<template>
  <el-badge
    :class="['el-badge--purple', 'el-badge--clickable']"
    @click="handleFunction()"
    :is-dot="true"
    style="margin: 3px; margin-bottom: 2px"
  >
    <div style="padding: 5px">
      {{ user.first_name.concat(' ', user.last_name) }}
    </div>
  </el-badge>
</template>

<script>
export default {
  props: {
    user: Object,
    handleFunction: Function
  }
}
</script>

<style>
.el-badge--purple {
  background-color: #017aff;
  color: white;
  font-size: 12px;
  border-radius: 3px;
  cursor: pointer;
}

.el-badge--clickable:hover {
  background-color: #409eff;
}
</style>
