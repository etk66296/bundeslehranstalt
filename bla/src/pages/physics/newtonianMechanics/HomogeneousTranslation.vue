<template>
  <q-page class="q-pa-xs">
    <div class="text-h6 text-center q-mt-md">Gleichförmige Bewegung</div>
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
            gravity: { y: 800 },
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
      this.load.atlas('car', 'sprites/vehicles/2cvCar.png', 'sprites/vehicles/2cvCar.json')
      this.load.image('wiki', 'sprites/buttons/Wikipedia-logo-v2.png')
      this.load.image('arrowXSegment', 'tiles/vectorXArrowSegmentTile.png')
      this.load.image('arrowYSegment', 'tiles/vectorYArrowSegmentTile.png')
      this.load.image('arrowXHead', 'tiles/vectorXArrowHeadTile.png')
      this.load.image('arrowYHead', 'tiles/vectorYArrowHeadTile.png')
      this.load.image('origin', 'tiles/vectorOrigin.png')
      this.load.atlas('nextButton', 'sprites/buttons/nextDark.png', 'sprites/buttons/nextDark.json')
      this.load.atlas('indexButton', 'sprites/buttons/indexDark.png', 'sprites/buttons/nextDark.json')
    }

    let cartesian = null
    let car = null
    let startPos = { x: Math.floor(config.width * 0.25), y: isPortrait ? config.height * 0.75 : Math.floor(config.height * 0.75) }
    let finishPos = { x: Math.floor(config.width * 0.75), y: isPortrait ? config.height * 0.75 : Math.floor(config.height * 0.75) }
    let startTimeText = null
    let stopTimeText = null
    let infoText = null
    let start 
    let finish

    let scaleFacotorProtrait = 0.035
    let scaleFacotorLandscape = 0.04

    let myTmpGameObjects = []

    function create () {
      this.cameras.main.setBackgroundColor(0x121212)
      this.anims.create({ 
		      key: 'move',
		      frames: this.anims.generateFrameNames('car', {
			    prefix: 'moving_',
			    end: 1,
			    zeroPad: 4
        }),
        frameRate: 8,
		    repeat: -1
	    })
      car = this.physics.add.sprite(Math.floor(config.width / 10), -40, 'car')
      car.play('move')

      // create the x axis arrow -->
      cartesian = this.physics.add.group({
        key: 'arrowXSegment',
        repeat: Math.floor(config.width / 32) - 4,
        setXY: { x: config.width - 32 - 50, y: isPortrait ? config.height  * 0.75 : Math.floor(config.height * 0.75), stepX: -32 }
      })
      let cartesianHead = new Phaser.Physics.Arcade.Sprite(this, config.width - 50, isPortrait ? config.height  * 0.75 : Math.floor(config.height * 0.75), 'arrowXHead')
      this.add.existing(cartesianHead)
      this.physics.add.existing(cartesianHead)
      car.setBounce(0, 0.2)
      cartesian.add(cartesianHead)
      cartesian.getChildren().forEach(segment => {
        segment.setImmovable(true)
        segment.body.allowGravity = false
      })
      // <-- create the x axis arrow

      // start line and finish line -->
      start = this.add.rectangle(startPos.x, startPos.y, 8, 32, 0x6666ff);
      finish = this.add.rectangle(finishPos.x, finishPos.y, 8, 32, 0x9966ff);
      // <-- start line and finish line

      this.physics.add.collider(cartesian, car)

      // timer text
      startTimeText = this.add.text(startPos.x - 10, startPos.y - 48, '', { font: isPortrait ? String(config.width * scaleFacotorProtrait)  + 'px' : config.height * scaleFacotorLandscape + 'px' })
      stopTimeText = this.add.text(finishPos.x - 10, finishPos.y - 48, '',  { font: isPortrait ? String(config.width * scaleFacotorProtrait)  + 'px' : config.height * scaleFacotorLandscape + 'px' })
      infoText = this.add.text(isPortrait ? config.width * 0.1 : config.height * 0.05 , 10, [],  { font: isPortrait ? String(config.width * scaleFacotorProtrait)  + 'px' : config.height * scaleFacotorLandscape + 'px' })
    }
    


    let startPassed = false
    let finishPassed = false
    let carSpeed = Math.floor(config.width * 0.15)
    let xStartText = null
    let xStopText = null
    let nextButton = null
    let step = 0
    let xe = 0
    let xs = 0
    let te = 0
    let ts = 0
    let cartesianOrigin = 0
    let x = 0
    let y = 0
    let xAxis
    let xAxisArrow
    let yAxis
    let yAxisArrow
    let velocity 
    let translation
    let velocityText
    let translationText

    let runFinalAnimation = false

    function update (time, delta) {

      if (car.body.touching.down && car.body.velocity.x != carSpeed && step === 0) {
        car.setVelocityX(carSpeed)
      }


      // start passed -->
      if (car.x >= startPos.x && !startPassed) {
        startPassed = true
        ts = (time * 0.001).toFixed(3)
        xs = Math.floor(car.x)
        xStartText = this.add.text(startPos.x - 10, startPos.y + 40, 'xs=' + String(xs) + 'm', { font: isPortrait ? config.width * scaleFacotorProtrait + 'px': config.height * scaleFacotorLandscape + 'px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'})
        startTimeText.setText('ts=' + ts + 's')
      }
      // <-- start passed

      // stop passed -->
      if (car.x >= finishPos.x && !finishPassed) {
        finishPassed = true
        xe = Math.floor(car.x)
        te = (time * 0.001).toFixed(3)
        xStopText = this.add.text(finishPos.x - 10, finishPos.y + 40, 'xe=' + String(xe) + 'm', { font: isPortrait ? config.width * scaleFacotorProtrait + 'px' : config.height * scaleFacotorLandscape + 'px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'})
        stopTimeText.setText('te=' + te + 's')
      }
      // <-- stop passed

      if ((car.x >= (finishPos.x + 64) && step === 0) || (car.x >= (finishPos.x + 64) && step === 5)) {
        step++
        car.setVelocityX(0)
        car.anims.stop()
        infoText.setText([
          'Die Verschiebung des Autos',
          'ist die Strecke zwischen den',
          'Punkten xs und xe.',
          '',
          'Δx = xe - xs',
          '(Δx in Worten "Delta x")'
        ])
        nextButton = this.add.sprite(Math.floor(config.width / 2), config.height, 'nextButton', 'idlebutton').setInteractive({ useHandCursor: true })
        nextButton.scale = isPortrait ? config.height * 0.001 : config.width * 0.001
        nextButton.y -= (nextButton.height -5) * nextButton.scale
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
          switch(step) {
            case 1:
              step++
              infoText.setText([
                'Die Zeit, welche für die',
                'Verschiebung benötigt wird',
                'berechnet sich in gleicher Weise:',
                '',
                'Δt = te - ts',
                '(Δt in Worten "Delta t")'
              ])
            break
            case 2:
              infoText.setText([
                'Mit Δt und Δx lässt sich',
                'die Mittlere Geschwindigkeit definieren.',
                '',
                '     Δx',
                'v = ―――',
                '     Δt'
              ])
              step++
            break
            case 3:
              infoText.setText([
                'Für das Beispiel gilt somit:',
                '',
                'Δx = ' + String(xe - xs) + 'm = ' + String(xe) + 'm - ' + String(xs) + 'm',
                'Δt = ' + String((te - ts).toFixed(3)) + 's = ' + String(te) + 's - ' + String(ts) + 's',
                '',
                '     Δx              m     ' + String(xe - xs) + 'm',
                'v = ―――  =  ' + String(((xe - xs) / String(te - ts)).toFixed(3)) + ' ――― =  ――――――',
                '     Δt              s     ' + String((te - ts).toFixed(3)) + 's'
              ])
              step++
            break
            case 4:
              this.children.remove(infoText)
              startTimeText.setText('')
              stopTimeText.setText('')
              this.children.remove(xStartText)
              this.children.remove(xStopText)
              this.children.remove(car)
              car = this.physics.add.sprite(Math.floor(config.width / 10), isPortrait ? Math.floor(config.height  * 0.75) - 64 : Math.floor(config.height * 0.75) - 64, 'car')
              this.physics.add.collider(cartesian, car)
              car.setBounce(0, 0.2)
              step++


              cartesianOrigin = this.add.image(startPos.x, config.height * 0.55, 'origin')
              xAxis = this.add.group({
                key: 'arrowXSegment',
                repeat: isPortrait ? Math.floor(config.width / 32 * 0.5) : Math.floor(config.width / 32 * 0.7),
                setXY: { x: startPos.x, y: config.height * 0.55, stepX: 32 }
              })
              xAxisArrow = this.add.image(isPortrait ? Math.floor(config.width / 32 * 0.5) * 32 + startPos.x : Math.floor(config.width / 32 * 0.7) * 32 + startPos.x , config.height * 0.55, 'arrowXHead')
              yAxis = this.add.group({
                key: 'arrowYSegment',
                repeat: isPortrait ? Math.floor(config.height / 32 * 0.35) : Math.floor(config.height / 32 * 0.3),
                setXY: { x: startPos.x, y: Math.floor(config.height * 0.55), stepY: -32 }
              })

              // legend
              velocity = this.add.rectangle(isPortrait ? 20 : 30, isPortrait ? 50 : 20 , 16, 16, 0xffff00)
              translation = this.add.rectangle(isPortrait ? 20 : 30, isPortrait ? 80 : 50 , 16, 16, 0x00ff00)
              velocityText = this.add.text(isPortrait ? 40 : 60, isPortrait ? 35 : 10, 'Geschwindigkeit' , { font: isPortrait ? config.width * scaleFacotorProtrait + 'px': config.height * scaleFacotorLandscape + 'px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'})
              translationText = this.add.text(isPortrait ? 40 : 60, isPortrait ? 65 : 40, 'Verschiebung' , { font: isPortrait ? config.width * scaleFacotorProtrait + 'px': config.height * scaleFacotorLandscape + 'px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'})

            break
            case 5:
              startPassed = false
              finishPassed = false
              car.setVelocityX(carSpeed)
              car.setDepth(-1)
              runFinalAnimation = true
              nextButton.removeInteractive()
              this.children.remove(nextButton)
              break
            case 6:
              // final screen
              myTmpGameObjects.forEach(item => {
                this.children.remove(item)
              })
              this.children.remove(nextButton)
              this.children.remove(infoText)
              this.children.remove(startTimeText)
              this.children.remove(stopTimeText)
              this.children.remove(xStartText)
              this.children.remove(xStopText)
              this.children.remove(car)
              xAxis.getChildren().forEach(item => {
                this.children.remove(item)

              })
              this.children.remove(xAxisArrow)
              yAxis.getChildren().forEach(item => {
                this.children.remove(item)

              })
              cartesian.getChildren().forEach(item => {
                this.children.remove(item)

              })
              this.children.remove(yAxisArrow)
              this.children.remove(velocity )
              this.children.remove(translation)
              this.children.remove(velocityText)
              this.children.remove(translationText)
              this.children.remove(yAxisArrow)
              this.children.remove(velocity )
              this.children.remove(translation)
              this.children.remove(velocityText)
              this.children.remove(translationText)
              this.children.remove(cartesianOrigin)
              this.children.remove(start)
              this.children.remove(finish)
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
                window.location.replace("https://de.wikipedia.org/wiki/Gleichf%C3%B6rmige_Bewegung");
              })
              this.tweens.add({
                targets: wikilinkButton,
                alpha: { from: 0.5, to: 1 },
                ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
                duration: 1200,
                repeat: -1,            // -1: infinity
                yoyo: true
              })
              break
            default:
            break
          }
        })
      }

      if (runFinalAnimation) {
        if (startPassed && !finishPassed) {
          y = isPortrait ? cartesianOrigin.y - (car.x - xs) * 0.5 : cartesianOrigin.y - (car.x - xs) * 0.5
          myTmpGameObjects.push(this.add.rectangle(car.x,  cartesianOrigin.y + car.body.velocity.y * 20, 2, 2, 0xffff00))
          myTmpGameObjects.push(this.add.rectangle(car.x,  y, 2, 2, 0x00ff00))
          x = car.x
        }
        if (car.x >= finishPos.x) {
          runFinalAnimation = false
          myTmpGameObjects.push(this.add.line(car.x, y + (cartesianOrigin.y - y) * 0.5, 0, 0, 0, cartesianOrigin.y - y + 20, 0xffffff))
          myTmpGameObjects.push(this.add.text(car.x + 10, y + (cartesianOrigin.y - y) * 0.5, 'Δx', { font: isPortrait ? config.width * scaleFacotorProtrait + 'px': config.height * scaleFacotorLandscape + 'px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'}))
          myTmpGameObjects.push(this.add.text(cartesianOrigin.x + (car.x - cartesianOrigin.x) * 0.5, cartesianOrigin.y + 10, 'Δt', { font: isPortrait ? config.width * scaleFacotorProtrait + 'px': config.height * scaleFacotorLandscape + 'px', fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif'}))
          myTmpGameObjects.push(this.add.text(cartesianOrigin.x + 5, cartesianOrigin.y - 96, ['     Δx', 'v = ――― = konstant', '     Δt'],  { font: isPortrait ? String(config.width * scaleFacotorProtrait)  + 'px' : config.height * scaleFacotorLandscape + 'px' }))
          myTmpGameObjects[myTmpGameObjects.length - 1].setDepth(100)
          myTmpGameObjects[myTmpGameObjects.length - 1].style.setBackgroundColor('#000000')
          myTmpGameObjects[myTmpGameObjects.length - 1].alpha = 0.75

          console.log(myTmpGameObjects[myTmpGameObjects.length - 1])
        }
      }
    }
  }
}
</script>