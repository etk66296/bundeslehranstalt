<template>
  <q-page class="q-pa-xs">
    <q-card>
      <q-card-section class="q-ma-xs">
        <div class="q-pa-md q-gutter-lg">
          <q-btn size="xl" color="positive" icon="keyboard" label="Programmierung" tag="a" to="programming"/>
        </div>
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section class="q-ma-xs">
        <div class="q-pa-md q-gutter-lg">
          <q-btn size="xl" color="positive" icon="highlight" label="Physik" tag="a" to="physics"/>
        </div>
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section class="q-ma-xs">
        <div class="q-pa-md q-gutter-lg">
          <q-btn size="xl" color="positive" icon="calculate" label="Mathematik" tag="a" to="mathIndex"/>
        </div>
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section class="q-ma-xs">
        <div class="q-pa-md q-gutter-lg">
          <q-btn size="xl" color="positive" icon="calculate" label="3D Drucker" tag="a" to="3dprinting"/>
        </div>
      </q-card-section>
    </q-card>
    <q-card>
      <q-card-section class="q-ma-xs">
        <div class="q-pa-md q-gutter-lg">
          <q-btn size="xl" color="positive" icon="calculate" label="Elektronik" tag="a" to="electronics"/>
          <q-btn size="xl" color="positive" icon="calculate" label="Elektronik" tag="a" to="electronics"/>
          <q-btn size="xl" color="positive" icon="calculate" label="Elektronik" tag="a" to="electronics"/>
          <q-btn size="xl" color="positive" icon="calculate" label="Elektronik" tag="a" to="electronics"/>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex'
}
</script>