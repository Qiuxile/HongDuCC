<template>
<div class="page">
  <div class="container" style="padding-top:100px;min-height:100vh;max-width:800px">
    <div v-if="loading" class="loading">加载中...</div>
    <template v-else-if="news">
      <span class="tag">{{ news.category }}</span>
      <h1 style="margin:12px 0 8px">{{ news.title }}</h1>
      <p class="card-meta" style="margin-bottom:24px">{{ fmt(news.createdAt) }} · 阅读 {{ news.viewCount }}</p>
      <div class="content" v-html="news.content || news.summary"></div>
    </template>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getNewsDetail } from '@/api/news'

const route = useRoute()
const news = ref<any>(null)
const loading = ref(true)

function fmt(d: string) { return new Date(d).toLocaleDateString('zh-CN') }
onMounted(async () => {
  try { news.value = await getNewsDetail(parseInt(route.params.id as string)) }
  finally { loading.value = false }
})
</script>

<style scoped>
.content { font-size: 15px; line-height: 1.9; color: var(--text-primary); }
.content :deep(img) { max-width: 100%; border-radius: var(--radius-md); }
.content :deep(p) { margin-bottom: 12px; }
</style>
