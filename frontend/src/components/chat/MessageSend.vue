<script>
export default {
  data() {
    return {
      emojis: [
        '😀',
        '😃',
        '😄',
        '😁',
        '😆',
        '😅',
        '😂',
        '🤣',
        '😊',
        '😇',
        '🙂',
        '🙃',
        '😉',
        '😌',
        '😍',
        '😝',
        '😜',
        '🧐',
        '🤓',
        '😎',
        '😕',
        '🤑',
        '🥴',
        '😱'
      ],
      message: ''
    }
  },
  methods: {
    sendMessage() {
      this.$emit('messageFromChild', this.message)
      this.message = ''
    }
  }
}
</script>

<template>
  <div class="message-send-section">
    <input type="checkbox" id="emoji" />
    <div class="file hover-attachment">
      <div class="add-attachment">Add Attachment</div>
      <el-icon><CirclePlus /></el-icon>
    </div>

    <div class="file hover-image">
      <div class="add-image">Add Image</div>
      <label for="pic">
        <el-icon><Picture /></el-icon>
      </label>
    </div>

    <div class="file hover-gift">
      <div class="add-gift">Add Gift</div>
      <el-icon><Goods /></el-icon>
    </div>

    <div class="message-type">
      <input
        type="text"
        name="message"
        id="message"
        class="form-control"
        placeholder="Aa"
        v-model="message"
        @keyup.enter="sendMessage"
      />
      <div class="file hover-gift">
        <label for="emoji">
          <el-icon><Position /></el-icon>
        </label>
      </div>
    </div>

    <div class="file" @click="sendMessage">❤</div>

    <div class="emoji-section">
      <div class="emoji">
        <span v-for="emoji in emojis" :key="emoji">{{ emoji }}</span>
      </div>
    </div>
  </div>
</template>
