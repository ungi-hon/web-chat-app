<template>
  <div class="container">
    <transition name="fade-sign-in">
      <LoginSignIn
        v-if="!isOpenSignUpContent"
        class="sign-content"
        :is-open-sign-up-content.sync="isOpenSignUpContent"
      />
    </transition>
    <transition name="fade-sign-up">
      <LoginCreateAccount
        v-if="isOpenSignUpContent"
        class="sign-content"
        :is-open-sign-up-content.sync="isOpenSignUpContent"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from '@nuxtjs/composition-api'
import LoginSignIn from '~/components/login/LoginSignIn.vue'
import LoginCreateAccount from '~/components/login/LoginCreateAccount.vue'

export default defineComponent({
  layout: 'login',
  head: {
    title: 'Sample',
  },
  components: {
    LoginSignIn,
    LoginCreateAccount,
  },
  setup() {
    const state = reactive<any>({
      isOpenSignUpContent: false,
    })
    return {
      ...toRefs(state),
    }
  },
})
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
}

.sign-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.fade-sign-in-enter-active {
  transition: all 0.5s 0.5s;
}
.fade-sign-in-leave-active {
  transition: all 0.5s;
}

.fade-sign-in-enter,
.fade-sign-in-leave-to {
  opacity: 0;
  transform: translate(-50%, -40%);
}

.fade-sign-up-enter-active {
  transition: all 0.5s 0.5s;
}

.fade-sign-up-leave-active {
  transition: all 0.5s;
}

.fade-sign-up-enter,
.fade-sign-up-leave-to {
  opacity: 0;
  transform: translate(-50%, -60%);
}
</style>
