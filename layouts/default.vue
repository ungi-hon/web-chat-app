<template>
  <div class="wrapper">
    <navigation />
    <Nuxt />
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import navigation from '~/components/nav/navigation.vue'

export default defineComponent({
  components: {
    navigation,
  },
  setup() {},
})
</script>

<style lang="scss">
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-size: cover;
  color: #333;
}

.wrapper {
  display: flex;
}

a {
  text-decoration: none;
  &:link {
    color: #333;
  }
  &:visited {
    color: #333;
  }
  &:hover {
    color: #333;
  }
  &:active {
    color: #333;
  }
}

button,
input,
textarea {
  outline: none;
}

li {
  list-style: none;
}

button {
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  appearance: none;
}

input {
  border: none;
}
</style>
