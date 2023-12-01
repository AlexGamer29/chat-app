<template>
  <el-card
    @click="handleFunction()"
    :body-style="{ padding: '10px' }"
    :style="{ cursor: 'pointer', marginBottom: '8px' }"
    :hover-style="{ background: '#38B2AC', color: 'white' }"
    shadow="hover"
  >
    <el-row :gutter="12" align="middle">
      <el-col :span="4" class="flex-center">
        <el-avatar
          :size="avatarSize"
          src="https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTA0L2pvYjcyMS0wMzctdi5qcGc.jpg"
          :alt="user.first_name.concat(' ', user.last_name)"
        ></el-avatar>
      </el-col>
      <el-col :span="20">
        <div>
          <span>{{ user.first_name.concat(' ', user.last_name) }}</span>
        </div>
        <div><b>Email:</b> {{ user.email }}</div>
      </el-col>
    </el-row>
  </el-card>
</template>

<style scoped>
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

<script>
export default {
  props: {
    handleFunction: Function,
    user: Object
  },
  data() {
    return {
      avatarSize: 'default' // You can adjust the size as needed
    }
  }
}
</script>
