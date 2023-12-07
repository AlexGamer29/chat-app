import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
const endpoint = `${import.meta.env.VITE_API_URL}`

export const useSocketStore = defineStore({
  id: 'socket',
  state: () => ({
    socket: null,
    socketConnected: false
  }),
  actions: {
    initializeSocket(user) {
      // Assuming you have VITE_API_URL defined in your environment
      this.socket = io(endpoint)

      this.socket.emit('setup', user)

      this.socket.on('connected', () => {
        this.socketConnected = true
      })
    },

    joinChat(conversationId) {
      if (this.socket) {
        this.socket.emit('join chat', conversationId)
      }
    }
  }
})
