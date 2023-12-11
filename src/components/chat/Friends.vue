<script>
import { storeToRefs } from 'pinia'
import { useAuthStore, useSettingStore } from '../../stores'

export default {
  props: {
    friend: Object
  },
  data() {
    return {
      loadReceiver: ''
    }
  },
  setup() {
    const { nightMode } = storeToRefs(useSettingStore())

    return {
      nightMode
    }
  },
  watch: {
    friend: {
      handler: 'updateReceiver',
      immediate: true
    }
  },
  methods: {
    updateReceiver() {
      const { user } = useAuthStore()

      if (this.friend.is_group) {
        this.loadReceiver = '' // Reset loadReceiver for groups
      } else {
        // Find the receiver from members
        this.friend.members.forEach((member) => {
          if (member.user[0]._id !== user.user._id) {
            this.loadReceiver = member.user[0].first_name + ' ' + member.user[0].last_name
          }
        })
      }
    }
  }
}
</script>

<template>
  <div class="friend">
    <div class="friend-image">
      <div class="image">
        <img
          src="https://png.pngtree.com/png-clipart/20230207/original/pngtree-beauty-logo-design-png-image_8947095.png"
          alt=""
        />
      </div>
    </div>
    <div class="friend-name-seen">
      <div
        :class="{
          'friend-name': true,
          'night-mode': nightMode
        }"
      >
        <h4 v-if="friend.is_group">
          {{ friend.conversation_name }}
        </h4>
        <h4 v-else>
          {{ loadReceiver }}
        </h4>
      </div>
    </div>
  </div>
</template>
