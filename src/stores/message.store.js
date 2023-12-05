import { defineStore } from 'pinia'
import { fetchWrapper } from '@/helpers'

const baseUrl = `${import.meta.env.VITE_API_URL}/api/message`

export const useMessageStore = defineStore({
    id: 'message',
    state: () => ({
        messages: [],
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
    }
})
