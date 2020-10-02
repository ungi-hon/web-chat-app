<template>
  <div class="container">
    <button @click="logout()">ログアウト</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, useContext } from 'nuxt-composition-api'

export default defineComponent({
  setup(_props, { root }) {
    const { store } = useContext()
    const router = root.$router

    const logout = () => {
      store.dispatch('setIsLogout')
      store.dispatch('setUserUid', '')
      store.dispatch('setUserName', '')
      store.dispatch('setUserImage', '')
      router.push('/login')
    }

    return { logout }
  },
})
</script>

<style lang="scss" scoped>
.container {
  width: calc(100% - 250px);
}
</style>
