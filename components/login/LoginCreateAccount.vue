<template>
  <section class="create-account-content">
    <h1 class="title-text">webチャットアプリ</h1>
    <p class="create-account-text">アカウントの作成</p>

    <div class="email-create-account">
      <DefaultInput type="email" :value="email" @input="email = $event" />
      <DefaultInput
        type="password"
        :value="password"
        @input="password = $event"
      />
      <DefaultInput type="name" :value="name" @input="name = $event" />
      <button
        rounded
        color="#1273E5"
        class="email-create-account-btn"
        @click="emailCreateAccount"
      >
        <p class="submit-btn-text">作成</p>
      </button>
    </div>
    <div class="sign-up-text-content">
      <button class="sign-up-open-btn" @click="onClickSignUpOpenBtn">
        <span class="sign-up-text">アカウントをお持ちの方は</span>
        <span class="blue-sign-up-text">こちらからログインしてくさい。</span>
      </button>
    </div>
  </section>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import {
  defineComponent,
  useContext,
  reactive,
  toRefs,
} from '@nuxtjs/composition-api'
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
  setup(_props, { emit }) {
    const { store } = useContext()

    const onClickSignUpOpenBtn = () => {
      emit('update:isOpenSignUpContent', false)
    }

    const { createAccountState, emailCreateAccount } = createUseAccount(
      store,
      emit
    )

    return {
      createAccountState,
      ...toRefs(createAccountState),
      emailCreateAccount,
      onClickSignUpOpenBtn,
    }
  },
})

type CreateAccountState = {
  email: string
  password: string
  name: string
}

type UseAccount = {
  createAccountState: CreateAccountState
  emailCreateAccount(): void
}

const createUseAccount = (store: Context['store'], emit: any): UseAccount => {
  const createAccountState = reactive<CreateAccountState>({
    email: '',
    password: '',
    name: '',
  })

  const emailCreateAccount = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(
        createAccountState.email,
        createAccountState.password
      )
      .then(() => {
        const user = firebase.auth().currentUser

        user?.updateProfile({
          displayName: createAccountState.name,
        })

        store.dispatch('setUserName', user?.displayName)
        store.dispatch('setIsLogin')

        emit('update:isOpenSignUpContent', false)
      })
      .catch((error) => {
        alert(error)
      })
  }

  return { createAccountState, emailCreateAccount }
}
</script>

<style lang="scss" scoped>
.create-account-content {
  width: 500px;
  margin: 0 auto;
  display: block;
  padding: 30px 0;
  background-color: #fff;
  border-radius: 5px;
  color: #333;

  .title-text {
    width: 80%;
    margin: 0 auto 20px;
    font-size: 15px;
    font-weight: normal;
  }

  .create-account-text {
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

.email-create-account {
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

  .email-create-account-btn {
    display: block;
    margin: 30px 0 0 auto;
    font-weight: 800;
    background-color: #1273e5;
    padding: 10px 20px;
    border-radius: 25px;
    box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
      0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12);

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
