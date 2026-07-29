<template>
<div class="page">
  <div class="container" style="padding-top:100px;min-height:100vh;max-width:500px">
    <div v-if="!isAuth" style="text-align:center;padding:60px">
      <p style="color:var(--text-muted);margin-bottom:16px">请先登录</p>
      <n-button type="primary" @click="$router.push('/login')">去登录</n-button>
    </div>
    <template v-else-if="user">
      <div style="text-align:center;margin-bottom:24px">
        <n-avatar :size="72" style="background:var(--color-primary);font-size:28px;margin-bottom:12px">{{ user.nickname?.[0] }}</n-avatar>
        <h2 style="margin:4px 0">{{ user.nickname }}</h2>
        <p style="color:var(--text-muted);font-size:14px">学号 {{ user.studentId }} · {{ user.role==='admin'?'管理员':'学生' }}</p>
        <p v-if="user.bio" style="color:var(--text-secondary);margin-top:8px">{{ user.bio }}</p>
      </div>
      <n-button block @click="logout" type="error" ghost>退出登录</n-button>
    </template>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { NButton, NAvatar } from 'naive-ui'
import { getMe } from '@/api/auth'

const router=useRouter();const user=ref<any>(null)
const isAuth=computed(()=>!!localStorage.getItem('token'))
onMounted(async()=>{if(isAuth.value)try{user.value=await getMe()}catch{}})
function logout(){localStorage.removeItem('token');localStorage.removeItem('user');router.push('/')}
</script>
