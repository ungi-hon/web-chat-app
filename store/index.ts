import { reactive } from 'nuxt-composition-api'
import { GetterTree, MutationTree, ActionTree } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { RootState, AuthState } from '~/store/types'

export const state = () => {
  return reactive<AuthState>({
    isLogin: false,
    userUid: '',
    userName: '',
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
}

export const actions: ActionTree<AuthState, RootState> = {
  nuxtClientInit() {
    createPersistedState()(this)
  },
  setUserUid({ commit }, uid) {
    commit('setUserUid', uid)
  },
  setUserName({ commit }, displayName) {
    commit('setUserName', displayName)
  },
  setIsLogin({ commit }) {
    commit('setIsLogin', true)
  },
}

export const getters: GetterTree<AuthState, RootState> = {
  getUserUid(state) {
    return state.userUid
  },
  getUserName(state) {
    return state.userName
  },
}
