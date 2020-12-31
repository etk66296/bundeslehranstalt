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
      this.load.image('apple', 'sprites/fruits/apple32x40.png');
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
              this.add.text(Math.floor(config.width * 0.4), isPortrait ? 15 : 50, 'ℕ', {font: '64px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' })
              this.add.text(
                isPortrait ? Math.floor(config.width * 0.02) : Math.floor(config.width * 0.2),
                isPortrait ? 90 : 120, ['Die Menge der natürlichen Zahlen.', 'Nach definition gilt entweder', 'ℕ={1; 2; 3; ...} ohne die Null, oder', 'ℕ={0; 1; 2; 3; ...} mit der Null.'], 
                {
                  font: isPortrait ? '14px' : '36px',
                  fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'
                }
              )
            }
            if (index === (numberOfApples - 9)) {
              let apples = this.physics.add.staticGroup({
                key: 'apple',
                frameQuantity: numberOfApples
              })
              apples.getChildren().forEach((item, index) => {
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