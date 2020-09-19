import { reactive, useContext } from 'nuxt-composition-api'
import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { User } from 'firebase'
import createPersistedState from 'vuex-persistedstate'
import { RootState, AutoState } from '~/store/types'

import firebase from '~/plugins/firebase'

export const state = () => {
  return reactive<AutoState>({
    isLogin: false,
    userName: '',
  })
}

export const mutations: MutationTree<AutoState> = {
  setIsLogin(state, isLogin) {
    state.isLogin = isLogin
  },
  setUserUid(state, userUid) {
    state.userUid = userUid
  },
  setUserName(state, userName) {
    state.userName = userName
  },
}

export const actions: ActionTree<AutoState, RootState> = {
  nuxtClientInit() {
    createPersistedState()(this)
  },
  // emailLogin({ commit }, { email, password, name }) {
  //   firebase
  //     .auth()
  //     .signInWithEmailAndPassword(email, password)
  //     .then((result) => {
  //       const user: User | null = result.user
  //       user?.updateProfile({
  //         displayName: name,
  //       })
  //       commit('setUserName', user?.displayName)
  //       commit('setIsLogin', true)
  //     })
  //     .catch((error) => {
  //       alert(error)
  //     })
  // },
  googleLogin({ commit }) {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const user: User | null = result.user
        commit('setUserName', user?.displayName)
        commit('setIsLogin', true)
      })
      .catch((error) => {
        const errorCode = error.code
        console.log('error : ' + errorCode)
      })
  },
  setUserName({ commit }, displayName) {
    commit('setUserName', displayName)
  },
  setIsLogin({ commit }) {
    commit('setIsLogin', true)
  },
}

export const getters: GetterTree<AutoState, RootState> = {
  getUserName(state) {
    return state.userName
  },
}
