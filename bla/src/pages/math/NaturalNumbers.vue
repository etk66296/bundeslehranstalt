<template>
  <q-page class="q-pa-xs">
    <div class="text-h6 text-center q-mt-md">Die Menge der natürlichen Zahlen</div>
    <div class="fixed-center q-mt-xl" id="myRenderCanvas"></div>
    <!-- <div>
      <vue-mathjax :formula="formula"></vue-mathjax>
    </div> -->
    <!-- <q-item clickable tag="a" target="_blank" href="https://de.wikipedia.org/wiki/Natürliche_Zahl">
      wikipedia link
    </q-item> -->
  </q-page>
</template>

<script>
import {VueMathjax} from 'vue-mathjax'
import "phaser"
export default {
  name: 'NaturalNumbers',
  components: {
    // 'vue-mathjax': VueMathjax
  },
  data () {
    return {
      leftDrawerOpen: false,
      formula: '$$x = {-b \\pm \\sqrt{b^2-4ac} \\over 2a}.$$',
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {
    var config = {
      width: window.innerWidth,
      height: Math.floor(window.innerHeight * 0.75),
      type: Phaser.AUTO,
      parent: 'myRenderCanvas',
      physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
      },
      scene: {
        preload: preload,
        create: create,
        update: update
      }
    }
    let isPortrait = true
    if (window.innerWidth > window.innerHeight) {
      isPortrait = false
      config.width =  Math.floor(window.innerWidth * 0.75)
    }
    var game = new Phaser.Game(config);

    function preload () {
      this.load.image('apple', 'sprites/fruits/apple32x40.png')
      this.load.image('wiki', 'sprites/buttons/Wikipedia-logo-v2.png')
      this.load.atlas('nextButton', 'sprites/buttons/nextDark.png', 'sprites/buttons/nextDark.json')
      this.load.atlas('indexButton', 'sprites/buttons/indexDark.png', 'sprites/buttons/nextDark.json')
    }

    function create () {
      this.cameras.main.setBackgroundColor(0x121212)


      // let image0 = this.add.image(400-15, 300, 'apple')
      let numberOfApples = 35
      let apples = this.physics.add.staticGroup({
        key: 'apple',
        frameQuantity: numberOfApples
      })
      apples.setXY(-40, -40)
      
      let infoText = this.add.text(
        isPortrait ? Math.floor(config.width * 0.2) : Math.floor(config.width * 0.4),
        20,
        '0 Apfel',
        {
          font: String(config.height) * 0.1 + 'px',
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        }
      )

      let descText = this.add.text(
        isPortrait ? Math.floor(Math.floor(config.width * 0.05)) : Math.floor(Math.floor(config.width * 0.2)),
        20,
        [],
        {
          font: isPortrait ? '18px' : '36px',
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        }
      )

      let finalTextA = this.add.text(Math.floor(config.width * 0.4), isPortrait ? 15 : 50, '', {font: '64px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })
            
      let finalTextB = this.add.text(
        isPortrait ? Math.floor(config.width * 0.02) : Math.floor(config.width * 0.2),
        isPortrait ? 90 : 120, [], 
        {
          font: isPortrait ? '14px' : '36px',
          fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
        }
      )

      apples.getChildren().forEach((apple, index) => {
        this.tweens.add({
          targets: apple,
          props: {
              x: { value: String(config.width - config.width / 10) - String(40 * index), duration: 2000, ease: 'Power2' },
              y: { value: String(config.height / 2), duration: 1500, ease: 'Bounce.easeOut' }
          },
          delay: 800 * index,
          onStart: () => {
            if (index == 0) {
              infoText.setText(String(index + 1) + ' Apfel')
            } else {
              if (index <= (numberOfApples - 29)) {
                infoText.setText(String(index + 1) + ' Äpfel')
              }
              if (index === (numberOfApples - 28)) {
                infoText.setText(String('...'))
              }
            }
          },
          onComplete: (e) => {
            let nextButton = null
            if (index === (numberOfApples - 28)) {
              infoText.setText(String(''))
              descText.setText(['Diese und alle folgenden', 'Zahlen werden als', 'natürliche Zahlen', 'bezeichnet.'])
            }
            if (index === (numberOfApples - 22)) {
              infoText.setText(String(''))
              descText.setText(['All diese Zahlen', 'zusammen bilden die', 'Menge der natürlichen', 'Zahlen.'])
            }
            if (index === (numberOfApples - 16)) {
              descText.setText(['Der Buchstabe N (ℕ)', 'mit Doppelstrich steht', 'für die Menge der ', 'natürlichen Zahlen.'])
            }
            if (index === (numberOfApples - 10)) {
              descText.setText([])
              finalTextA.setText('ℕ')
              finalTextB.setText(['Die Menge der natürlichen Zahlen.', 'Nach Definition gilt entweder', 'ℕ={1; 2; 3; ...} ohne die Null, oder', 'ℕ={0; 1; 2; 3; ...} mit der Null.'])
            }
            if (index === (numberOfApples - 9)) {
              let buttonPressedCount = 0
              nextButton = this.add.sprite(Math.floor(config.width / 2), config.height - 72, 'nextButton', 'idlebutton').setInteractive({ useHandCursor: true })
              nextButton.on('pointerover', (pointer) => {
                nextButton.setFrame('hoveredbutton')
              })
              nextButton.on('pointerout', (pointer) => {
                nextButton.setFrame('idlebutton')
              })
                nextButton.on('pointerdown', (pointer) => {
                nextButton.setFrame('pressedbutton')
              })
              nextButton.on('pointerup', (pointer) => {
                buttonPressedCount++
                if (buttonPressedCount === 1) {
                  nextButton.setFrame('hoveredbutton')

                  apples.getChildren().forEach(apple => {
                    this.children.remove(apple)
                  })
                  moreApples.getChildren().forEach(apple => {
                    this.children.remove(apple)
                  })
                  this.children.remove(infoText)
                  this.children.remove(descText)
                  this.children.remove(finalTextA)
                  this.children.remove(finalTextB)
                  descText = this.add.text(
                    isPortrait ? Math.floor(Math.floor(config.width * 0.05)) : Math.floor(Math.floor(config.width * 0.2)),
                    20,
                    [
                      'Addiert man eine natürliche Zahl ',
                      'mit einer natürlichen Zahl erhält ',
                      'man eine natürliche Zahl.',
                      '',
                      'es gilt:',
                      'a ist Element von ℕ',
                      'b ist Element von ℕ',
                      'a + b ist Element von ℕ',
                      'b + a ist Element von ℕ'
                    ],
                    {
                      font: isPortrait ? '18px' : '36px',
                      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
                    }
                  )
                } else if (buttonPressedCount === 2){
                  descText.setText(
                    [
                      'Multipliziert man eine natürliche',
                      'Zahl mit einer natürlichen Zahl',
                      'erhält man eine natürliche Zahl.',
                      '',
                      'es gilt:',
                      'a ist Element von ℕ',
                      'b ist Element von ℕ',
                      'a ⋅ b ist Element von ℕ',
                      'b ⋅ a ist Element von ℕ'
                    ]
                  )
                } else {
                  this.children.remove(nextButton)
                  this.children.remove(descText)
                  let indexButton = this.add.sprite(Math.floor(config.width / 2), config.height - 72, 'indexButton', 'idlebutton').setInteractive({ useHandCursor: true })
                  indexButton.on('pointerover', (pointer) => {
                    indexButton.setFrame('hoveredbutton')
                  })
                  indexButton.on('pointerout', (pointer) => {
                    indexButton.setFrame('idlebutton')
                  })
                  indexButton.on('pointerdown', (pointer) => {
                    indexButton.setFrame('pressedbutton')
                  })
                  indexButton.on('pointerup', (pointer) => {
                    window.history.go(-1)
                  })
                  let wikilinkButton = this.add.image(Math.floor(config.width * 0.5), Math.floor(config.height * 0.5) - 128, 'wiki').setInteractive({ useHandCursor: true })
                  wikilinkButton.on('pointerup', (pointer) => {
                    window.location.replace("https://de.wikipedia.org/wiki/Nat%C3%BCrliche_Zahl");
                  })
                  this.tweens.add({
                    targets: wikilinkButton,
                    alpha: { from: 0.5, to: 1 },
                    ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                    duration: 1200,
                    repeat: -1,            // -1: infinity
                    yoyo: true
                  })
                }
              })
              let moreApples = this.physics.add.staticGroup({
                key: 'apple',
                frameQuantity: numberOfApples
              })
              moreApples.getChildren().forEach((item, index) => {
                item.setPosition(32 * index, -40)
                this.tweens.add({
                  targets: item,
                    props: {
                      x: { value: '+=30', duration: 2000, ease: 'Power2' },
                      y: { value: String(config.height / 2), duration: 1500, ease: 'Bounce.easeOut' }
                    },
                  delay: 800 * index,
                })
              })
            }
          }
        })
      })
    }
    
    function update () {
      
    }
  }
}
</script>