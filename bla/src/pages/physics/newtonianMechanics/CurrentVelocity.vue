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
    }

    let heli = null
    let heliCurrentSpeed = 0
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
      cartesian.labelX = scene.add.text(x + lengthX * 32, y + 8, 't' , { font: '16px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'})
      cartesian.yArrow = scene.add.image(x, y + lengthY * (-32), 'arrowYHead')
      cartesian.labelY = scene.add.text(x + 8, y + lengthY * (-32) - 16, 'x' , { font: '16px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'})
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
      
      heli = this.physics.add.sprite(-50, config.height * 0.5, 'helicopter')
      heli.body.allowGravity = false
      heli.play('fly')
      heli.setVelocityX(0)

      drawCartesian(this, Math.floor(config.width * 0.0) + marginLeft, Math.floor(config.height * 0.4), Math.floor(config.width * 0.8 / 32) - 2, Math.floor(config.height * 0.4 / 32) - 2)
      
      // info text
      infoText = this.add.text(config.width * 0.51, config.height * 0.2, [''] , { font: isPortrait ? String(Math.floor(config.width * 0.04)) + 'px' : String(Math.floor(config.height * 0.035)) + 'px' , fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'})
      infoText.setDepth(10000)
      infoText.setText(['x sei die Position', 'des Helikopter'])

      infoText2 = this.add.text(config.width * 0.1, config.height * 0.6, [''] , { font: isPortrait ? String(Math.floor(config.width * 0.04)) + 'px' : String(Math.floor(config.height * 0.035)) + 'px' , fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'})
      infoText2.setDepth(10000)
      

      // next button
      nextButton = this.add.sprite(Math.floor(config.width * 0.5), config.height, 'nextButton', 'idlebutton').setInteractive({ useHandCursor: true })
      nextButton.scale = isPortrait ? config.height * 0.001 : config.width * 0.001
      nextButton.y -= Math.floor((nextButton.height - 5) * nextButton.scale)
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
    
    let virtualTime = 0
    let trackHeli = (scene) => {
      // mark the heli translation
      virtualTime += 0.2
      measurepoints.push(scene.add.rectangle(virtualTime + marginLeft, Math.floor(config.width * 0.2 - heli.x * 0.125), 2, 2, 0x00ff00))      
    }

    let gui = null
    let camera1 = null

    function update (time, delta) {
      switch(step) {
        case 0:
          heliCurrentSpeed++
          heli.setVelocityX(heliCurrentSpeed)
          heli.setRotation(0.15)
          infoText.setText(['der Helikopter', 'beschleunigt in', 'Vorwärts-Richtung'])
          trackHeli(this)
          if (heli.x >= Math.floor(config.width * 0.2)) {
            step++
          }
        break
        case 1:
          heliCurrentSpeed--
          heli.setRotation(-0.15)
          heli.setVelocityX(heliCurrentSpeed)
          infoText.setText(['er bremst ab', 'und beschleunigt', 'Rückwärts'])
          trackHeli(this)
           if (heli.x <= (-1) * Math.floor(config.width * 0.05)) {
            step++
            heli.setRotation(0.1)
          }
        break
        case 2:
          heliCurrentSpeed++
          heli.setVelocityX(heliCurrentSpeed)
          heli.setRotation(0.15)
          infoText.setText(['und ...', 'wieder auf den', 'Bildschirm'])
          trackHeli(this)
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
          trackHeli(this)
           if (heli.body.velocity.x <= 25) {
            infoText.setText(['weiter mit', 'konstanter', 'Geschwindigkeit'])
            step++
            heli.setRotation(0.0)
            heli.setRotation(0)
            heli.setVelocityX(25)
          }
          break
        case 4:
          trackHeli(this)
           if (heli.x >= Math.floor(config.width * 0.5)) {
            infoText.setText(['uuund Stopp', 'Position halten'])
            step++
            heli.setRotation(0.0)
            heli.setRotation(0)
            heli.setVelocityX(0)
            nextButton.setActive(true)
            nextButton.setVisible(true)
          }
        break
        case 5:
          infoText.setText(['die Kurve zeigt', 'die Verschiebung x', 'des Helikopters', 'nach der Zeit'])
          infoText2.setText([
            'Geschwindigkeit ist definiert als',
            '     Δx',
            'v = ―――',
            '     Δt',
            'entnimmt man über die Gesamte Kurve alle infinitesimal',
            'kleinen Zeitabschnitt '
          ])
          // // gui = new dat.GUI()
          // // camera1 = this.cameras.main;
          // camera1 = this.cameras.add(0, 0, Math.floor(config.width * 0.5), Math.floor(config.height * 0.5)).setZoom(0.5);
          // gui.addFolder('Camera 1')
          // gui.add(camera1, 'x')
          // gui.add(camera1, 'y')
          // gui.add(camera1, 'width')
          // gui.add(camera1, 'height')
          // gui.add(camera1, 'centerToSize')
          // gui.add(camera1, 'scrollX', -1920, 1920)
          // gui.add(camera1, 'scrollY', -989, 989)
          // gui.add(camera1, 'zoom', 0.1, 2).step(0.1)
          // gui.add(camera1, 'rotation').step(0.01)
          // gui.addColor(camera1, 'backgroundColor').onChange(function (value) {
          //   value.a = 255
          //   camera1.setBackgroundColor(value)
          // })
          // step++

        break
        case 6:
        break
        default:
        break
      }
      heli.setVelocityY(Math.sin(time) * 15)
    }
  }
}
</script>