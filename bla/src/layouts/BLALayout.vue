<template>
  <q-layout view="lHh Lpr lFf">
    <q-header style="background-color: #121212;" class="">
      <q-img :src=headerImage />
      <div top="120" class="text-h6 absolute-top-left q-mt-sm q-ml-xl">Bundeslehranstalt</div>
    </q-header>

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
    <q-footer style="background-color: #121212;" class="">
      <q-img :src=footerImage />
    </q-footer>
  </q-layout>
</template>

<script>
export default {
  name: 'BLALayout',
  components: {},
  data () {
    return {
      leftDrawerOpen: false,
      headerImage: "header.png",
      footerImage: "footer.png"
    }
  },
  mounted () {
    if (window.innerWidth >= window.innerHeight) {
      this.headerImage = "header.png"
      this.footerImage = "footer.png"
    } else {
      this.headerImage = "headerMobile.png"
      this.footerImage = "footerMobile.png"
    }
  }
}
</script>
