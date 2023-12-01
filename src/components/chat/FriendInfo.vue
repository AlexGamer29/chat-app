<script setup>
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../stores'
const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const props = defineProps(['currentFriend'])
</script>

<template>
  <div class="friend-info">
    <input type="checkbox" id="gallery" />
    <div class="image-name">
      <div class="image">
        <img
          src="https://png.pngtree.com/png-clipart/20230207/original/pngtree-beauty-logo-design-png-image_8947095.png"
          alt=""
        />
      </div>
      <div class="active-user">Active</div>

      <div class="name">
        <h4>
          {{
            props.currentFriend.members[1].user[0].first_name.concat(
              ' ',
              props.currentFriend.members[1].user[0].last_name
            )
          }}
        </h4>
      </div>
    </div>

    <div class="others">
      <div class="custom-chat">
        <h3>Customize Chat</h3>
        <el-icon><CaretBottom /></el-icon>
      </div>
      <div class="privacy">
        <h3>Privacy and Support</h3>
        <el-icon><CaretBottom /></el-icon>
      </div>
      <div class="media">
        <h3>Shared media</h3>
        <label for="gallery">
          <el-icon><CaretBottom /></el-icon>
        </label>
      </div>
    </div>

    <div class="gallery">
      <img
        src="https://png.pngtree.com/png-clipart/20230207/original/pngtree-beauty-logo-design-png-image_8947095.png"
        alt=""
      />
      <img
        src="https://png.pngtree.com/png-clipart/20230207/original/pngtree-beauty-logo-design-png-image_8947095.png"
        alt=""
      />
      <img
        src="https://png.pngtree.com/png-clipart/20230207/original/pngtree-beauty-logo-design-png-image_8947095.png"
        alt=""
      />
      <img
        src="https://png.pngtree.com/png-clipart/20230207/original/pngtree-beauty-logo-design-png-image_8947095.png"
        alt=""
      />
    </div>
  </div>
</template>
