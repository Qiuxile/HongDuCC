<template>
<div class="page">
  <div class="container" style="padding-top:100px;min-height:100vh;max-width:900px">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:12px">
      <h2>校园论坛</h2>
      <n-button v-if="isAuth" type="primary" @click="showCreate=true">发帖</n-button>
    </div>
    <div v-if="loading" class="loading">加载中...</div>
    <div v-else-if="!list.length" class="empty">暂无帖子</div>
    <div v-else class="post-list">
      <div v-for="item in list" :key="item.id" class="card card-click" @click="$router.push(`/forum/${item.id}`)">
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:6px">
          <span class="tag">{{ item.category }}</span>
          <span v-if="item.isPinned" class="tag" style="background:var(--color-danger);color:#fff">置顶</span>
        </div>
        <h3 class="card-title">{{ item.title }}</h3>
        <div style="display:flex;gap:16px;font-size:12px;color:var(--text-muted);flex-wrap:wrap">
          <span>{{ item.author?.nickname || '匿名' }}</span>
          <span>{{ fmt(item.createdAt) }}</span>
          <span>{{ item.viewCount }} 阅读</span>
          <span>{{ item.commentCount }} 评论</span>
        </div>
      </div>
    </div>
    <n-pagination v-if="total>pageSize" :page="page" :page-size="pageSize" :item-count="total"
      :on-update:page="(p:number)=>{page=p;fetch()}" style="margin-top:24px;justify-content:center" />

    <!-- Create modal -->
    <n-modal v-model:show="showCreate" preset="card" title="发布帖子" style="max-width:560px">
      <n-form :model="form" :rules="rules">
        <n-form-item path="title" label="标题">
          <n-input v-model:value="form.title" placeholder="请输入标题" />
        </n-form-item>
        <n-form-item path="category" label="分类">
          <n-select v-model:value="form.category" :options="cats" />
        </n-form-item>
        <n-form-item path="content" label="内容">
          <n-input v-model:value="form.content" type="textarea" :rows="6" placeholder="请输入内容" />
        </n-form-item>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="showCreate=false">取消</n-button>
          <n-button type="primary" :loading="posting" @click="handleCreate">发布</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { NButton, NModal, NForm, NFormItem, NInput, NSelect, NSpace, NPagination, useMessage } from 'naive-ui'
import { getPosts, createPost } from '@/api/forum'

const message = useMessage()
const isAuth = computed(() => !!localStorage.getItem('token'))
const list = ref<any[]>([]); const loading=ref(true)
const page=ref(1); const pageSize=15; const total=ref(0)
const showCreate=ref(false); const posting=ref(false)

const cats = ['综合讨论','学习交流','校园生活','社团活动','意见建议','闲聊灌水'].map(v=>({label:v,value:v}))
const form = reactive({ title:'', content:'', category:'综合讨论' })
const rules = { title:{required:true,message:'请输入标题'}, content:{required:true,message:'请输入内容'} }

function fmt(d:string){return new Date(d).toLocaleDateString('zh-CN')}
async function fetch(){
  loading.value=true
  try{const d:any=await getPosts({page:page.value,pageSize});list.value=d.list;total.value=d.total}
  finally{loading.value=false}
}
async function handleCreate(){
  posting.value=true
  try{await createPost({...form});message.success('发帖成功');showCreate.value=false;form.title='';form.content='';await fetch()}
  catch(e:any){message.error(e.message)}
  finally{posting.value=false}
}
onMounted(fetch)
</script>

<style scoped>
.post-list { display:flex;flex-direction:column;gap:12px; }
.card-click { cursor:pointer; }
.card-title { font-size:1rem;margin:0; }
</style>
