import { Middleware } from '@nuxt/types'

const middleware: Middleware = ({ route, store, redirect }) => {
  // NOTE: ログイン不要のページであれば終了
  if (route.path === '/login') {
    return
  }
  const { isLogin } = store.state

  console.log(isLogin)
  // NOTE: ログイン状態でなければログインページへ遷移
  if (!isLogin) {
    redirect('/login')
  }
}

export default middleware
