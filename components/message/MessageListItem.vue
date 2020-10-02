<template>
  <li v-if="userName" class="message-item">
    <div class="wrapper" :class="`message-item-${messagePosition}`">
      <p class="user-image">
        <img
          :src="
            userImage ||
            'https://placehold.jp/50/c4c4c4/ffffff/150x150.png?text=%E3%83%80%E3%83%9F%E3%83%BC'
          "
          alt="userのプロフィール写真"
        />
      </p>
      <div class="message-name-wrapper">
        <p class="user-name">{{ userName }}</p>
        <div class="message-content">
          <p class="message-text">{{ message }}</p>
        </div>
        <p v-if="setYearBefore !== 0" class="send-time-text">
          {{ `${setYearBefore} 年前` }}
        </p>
        <p v-else-if="setDayBefore !== 0" class="send-time-text">
          {{ `${setDayBefore} 日前` }}
        </p>
        <p v-else class="send-time-text">{{ sendTime }}</p>
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent, computed, useContext } from 'nuxt-composition-api'

type Props = {
  message: string
  sendGetTime: number
  sendTime: string
  userId: string
  userName: string
  userImage: string
}

export default defineComponent({
  props: {
    message: {
      type: String as () => Props['message'],
      default: '',
    },
    sendGetTime: {
      type: Number as () => Props['sendGetTime'],
      default: 0,
    },
    sendTime: {
      type: String as () => Props['sendTime'],
      default: '',
    },
    userId: {
      type: String as () => Props['userId'],
      default: '',
    },
    userName: {
      type: String as () => Props['userName'],
      default: '',
    },
    userImage: {
      type: String as () => Props['userImage'],
      default: '',
    },
  },
  setup(props) {
    const { messagePosition, setDayBefore, setYearBefore } = useMessageItem(
      props
    )

    return {
      messagePosition,
      setDayBefore,
      setYearBefore,
    }
  },
})

const useMessageItem = (props: Props) => {
  const { store } = useContext()

  const messagePosition = computed(() => {
    return props.userId === store.getters.getUserUid ? 'right' : 'left'
  })

  const setDayBefore = computed(() => {
    const nowGetTime = new Date().getTime()
    const diff = nowGetTime - props.sendGetTime

    const beforeDays = diff / (1000 * 60 * 60 * 24)

    return Math.floor(beforeDays)
  })

  const setYearBefore = computed(() => {
    return Math.floor(setDayBefore.value / 365)
  })

  return {
    messagePosition,
    setDayBefore,
    setYearBefore,
  }
}
</script>

<style lang="scss" scoped>
.message-item {
  list-style: none;
  padding: 10px 15px;
}

.wrapper {
  display: flex;
  justify-content: flex-start;

  .user-image {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    overflow: hidden;

    > img {
      width: 100%;
    }
  }

  .message-name-wrapper {
    position: relative;

    .user-name {
      font-size: 13px;
    }
    .send-time-text {
      font-size: 12px;
      position: absolute;
      bottom: 10px;
    }

    .message-content {
      display: inline-block;
      color: #555;
      font-size: 16px;
      background: #e0edff;

      .message-text {
        max-width: 300px;
      }
    }
  }
}

.message-item-left {
  .message-name-wrapper {
    .user-name {
      text-align: left;
      margin-left: 10px;
    }

    .message-content {
      border-radius: 0 20px 20px 20px;
      margin: 10px 0 5px 10px;
      padding: 10px 15px 10px 18px;
    }

    .send-time-text {
      left: calc(100% + 10px);
    }
  }
}

.message-item-right {
  flex-direction: row-reverse;

  .message-name-wrapper {
    .user-name {
      text-align: right;
      margin-right: 10px;
    }

    .message-content {
      border-radius: 20px 0 20px 20px;
      margin: 10px 10px 5px 0;
      padding: 10px 18px 10px 15px;
    }

    .send-time-text {
      right: calc(100% + 10px);
      white-space: nowrap;
    }
  }
}
</style>
