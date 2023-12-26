import { defineStore } from 'pinia'

import { fetchWrapper } from '@/helpers'
import { useAuthStore, useAlertStore } from '../stores'
import { router } from '../router'

const baseUrl = `${import.meta.env.VITE_API_URL}/api/user`

export const useUsersStore = defineStore({
  id: 'users',
  state: () => ({
    searchUsers: {},
    users: {},
    user: {},
    selectedFriend: null
  }),
  actions: {
    clearSearchUsers() {
      this.searchUsers = {}
    },
    async searchUser(string) {
      this.searchUsers = { loading: true }
      try {
        let data = await fetchWrapper.get(`${baseUrl}?search=${string}`)
        this.searchUsers = data.data
      } catch (error) {
        this.users = { error }
      }
    },
    async selectFriend(friend) {
      this.selectedFriend = friend
    },
    async register(user) {
      const alertStore = useAlertStore()
      try {
        let data = await fetchWrapper.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, user)
        this.user = data.data
        router.push('/auth/login')
      } catch (error) {
        alertStore.error(error)
      }
    },
    async getAll() {
      this.users = { loading: true }
      try {
        let data = await fetchWrapper.get(`${baseUrl}/get-users`)
        this.users = data.response
      } catch (error) {
        this.users = { error }
      }
    },
    async getById(id) {
      this.user = { loading: true }
      try {
        this.user = await fetchWrapper.get(`${baseUrl}/${id}`)
      } catch (error) {
        this.user = { error }
      }
    },
    async update(userUpdate) {
      try {
        // Send a PUT request to update the user on the server
        const updateUser = await fetchWrapper.put(`${baseUrl}/update-user`, userUpdate);

        // Check if the response is successful
        if (updateUser.status === 200) {
          const authStore = useAuthStore();
          const storedUserString = localStorage.getItem('user');
          // Check if the user object exists in local storage
          if (storedUserString) {
            // Parse the stored JSON string to get the user object
            const storedUser = JSON.parse(storedUserString);

            // Update the user object with the new data
            Object.assign(storedUser.user, updateUser.user);

            // Store the updated user object back into local storage
            localStorage.setItem('user', JSON.stringify(storedUser));

            // Update auth user in pinia state
            authStore.user.user = updateUser.user;

            console.log('User object updated successfully:', storedUser);
          } else {
            console.error('User object not found in local storage');
          }
        } else {
          // Handle unsuccessful response
          console.error('Update user request failed:', updateUser.message);
        }
      } catch (error) {
        // Handle fetch error
        console.error('Error updating user:', error.message);
      }
    },

    async delete(id) {
      // add isDeleting prop to user being deleted
      this.users.find((x) => x.id === id).isDeleting = true

      await fetchWrapper.delete(`${baseUrl}/${id}`)

      // remove user from list after deleted
      this.users = this.users.filter((x) => x.id !== id)

      // auto logout if the logged in user deleted their own record
      const authStore = useAuthStore()
      if (id === authStore.user.id) {
        authStore.logout()
      }
    }
  }
})
