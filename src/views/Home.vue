<script>
import _ from 'lodash'
import { storeToRefs } from 'pinia'
import { onMounted, ref, reactive } from 'vue'
import {
  useAuthStore,
  useUsersStore,
  useConversationStore,
  useMessageStore,
  useSocketStore,
  useSettingStore
} from '../stores'
import ActiveFriend from '../components/chat/ActiveFriend.vue'
import Friends from '../components/chat/Friends.vue'
import ChatBox from '../components/chat/ChatBox.vue'
import { UserAvatar, UserBadge } from '../components'

import {
  ElDrawer,
  ElButton,
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  ElInput,
  ElSkeleton
} from 'element-plus'

export default {
  components: {
    ActiveFriend,
    Friends,
    ChatBox,
    ElDrawer,
    ElButton,
    ElForm,
    ElFormItem,
    ElRow,
    ElCol,
    ElInput,
    ElSkeleton,
    UserAvatar,
    UserBadge
  },
  data() {
    return {
      receivedMessage: ''
    }
  },
  setup() {
    const { nightMode } = storeToRefs(useSettingStore())
    const { socket, socketConnected } = storeToRefs(useSocketStore())
    const typing = ref(false)
    const isTyping = ref(false)
    const { user } = storeToRefs(useAuthStore())
    const { searchUsers } = storeToRefs(useUsersStore())
    const { conversations, selectedConversation } = storeToRefs(useConversationStore())
    const dialogSearchUsers = ref(false)
    const loadingSearchUsers = ref(false)
    let timer

    const formSearchUsers = reactive({
      name: ''
    })
    const formLabelWidth = '80px'

    const dialogCreateGroup = ref(false)
    const loadingCreateGroup = ref(false)
    const formCreateGroup = reactive({
      groupName: '',
      searchString: '',
      selectedUsers: []
    })

    const onClick = async () => {
      loadingSearchUsers.value = true
      await useUsersStore()
        .searchUser(formSearchUsers.name)
        .then(() => {
          loadingSearchUsers.value = false
        })
    }

    const cancelForm = () => {
      loadingSearchUsers.value = false
      dialogSearchUsers.value = false
      useUsersStore().clearSearchUsers()
      clearTimeout(timer)
    }

    const handleClose = (done) => {
      if (loadingSearchUsers.value) {
        return
      }
      done()
      useUsersStore().clearSearchUsers()
    }

    const chooseConversation = async (conversation) => {
      await useConversationStore().selectConversation(conversation)
      await useSocketStore().joinChat(selectedConversation.value._id)
    }

    onMounted(async () => {
      await useSocketStore().initializeSocket(user.value.user)
      await useConversationStore()
        .getAllConversation()
        .then(() => {
          chooseConversation(conversations.value[0])
        })
      socket.value.on('typing', () => (isTyping.value = true))
      socket.value.on('stop typing', () => (isTyping.value = false))
      socket.value.on('seen', async (user, message) => {
        if (selectedConversation.value._id !== message.conversation_id) {
          console.log(
            `User ${message.seen_users[0].first_name.concat(
              ' ',
              message.seen_users[0].last_name
            )} seen a message`
          )
        } else {
          await useMessageStore().pushSeenMessage(user, message)
        }
      })
    })

    // watch(selectedConversation, (newSelectedConversation, oldSelectedConversation) => {
    //   // Perform logic when selectedConversation changes
    //   console.log('Selected Conversation changed:', newSelectedConversation)

    //   // Example: Join the new conversation
    //   if (newSelectedConversation) {
    //     useSocketStore().joinChat(newSelectedConversation._id)
    //   }
    // })

    return {
      nightMode,
      toggleNightMode: useSettingStore().toggleNightMode,
      user,
      conversations,
      selectedConversation,
      chooseConversation,
      searchUsers,
      dialogSearchUsers,
      formSearchUsers,
      loadingSearchUsers,
      cancelForm,
      onClick,
      handleClose,
      formLabelWidth,
      dialogCreateGroup,
      loadingCreateGroup,
      formCreateGroup,
      socket,
      socketConnected,
      typing,
      isTyping
    }
  },
  methods: {
    async handleFocusInFromMiddle() {
      useMessageStore().seenMessages()
    },
    async handleTypingFromMiddle() {
      if (!this.socketConnected) return

      if (!this.typing) {
        this.typing = true
        this.socket.emit('typing', this.selectedConversation._id)
      }
      let lastTypingTime = new Date().getTime()
      var timerLength = 3000
      setTimeout(() => {
        var timeNow = new Date().getTime()
        var timeDiff = timeNow - lastTypingTime
        if (timeDiff > timerLength && this.typing) {
          this.socket.emit('stop typing', this.selectedConversation._id)
          this.typing = false
        }
      }, timerLength)
    },
    async handleMessage(message) {
      this.receivedMessage = message
      console.log(this.receivedMessage)
      this.socket.emit('stop typing', this.selectedConversation._id)
      const data = {
        conversation_id: this.selectedConversation._id,
        content: 'text',
        message: this.receivedMessage ? this.receivedMessage : '❤'
      }
      let response = await useMessageStore().sendMessage(data)
      this.socket.emit('new message', response, this.selectedConversation)
    },
    logout() {
      useAuthStore().logout()
    },
    async accessChat(user_id) {
      const conversation = await useConversationStore().accessConversation(user_id)
      await useConversationStore()
        .getAllConversation()
        .then(() => {
          this.chooseConversation(conversation[0])
        })
      this.cancelForm()
    },
    handleGroup(userToAdd) {
      if (this.formCreateGroup.selectedUsers.includes(userToAdd)) {
        this.$message({
          message: 'User already added',
          type: 'warning'
        })
        return
      }
      this.formCreateGroup.selectedUsers.push(userToAdd)
    },
    handleDelete(delUser) {
      _.remove(this.formCreateGroup.selectedUsers, { _id: delUser })
    },
    handleCancel() {
      this.dialogCreateGroup = false
    },
    async handleSearch() {
      this.loadingCreateGroup = true
      await useUsersStore()
        .searchUser(this.formCreateGroup.searchString)
        .then(() => {
          this.loadingCreateGroup = false
        })
    },
    async handleSubmit() {
      this.loadingCreateGroup = true
      const data = {
        group_name: this.formCreateGroup.groupName,
        members: this.formCreateGroup.selectedUsers
      }
      if (data.group_name !== '' && data.members.length > 0) {
        console.log(data)
        const response = await useConversationStore().createConversation(
          data.group_name,
          data.members
        )
        console.log(`CREATE GROUP`, response)
        await useConversationStore()
          .getAllConversation()
          .then(() => {
            this.chooseConversation(response[0])
          })
      } else {
        this.$message({
          message:
            'To create group, you need to have a group name and at least one member selected.',
          duration: 5000,
          type: 'warning'
        })
      }
      this.loadingCreateGroup = false
    }
  }
}
</script>

<template>
  <div v-if="user" class="messenger">
    <div class="row">
      <div class="col-3">
        <div
          :class="{
            'left-side': true,
            'night-mode': nightMode
          }"
        >
          <div class="top">
            <div class="image-name">
              <div class="image">
                <img
                  src="https://png.pngtree.com/png-clipart/20230207/original/pngtree-beauty-logo-design-png-image_8947095.png"
                  alt=""
                />
              </div>
              <div
                :class="{
                  name: true,
                  'night-mode': nightMode
                }"
              >
                <h3>{{ user.user.first_name.concat(' ', user.user.last_name) }}</h3>
              </div>
            </div>

            <div class="icons">
              <div class="non-icon" @click="null">
                <el-switch
                  v-model="nightMode"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  @change="useSettingStore().toggleNightMode()"
                >
                </el-switch>
              </div>
              <div class="icon" @click="logout()">
                <el-icon>
                  <more-filled></more-filled>
                </el-icon>
              </div>
              <div class="icon" @click="dialogSearchUsers = true">
                <el-icon>
                  <edit></edit>
                </el-icon>
              </div>
              <div class="icon" @click="dialogCreateGroup = true">
                <el-icon>
                  <chat-square></chat-square>
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
          <div
            :class="{
              'active-friends': true,
              'night-mode': nightMode
            }"
          >
            <ActiveFriend />
          </div>
          <div v-if="conversations && conversations.length > 0" class="friends">
            <div
              v-for="friend in conversations"
              :key="friend._id"
              :class="{
                'hover-friend': true,
                'night-mode': nightMode,
                active: selectedConversation && selectedConversation._id === friend._id
              }"
              @click="chooseConversation(friend)"
            >
              <Friends :friend="friend" />
            </div>
          </div>
          <div v-else>
            <p>No friends</p>
          </div>
        </div>
      </div>
      <div v-if="selectedConversation" class="col-9">
        <ChatBox
          :currentFriend="selectedConversation"
          :userTyping="isTyping"
          @messageFromMiddle="handleMessage"
          @typingFromMiddle="handleTypingFromMiddle"
          @focusInFromMiddle="handleFocusInFromMiddle"
        />
      </div>
      <div v-else>
        <p>Select friend</p>
      </div>
    </div>
  </div>

  <el-drawer
    v-model="dialogSearchUsers"
    title="Search users"
    :before-close="handleClose"
    direction="ltr"
    class="search-user__drawer"
  >
    <div class="search-user__content">
      <el-form :model="formSearchUsers" :size="'large'">
        <el-row :justify="'space-evenly'">
          <el-form-item label="Name" :label-width="formLabelWidth">
            <el-input v-model="formSearchUsers.name" autocomplete="off" />
          </el-form-item>
          <el-form-item>
            <el-button @click="cancelForm">Cancel</el-button>
            <el-button type="primary" :loading="loadingSearchUsers" @click="onClick">{{
              loadingSearchUsers ? 'Searching ...' : 'Submit'
            }}</el-button>
          </el-form-item>
        </el-row>

        <el-row v-if="loadingSearchUsers">
          <el-col :span="24">
            <el-skeleton :loading="loadingSearchUsers" avatar />
          </el-col>
        </el-row>

        <el-row v-else-if="searchUsers && searchUsers.length > 0">
          <el-col :span="24">
            <el-row v-for="search in searchUsers" :key="search._id">
              <el-col :span="24">
                <UserAvatar :handleFunction="() => accessChat(search._id)" :user="search" />
              </el-col>
            </el-row>
          </el-col>
        </el-row>

        <el-row v-else-if="searchUsers.length === 0">
          <el-col :span="24">
            <p>No users found.</p>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-drawer>

  <el-dialog v-model="dialogCreateGroup" title="Create group" width="30%" center>
    <el-form :model="formCreateGroup" :size="'large'">
      <el-form-item label="Group name">
        <el-input
          v-model="formCreateGroup.groupName"
          autocomplete="off"
          placeholder="Add group name"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="formCreateGroup.searchString"
          autocomplete="off"
          placeholder="Add users"
          @keyup.enter="handleSearch"
        />
      </el-form-item>

      <el-row v-if="formCreateGroup.selectedUsers && formCreateGroup.selectedUsers.length > 0">
        <el-row v-for="user in formCreateGroup.selectedUsers" :key="user._id">
          <UserBadge :user="user" :handleFunction="() => handleDelete(user._id)" />
        </el-row>
      </el-row>

      <el-row v-if="loadingCreateGroup">
        <el-col :span="24">
          <el-skeleton :loading="loadingCreateGroup" avatar />
        </el-col>
      </el-row>

      <el-row v-else-if="searchUsers && searchUsers.length > 0">
        <el-col :span="24">
          <el-row v-for="search in searchUsers" :key="search._id">
            <el-col :span="24">
              <UserAvatar :handleFunction="() => handleGroup(search)" :user="search" />
            </el-col>
          </el-row>
        </el-col>
      </el-row>

      <el-row v-else-if="searchUsers.length === 0">
        <el-col :span="24">
          <p>No users found.</p>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" :loading="loadingCreateGroup" @click="handleSubmit">{{
          loadingCreateGroup ? 'Creating...' : 'Create'
        }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>
