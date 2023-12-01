<template>
  <el-form ref="form" :model="form" :rules="rules" label-width="180px" size="large">
    <el-form-item label="First Name" prop="firstName">
      <el-input v-model="form.firstName"></el-input>
    </el-form-item>
    <el-form-item label="Last Name" prop="lastName">
      <el-input v-model="form.lastName"></el-input>
    </el-form-item>
    <el-form-item label="Username" prop="username">
      <el-input v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item label="Email" prop="email">
      <el-input v-model="form.email"></el-input>
    </el-form-item>
    <el-form-item label="Password" prop="password">
      <el-input type="password" v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item label="Repeat Password" prop="repeatPassword">
      <el-input type="password" v-model="form.repeatPassword"></el-input>
    </el-form-item>
    <el-form-item>
      <el-text> Already have an account?&nbsp;<RouterLink to="login">Login</RouterLink> </el-text>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('form')">Sign up</el-button>
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
import { useUsersStore } from '../../../stores'

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
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        repeatPassword: ''
      },
      rules: {
        firstName: [{ required: true, message: 'Please enter your first name', trigger: 'blur' }],
        lastName: [{ required: true, message: 'Please enter your last name', trigger: 'blur' }],
        username: [{ required: true, message: 'Please enter your username', trigger: 'blur' }],
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
        ],
        repeatPassword: [
          { required: true, message: 'Please enter your password again', trigger: 'blur' },
          { validator: this.validateRepeatPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log(`Data`, this.form)
          const data = {
            first_name: this.form.firstName,
            last_name: this.form.lastName,
            username: this.form.username,
            email: this.form.email,
            password: this.form.password,
            repeat_password: this.form.repeatPassword
          }

          const usersStore = useUsersStore()
          await usersStore.register(data)

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
    },
    validateRepeatPassword(rule, value, callback) {
      if (value !== this.form.password) {
        callback(new Error('The two passwords do not match'))
      } else {
        callback()
      }
    }
  }
})
</script>
