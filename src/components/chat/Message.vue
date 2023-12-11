<template>
  <div
    :class="{
      'message-show': true,
      'night-mode': nightMode
    }"
    v-if="messages && messages.length > 0"
  >
    <div v-for="message in messages" :key="message._id">
      <div class="my-message" v-if="message.from === user.user._id">
        <div class="image-message">
          <div class="my-text">
            <p class="message-text">{{ message.message }}</p>
          </div>
        </div>
        <div class="time">
          {{ formatTime(message.createdAt) }}
        </div>
        <div class="time">
          <div v-for="seen in message.seen_users" :key="seen._id">
            <div>{{ seen.first_name }}</div>
          </div>
        </div>
      </div>

      <div className="fd-message" v-else>
        <div className="image-message-time">
          <img
            src="https://png.pngtree.com/png-clipart/20230207/original/pngtree-beauty-logo-design-png-image_8947095.png"
            alt=""
          />
          <div className="message-time">
            <div className="fd-text">
              <p className="message-text">{{ message.message }}</p>
            </div>
            <div className="time">
              {{ formatTime(message.createdAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="userTyping">Typing...</div>
  </div>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useAuthStore, useSettingStore } from '../../stores'

export default {
  props: {
    messages: Object,
    userTyping: Boolean
  },
  data() {
    return {
      showMessages: {},
      user: {}
    }
  },
  setup() {
    const { nightMode } = storeToRefs(useSettingStore())

    return {
      nightMode
    }
  },
  watch: {
    messages: 'setShowMessages',
    user: 'setUser'
  },
  methods: {
    setShowMessages() {
      this.showMessages = this.messages
      console.log(`MSG`, this.showMessages)
    },
    setUser() {
      const { user } = storeToRefs(useAuthStore())
      this.user = user
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  },
  created() {
    this.setUser()
    this.setShowMessages()
  }
}
</script>
