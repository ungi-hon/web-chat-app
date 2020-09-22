<template>
  <section class="login-content">
    <h1 class="title-text">webチャットアプリ</h1>
    <p class="login-text">ログイン</p>

    <button class="sign-up-open-btn" @click="onClickSignUpOpenBtn">
      <span class="sign-up-text">初めての方は</span>
      <span class="blue-sign-up-text"
        >こちらからアカウントを作成してください。</span
      >
    </button>
    <div class="email-login">
      <DefaultInput type="email" :value="email" @input="email = $event" />
      <DefaultInput
        type="password"
        :value="password"
        @input="password = $event"
      />
      <v-btn rounded color="#1273E5" class="email-login-btn" @click="emailLogin"
        ><p class="submit-btn-text">ログイン</p></v-btn
      >
    </div>

    <p class="separator">または</p>

    <LoginSignInLoginBtn
      btn-text="google"
      :outlined="true"
      @click="googleLogin"
    />
    <LoginSignInLoginBtn
      btn-text="facebook"
      color="#3B5998"
      :font-color-white="true"
      @click="facebookLogin"
    />
    <LoginSignInLoginBtn
      btn-text="github"
      color="#171515"
      :font-color-white="true"
      @click="githubLogin"
    />
  </section>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import {
  defineComponent,
  SetupContext, // eslint-disable-line
  useContext,
  reactive,
  toRefs,
} from 'nuxt-composition-api'
import firebase from '~/plugins/firebase'
import LoginSignInLoginBtn from '~/components/login/LoginSignInLoginBtn.vue'
import DefaultInput from '~/components/modules/DefaultInput.vue'

type Props = {
  isOpenSignUpContent: boolean
}

export default defineComponent({
  head: {},
  components: {
    LoginSignInLoginBtn,
    DefaultInput,
  },
  props: {
    isOpenSignUpContent: {
      type: Boolean as () => Props['isOpenSignUpContent'],
      required: true,
    },
  },
  setup(_props, { root, emit }) {
    const { store } = useContext()

    const onClickSignUpOpenBtn = () => {
      emit('update:isOpenSignUpContent', true)
    }

    const {
      accountState,
      googleLogin,
      emailLogin,
      facebookLogin,
      githubLogin,
    } = useAccount(store, root)

    return {
      accountState,
      ...toRefs(accountState),
      googleLogin,
      emailLogin,
      facebookLogin,
      githubLogin,
      onClickSignUpOpenBtn,
    }
  },
})

type AccountState = {
  email: string
  password: string
}

type UseAccount = {
  accountState: AccountState
  googleLogin(): void
  emailLogin(): void
  facebookLogin(): void
  githubLogin(): void
}

const useAccount = (
  store: Context['store'],
  root: SetupContext['root']
): UseAccount => {
  const router = root.$router

  const accountState = reactive<AccountState>({
    email: '',
    password: '',
  })

  const googleLogin = () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const user = result.user

        store.dispatch('setIsLogin')
        store.dispatch('setUserUid', user?.uid)
        store.dispatch('setUserName', user?.displayName)
        store.dispatch('setUserImage', user?.photoURL)

        router.push('/')
      })
      .catch((error) => {
        console.log(error) // eslint-disable-line
      })
  }

  const emailLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(accountState.email, accountState.password)
      .then((result) => {
        const user = result.user

        store.dispatch('setIsLogin')
        store.dispatch('setUserUid', user?.uid)
        store.dispatch('setUserName', user?.displayName)
        store.dispatch('setUserImage', user?.photoURL)

        router.push('/')
      })
      .catch((error) => {
        console.log(error) // eslint-disable-line
      })
  }

  const facebookLogin = () => {
    const provider = new firebase.auth.FacebookAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const user = result.user

        store.dispatch('setIsLogin')
        store.dispatch('setUserUid', user?.uid)
        store.dispatch('setUserName', user?.displayName)
        store.dispatch('setUserImage', user?.photoURL)

        router.push('/')
      })
      .catch((error) => {
        console.log(error) // eslint-disable-line
      })
  }

  const githubLogin = () => {
    const provider = new firebase.auth.GithubAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const user = result.user

        store.dispatch('setIsLogin')
        store.dispatch('setUserUid', user?.uid)
        store.dispatch('setUserName', user?.displayName)
        store.dispatch('setUserImage', user?.photoURL)

        router.push('/')
      })
      .catch((error) => {
        console.log(error) // eslint-disable-line
      })
  }

  return { accountState, googleLogin, emailLogin, facebookLogin, githubLogin }
}
</script>

<style lang="scss" scoped>
.login-content {
  width: 500px;
  margin: 0 auto;
  display: block;
  padding: 30px 0;
  background-color: #fff;
  border-radius: 5px;

  .title-text {
    width: 80%;
    margin: 0 auto 20px;
    font-size: 15px;
    font-weight: normal;
  }

  .login-text {
    width: 80%;
    margin: 0 auto 20px;
    font-size: 20px;
    font-weight: bold;
  }

  .sign-up-open-btn {
    display: block;
    font-size: 14px;
    width: 80%;
    margin: 0 auto 30px;
    outline: none;
    text-align: left;

    .blue-sign-up-text {
      color: #1273e5;
    }
  }
}

.email-login {
  display: block;
  padding: 30px 0 0 0;
  width: 80%;
  margin: 0 auto 30px;

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

  .email-login-btn {
    display: block;
    margin: 30px 0 0 auto;
    font-weight: 800;

    .submit-btn-text {
      color: #fff;
    }
  }
}

.separator {
  color: #444;
  display: flex;
  width: 80%;
  margin: 0 auto 30px;
  align-items: center;

  &:before,
  &:after {
    content: '';
    flex-grow: 1;
    height: 1px;
    background: #c0c0c0;
    display: block;
  }
  &:before {
    margin-right: 0.4em;
  }
  &:after {
    margin-left: 0.4em;
  }
  &:before {
    content: '';
  }
}
</style>
