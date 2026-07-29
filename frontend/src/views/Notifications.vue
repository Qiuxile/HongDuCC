<template>
<div class="page">
  <div class="container" style="padding-top:100px;min-height:100vh;max-width:600px">
    <h2 style="margin-bottom:20px">通知中心</h2>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="!list.length" class="empty">暂无通知</div>
    <div v-else>
      <div v-for="item in list" :key="item.id" class="card" style="margin-bottom:8px;padding:16px" :style="{opacity:item.isRead?0.6:1}">
        <div style="display:flex;justify-content:space-between;align-items:start">
          <strong style="font-size:14px">{{ item.title }}</strong>
          <span class="tag" v-if="!item.isRead">未读</span>
        </div>
        <p style="font-size:13px;color:var(--text-secondary);margin:6px 0">{{ item.body }}</p>
        <span style="font-size:12px;color:var(--text-muted)">{{ fmt(item.createdAt) }}</span>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api/client'

const list=ref<any[]>([]);const loading=ref(true)
function fmt(d:string){return new Date(d).toLocaleDateString('zh-CN')}
onMounted(async()=>{try{const d:any=await api.get('/notifications');list.value=d.list}catch{}finally{loading.value=false}})
</script>
