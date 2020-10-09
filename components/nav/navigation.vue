<template>
  <nav class="nav-container">
    <ul class="icon-menu-list">
      <li class="profile-item">
        <button class="icon" @click="isOpenIconMenu = true">
          <svg
            id="_x32_"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 512 512"
            style="width: 32px; height: 32px; opacity: 1"
            xml:space="preserve"
          >
            <g>
              <path
                class="st0"
                d="M255.988,282.537c78.002,0,141.224-63.221,141.224-141.213c0-77.982-63.222-141.213-141.224-141.213
		c-77.99,0-141.203,63.23-141.203,141.213C114.785,219.316,177.998,282.537,255.988,282.537z"
                style="fill: #666666"
              ></path>
              <path
                class="st0"
                d="M503.748,468.222C473.826,376.236,364.008,326.139,256,326.139c-108.02,0-217.828,50.098-247.75,142.084
		c-4.805,14.74-7.428,29.387-8.25,43.666h512C511.166,497.609,508.553,482.963,503.748,468.222z"
                style="fill: #666666"
              ></path>
            </g>
          </svg>
        </button>
        <p class="profile-image">
          <img
            :src="
              $store.getters.getUserImage ||
              'https://placehold.jp/50/c4c4c4/ffffff/150x150.png?text=%E3%83%80%E3%83%9F%E3%83%BC'
            "
          />
        </p>
        <p class="profile-name">{{ $store.getters.getUserName }}</p>
      </li>
      <li class="add-room-item">
        <button class="icon" @click="isOpenIconMenu = true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="512px"
            height="512px"
            viewBox="0 0 512 512"
          >
            <g>
              <path
                class="st0"
                d="M257.1,19.2C104,19.2,0,97.3,0,218.8c0,74.7,31.1,134.6,91.1,173.2c4,2.6,8.7,3,7,10.4
		c-7.2,29.9-19.6,83.3-19.6,83.3c-0.5,2.3,0.3,4.6,2.2,6c1.8,1.4,4.3,1.6,6.4,0.5c0,0,87.9-52.1,99.6-58.6
		c27.3-15.6,50.9-18.7,68.6-18.7c121.5,0,256.9-48.6,256.9-197.4C512,102,419,19.2,257.1,19.2z M136.9,258.1
		c-16.9,0-30.5-13.7-30.5-30.5s13.7-30.5,30.5-30.5c16.9,0,30.5,13.7,30.5,30.5C167.4,244.5,153.8,258.1,136.9,258.1z M256,258.1
		c-16.9,0-30.5-13.7-30.5-30.5s13.7-30.5,30.5-30.5c16.9,0,30.5,13.7,30.5,30.5C286.5,244.5,272.9,258.1,256,258.1z M375.1,258.1
		c-16.9,0-30.5-13.7-30.5-30.5s13.7-30.5,30.5-30.5c16.9,0,30.5,13.7,30.5,30.5C405.6,244.5,392,258.1,375.1,258.1z"
                style="fill: #666666"
              />
            </g>
            <path
              class="st1"
              d="M483.2,71.7h-42.4V29.3c0-11.8-9.5-21.3-21.3-21.3h-1c-11.8,0-21.3,9.5-21.3,21.3v42.4h-42.4
	c-11.8,0-21.3,9.5-21.3,21.3v1c0,11.8,9.5,21.3,21.3,21.3h42.4v42.4c0,11.8,9.5,21.3,21.3,21.3h1c11.8,0,21.3-9.5,21.3-21.3v-42.4
	h42.4c11.8,0,21.3-9.5,21.3-21.3v-1C504.5,81.2,495,71.7,483.2,71.7z"
              style="fill: #dadada"
            />
          </svg>
        </button>

        <div class="add-room-content">
          <input v-model="addRoomName" class="input" type="text" />

          <button class="add-room-btn" @click="addMessageRoom()">追加</button>
        </div>
      </li>
      <li class="logout-item">
        <button class="logout-icon" @click="logout()">
          <img src="~assets/img/logout.svg" />
        </button>
      </li>
      <button class="close-add-room-btn" @click="closeInput">×</button>
    </ul>
    <ul class="room-list" :class="{ 'transform-x': isOpenIconMenu }">
      <NavigationListItem
        v-for="room in roomData"
        :key="room.key"
        class="navigation-list-item"
        :room-name="room.roomName"
        :last-message="room.lastMessage"
        :last-send-get-time="room.lastSendGetTime"
        :last-send-time="room.lastSendTime"
      />
    </ul>
  </nav>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  useContext,
} from '@nuxtjs/composition-api'
import firebase from '~/plugins/firebase'
import NavigationListItem from '~/components/nav/NavigationListItem.vue'

export default defineComponent({
  components: { NavigationListItem },
  setup(_props, { root }) {
    const { store } = useContext()
    const router = root.$router

    const { state, getDataRoomList, addMessageRoom } = useNavication()

    getDataRoomList()

    const closeInput = () => {
      state.isOpenIconMenu = false
      state.addRoomName = ''
    }

    const logout = () => {
      store.dispatch('setIsLogout')
      store.dispatch('setUserUid', '')
      store.dispatch('setUserName', '')
      store.dispatch('setUserImage', '')
      router.push('/login')
    }

    return {
      ...toRefs(state),
      getDataRoomList,
      addMessageRoom,
      closeInput,
      logout,
    }
  },
})

const useNavication = () => {
  const state = reactive<any>({
    roomData: [],
    isOpenIconMenu: false,
    addRoomName: '',
  })

  const getDataRoomList = () => {
    firebase
      .database()
      .ref('message')
      .on('value', (snap) => {
        state.roomData = []
        getDataRoomLastMessage(Object.keys(snap.val()))
      })
  }

  const getDataRoomLastMessage = (list: any) => {
    for (const item of list) {
      firebase
        .database()
        .ref('message/' + item)
        .limitToLast(1)
        .once('value')
        .then(function (snap) {
          snap.forEach((children) => {
            state.roomData.unshift({
              roomName: item,
              key: children.key,
              lastMessage: children.val().message,
              lastSendGetTime: children.val().send_get_time,
              lastSendTime: children.val().send_time,
            })
          })
        })
    }
  }

  const addMessageRoom = () => {
    const nowDate = new Date()
    const nowYear = nowDate.getFullYear()
    const nowDay = `${('00' + String(nowDate.getMonth() + 1)).slice(-2)}:${(
      '00' + String(nowDate.getDay())
    ).slice(-2)}`
    const nowTime = `${('00' + String(nowDate.getHours())).slice(-2)}:${(
      '00' + String(nowDate.getMinutes())
    ).slice(-2)}`

    firebase
      .database()
      .ref(`message/${state.addRoomName}`)
      .push({
        createDate: nowYear + '/' + nowDay + '/' + nowTime,
      })

    state.addRoomName = ''
  }

  return {
    state,
    getDataRoomList,
    addMessageRoom,
  }
}
</script>

<style lang="scss" scoped>
.nav-container {
  width: 312px;
  height: 100vh;
  display: flex;
  position: relative;
}

.icon-menu-list {
  width: 250px;
  position: relative;
  height: 100%;
  border-right: 1px solid #414141;
  display: flex;
  flex-direction: column;

  .icon {
    width: 32px;
    margin: 0 15px;

    > svg {
      width: 100%;
    }
  }

  .close-add-room-btn {
    position: absolute;
    top: 0px;
    right: 5px;
    font-size: 25px;
    color: #f0f0f0;
  }

  .profile-item {
    height: 80px;
    display: flex;
    align-items: center;

    .profile-image {
      width: 40px;
      height: 40px;
      border-radius: 30px;
      overflow: hidden;
      margin: 0 30px 0 10px;

      > img {
        width: 100%;
      }
    }

    .profile-name {
    }
  }

  .add-room-item {
    height: 80px;
    display: flex;
    align-items: center;

    .add-room-content {
      height: 100%;
      display: flex;
      align-items: center;

      .input {
        background-color: #f0f0f0;
        border-radius: 10px;
        font-size: 15px;
        width: 100px;
        padding: 5px 10px;
        margin-left: 10px;
      }

      .add-room-btn {
        margin-left: 15px;
        color: #f0f0f0;
      }
    }
  }
  .logout-item {
    height: 80px;
    display: flex;
    align-items: center;
    margin-top: auto;

    .logout-icon {
      width: 32px;
      margin: 0 15px;

      > img {
        width: 100%;
        position: relative;
        left: 2px;
      }
    }
  }
}

.room-list {
  width: 250px;
  position: absolute;
  top: 0;
  left: 62px;
  border-left: 1px solid #414141;
  border-right: 1px solid #414141;
  height: 100%;
  background-color: #27292a;
  transition: all 0.7s;
  z-index: 1;

  .navigation-list-item {
    border-bottom: 1px solid #414141;
  }
}

.transform-x {
  transform: translateX(188px);
}
</style>
