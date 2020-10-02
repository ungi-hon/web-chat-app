<template>
  <li class="room-item">
    <p class="room-name">{{ roomName }}</p>
    <p class="last-message">{{ lastMessage }}</p>
    <div class="time-text">
      <p v-if="setYearBefore !== 0" class="last-send-time-text">
        {{ `${setYearBefore} 年前` }}
      </p>
      <p v-else-if="setDayBefore !== 0" class="last-send-time-text">
        {{ `${setDayBefore} 日前` }}
      </p>
      <p v-else class="last-send-time-text">{{ lastSendTime }}</p>
    </div>
    <nuxt-link class="room-link" :to="`./${roomName}`"> </nuxt-link>
  </li>
</template>

<script lang="ts">
import { defineComponent, computed } from 'nuxt-composition-api'

type Props = {
  roomName: string
  lastMessage: string
  lastSendGetTime: number
  lastSendTime: string
}

export default defineComponent({
  props: {
    roomName: {
      type: String as () => Props['roomName'],
      required: true,
    },
    lastMessage: {
      type: String as () => Props['lastMessage'],
      default: '',
    },
    lastSendGetTime: {
      type: Number as () => Props['lastSendGetTime'],
      required: false,
      default: 0,
    },
    lastSendTime: {
      type: String as () => Props['lastSendTime'],
      required: false,
      default: '',
    },
  },
  setup(props: Props) {
    const setDayBefore = computed(() => {
      if (!props.lastSendGetTime) {
        return 0
      }
      const nowGetTime = new Date().getTime()
      const diff = nowGetTime - props.lastSendGetTime

      const beforeDays = diff / (1000 * 60 * 60 * 24)

      return Math.floor(beforeDays)
    })

    const setYearBefore = computed(() => {
      if (!props.lastSendGetTime) {
        return 0
      }
      return Math.floor(setDayBefore.value / 365)
    })

    return {
      setDayBefore,
      setYearBefore,
    }
  },
})
</script>

<style lang="scss" scoped>
.room-item {
  position: relative;
  list-style: none;
  padding: 20px 15px;
  height: 86px;
}

.room-link {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.room-name {
  font-weight: bold;
}

.last-message {
  margin-top: 10px;
}

.time-text {
  position: absolute;
  top: 10px;
  right: 20px;
}
</style>
