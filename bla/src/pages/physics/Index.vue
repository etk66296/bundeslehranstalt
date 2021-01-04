<template>
  <q-page class="q-pa-xs">
    <q-card>
      <q-card-section class="q-ma-xs">
        <div>
          Mechanik
        </div>
        <div class="q-pa-md q-gutter-lg">
          <q-btn size="xl" color="accent" icon="keyboard" label="gleichförmige Bewegung" tag="a" to="homogeneousTranslation"/>
        </div>
        <div class="q-pa-md q-gutter-lg">
          <q-btn size="xl" color="accent" icon="keyboard" label="Geschwindigkeit" tag="a" to="velocity"/>
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