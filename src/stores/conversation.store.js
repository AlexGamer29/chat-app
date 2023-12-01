import { defineStore } from 'pinia'
import { fetchWrapper } from '@/helpers'

const baseUrl = `${import.meta.env.VITE_API_URL}/api/conversation`

export const useConversationStore = defineStore({
  id: 'conversation',
  state: () => ({
    conversations: {},
    selectedConversation: null
  }),
  actions: {
    async accessConversation(user_id) {
      try {
        let data = await fetchWrapper.post(`${baseUrl}`, { user_id })
        return data.data
      } catch (error) {}
    },
    async getAllConversation() {
      this.conversations = { loading: true }
      try {
        let data = await fetchWrapper.get(`${baseUrl}`)
        this.conversations = data.data
      } catch (error) {
        this.conversations = { error }
      }
    },
    async selectConversation(conversation) {
      this.selectedConversation = conversation
    }
  }
})
