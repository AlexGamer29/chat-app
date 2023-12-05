<template>
  <div class="message-show">
    <div v-for="message in messages" :key="message._id">
      <div class="my-message" v-if="message.from === user.user._id">
        <div class="image-message">
          <div class="my-text">
            <p class="message-text">{{ message.message }}</p>
          </div>
        </div>
        <div class="time">
          {{
            new Date(message.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }}
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
              {{
                new Date(message.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../stores'

export default {
  props: {
    messages: Object
  },
  data() {
    return {
      showMessages: {},
      user: {}
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
      console.log(`USR`, this.user.user._id)
    }
  },
  created() {
    this.setUser()
    this.setShowMessages()
  }
}
</script>
