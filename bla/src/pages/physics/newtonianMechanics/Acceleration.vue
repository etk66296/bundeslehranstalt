<template>
  <q-page class="q-pa-xs">
    <div class="text-h6 text-center q-mt-md">Beschleunigung</div>
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
      this.load.atlas('tram', 'sprites/vehicles/ssbgt4.png', 'sprites/vehicles/ssbgt4.json')
      this.load.image('rail', 'sprites/vehicles/rail.png')
      this.load.image('powerPole', 'sprites/vehicles/trainPowerPole.png')
      this.load.image('voltageLine', 'sprites/vehicles/voltageLine.png')
    }

    let tram = null
    let marginLeft = 25


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
      cartesian.labelY = scene.add.text(x + 8, y + lengthY * (-32) - 16, 'Beschleunigung a(t)' , { font: '16px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'})
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

    let acceleration = 0.06
    let velocity = 0
    let translation = 0
    let elapsedTime = 0

    function create () {
      this.cameras.main.setBackgroundColor(0x121212)
      this.anims.create({ 
		      key: 'roll',
		      frames: this.anims.generateFrameNames('tram', {
			    prefix: 'roll_',
			    end: 1,
			    zeroPad: 4
        }),
        frameRate: 2,
		    repeat: -1
      })

      // tram
      tram = this.physics.add.sprite(0, Math.floor(config.height * 0.6), 'tram')
      tram.body.allowGravity = false
      tram.play('roll')
      tram.setVelocityX(50)
      let rail = this.add.group({
        key: 'rail',
        repeat: Math.floor(config.width / 32 + 1),
        setXY: { x: 0, y: Math.floor(config.height * 0.6 + 109 * 0.5 + 4), stepX: 32 }
      })
      let voltageLine = this.add.group({
        key: 'voltageLine',
        repeat: Math.floor(config.width / 64 + 1),
        setXY: { x: 0, y: Math.floor(config.height * 0.6 - 109 * 0.5 - 4), stepX: 64 }
      })
      let powerPole = this.add.group({
        key: 'powerPole',
        repeat: 4,
        setXY: { x: 32, y: Math.floor(config.height * 0.6 - 4), stepX: Math.floor(config.width / 4) }
      })

      drawCartesian(this, Math.floor(config.width * 0.0) + marginLeft, Math.floor(config.height * 0.4), Math.floor(config.width * 0.8 / 32) - 2, Math.floor(config.height * 0.4 / 32) - 2)
      
      // info text
      infoText = this.add.text(config.width * 0.4, isPortrait ? config.height * 0.1 : config.height * 0.025, [''] , { font: isPortrait ? String(Math.floor(config.width * 0.04)) + 'px' : String(Math.floor(config.height * 0.035)) + 'px' , fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'})
      infoText.setDepth(10000)
      infoText.setText(['der Fahrer schiebt', 'den Gashebel nach vorne'])

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
    let trackTrainX = (scene, currentPosition) => {
      virtualTimeX += 0.75
        measurepoints.push(scene.add.rectangle(virtualTimeX + marginLeft, Math.floor(cartesian.origin.y - currentPosition * 0.2), 3, 3, 0x00ff00))
    }
    let virtualTimeV = 0
    let rectCounterV = 0
    let trackTrainV = (scene, currentVelocity) => {
      virtualTimeV += 0.75
        measurepoints.push(scene.add.rectangle(virtualTimeV + marginLeft, Math.floor(cartesian.origin.y - currentVelocity * 0.4), 3, 3, 0xffff00))
    }
    let virtualTimeA = 0
    let rectCounterA = 0
    let trackTrainA = (scene, currentAcceleration) => {
      virtualTimeA += 0.75
        measurepoints.push(scene.add.rectangle(virtualTimeA + marginLeft, Math.floor(cartesian.origin.y - currentAcceleration * 0.4), 3, 3, 0x00ffff))
    }
    

    let timedEvent = null

    function update (time, delta) {
      switch(step) {
        case 0:
          trackTrainA(this, acceleration * 3000)
          // trackTrainV(this, velocity)
          // trackTrainX(this, tram.x)
          acceleration -= 0.0003
          elapsedTime = delta
          velocity += acceleration * elapsedTime
          tram.setVelocityX(velocity)
          if (acceleration <= 0.01) {
            acceleration = -0.045
            step++
          }
        break
        case 1:
          infoText.setText(['volle Kraft', 'zurück'])
          trackTrainA(this, acceleration * 3000)
          // trackTrainV(this, velocity)
          // trackTrainX(this, tram.x)
          acceleration += 0.0001
          elapsedTime = delta
          velocity += acceleration * elapsedTime
          tram.setVelocityX(velocity)
          if (acceleration >= -0.02) {
            acceleration = Math.abs(acceleration)
            step++
          }
        break
        case 2:
          infoText.setText(['ein Halteprogramm', 'bremst konstant'])
          trackTrainA(this, acceleration * 3000)
          // trackTrainV(this, velocity)
          // trackTrainX(this, tram.x)
          elapsedTime = delta
          velocity += acceleration * elapsedTime
          tram.setVelocityX(velocity)
          if (velocity >= 0) {
            step++
            acceleration = 0
            velocity = 0
            tram.setVelocityX(velocity)
            tram.stop()
          }
        break
        case 3:
          infoText.setText(['und nochmal', 'volle Kraft voraus'])
          nextButton.setActive(true)
          nextButton.setVisible(true)
        break
        case 4:
          virtualTimeA = 0
          nextButton.setActive(false)
          nextButton.setVisible(false)
          measurepoints.forEach(item => {
            this.children.remove(item)
          })
          acceleration = 0.07
          step++
        break
        case 5:
          infoText.setText([''])
          trackTrainA(this, acceleration * 3000)
          trackTrainV(this, velocity)
          trackTrainX(this, tram.x)
          acceleration -= 0.0003
          elapsedTime = delta
          velocity += acceleration * elapsedTime
          tram.setVelocityX(velocity)
          if (acceleration <= 0.01) {
            acceleration = -0.045
            step++
          }
        break
        case 6:
          trackTrainA(this, acceleration * 3000)
          trackTrainV(this, velocity)
          trackTrainX(this, tram.x)
          acceleration += 0.00008
          elapsedTime = delta
          velocity += acceleration * elapsedTime
          tram.setVelocityX(velocity)
          if (acceleration >= -0.02) {
            acceleration = Math.abs(acceleration)
            step++
          }
        break
        case 7:
          trackTrainA(this, acceleration * 3000)
          trackTrainV(this, velocity)
          trackTrainX(this, tram.x)
          elapsedTime = delta
          velocity += acceleration * elapsedTime
          tram.setVelocityX(velocity)
          if (velocity >= 0) {
            step++
            acceleration = 0
            velocity = 0
            tram.setVelocityX(velocity)
            tram.stop()
          }
        break
        default:
        break
      }
      // heli.setVelocityY(Math.sin(time) * 15)
    }
  }
}
</script>