import { reactive } from 'nuxt-composition-api'
import { GetterTree, MutationTree, ActionTree } from 'vuex'
import { User } from 'firebase'
import { RootState, AutoState } from '~/store/types'
import firebase from '~/plugins/firebase'

export const autoState = () => {
  return reactive<AutoState>({
    userUid: '',
    userName: '',
  })
}

export const mutations: MutationTree<AutoState> = {
  setUserUid(autoState, userUid) {
    autoState.userUid = userUid
  },
  setUserName(autoState, userName) {
    autoState.userName = userName
  },
}

export const actions: ActionTree<AutoState, RootState> = {
  login({ commit }) {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const user: User | null = result.user
        commit('setUserUid', user?.uid)
        commit('setUserName', user?.displayName)
      })
      .catch((error) => {
        const errorCode = error.code
        console.log('error : ' + errorCode)
      })
  },
}

export const getters: GetterTree<AutoState, RootState> = {
  getUserUid(autoState) {
    return autoState.userUid
  },
  getUserName(autoState) {
    return autoState.userName
  },
}
