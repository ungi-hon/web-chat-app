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
} from 'nuxt-composition-api'
import firebase from '~/plugins/firebase'
import MessageListItem from '~/components/message/MessageListItem.vue'

export default defineComponent({
  head: {
    title: 'webチャットアプリ',
  },
  components: {
    MessageListItem,
  },
  setup(_props, { root }) {
    const { store } = useContext()

    const {
      state,
      sendMessage,
      onFocus,
      onBlur,
      isPressedSubmitKey,
    } = useMessage(store)

    console.log()

    firebase
      .database()
      .ref('message/room1')
      .on('child_added', (snap) => {
        const message = snap.val()
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

    return {
      ...toRefs(state),
      sendMessage,
      onFocus,
      onBlur,
      isPressedSubmitKey,
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
  isPressedSubmitKey(keyEvent: any): void
}

const useMessage = (store: Context['store']): UseMessage => {
  const state = reactive<State>({
    messageContent: '',
    messages: [],
    isTextareaFocused: false,
  })

  const onFocus = () => {
    state.isTextareaFocused = true
  }

  const onBlur = () => {
    state.isTextareaFocused = false
  }

  const sendMessage = () => {
    const nowDate = new Date()
    const sendGetTime = nowDate.getTime()
    const sendTime = `${('00' + String(nowDate.getHours())).slice(-2)}:${(
      '00' + String(nowDate.getMinutes())
    ).slice(-2)}`

    firebase.database().ref('message/room1/').push({
      message: state.messageContent,
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
  }
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  background-color: #fff;
  width: calc(100% - 300px);
  height: 100vh;
  background-color: #ffffff;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
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
  border: 1px solid #ddd;
  background: #fff;

  .message-text-area {
    > textarea {
      width: 100%;
      resize: none;
      box-sizing: border-box;
      padding: 10px 15px;
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
