<template>
  <q-page class="q-pa-xs">
    <q-item clickable tag="a" target="_blank" href="https://de.wikipedia.org/wiki/Natürliche_Zahl">
      wikipedia link
    </q-item>
    <div id="myRenderCanvas"></div>
  </q-page>
</template>

<script>
import "phaser"
export default {
  name: 'NaturalNumbers',
  components: {},
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  mounted () {
    var config = {
      width: window.innerWidth,
      height: window.innerheight,
      type: Phaser.AUTO,
      parent: 'myRenderCanvas',
      scene: {
        create: create,
        update: update
      }
    }
    var game = new Phaser.Game(config);

    var graphics
    var circles

    function create () {
      this.cameras.main.setBackgroundColor(0x121212)
      graphics = this.add.graphics({ lineStyle: { color: 0xf58b00 } })
      var circle = new Phaser.Geom.Circle(400, 300, 0)
      circles = [circle]
      for(var i = 0; i < 80; i++) {
        circle = Phaser.Geom.Circle.Clone(circle)
        circle.radius += 20
        Phaser.Geom.Circle.CircumferencePoint(circle, i / 20 * Phaser.Math.PI2, circle)
        circles.push(circle)
      }
    }
    
    function update () {
      graphics.clear()
      for(var i = 0; i < circles.length; i++) {
        circles[i].radius += 1
        if(circles[i].radius > window.innerWidth) {
          circles[i].radius = 0
        }
        graphics.strokeCircleShape(circles[i]);
      }
    }
  }
}
</script>