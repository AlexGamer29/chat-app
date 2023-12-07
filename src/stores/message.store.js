import { defineStore } from 'pinia'
import { fetchWrapper } from '@/helpers'

const baseUrl = `${import.meta.env.VITE_API_URL}/api/message`

export const useMessageStore = defineStore({
  id: 'message',
  state: () => ({
    messages: []
  }),
  actions: {
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
    }
  }
})
