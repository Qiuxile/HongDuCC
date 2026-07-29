<template>
<div class="auth-page">
  <div class="auth-card">
    <router-link to="/" class="auth-logo">🏫 洪都中学</router-link>
    <h2>登录</h2>
    <n-form :model="form" :rules="rules">
      <n-form-item path="studentId" label="学号">
        <n-input v-model:value="form.studentId" placeholder="请输入学号" size="large" />
      </n-form-item>
      <n-form-item path="password" label="密码">
        <n-input v-model:value="form.password" type="password" placeholder="请输入密码" size="large" @keyup.enter="handleLogin" />
      </n-form-item>
    </n-form>
    <n-button type="primary" block size="large" :loading="loading" @click="handleLogin">登录</n-button>
    <p class="switch">还没有账号？<router-link to="/register">立即注册</router-link></p>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NForm, NFormItem, NInput, NButton, useMessage } from 'naive-ui'
import { useAuthStore } from '@/stores/auth'

const router=useRouter();const route=useRoute();const auth=useAuthStore();const message=useMessage();const loading=ref(false)
const form=reactive({studentId:'',password:''})
const rules={studentId:{required:true,message:'请输入学号'},password:{required:true,message:'请输入密码'}}
async function handleLogin(){
  loading.value=true
  try{await auth.login({studentId:form.studentId,password:form.password});router.push((route.query.redirect as string)||'/')}
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
