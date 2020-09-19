<template>
  <div class="container">
    <p class="title is-1 is-spaced">user: {{ $store.getters.getUserName }}</p>
    <button @click="login">ログイン</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext } from 'nuxt-composition-api'

// import firebase from 'firebase'

export default defineComponent({
  head: {
    title: 'Sample',
  },
  setup() {
    const { store } = useContext()

    const login = () => {
      store.dispatch('login')
    }

    return {
      login,
    }
  },
})
</script>
<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
