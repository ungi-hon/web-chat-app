<template>
  <button class="login-btn" :class="`${btnText}-login-btn`" @click="onClick">
    <img class="icon" :src="imgPath" :alt="`${btnText}のアイコン`" />
    <span
      class="outlined-btn-text"
      :class="{ 'btn-text-color-white': fontColorWhite }"
      >{{ btnText + 'でログイン' }}</span
    >
  </button>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'

type Props = {
  outlined: boolean
  color: string
  btnText: string
  fontColorWhite: boolean
}

export default defineComponent({
  head: {
    title: 'Sample',
  },
  props: {
    outlined: {
      type: Boolean as () => Props['outlined'],
      default: false,
    },
    color: {
      type: String as () => Props['color'],
      default: '',
    },
    btnText: {
      type: String as () => Props['btnText'],
      required: true,
    },
    fontColorWhite: {
      type: Boolean as () => Props['fontColorWhite'],
      default: false,
    },
  },
  setup(props: Props, { emit }) {
    const onClick = () => {
      emit('click')
    }

    const imgPath = computed(() => {
      return require(`~/assets/img/${props.btnText}-icon.png`)
    })

    return {
      onClick,
      imgPath,
    }
  },
})
</script>

<style lang="scss" scoped>
.login-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  width: 80%;
  padding: 20px 0 !important;
  margin: 0 auto 20px;
  box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
    0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);
  border-radius: 30px;

  .icon {
    width: 18px;
    margin-right: 10px;
  }
}
.google-login-btn {
}
.facebook-login-btn {
  background: #3b5998;
}
.github-login-btn {
  background: #171515;
}
.btn-text-color-white {
  color: #fff;
}
</style>
