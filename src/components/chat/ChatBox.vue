<script>
import { storeToRefs } from 'pinia'
import Message from './Message.vue'
import MessageSend from './MessageSend.vue'
import FriendInfo from './FriendInfo.vue'
import { useConversationStore, useMessageStore, useSocketStore, useSettingStore } from '@/stores'

export default {
  components: {
    Message,
    MessageSend,
    FriendInfo
  },
  props: {
    currentFriend: Object,
    userTyping: Boolean
  },
  data() {
    return {
      middleLayerMessage: '',
      messages: [],
      loadReceiver: {},
      isTyping: false,
      isFocusIn: false
    }
  },
  setup() {
    const { socket } = storeToRefs(useSocketStore())
    const { nightMode } = storeToRefs(useSettingStore())

    return {
      socket,
      nightMode
    }
  },
  methods: {
    handleMessageFromChild(message) {
      this.middleLayerMessage = message
      // Forward the message up to the parent
      this.$emit('messageFromMiddle', message)
    },
    handleTypingFromChild() {
      this.isTyping = true
      // Forward the typing event up to the parent
      this.$emit('typingFromMiddle')
    },
    handleFocusInFromChild() {
      this.isFocusIn = true
      this.$emit('focusInFromMiddle')
    },
    async loadMessageByConversationId() {
      const { messages } = storeToRefs(useMessageStore())
      await useMessageStore().getMessageByConversationId(this.currentFriend._id)
      this.messages = messages
    },
    getReceiver() {
      useConversationStore().getReceiver()
      const { receiver } = storeToRefs(useConversationStore())
      this.loadReceiver = receiver
    }
  },
  async created() {
    await this.loadMessageByConversationId()
    this.socket.on('message received', async (message) => {
      if (this.currentFriend._id !== message.conversation_id) {
        // Notification
        // console.log(`NOTIFICATION`)
        this.$message({
          message: `User ${message.seen_users[0].first_name.concat(
            ' ',
            message.seen_users[0].last_name
          )} sent you a message`,
          type: 'warning'
        })
      } else {
        console.log(`RECEIVE`, message)
        await useMessageStore().pushMessageToStore(message)
      }
    })
  },
  watch: {
    currentFriend: async function () {
      await this.getReceiver()
      await this.loadMessageByConversationId()
    }
  }
}
</script>

<template>
  <div class="right-side">
    <input type="checkbox" id="dot" />
    <div class="row">
      <div class="col-8">
        <div
          :class="{
            'message-send-show': true,
            'night-mode': nightMode
          }"
        >
          <div :class="{ header: true, 'night-mode': nightMode }">
            <div class="image-name">
              <div class="image">
                <img :src="loadReceiver.profile_photo" alt="" />
              </div>

              <div
                :class="{
                  name: true,
                  'night-mode': nightMode
                }"
              >
                <h3 v-if="currentFriend.is_group">
                  {{ currentFriend.conversation_name }}
                </h3>
                <h3 v-else>{{ loadReceiver.first_name }} {{ loadReceiver.last_name }}</h3>
              </div>
            </div>

            <div class="icons">
              <div class="icon">
                <el-icon><Phone /></el-icon>
              </div>
              <div class="icon">
                <el-icon><VideoCamera /></el-icon>
              </div>
              <div class="icon">
                <label for="dot">
                  <el-icon><ChatDotRound /></el-icon>
                </label>
              </div>
            </div>
          </div>

          <Message :messages="messages" :userTyping="userTyping" />
          <MessageSend
            @messageFromChild="handleMessageFromChild"
            @typingFromChild="handleTypingFromChild"
            @focusInFromChild="handleFocusInFromChild"
          />
        </div>
      </div>

      <div class="col-4">
        <FriendInfo :currentFriend="currentFriend" />
      </div>
    </div>
  </div>
</template>
