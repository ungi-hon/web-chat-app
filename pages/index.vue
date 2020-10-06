<template>
  <div class="container">
    <p>メッセージを始めましょう。</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup() {
    return {}
  },
})
</script>

<style lang="scss" scoped>
.container {
  width: calc(100% - 312px);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
