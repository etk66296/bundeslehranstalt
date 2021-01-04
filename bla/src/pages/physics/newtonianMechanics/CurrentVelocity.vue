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
    let heliFollower = null
    let graphics = null

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
      heli.setVelocityX(80)

      graphics = this.add.graphics({ lineStyle: { width: 1, color: 0x00ff00 }, fillStyle: { color: 0x0000aa } });
    
    }
    
    let measurePoints = []
    let measurePointConnectors = []
    let step = 0
    let measurePointPos = { x: 0, y: 0 }
    let originY = 0
    let deltaV = 0
    let tmpV = 0
    let blockUpdate = false


    function update (time, delta) {
      switch(step) {
        case 0:
          measurePoints.push(this.add.rectangle(measurePointPos.x,  heli.y + 20, 4, 4, 0x00ff00))
          measurePointPos.x++
          originY = heli.y + 20
          if (heli.x >= config.width * 0.2) {
            step++
          }
        break
        case 1:
          if (!blockUpdate) {
            let curve = new Phaser.Curves.Ellipse(0, 0, Math.floor(config.width * 0.3), Math.floor(config.height * 0.3), 90, 91, true, true)
            heliFollower = this.add.follower(curve, heli.x, heli.y, 'helicopter');
            heliFollower.play('fly')
            measurePointPos.x++
            blockUpdate = true
            this.children.remove(heli)
            heliFollower.startFollow({
              duration: 8000,
              yoyo: false,
              repeat: 1,
              rotateToPath: true,
              verticalAdjust: true,
              onComplete: () => {
                let heliPos = { x: heliFollower.x, y: heliFollower.y }
                this.children.remove(heliFollower)
                heli = this.physics.add.sprite(heliPos.x, heliPos.y, 'helicopter')
                heli.body.allowGravity = false
                heli.play('fly')
                heli.setVelocityX(80)
                step++
                blockUpdate = false
              }
            })
          } else {
            deltaV = heliFollower.y - tmpV
            measurePointPos.x = measurePointPos.x + 0.2
            measurePointPos.y = originY - Math.floor(deltaV * 20)
            measurePoints.push(this.add.rectangle(Math.floor(measurePointPos.x),  measurePointPos.y, 4, 4, 0x00ff00))
            tmpV = heliFollower.y
          }
        break
        case 2:
          measurePoints.push(this.add.rectangle(measurePointPos.x,  heli.y + 20, 4, 4, 0x00ff00))
          measurePointPos.x++
          if (heli.x >= (config.width + 50)) {
            step++
          }
        break
        case 3:
          step++
          break
        case 4:
        break
        default:
        break
      }

    }
  }
}
</script>