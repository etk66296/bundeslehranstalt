<template>
  <q-page class="q-pa-xs">
    <div class="text-h6 text-center q-mt-md">Momentane Geschwindigkeit</div>
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
// import * as dat from 'dat.gui'
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
            gravity: { y: 100 },
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
      
      this.load.image('wiki', 'sprites/buttons/Wikipedia-logo-v2.png')
      this.load.image('arrowXSegment', 'tiles/vectorXArrowSegmentTile.png')
      this.load.image('arrowYSegment', 'tiles/vectorYArrowSegmentTile.png')
      this.load.image('arrowXHead', 'tiles/vectorXArrowHeadTile.png')
      this.load.image('arrowYHead', 'tiles/vectorYArrowHeadTile.png')
      this.load.image('origin', 'tiles/vectorOrigin.png')
      this.load.atlas('nextButton', 'sprites/buttons/nextDark.png', 'sprites/buttons/nextDark.json')
      this.load.atlas('indexButton', 'sprites/buttons/indexDark.png', 'sprites/buttons/nextDark.json')
      this.load.atlas('helicopter', 'sprites/vehicles/warhelicopter.png', 'sprites/vehicles/warhelicopter.json')

      this.load.atlas('image001', 'images/physics/Momentangeschwindigkeit/001.png', 'images/physics/Momentangeschwindigkeit/001.json')
    }

    let heli = null
    let heliCurrentSpeed = 0
    let marginLeft = 25
    let images = []


    // cartesian -->
    let cartesian = {
      origin: null,
      xAxisSegments: null,
      yAxisSegments: null,
      xArrow: null,
      yArrow: null,
      labelX: 't',
      labelY: 'x'
    }

    let drawCartesian = (scene, x, y, lengthX, lengthY) => {
      cartesian.origin = scene.add.image(x, y, 'origin')
      cartesian.xArrow = scene.add.image(x + lengthX * 32, y, 'arrowXHead')
      cartesian.labelX = scene.add.text(x + lengthX * 32, y + 8, 'Zeit t' , { font: '16px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'})
      cartesian.yArrow = scene.add.image(x, y + lengthY * (-32), 'arrowYHead')
      cartesian.labelY = scene.add.text(x + 8, y + lengthY * (-32) - 16, 'Verschiebung x(t)' , { font: '16px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'})
      cartesian.xAxisSegments = scene.add.group({
        key: 'arrowXSegment',
        repeat: lengthX - 2,
        setXY: { x: x + 32, y: y, stepX: 32 }
      })
      cartesian.yAxisSegments = scene.add.group({
        key: 'arrowYSegment',
        repeat: lengthY - 2,
        setXY: { x: x, y: y - 32, stepY: -32 }
      })
    }
    // <-- cartesian

    let infoText = null
    let infoText2 = null
    let nextButton = null
    let step = 0

    function create () {
      this.cameras.main.setBackgroundColor(0x121212)
      this.anims.create({ 
		      key: 'fly',
		      frames: this.anims.generateFrameNames('helicopter', {
			    prefix: 'fly_',
			    end: 4,
			    zeroPad: 4
        }),
        frameRate: 30,
		    repeat: -1
      })
      
      this.anims.create({ 
		      key: 'deltaT',
		      frames: this.anims.generateFrameNames('image001', {
			    prefix: 'deltaT_',
			    end: 2,
			    zeroPad: 4
        }),
        frameRate: 1,
		    repeat: -1
	    })
      
      heli = this.physics.add.sprite(0, config.height * 0.5, 'helicopter')
      heli.body.allowGravity = false
      heli.play('fly')
      heli.setVelocityX(0)

      drawCartesian(this, Math.floor(config.width * 0.0) + marginLeft, Math.floor(config.height * 0.4), Math.floor(config.width * 0.8 / 32) - 2, Math.floor(config.height * 0.4 / 32) - 2)
      
      // info text
      infoText = this.add.text(config.width * 0.4, isPortrait ? config.height * 0.1 : config.height * 0.025, [''] , { font: isPortrait ? String(Math.floor(config.width * 0.04)) + 'px' : String(Math.floor(config.height * 0.035)) + 'px' , fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'})
      infoText.setDepth(10000)
      infoText.setText(['x sei die Position', 'des Helikopters'])

      infoText2 = this.add.text(config.width * 0.1, config.height * 0.55, [''] , { font: isPortrait ? String(Math.floor(config.width * 0.04)) + 'px' : String(Math.floor(config.height * 0.03)) + 'px' , fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'})
      infoText2.setDepth(10000)
      

      // next button
      nextButton = this.add.sprite(Math.floor(config.width * 0.5), config.height, 'nextButton', 'idlebutton').setInteractive({ useHandCursor: true })
      nextButton.scale = isPortrait ? config.height * 0.001 : config.width * 0.001
      nextButton.y -= isPortrait ? (Math.floor((nextButton.height - 5) * nextButton.scale) + 16) : (Math.floor((nextButton.height - 5) * nextButton.scale) + 16)
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
        step++
      })
      nextButton.setActive(false)
      nextButton.setVisible(false)
    }
    
    let measurepoints = []
    let extraMeasurepoints = []
    
    let virtualTimeX = 0
    let rectCounterX = 0
    let trackHeliX = (scene) => {
      // mark the heli translation
      virtualTimeX += 0.3
      // rectCounterX++
      // if (rectCounterX % 5 === 0) {
        measurepoints.push(scene.add.rectangle(virtualTimeX + marginLeft, Math.floor(cartesian.origin.y - heli.x * 0.2), 3, 3, 0x00ff00))
      // }
    }
    let virtualTimeV = 0
    let rectCounterV = 0
    let trackHeliV = (scene, currentSpeed) => {
      virtualTimeV += 0.3
      // rectCounterV++
      // if (rectCounterV % 5 === 0) {
        measurepoints.push(scene.add.rectangle(virtualTimeV + marginLeft, Math.floor(cartesian.origin.y - currentSpeed * 0.4), 3, 3, 0xffff00))
      // }
    }
    

    let gui = null
    let camera1 = null
    let timedEvent = null

    function update (time, delta) {
      switch(step) {
        case 0:
          heliCurrentSpeed++
          heli.setVelocityX(heliCurrentSpeed)
          heli.setRotation(0.15)
          infoText.setText(['der Helikopter', 'beschleunigt in', 'Vorwärts-Richtung'])
          trackHeliX(this)
          if (heli.x >= Math.floor(config.width * 0.2)) {
            step++
          }
        break
        case 1:
          heliCurrentSpeed--
          heli.setRotation(-0.15)
          heli.setVelocityX(heliCurrentSpeed)
          infoText.setText(['er bremst ab', 'und beschleunigt', 'Rückwärts'])
          trackHeliX(this)
           if (heli.x <= (-1) * Math.floor(config.width * 0.05)) {
            step++
            heli.setRotation(0.1)
          }
        break
        case 2:heliCurrentSpeed++
          heli.setVelocityX(heliCurrentSpeed)
          heli.setRotation(0.15)
          infoText.setText(['der Helikopter', 'beschleunigt in', 'Vorwärts-Richtung'])
          trackHeliX(this)
          if (heli.x >= Math.floor(config.width * 0.2)) {
            step++
          }
          heliCurrentSpeed++
          heli.setVelocityX(heliCurrentSpeed)
          heli.setRotation(0.15)
          infoText.setText(['und ...', 'wieder auf den', 'Bildschirm'])
          trackHeliX(this)
          if (heli.x >= Math.floor(config.width * 0.1)) {
            step++
            infoText.setText(['und ...', 'wieder auf den', 'Bildschirm'])
          }
        break
        case 3:
          heliCurrentSpeed -= 5
          heli.setRotation(-0.15)
          heli.setVelocityX(heliCurrentSpeed)
          infoText.setText(['langsaaaam!😄'])
          trackHeliX(this)
           if (heli.body.velocity.x <= 25) {
            infoText.setText(['weiter mit', 'konstanter', 'Geschwindigkeit'])
            step++
            heli.setRotation(0.0)
            heli.setRotation(0)
            heli.setVelocityX(25)
          }
          break
        case 4:
          trackHeliX(this)
           if (heli.x >= Math.floor(config.width * 0.5)) {
            infoText.setText(['uuund Stopp', 'Position halten'])
            step++
            heli.setRotation(0.0)
            heli.setRotation(0)
            heli.setVelocityX(0)
            timedEvent = this.time.delayedCall(6000, () => {
              step++
              nextButton.setActive(true)
              nextButton.setVisible(true)
              timedEvent.remove(false)
            }, [], this)
          }
        break
        case 5:
          // wait for the timer event
          trackHeliX(this)
        break
        case 6:
          infoText.setText(['nimm dir kurz Zeit', 'um die Kurve', 'zu verstehen'])
          infoText2.setText([
            'Geschwindigkeit ist definiert als:',
            '     Δx',
            'V = ―――',
            '     Δt',
            'Eine Geschwindigkeit V ≠ 0 setzt',
            'also eine Änderung der Verschiebung ',
            'mit der Zeit voraus.'
          ])
        break
        case 7:
          if (images.length <= 0) {
            images.push(this.add.sprite(Math.floor(config.width * 0.5) + 128, isPortrait ? config.height * 0.2 : config.height * 0.2, 'image001'))
          }
          infoText.setText([])
          infoText2.setText([
            'Teilt man den gesamten Kurvenverlauf',
            'in kleine Zeitabschnitte, nähern sich',
            'die darin liegenden Kurvenabschnitte',
            'immer weiter aneinandergeketteten',
            'Geraden an.'
          ])
        break
        case 8:
          if (!images[images.length - 1].anims.isPlaying) {
            images[images.length - 1].play('deltaT')
          }
          infoText.setText([])
          infoText2.setText([
            'Die Mathematik erlaubt es diese',
            'Teilabschnitte invitesimal klein',
            'werden zu lassen:',
            '       Δx',
            'lim   ――― ',
            'Δt➔0  Δt'
          ])
        break
        case 9:
          infoText.setText([])
          infoText2.setText([
            'Für den Kurvenverlauf erhält man',
            'damit Werte, welche zu den',
            'Zeitpunkten die Steigung der ',
            'Veschiebungskurve beschreiben.',
            '       Δx',
            'lim   ――― ',
            'Δt➔0  Δt'
          ])
        break
        case 10:
          infoText.setText([])
          infoText2.setText([
            'es gilt:',
            '      Δx     dx',
            'lim  ―――  = ――― = ẋ = v(t)',
            'Δt→0  Δt     dt',
            'Mit einem Punkt über Buchstaben',
            'wird in der Physik oft die',
            'Ableitung nach der Zeit abgekürzt.'
          ])
        break
        case 11:
          images[images.length - 1].setActive(false)
          images[images.length - 1].setVisible(false)
          this.children.remove(images[images.length - 1])
          step++
        break
        case 12:
          infoText.setText([
            ' dx(t)',
            '――――――― = ẋ(t) = v(t)',
            '  dt'
          ])
          infoText2.setText([
            'Die Steigung in jedem invitesimal',
            'kleinen Punkt der Kurve ist somit',
            'die momentante Geschwindigkeit zum',
            'jeweiligen Zeitpunkt.'
          ])
        break
        case 13:
          infoText.setText([
            ' dx(t)',
            '――――――― = ẋ(t) = v(t)',
            '  dt'
          ])
          infoText2.setText([
            'Die erste Ableitung der Verschiebung',
            'x(t) nach der Zeit ist die',
            'momentante Geschwindigkeit.'
          ])
        break
        case 14:
          images.forEach(item => {
            this.children.remove(item)
          })
          measurepoints.forEach(item => {
            this.children.remove(item)
          })
          
          infoText.setText([])
          infoText2.setText(['Ein weiterer Rundflug', 'mit Kurven für Verschiebung', 'und Momentangeschwindigkeit', 'verdeutlicht die zusammenhänge.'])
          heliCurrentSpeed = 0
          virtualTimeX = 0
          rectCounterX = 0
          cartesian.labelY.setText(['Verschiebung x(t)', 'Geschwindigkeit v(t)'])
        break
        case 15:
          heliCurrentSpeed--
          heli.setVelocityX(heliCurrentSpeed)
          heli.setRotation(-0.15)
          trackHeliX(this)
          trackHeliV(this, heliCurrentSpeed)
          nextButton.setActive(false)
          nextButton.setVisible(false)
          if (heli.x <= Math.floor(config.width * 0.1)) {
            infoText2.setText([''])
            step++
          }
        break
        case 16:
          heliCurrentSpeed++
          heli.setVelocityX(heliCurrentSpeed)
          heli.setRotation(0.15)
          trackHeliX(this)
          trackHeliV(this, heliCurrentSpeed)
          nextButton.setActive(false)
          nextButton.setVisible(false)
          if (heli.x >= Math.floor(config.width * 0.35)) {
            step++
          }
        break
        case 17:
          heliCurrentSpeed -= 2
          heli.setVelocityX(heliCurrentSpeed)
          heli.setRotation(-0.15)
          trackHeliX(this)
          trackHeliV(this, heliCurrentSpeed)
          nextButton.setActive(false)
          nextButton.setVisible(false)
          if (heliCurrentSpeed <= 30) {
            heliCurrentSpeed = 30
            step++
          }
        break
        case 18:
          heli.setVelocityX(heliCurrentSpeed)
          heli.setRotation(0.0)
          trackHeliX(this)
          trackHeliV(this, heliCurrentSpeed)
          timedEvent = this.time.delayedCall(4000, () => {
            step++
            timedEvent.remove(false)
          }, [], this)
          step++
        break
        case 19:
          // just wait for the timer event
          trackHeliX(this)
          trackHeliV(this, heliCurrentSpeed)
        break
        case 20:
          heliCurrentSpeed--
          heli.setVelocityX(heliCurrentSpeed)
          heli.setRotation(-0.15)
          trackHeliX(this)
          trackHeliV(this, heliCurrentSpeed)
          nextButton.setActive(false)
          nextButton.setVisible(false)
          if (heliCurrentSpeed <= 0) {
            heliCurrentSpeed = 0
            heli.setRotation(0.0)
            heli.setVelocityX(heliCurrentSpeed)
            step++
          }
        break
        case 21:
          trackHeliX(this)
          trackHeliV(this, heliCurrentSpeed)
          timedEvent = this.time.delayedCall(4000, () => {
            step++
            timedEvent.remove(false)
          }, [], this)
          step++
        break
        case 22:
          // just wait for the timer event
          trackHeliX(this)
          trackHeliV(this, heliCurrentSpeed)
        break
        case 23:
          nextButton.setActive(true)
          nextButton.setVisible(true)
          step++
        break
        case 24:
        break
        case 25:
          measurepoints.forEach(item => {
            this.children.remove(item)
          })
          extraMeasurepoints.forEach(item => {
            this.children.remove(item)
          })
          this.children.remove(nextButton)
          this.children.remove(cartesian.origin)
          this.children.remove(cartesian.xAxisSegments)
          this.children.remove(cartesian.yAxisSegments)
          this.children.remove(cartesian.xArrow)
          this.children.remove(cartesian.yArrow)
          this.children.remove(cartesian.labelX)
          this.children.remove(cartesian.labelY)
          this.children.remove(heli)
          cartesian.xAxisSegments.getChildren().forEach(item => {
            this.children.remove(item)
          })
          cartesian.yAxisSegments.getChildren().forEach(item => {
            this.children.remove(item)
          })
          this.children.remove(infoText)
          this.children.remove(infoText2)
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
            window.location.replace("https://de.wikipedia.org/wiki/Geschwindigkeit");
          })
          this.tweens.add({
            targets: wikilinkButton,
            alpha: { from: 0.5, to: 1 },
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1200,
            repeat: -1,            // -1: infinity
            yoyo: true
          })
          step++
          break
        case 26:
          break
        default:
        break
      }
      // heli.setVelocityY(Math.sin(time) * 15)
    }
  }
}
</script>