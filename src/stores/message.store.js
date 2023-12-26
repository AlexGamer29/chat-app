import { defineStore } from 'pinia'
import { fetchWrapper } from '@/helpers'
import { useAuthStore, useSocketStore, useConversationStore } from '../stores'

const baseUrl = `${import.meta.env.VITE_API_URL}/api/message`

export const useMessageStore = defineStore({
  id: 'message',
  state: () => ({
    messages: [],
    scheduleMessage: {},
    listScheduleMessage: []
  }),
  actions: {
    async saveScheduleMessage(req) {
      this.scheduleMessage = { loading: true }
      try {
        let data = await fetchWrapper.post(`${import.meta.env.VITE_API_URL}/api/schedule-message`, req)
        this.scheduleMessage = data.data
      } catch (error) {
        this.scheduleMessage = { error }
      }
    },
    async getMessageByConversationId(conversation_id) {
      this.messages = { loading: true }
      try {
        let data = await fetchWrapper.post(`${baseUrl}/get`, { conversation_id })
        this.messages = data.data
      } catch (error) {
        this.messages = { error }
      }
    },
    pushMessageToStore(message) {
      this.messages.push(message)
    },
    async sendMessage(data) {
      try {
        let response = await fetchWrapper.post(`${baseUrl}/`, data)
        this.messages.push(response.data)
        return response.data
      } catch (error) {
        this.messages = { error }
      }
    },
    pushSeenMessage(user, messageEmit) {
      const { _id, conversation_id } = messageEmit

      const targetMessage = this.messages.find(
        (message) => message._id === _id && message.conversation_id === conversation_id
      )

      if (targetMessage) {
        const userNotSeen = targetMessage.seen_users.every((seen) => seen._id !== user._id)

        if (userNotSeen) {
          targetMessage.seen_users.push(user)
        }
      }
    },
    seenMessages() {
      const { user } = useAuthStore()
      const { socket } = useSocketStore()
      const { selectedConversation } = useConversationStore()
      this.messages.forEach(async (message) => {
        // Message from this user
        if (message.from === user.user._id) {
          return
        }
        // Message from other user
        const userNotSeen = message.seen_users.every((seen) => seen._id !== user.user._id)

        if (userNotSeen) {
          // Add user to seen_users array
          message.seen_users.push(user.user)
          let seen = await fetchWrapper.patch(`${baseUrl}/seen`, { message_id: message._id })
          socket.emit('message seen', user.user, message, selectedConversation)
        }
      })
    }
  }
})
