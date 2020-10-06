<template>
  <div class="input-content">
    <span class="label">{{ typeText }}</span>
    <input :value="value" class="input" :type="type" @input="onInput" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'

type Props = {
  type: 'email' | 'password' | 'name'
  value: String
}

export default defineComponent({
  head: {
    title: 'Sample',
  },
  props: {
    type: {
      type: String as () => Props['type'],
      required: true,
    },
    value: {
      type: String as () => Props['value'],
      required: true,
    },
  },
  setup(props: Props, { emit }) {
    const onInput = (event: Event) => {
      if (event.target instanceof HTMLInputElement) {
        emit('input', event.target.value)
      }
    }

    const typeText = computed(() => {
      switch (props.type) {
        case 'email': {
          return '電子メールアドレス'
        }
        case 'name': {
          return '名前'
        }
        case 'password': {
          return 'パスワード'
        }
      }
    })

    return {
      onInput,
      typeText,
    }
  },
})
</script>

<style lang="scss" scoped>
.input-content {
  position: relative;

  &:not(:last-of-type) {
    margin-bottom: 50px;
  }

  .label {
    position: absolute;
    top: -25px;
    font-size: 13px;
  }

  .input {
    font-size: 18px;
    width: 100%;
    outline: none;
    border-bottom: 1px solid #c0c0c0;
    transition: all 0.2s;

    &:focus {
      border-bottom: 1px solid #1273e5;
    }
  }
}
</style>
