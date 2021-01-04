<template>
  <q-layout view="lHh Lpr lFf">
    <!-- <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title>
          Bundeslehranstalt
        </q-toolbar-title>

        <div></div>
      </q-toolbar>
    </q-header> -->

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      dark
    >
      <q-list>
        <q-item-label
          header
        >
          Index
        </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <!-- <q-footer class="q-pa-xs">
      (Impressum)
    </q-footer>   -->
  </q-layout>
</template>

<script>
export default {
  name: 'BLALayout',
  components: {},
  data () {
    return {
      leftDrawerOpen: false
    }
  },
  mounted () {
  }
}
</script>
