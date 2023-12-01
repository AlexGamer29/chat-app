<template>
  <el-dialog v-model="dialogCreateGroup" title="Create general group" width="30%" center>
    <el-form :model="formCreateGroup">
      <el-form-item label="Group name">
        <el-input v-model="formCreateGroup.groupName" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogCreateGroup = false">Cancel</el-button>
        <el-button type="primary" @click="dialogCreateGroup = false"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data: function () {
    return {}
  },
  setup() {
    const formCreateGroup = reactive({
      groupName: '',
      selectedUsers: []
    })
  }
}
</script>
