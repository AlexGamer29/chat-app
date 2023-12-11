// store.js
import { defineStore } from 'pinia'

export const useSettingStore = defineStore({
  id: 'setting',
  state: () => ({
    nightMode: false
  }),
  actions: {
    toggleNightMode(value) {
      this.nightMode = value
      localStorage.setItem('nightMode', value)
    }
  }
})
