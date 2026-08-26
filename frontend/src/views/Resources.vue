<template>
<div class="res-page">
  <div class="container res-container">
    <div class="section-header"><h2>学习资源</h2></div>
    <n-config-provider :theme="darkTheme" :theme-overrides="themeOverrides">
      <div style="display:flex;gap:10px;margin-bottom:20px;flex-wrap:wrap">
        <n-select v-model:value="filter.cat" :options="catOpts" placeholder="分类" style="width:130px" clearable @update:value="fetch" size="small" />
        <n-select v-model:value="filter.subj" :options="subjOpts" placeholder="学科" style="width:130px" clearable @update:value="fetch" size="small" />
        <n-input v-model:value="filter.search" placeholder="搜索..." style="width:180px" clearable @keyup.enter="fetch" size="small" />
      </div>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else-if="!list.length" class="empty">暂无资源</div>
      <div v-else class="res-grid">
        <div v-for="item in list" :key="item.id" class="card card-click" @click="$router.push(`/resources/${item.id}`)">
          <div style="display:flex;gap:12px">
            <span style="font-size:28px;line-height:1.4">📄</span>
            <div style="flex:1;min-width:0">
              <h3 class="card-title">{{ item.title }}</h3>
              <div style="display:flex;gap:6px;flex-wrap:wrap;margin:6px 0">
                <span class="tag">{{ item.category }}</span>
                <span v-if="item.subject" class="tag">{{ item.subject }}</span>
                <span v-if="item.grade" class="tag">{{ item.grade }}</span>
              </div>
              <div class="res-meta">
                <span>{{ item.author?.nickname }}</span>
                <span>{{ item.downloadCount }} 下载</span>
                <span>{{ item.likeCount }} 赞</span>
                <span>{{ fmt(item.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <n-pagination v-if="total>pageSize" :page="page" :page-size="pageSize" :item-count="total"
        :on-update:page="(p:number)=>{page=p;fetch()}" style="margin-top:24px;justify-content:center" />
    </n-config-provider>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { NSelect, NInput, NPagination, NConfigProvider, darkTheme } from 'naive-ui'
import { getResources } from '@/api/resources'
import { useTheme } from '@/composables/useTheme'

const { themeOverrides } = useTheme()

const list=ref<any[]>([]);const loading=ref(true)
const page=ref(1);const pageSize=12;const total=ref(0)
const filter=reactive({cat:null as string|null,subj:null as string|null,search:''})
const catOpts=['课件','试卷','习题','视频','其他'].map(v=>({label:v,value:v}))
const subjOpts=['语文','数学','英语','物理','化学','生物','政治','历史','地理'].map(v=>({label:v,value:v}))

function fmt(d:string){return new Date(d).toLocaleDateString('zh-CN')}
async function fetch(){
  loading.value=true
  try{const d:any=await getResources({page:page.value,pageSize,category:filter.cat||undefined,subject:filter.subj||undefined,search:filter.search||undefined});list.value=d.list;total.value=d.total}
  finally{loading.value=false}
}
onMounted(fetch)
</script>

<style scoped>
.res-page {
  min-height: 100vh;
  background: var(--theme-bg-page);
}

.res-container {
  padding-top: 100px;
  min-height: 100vh;
}

.section-header h2 {
  color: var(--theme-text-primary);
  font-weight: 700;
}

.res-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px}

/* 玻璃拟态卡片 */
.res-page .card {
  background: var(--theme-card-bg);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  border: 1px solid var(--theme-card-border);
  border-radius: 14px;
  transition: all 0.25s ease;
}
.res-page .card:hover {
  background: var(--theme-card-hover);
  border-color: var(--theme-border-strong);
  transform: translateY(-2px);
}

.res-page .card .tag {
  background: color-mix(in srgb, var(--theme-primary) 18%, transparent);
  color: color-mix(in srgb, var(--theme-primary) 60%, white);
}

.card-click{cursor:pointer}
.card-title{font-size:1rem;margin:0 0 4px;color:var(--theme-text-primary)}
.res-meta{display:flex;gap:12px;font-size:12px;color:var(--theme-text-muted);flex-wrap:wrap}

.res-page .loading,
.res-page .empty {
  color: var(--theme-text-muted);
}

/* 强制筛选控件文字为浅色（naive-ui 深色主题） */
.res-page :deep(.n-base-selection-label),
.res-page :deep(.n-base-selection-placeholder) {
  color: var(--theme-text-secondary) !important;
}
.res-page :deep(.n-input__input-el) {
  color: var(--theme-text-primary);
}
.res-page :deep(.n-input__placeholder) {
  color: var(--theme-text-muted);
}

@media(max-width:640px){.res-grid{grid-template-columns:1fr}}
</style>
