<template>
<div class="page">
  <div class="container" style="padding-top:100px;min-height:100vh">
    <div class="section-header"><h2>新闻公告</h2></div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="!list.length" class="empty">暂无新闻</div>
    <div v-else class="news-list">
      <div v-for="item in list" :key="item.id" class="card card-click" @click="$router.push(`/news/${item.id}`)">
        <span class="tag">{{ item.category }}</span>
        <h3 class="card-title">{{ item.title }}</h3>
        <p class="card-desc">{{ item.summary }}</p>
        <span class="card-meta">{{ fmt(item.createdAt) }} · 阅读 {{ item.viewCount }}</span>
      </div>
    </div>
    <n-pagination v-if="total > pageSize" :page="page" :page-size="pageSize" :item-count="total"
      :on-update:page="(p:number) => { page = p; fetch() }" style="margin-top:24px;justify-content:center" />
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { NPagination } from 'naive-ui'
import { getNewsList } from '@/api/news'

const list = ref<any[]>([])
const loading = ref(true)
const page = ref(1); const pageSize = 12; const total = ref(0)

function fmt(d: string) { return new Date(d).toLocaleDateString('zh-CN') }
async function fetch() {
  loading.value = true
  try { const d: any = await getNewsList({ page: page.value, pageSize }); list.value = d.list; total.value = d.total }
  finally { loading.value = false }
}
onMounted(fetch)
</script>

<style scoped>
.news-list { display: flex; flex-direction: column; gap: 12px; }
.card-click { cursor: pointer; }
.card-title { font-size: 1.1rem; margin: 8px 0 4px; }
.card-desc { font-size: 14px; color: var(--text-secondary); margin: 4px 0; }
.card-meta { font-size: 12px; color: var(--text-muted); }
</style>
