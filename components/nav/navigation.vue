<template>
  <nav class="nav-container">
    <ul class="icon-menu-list">
      <li class="profile-item">
        <button class="icon" @click="isOpenIconMenu = true">
          <img src="~assets/img/profile-icon.svg" />
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
          <img src="~assets/img/add-room-icon.svg" />
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

    > img {
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
