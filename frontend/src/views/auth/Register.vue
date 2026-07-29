<template>
<div class="auth-page">
  <div class="auth-card">
    <router-link to="/" class="auth-logo">🏫 洪都中学</router-link>
    <h2>注册</h2>
    <n-form :model="form" :rules="rules">
      <n-form-item path="studentId" label="学号"><n-input v-model:value="form.studentId" placeholder="请输入学号" size="large" /></n-form-item>
      <n-form-item path="nickname" label="昵称"><n-input v-model:value="form.nickname" placeholder="请输入昵称" size="large" /></n-form-item>
      <n-form-item path="password" label="密码"><n-input v-model:value="form.password" type="password" placeholder="至少6位" size="large" /></n-form-item>
    </n-form>
    <n-button type="primary" block size="large" :loading="loading" @click="handleRegister">注册</n-button>
    <p class="switch">已有账号？<router-link to="/login">去登录</router-link></p>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { NForm, NFormItem, NInput, NButton, useMessage } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'

const router=useRouter();const auth=useAuthStore();const message=useMessage();const loading=ref(false)
const form=reactive({studentId:'',nickname:'',password:''})
const rules={studentId:{required:true,message:'请输入学号'},nickname:{required:true,message:'请输入昵称'},password:{required:true,min:6,message:'密码至少6位'}}
async function handleRegister(){
  loading.value=true
  try{await auth.register({...form});router.push('/')}
  catch(e:any){message.error(e.message)}
  finally{loading.value=false}
}
</script>

<style scoped>
.auth-page{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--color-primary)0%,var(--color-primary-light)100%);padding:20px}
.auth-card{background:var(--bg-card);border-radius:var(--radius-lg);padding:40px;width:100%;max-width:400px;box-shadow:var(--shadow-lg)}
.auth-logo{display:block;text-align:center;font-size:24px;color:var(--color-primary);margin-bottom:8px;text-decoration:none;font-family:var(--font-heading)}
h2{text-align:center;margin-bottom:24px}
.switch{text-align:center;margin-top:16px;font-size:14px;color:var(--text-muted)}
.switch a{color:var(--color-accent)}
</style>
