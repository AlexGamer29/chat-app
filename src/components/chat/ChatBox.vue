<script>
import Message from './Message.vue'
import MessageSend from './MessageSend.vue'
import FriendInfo from './FriendInfo.vue'
import { storeToRefs } from 'pinia'
import { useMessageStore } from '../../stores'

export default {
  components: {
    Message,
    MessageSend,
    FriendInfo
  },
  props: {
    currentFriend: Object
  },
  data() {
    return {
      middleLayerMessage: '',
      messages: []
    }
  },
  methods: {
    handleMessageFromChild(message) {
      this.middleLayerMessage = message
      // Forward the message up to the parent
      this.$emit('messageFromMiddle', message)
    },
    async loadMessageByConversationId() {
      const { messages } = storeToRefs(useMessageStore())
      await useMessageStore().getMessageByConversationId(this.currentFriend._id)
      this.messages = messages
    }
  },
  async created() {
    this.loadMessageByConversationId()
  },
  watch: {
    currentFriend: 'loadMessageByConversationId'
  }
}
</script>

<template>
  <div class="right-side">
    <input type="checkbox" id="dot" />
    <div class="row">
      <div class="col-8">
        <div class="message-send-show">
          <div class="header">
            <div class="image-name">
              <div class="image">
                <img
                  src="https://png.pngtree.com/png-clipart/20230207/original/pngtree-beauty-logo-design-png-image_8947095.png"
                  alt=""
                />
              </div>

              <div class="name">
                <h3>
                  {{
                    currentFriend.members[1].user[0].first_name.concat(
                      ' ',
                      currentFriend.members[1].user[0].last_name
                    )
                  }}
                </h3>
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

          <Message :messages="messages" />
          <MessageSend @messageFromChild="handleMessageFromChild" />
        </div>
      </div>

      <div class="col-4">
        <FriendInfo :currentFriend="currentFriend" />
      </div>
    </div>
  </div>
</template>
