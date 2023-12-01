<script setup>
import { useAuthStore } from '@/stores'

const authStore = useAuthStore()
</script>

<template>
  <nav v-show="authStore.user" class="el-navbar">
    <el-container>
      <el-header>
        <el-menu :default-active="activeMenu" mode="horizontal" @select="handleMenuSelect">
          <router-link to="/" class="nav-item nav-link">
            <el-menu-item index="/">Home</el-menu-item>
          </router-link>
          <router-link to="/users" class="nav-item nav-link">
            <el-menu-item index="/users">Users</el-menu-item>
          </router-link>
        </el-menu>
      </el-header>
      <el-header>
        <el-button @click="authStore.logout" type="text">Logout</el-button>
      </el-header>
    </el-container>
  </nav>
</template>
