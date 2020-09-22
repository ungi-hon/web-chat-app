import { reactive } from 'nuxt-composition-api'
import { GetterTree, MutationTree, ActionTree } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { RootState, AuthState } from '~/store/types'

export const state = () => {
  return reactive<AuthState>({
    isLogin: false,
    userUid: '',
    userName: '',
    userImage: '',
  })
}

export const mutations: MutationTree<AuthState> = {
  setIsLogin(state, isLogin) {
    state.isLogin = isLogin
  },
  setUserUid(state, userUid) {
    state.userUid = userUid
  },
  setUserName(state, userName) {
    state.userName = userName
  },
  setUserImage(state, userImage) {
    state.userImage = userImage
  },
}

export const actions: ActionTree<AuthState, RootState> = {
  nuxtClientInit() {
    createPersistedState()(this)
  },
  setIsLogin({ commit }) {
    commit('setIsLogin', true)
  },
  setIsLogout({ commit }) {
    commit('setIsLogin', false)
  },
  setUserUid({ commit }, uid) {
    commit('setUserUid', uid)
  },
  setUserName({ commit }, displayName) {
    commit('setUserName', displayName)
  },
  setUserImage({ commit }, image) {
    commit('setUserImage', image)
  },
}

export const getters: GetterTree<AuthState, RootState> = {
  getIsLogin(state) {
    return state.isLogin
  },
  getUserUid(state) {
    return state.userUid
  },
  getUserName(state) {
    return state.userName
  },
  getUserImage(state) {
    return state.userImage
  },
}
