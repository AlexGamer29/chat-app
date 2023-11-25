<script>
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useAuthStore, useUsersStore } from '../stores'
import ActiveFriend from '../components/chat/ActiveFriend.vue'
import Friends from '../components/chat/Friends.vue'
import ChatBox from '../components/chat/ChatBox.vue'

export default {
  components: {
    ActiveFriend,
    Friends,
    ChatBox
  },
  setup() {
    const { user } = storeToRefs(useAuthStore())
    const { users, selectedFriend } = storeToRefs(useUsersStore())

    const chooseFriend = async (friend) => {
      await useUsersStore().selectFriend(friend)
    }

    onMounted(async () => {
      await useUsersStore()
        .getAll()
        .then(() => {
          chooseFriend(users.value[1])
        })
    })

    return {
      user,
      users,
      selectedFriend,
      chooseFriend
    }
  },
  data() {
    return {
      receivedMessage: ''
    }
  },
  methods: {
    handleMessage(message) {
      this.receivedMessage = message
      console.log(this.receivedMessage)
    }
  }
}
</script>

<template>
  <div v-if="user" class="messenger">
    <div class="row">
      <div class="col-3">
        <div class="left-side">
          <div class="top">
            <div class="image-name">
              <div class="image">
                <img
                  src="https://png.pngtree.com/png-clipart/20230207/original/pngtree-beauty-logo-design-png-image_8947095.png"
                  alt=""
                />
              </div>
              <div class="name">
                <h3>{{ user.user.first_name.concat(' ', user.user.last_name) }}</h3>
              </div>
            </div>

            <div class="icons">
              <div class="icon">
                <el-icon>
                  <more-filled></more-filled>
                </el-icon>
              </div>
              <div class="icon">
                <el-icon>
                  <edit></edit>
                </el-icon>
              </div>
            </div>
          </div>
          <div class="friend-search">
            <div class="search">
              <button>
                <el-icon>
                  <search></search>
                </el-icon>
              </button>
              <input type="text" placeholder="Search" class="form-control" />
            </div>
          </div>
          <div class="active-friends">
            <ActiveFriend />
          </div>
          <div v-if="users && users.length > 0" class="friends">
            <div
              v-for="friend in users"
              :key="friend._id"
              class="hover-friend"
              @click="chooseFriend(friend)"
            >
              <Friends :friend="friend" />
            </div>
          </div>
          <div v-else>
            <p>No friends</p>
          </div>
        </div>
      </div>
      <div v-if="selectedFriend" class="col-9">
        <ChatBox :currentFriend="selectedFriend" @messageFromMiddle="handleMessage" />
      </div>
      <div v-else>
        <p>Select friend</p>
      </div>
    </div>
  </div>
</template>
