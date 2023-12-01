<script>
import _ from 'lodash'
import { storeToRefs } from 'pinia'
import { onMounted, ref, reactive } from 'vue'
import { useAuthStore, useUsersStore, useConversationStore } from '../stores'
import ActiveFriend from '../components/chat/ActiveFriend.vue'
import Friends from '../components/chat/Friends.vue'
import ChatBox from '../components/chat/ChatBox.vue'
import { UserAvatar } from '../components'

import {
  ElDrawer,
  ElButton,
  ElForm,
  ElFormItem,
  ElRow,
  ElCol,
  ElInput,
  ElMessageBox,
  ElLoading,
  ElDialog,
  ElSelect,
  ElOption
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
    ElLoading,
    ElDialog,
    ElSelect,
    ElOption,
    UserAvatar
  },
  setup() {
    const { user } = storeToRefs(useAuthStore())
    const { searchUsers } = storeToRefs(useUsersStore())
    const { conversations, selectedConversation } = storeToRefs(useConversationStore())
    const dialogSearchUsers = ref(false)
    const loadingSearchUsers = ref(false)
    const dialogCreateGroup = ref(false)
    let timer

    const formSearchUsers = reactive({
      name: ''
    })

    const formLabelWidth = '80px'

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
      clearTimeout(timer)
    }

    const handleClose = (done) => {
      if (loadingSearchUsers.value) {
        return
      }
      ElMessageBox.confirm('Do you want to submit?')
        .then(() => {
          loadingSearchUsers.value = true
          timer = setTimeout(() => {
            done()
            setTimeout(() => {
              loadingSearchUsers.value = false
            }, 400)
          }, 2000)
        })
        .catch(() => {
          // catch error
        })
    }

    const chooseConversation = async (conversation) => {
      await useConversationStore().selectConversation(conversation)
    }

    onMounted(async () => {
      await useConversationStore()
        .getAllConversation()
        .then(() => {
          chooseConversation(conversations.value[0])
        })
    })

    return {
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
      formCreateGroup
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
      const data = {
        senderName: this.user.user._id,
        // receiverId: this.selectedFriend._id,
        message: this.receivedMessage ? this.receivedMessage : '❤'
      }
      useUsersStore().sendMessage(data)
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
          <div class="active-friends">
            <ActiveFriend />
          </div>
          <div v-if="conversations && conversations.length > 0" class="friends">
            <div
              v-for="friend in conversations"
              :key="friend._id"
              :class="{
                'hover-friend': true,
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
        <ChatBox :currentFriend="selectedConversation" @messageFromMiddle="handleMessage" />
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

        <el-row :loading="loadingSearchUsers" element-loading-text="Loading...">
          <el-col :span="24" v-if="searchUsers && searchUsers.length > 0">
            <el-row v-for="search in searchUsers" :key="search._id">
              <el-col :span="24">
                <UserAvatar :handleFunction="() => accessChat(search._id)" :user="search" />
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </el-drawer>

 
</template>
