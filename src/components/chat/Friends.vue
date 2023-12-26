<script>
import { storeToRefs } from 'pinia'
import { useAuthStore, useSettingStore } from '../../stores'

export default {
  props: {
    friend: Object
  },
  data() {
    return {
      loadReceiver: {}
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
        this.loadReceiver = this.friend.members[0].user[0]
      } else {
        // Find the receiver from members
        this.friend.members.forEach((member) => {
          if (member.user[0]._id !== user.user._id) {
            this.loadReceiver = member.user[0]
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
        <img :src="loadReceiver.profile_photo" alt="" />
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
        <h4 v-else>{{ loadReceiver.first_name }} {{ loadReceiver.last_name }}</h4>
      </div>
    </div>
  </div>
</template>
