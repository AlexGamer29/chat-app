<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="180px" size="large">
    <el-form-item label="Email" prop="email">
      <el-input v-model="form.email"></el-input>
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input type="password" v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-text>
        Don't have an account?&nbsp;<RouterLink to="sign-up">Sign up now</RouterLink>
      </el-text>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('form')">Login</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>
.el-form-item:not(:last-child) {
  margin-bottom: 3em;
}
</style>

<script>
import { defineComponent } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton, ElText } from 'element-plus'

import { useAuthStore } from '../../../stores'

export default defineComponent({
  name: 'SignUpForm',
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton,
    ElText
  },
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          { required: true, message: 'Please enter your email', trigger: 'blur' },
          {
            type: 'email',
            message: 'Please enter a valid email address',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          { required: true, message: 'Please enter your password', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{6,30}$/,
            message:
              'Password must contain only alphanumeric characters and be between 6 and 30 characters long',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(`Login`, this.form)
          const data = {
            email: this.form.email,
            password: this.form.password
          }

          const authStore = useAuthStore()
          await authStore.login(data.email, data.password)

          this.$message({
            message: 'Form submitted successfully',
            type: 'success'
          })
        } else {
          this.$message({
            message: 'Form validation failed',
            type: 'error'
          })
          return false
        }
      })
    }
  }
})
</script>
