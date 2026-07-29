<template>
<div class="page">
  <div class="container" style="padding-top:100px;min-height:100vh;max-width:800px">
    <div v-if="loading" class="loading">加载中...</div>
    <template v-else-if="post">
      <h1>{{ post.title }}</h1>
      <div style="display:flex;gap:16px;font-size:13px;color:var(--text-muted);margin-bottom:24px;flex-wrap:wrap">
        <span>{{ post.author?.nickname || '匿名' }}</span>
        <span>{{ fmt(post.createdAt) }}</span>
        <span>{{ post.viewCount }} 阅读</span>
      </div>
      <div style="white-space:pre-wrap;line-height:1.8;margin-bottom:24px;color:var(--text-primary)">{{ post.content }}</div>
      <div style="display:flex;gap:12px;margin-bottom:32px">
        <n-button size="small" @click="toggleLike" :type="post.isLiked?'primary':'default'">
          {{ post.isLiked ? '已赞' : '点赞' }} {{ post.likeCount }}
        </n-button>
      </div>

      <!-- Comments -->
      <h3 style="margin-bottom:16px">评论 ({{ comments.length }})</h3>
      <div v-if="isAuth" style="display:flex;gap:8px;margin-bottom:20px">
        <n-input v-model:value="text" placeholder="写评论..." style="flex:1" />
        <n-button type="primary" :loading="sending" @click="send">发布</n-button>
      </div>
      <div v-for="c in comments" :key="c.id" class="comment">
        <div style="margin-bottom:4px">
          <strong style="color:var(--text-primary)">{{ c.author?.nickname }}</strong>
          <span style="margin-left:12px;font-size:12px;color:var(--text-muted)">{{ fmt(c.createdAt) }}</span>
        </div>
        <p style="color:var(--text-secondary);font-size:14px">{{ c.content }}</p>
        <div v-for="r in c.replies" :key="r.id" class="reply">
          <strong>{{ r.author?.nickname }}</strong>: {{ r.content }}
        </div>
      </div>
    </template>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { NButton, NInput, useMessage } from 'naive-ui'
import { getPostDetail, likePost, unlikePost } from '@/api/forum'
import { getComments, createComment } from '@/api/comments'

const route=useRoute(); const msg=useMessage()
const post=ref<any>(null); const comments=ref<any[]>([])
const text=ref(''); const sending=ref(false); const loading=ref(true)
const isAuth=computed(()=>!!localStorage.getItem('token'))

function fmt(d:string){return new Date(d).toLocaleDateString('zh-CN')}
async function toggleLike(){
  if(!isAuth.value){msg.warning('请先登录');return}
  try{const r:any=post.value.isLiked?await unlikePost(post.value.id):await likePost(post.value.id);post.value.isLiked=r.isLiked;post.value.likeCount=r.likeCount}
  catch(e:any){msg.error(e.message)}
}
async function send(){
  if(!text.value.trim())return;sending.value=true
  try{await createComment({targetType:'forum_post',targetId:post.value.id,content:text.value});text.value='';msg.success('评论成功');await loadComments()}
  catch(e:any){msg.error(e.message)}
  finally{sending.value=false}
}
async function loadComments(){const d:any=await getComments('forum_post',post.value.id);comments.value=d??[]}
onMounted(async()=>{try{post.value=await getPostDetail(parseInt(route.params.id as string));await loadComments()}finally{loading.value=false}})
</script>

<style scoped>
h1{font-size:1.5rem;margin-bottom:8px}
.comment{padding:14px 0;border-bottom:1px solid var(--border-light)}
.reply{padding:8px 0 8px 20px;font-size:14px;color:var(--text-secondary);border-left:2px solid var(--border-light);margin:6px 0}
</style>
