import { defineStore } from 'pinia'
import { fetchWrapper } from '@/helpers'
import { useAuthStore } from '../stores'

const baseUrl = `${import.meta.env.VITE_API_URL}/api/conversation`

export const useConversationStore = defineStore({
  id: 'conversation',
  state: () => ({
    conversations: {},
    selectedConversation: null,
    receiver: null
  }),
  actions: {
    getReceiver() {
      const { user } = useAuthStore()
      this.receiver = null
      if (this.selectedConversation && !this.selectedConversation.is_group) {
        this.selectedConversation.members.forEach((member) => {
          if (member.user[0]._id !== user.user._id) {
            this.receiver = member.user[0]
          }
        })
      } else if (this.selectedConversation && this.selectedConversation.is_group) {
        this.selectedConversation.members.forEach((member) => {
          if (member.user[0]._id === user.user._id) {
            this.receiver = member.user[0]
          }
        })
      }
    },
    async accessConversation(user_id) {
      try {
        let data = await fetchWrapper.post(`${baseUrl}`, { user_id })
        return data.data
      } catch (error) { }
    },
    async createConversation(group_name, members) {
      try {
        let data = await fetchWrapper.post(`${baseUrl}/create`, { group_name, members })
        return data.data
      } catch (error) { }
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
