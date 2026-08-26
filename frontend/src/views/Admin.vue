<template>
<div class="page">
  <div class="container" style="padding-top:100px;min-height:100vh">
    <h2 style="margin-bottom:24px">管理后台</h2>
    <div v-if="!isAdmin" style="text-align:center;padding:60px;color:var(--text-muted)">无权限访问</div>
    <template v-else>
      <div class="stat-grid" v-if="stats">
        <div v-for="s in cards" :key="s.label" class="card" style="text-align:center">
          <div style="font-size:2rem;font-weight:700;color:var(--color-primary)">{{ s.value }}</div>
          <div style="font-size:13px;color:var(--text-muted);margin-top:4px">{{ s.label }}</div>
        </div>
      </div>
    </template>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '@/api/client'

const stats=ref<any>(null)
const isAdmin=computed(()=>JSON.parse(localStorage.getItem('user')||'{}').role==='admin')
const cards=computed(()=>[
  {label:'用户',value:stats.value?.userCount??'-'},{label:'新闻',value:stats.value?.newsCount??'-'},
  {label:'资源',value:stats.value?.resourceCount??'-'},
  {label:'动态',value:stats.value?.feedCount??'-'},{label:'社团',value:stats.value?.clubCount??'-'},
  {label:'待处理举报',value:stats.value?.pendingReports??'-'},
])
onMounted(async()=>{if(isAdmin.value)try{stats.value=await api.get('/admin/dashboard')}catch{}})
</script>

<style scoped>
.stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px}
</style>
