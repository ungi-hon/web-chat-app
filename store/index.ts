import { reactive } from 'nuxt-composition-api'
import { GetterTree, MutationTree, ActionTree } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import { RootState, AutoState } from '~/store/types'

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
  setUserName(state, userName) {
    state.userName = userName
  },
}

export const actions: ActionTree<AutoState, RootState> = {
  nuxtClientInit() {
    createPersistedState()(this)
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
