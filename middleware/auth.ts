import { Middleware } from '@nuxt/types'

const NOT_LOGIN_PAGE_LIST = ['/login']

const middleware: Middleware = ({ route, store, redirect }) => {
  const isNotLoginPage = NOT_LOGIN_PAGE_LIST.map((page) => {
    return page
  }).includes(route.path)

  // NOTE: ログイン不要のページであれば終了
  if (isNotLoginPage) {
    return
  }

  // NOTE: ログイン状態でなければログインページへ遷移
  if (!store.getters.userUid) {
    return redirect('/login')
  }
}

export default middleware
