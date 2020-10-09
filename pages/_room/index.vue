<template>
  <div class="container" :class="{ 'is-textarea-expanded': isTextareaFocused }">
    <ul id="message-viewer" class="message-viewer">
      <MessageListItem
        v-for="message in messages"
        :key="message.key"
        :message="message.message"
        :send-get-time="message.sendGetTime"
        :send-time="message.sendTime"
        :user-name="message.name"
        :user-image="message.image"
        :user-id="message.userId"
      />
    </ul>
    <div class="message-form">
      <div class="message-text-area">
        <textarea
          v-model="messageContent"
          placeholder="メッセージを入力してください"
          @focus="onFocus"
          @keydown="isPressedSubmitKey"
          @blur="onBlur"
        ></textarea>
      </div>
      <div class="message-send-btn-area">
        <button
          class="send-btn"
          :class="{ 'disabled-send-btn': !messageContent }"
          :disabled="!messageContent"
          @click="sendMessage()"
        >
          <svg
            width="48px"
            height="48px"
            viewBox="0 0 24 24"
            stroke="#666666"
            fill="none"
          >
            <polygon
              points="21.368 12.001 3 21.609 3 14 11 12 3 9.794 3 2.394"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import {
  defineComponent,
  reactive,
  toRefs,
  SetupContext, //eslint-disable-line
  useContext,
  computed,
} from '@nuxtjs/composition-api'
import firebase from '~/plugins/firebase'
import MessageListItem from '~/components/message/MessageListItem.vue'

export default defineComponent({
  layout: 'default',
  head: {
    title: 'webチャットアプリ',
  },
  components: {
    MessageListItem,
  },
  setup(_props, { root }) {
    const { store, params } = useContext()

    const {
      state,
      sendMessage,
      onFocus,
      onBlur,
      isPressedSubmitKey,
      hasMessage,
      getMessageData,
    } = useMessage(store, params, root)

    getMessageData()

    return {
      ...toRefs(state),
      sendMessage,
      onFocus,
      onBlur,
      isPressedSubmitKey,
      hasMessage,
      getMessageData,
    }
  },
})

type Message = {
  key: string | null
  sendGetTime: number
  sendTime: string
  userId: string
  name: string
  image: string
  message: string
}

type State = {
  messageContent: string
  messages: Message[]
  isTextareaFocused: boolean
}

type UseMessage = {
  state: State
  sendMessage(): void
  onFocus(): void
  onBlur(): void
  isPressedSubmitKey(keyEvent: HTMLInputElement): void
  hasMessage: any
  getMessageData(): void
}

const useMessage = (
  store: Context['store'],
  params: any,
  root: any
): UseMessage => {
  const state = reactive<State>({
    messageContent: '',
    messages: [],
    isTextareaFocused: false,
  })

  const hasMessage = computed(() => {
    // NOTE: 空白文字のみの場合はメッセージなしと判定
    return !state.messageContent.match(/^\s*$/)
  })

  const onFocus = () => {
    state.isTextareaFocused = true
  }

  const onBlur = () => {
    state.isTextareaFocused = false
  }

  const getMessageData = () => {
    firebase
      .database()
      .ref(`message/${params.value.room}`)
      .on('child_added', (snap) => {
        const message = snap.val()
        console.log(message)
        state.messages.push({
          key: snap.key,
          sendGetTime: message.send_get_time,
          sendTime: message.send_time,
          userId: message.user_id,
          name: message.display_name,
          image: message.profile_url,
          message: message.message,
        })

        const messageViewer = document.getElementById('message-viewer')
        root.$nextTick(() => {
          messageViewer?.scrollTo(0, messageViewer.clientHeight)
        })
      })
  }

  const sendMessage = () => {
    const nowDate = new Date()
    const sendGetTime = nowDate.getTime()
    const sendTime = `${('00' + String(nowDate.getHours())).slice(-2)}:${(
      '00' + String(nowDate.getMinutes())
    ).slice(-2)}`

    firebase.database().ref(`message/${params.value.room}`).push({
      message: state.messageContent.trim(),
      send_get_time: sendGetTime,
      send_time: sendTime,
      user_id: store.getters.getUserUid,
      display_name: store.getters.getUserName,
      profile_url: store.getters.getUserImage,
    })

    state.messageContent = ''
  }

  const isPressedSubmitKey = (keyEvent: any) => {
    if (keyEvent.key === 'Enter' && (keyEvent.ctrlKey || keyEvent.metaKey)) {
      sendMessage()
    }
  }

  return {
    state,
    sendMessage,
    onFocus,
    onBlur,
    isPressedSubmitKey,
    hasMessage,
    getMessageData,
  }
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  background-color: #27292a;
  width: calc(100% - 312px);
  height: 100vh;
  display: flex;
  flex-direction: column;
  margin: 0;
  max-width: none;
}

.message-viewer {
  height: calc(100% - 96px);
  overflow: scroll;
}

.message-form {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 96px;
  background: #414141;

  .message-text-area {
    > textarea {
      color: #dadada;
      background: #414141;
      width: 100%;
      resize: none;
      box-sizing: border-box;
      padding: 10px 15px;
      border: none;
    }
  }

  .message-send-btn-area {
    display: flex;
    justify-content: flex-end;
    align-items: center;

    .send-btn {
      display: block;
      cursor: pointer;
      width: 30px;
      color: #ffffff;
      font-weight: bold;
      margin: 0 20px 0 auto;

      > svg {
        width: 100%;
        height: 100%;
      }
    }

    .disabled-send-btn {
      > svg {
        stroke: #ddd;
      }
    }
  }
}

.is-textarea-expanded {
  .message-viewer {
    height: calc(100% - 120px);
  }

  .message-form {
    height: 120px;

    textarea {
      height: 80px;
    }
  }
}
</style>
