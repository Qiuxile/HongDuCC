<template>
<div class="page">
  <div class="container" style="padding-top:100px;min-height:100vh">
    <div class="section-header"><h2>社团活动</h2></div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="!list.length" class="empty">暂无社团</div>
    <div v-else class="grid-3">
      <div v-for="item in list" :key="item.id" class="card card-click" @click="$router.push(`/clubs/${item.id}`)">
        <h3 class="card-title">{{ item.name }}</h3>
        <p class="card-desc">{{ item.description }}</p>
        <div style="display:flex;gap:10px;font-size:12px;color:var(--text-muted);flex-wrap:wrap">
          <span class="tag">{{ item.category }}</span>
          <span>{{ item.memberCount }}/{{ item.maxMembers }} 人</span>
          <span v-if="item.advisor">指导: {{ item.advisor }}</span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/client'

const list=ref<any[]>([]);const loading=ref(true)
onMounted(async()=>{try{const d:any=await api.get('/clubs');list.value=d.list}catch{}finally{loading.value=false}})
</script>

<style scoped>
.grid-3{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
.card-click{cursor:pointer}
.card-title{font-size:1rem;margin:0 0 6px}
.card-desc{font-size:13px;color:var(--text-secondary);margin:0 0 8px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
@media(max-width:640px){.grid-3{grid-template-columns:1fr}}
</style>
