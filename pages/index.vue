<template>
  <div class="container">
    <p class="title is-1 is-spaced">user: {{ $store.getters.getUserName }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'nuxt-composition-api'

// import firebase from 'firebase'

export default defineComponent({
  head: {
    title: 'Sample',
  },
  setup() {},
})
</script>
<style></style>
