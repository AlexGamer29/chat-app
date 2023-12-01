<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../stores'
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const props = defineProps(['friend'])
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
      <div class="friend-name">
        <h4>
          {{
            props.friend.members[1].user[0].first_name.concat(
              ' ',
              props.friend.members[1].user[0].last_name
            )
          }}
        </h4>
      </div>
    </div>
  </div>
</template>
