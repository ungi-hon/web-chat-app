<template>
  <v-btn
    class="login-btn"
    rounded
    :outlined="outlined"
    :color="color"
    @click="onClick"
    ><img class="icon" :src="imgPath" :alt="`${btnText}のアイコン`" />
    <span
      class="outlined-btn-text"
      :class="{ 'btn-text-color-white': fontColorWhite }"
      >{{ btnText + 'でログイン' }}</span
    ></v-btn
  >
</template>

<script lang="ts">
import { defineComponent, computed } from 'nuxt-composition-api'

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
  font-weight: 800;
  width: 80%;
  padding: 20px 0 !important;
  margin: 0 auto 20px;
  .icon {
    width: 18px;
    margin-right: 10px;
  }
}

.btn-text-color-white {
  color: #fff;
}
</style>
