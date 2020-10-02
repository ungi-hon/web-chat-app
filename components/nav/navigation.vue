<template>
  <nav class="nav-container">
    <ul class="room-list">
      <li class="profile">
        <p class="profile-image">
          <img :src="$store.getters.getUserImage" alt="" />
        </p>
        <p class="profile-name">{{ $store.getters.getUserName }}</p>
      </li>
      <li class="add-room-list">
        <button
          v-if="!isOpenInput"
          class="oepn-add-room-btn"
          @click="isOpenInput = true"
        >
          <svg
            class="add-room-icon"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="512px"
            height="512px"
            viewBox="0 0 512 512"
            style="width: 40px; height: 40px; opacity: 1"
          >
            <g>
              <path
                class="st0"
                d="M147.57,320.188c-0.078-0.797-0.328-1.531-0.328-2.328v-6.828c0-3.25,0.531-6.453,1.594-9.5
		c0,0,17.016-22.781,25.063-49.547c-8.813-18.594-16.813-41.734-16.813-64.672c0-5.328,0.391-10.484,0.938-15.563
		c-11.484-12.031-27-18.844-44.141-18.844c-35.391,0-64.109,28.875-64.109,73.75c0,35.906,29.219,74.875,29.219,74.875
		c1.031,3.047,1.563,6.25,1.563,9.5v6.828c0,8.516-4.969,16.266-12.719,19.813l-46.391,18.953
		C10.664,361.594,2.992,371.5,0.852,383.156l-0.797,10.203c-0.406,5.313,1.406,10.547,5.031,14.438
		c3.609,3.922,8.688,6.125,14.016,6.125H94.93l3.109-39.953l0.203-1.078c3.797-20.953,17.641-38.766,36.984-47.672L147.57,320.188z"
                style="fill: rgb(218, 218, 218)"
              ></path>
              <path
                class="st0"
                d="M511.148,383.156c-2.125-11.656-9.797-21.563-20.578-26.531l-46.422-18.953
		c-7.75-3.547-12.688-11.297-12.688-19.813v-6.828c0-3.25,0.516-6.453,1.578-9.5c0,0,29.203-38.969,29.203-74.875
		c0-44.875-28.703-73.75-64.156-73.75c-17.109,0-32.625,6.813-44.141,18.875c0.563,5.063,0.953,10.203,0.953,15.531
		c0,22.922-7.984,46.063-16.781,64.656c8.031,26.766,25.078,49.563,25.078,49.563c1.031,3.047,1.578,6.25,1.578,9.5v6.828
		c0,0.797-0.266,1.531-0.344,2.328l11.5,4.688c20.156,9.219,34,27.031,37.844,47.984l0.188,1.094l3.094,39.969h75.859
		c5.328,0,10.406-2.203,14-6.125c3.625-3.891,5.438-9.125,5.031-14.438L511.148,383.156z"
                style="fill: rgb(218, 218, 218)"
              ></path>
              <path
                class="st0"
                d="M367.867,344.609l-56.156-22.953c-9.375-4.313-15.359-13.688-15.359-23.969v-8.281
		c0-3.906,0.625-7.797,1.922-11.5c0,0,35.313-47.125,35.313-90.594c0-54.313-34.734-89.234-77.594-89.234
		c-42.844,0-77.594,34.922-77.594,89.234c0,43.469,35.344,90.594,35.344,90.594c1.266,3.703,1.922,7.594,1.922,11.5v8.281
		c0,10.281-6.031,19.656-15.391,23.969l-56.156,22.953c-13.047,5.984-22.344,17.984-24.906,32.109l-2.891,37.203h139.672h139.672
		l-2.859-37.203C390.211,362.594,380.914,350.594,367.867,344.609z"
                style="fill: rgb(218, 218, 218)"
              ></path>
            </g>
          </svg>

          <span>部屋を作成する</span>
        </button>

        <button
          v-if="isOpenInput"
          class="close-add-room-btn"
          @click="closeInput"
        >
          ×
        </button>
        <div class="add-room-content">
          <input
            v-if="isOpenInput"
            v-model="addRoomName"
            class="input"
            type="text"
          />

          <button
            v-if="isOpenInput"
            class="add-room-btn"
            @click="addMessageRoom()"
          >
            追加
          </button>
        </div>
      </li>
      <li class="room-list-title">
        <p>メッセージ</p>
      </li>
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
import { defineComponent, reactive, toRefs } from 'nuxt-composition-api'
import firebase from '~/plugins/firebase'
import NavigationListItem from '~/components/nav/NavigationListItem.vue'

export default defineComponent({
  components: { NavigationListItem },
  setup() {
    const { state, getDataRoomList, addMessageRoom } = useNavication()

    getDataRoomList()

    const closeInput = () => {
      state.isOpenInput = false
      state.addRoomName = ''
    }

    return {
      ...toRefs(state),
      getDataRoomList,
      addMessageRoom,
      closeInput,
    }
  },
})

const useNavication = () => {
  const state = reactive<any>({
    roomData: [],
    isOpenInput: false,
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
  background-color: #27292a;
  width: 250px;
  height: 100vh;
  border-right: 1px solid #414141;
}

.profile {
  height: 70px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #414141;

  .profile-image {
    width: 40px;
    height: 40px;
    border-radius: 30px;
    overflow: hidden;
    margin: 0 30px 0 20px;

    > img {
      width: 100%;
    }
  }

  .profile-name {
  }
}

.add-room-list {
  position: relative;
  border-bottom: 1px solid #414141;
  height: 70px;

  .add-room-icon {
    margin: 0 30px 0 20px;
    fill: #dadada;
  }

  .oepn-add-room-btn {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .close-add-room-btn {
    position: absolute;
    top: -5px;
    right: 3px;
    font-size: 25px;
  }

  .add-room-content {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;

    .input {
      background-color: #f0f0f0;
      border-radius: 10px;
      font-size: 15px;
      width: 150px;
      padding: 5px 10px;
      margin-left: 20px;
    }

    .add-room-btn {
      margin-left: 15px;
    }
  }
}

.room-list-title {
  border-bottom: 1px solid #414141;
  padding: 5px 20px;
  background-color: #1d1d1d;
  > p {
    font-size: 13px;
  }
}

.navigation-list-item {
  border-bottom: 1px solid #414141;
}
</style>
