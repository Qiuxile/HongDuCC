<template>
  <div class="clubs-page">
    <!-- ===== Hero 横幅：社团封面墙（按人数排序，自动滚动，悬停显示名字） ===== -->
    <section class="hero-section">
      <!-- 侧面光线背景 -->
      <SideRays
        class="hero-aurora"
        ray-color-1="#4a90d9"
        ray-color-2="#a78bfa"
        :intensity="1.6"
        :spread="1.8"
        origin="top-right"
        :opacity="0.45"
        :speed="2"
      />

      <div v-if="wallRows.length" class="wall-wrap">
        <div class="wall-grid">
          <div
            v-for="(row, ri) in wallRows" :key="ri"
            class="wall-row"
            :style="{ '--dur': row.dur + 's', '--dir': row.rev ? 'reverse' : 'normal' }"
          >
            <template v-for="(club, ci) in row.items" :key="ci">
              <div class="wall-card">
                <div
                  class="wall-cover"
                  :class="!club.placeholder ? `cover-${getCoverClass(club.category)}` : ''"
                  :style="wallCoverStyle(club)"
                >
                  <div v-if="!club.coverUrl && !club.placeholder" class="wall-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <div v-if="!club.placeholder" class="wall-name">{{ club.name }}</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>

      <GradualBlur position="top" :strength="1.6" height="8rem" :div-count="6" :z-index="5" />
      <GradualBlur position="bottom" :strength="1.6" height="8rem" :div-count="6" :z-index="5" />
    </section>

    <!-- ===== 主内容区 ===== -->
    <div class="main-container">
      <div class="content-grid">
        <!-- 左侧：社团列表 -->
        <div class="clubs-main">
          <!-- 分类筛选 -->
          <div class="filter-bar">
            <button
              v-for="cat in categories"
              :key="cat.key"
              :class="['filter-chip', { active: activeCategory === cat.key }]"
              @click="activeCategory = cat.key"
            >
              <svg
                v-if="cat.key !== 'all'"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <!-- 学术：书本 -->
                <template v-if="cat.key === '学术'">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </template>
                <!-- 艺术：调色板 -->
                <template v-if="cat.key === '艺术'">
                  <circle cx="13.5" cy="6.5" r="2" /><circle cx="17.5" cy="10.5" r="2" /><circle cx="8.5" cy="7.5" r="2" /><circle cx="6.5" cy="12.5" r="2" />
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.83-.13 2.68-.38A9.99 9.99 0 0 0 22 12c0-5.5-4.5-10-10-10z" />
                </template>
                <!-- 体育：奖杯 -->
                <template v-if="cat.key === '体育'">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 22V2" /><path d="M14 22V8" />
                </template>
                <!-- 公益：爱心 -->
                <template v-if="cat.key === '公益'">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </template>
                <!-- 兴趣：星星 -->
                <template v-if="cat.key === '兴趣'">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </template>
              </svg>
              {{ cat.label }}
            </button>
          </div>

          <!-- 加载中 -->
          <div v-if="loading" class="loading-grid">
            <div v-for="n in 6" :key="n" class="club-card-skeleton">
              <div class="skeleton-cover" />
              <div class="skeleton-body">
                <div class="skeleton-line w-60" />
                <div class="skeleton-line w-80" />
                <div class="skeleton-line w-40" />
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else-if="filteredClubs.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.4">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <p>该分类下暂无社团</p>
          </div>

          <!-- 社团卡片网格 -->
          <div v-else class="clubs-grid">
            <router-link
              v-for="(club, idx) in filteredClubs"
              :key="club.id"
              :to="`/clubs/${club.id}`"
              class="club-card"
              :style="{ animationDelay: `${idx * 0.06}s` }"
              @mousemove="onCardGlare"
              @mouseleave="onCardGlareLeave"
            >
              <!-- 卡片封面区 -->
              <div :class="['card-cover', `cover-${getCoverClass(club.category)}`]" :style="club.coverUrl ? { backgroundImage: `url(${club.coverUrl})`, backgroundSize:'cover', backgroundPosition:'center' } : {}">
                <div class="cover-pattern" />
                <div v-if="!club.coverUrl" class="cover-icon">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <template v-if="getCoverClass(club.category) === 'academic'">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </template>
                    <template v-else-if="getCoverClass(club.category) === 'art'">
                      <circle cx="13.5" cy="6.5" r="2" /><circle cx="17.5" cy="10" r="2" /><circle cx="8.5" cy="7.5" r="2" /><circle cx="6.5" cy="12.5" r="2" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.83-.13 2.68-.38A9.99 9.99 0 0 0 22 12c0-5.5-4.5-10-10-10z" />
                    </template>
                    <template v-else-if="getCoverClass(club.category) === 'sports'">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" /><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" /><path d="M4 22h16" /><path d="M10 22V2" /><path d="M14 22V8" />
                    </template>
                    <template v-else-if="getCoverClass(club.category) === 'public'">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </template>
                    <template v-else>
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </template>
                  </svg>
                </div>
                <span class="cover-category">{{ getCategoryLabel(club.category) }}</span>
              </div>

              <!-- 卡片信息区 -->
              <div class="card-body">
                <h3 class="card-name">{{ club.name }}</h3>
                <p class="card-desc">{{ (club.description || '').slice(0, 80) }}{{ (club.description || '').length > 80 ? '...' : '' }}</p>

                <div class="card-tags">
                  <span class="tag">{{ getCategoryLabel(club.category) }}</span>
                </div>

                <div class="card-footer">
                  <div class="footer-info">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    <span>{{ club.memberCount }} 人</span>
                  </div>
                  <span class="footer-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </span>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- 右侧边栏 -->
        <aside class="clubs-sidebar">
          <!-- 近期活动 -->
          <div class="sidebar-card activity-card" @mousemove="onCardGlare" @mouseleave="onCardGlareLeave">
            <div class="sidebar-card-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>近期活动</span>
            </div>
            <div v-if="recentEvents.length === 0" class="activity-empty">暂无近期活动</div>
            <div v-else class="activity-list">
              <div v-for="evt in recentEvents" :key="evt.id" class="activity-item" @click="goClub(evt.clubId)">
                <div class="act-date">
                  <span class="act-date-month">{{ formatActMonth(evt.startTime) }}</span>
                  <span class="act-date-day">{{ formatActDay(evt.startTime) }}</span>
                </div>
                <div class="act-info">
                  <span class="act-title">{{ evt.title }}</span>
                  <span class="act-club">{{ evt.club?.name || '' }} · {{ evt.location }}</span>
                </div>
              </div>
            </div>
            <button class="view-all-btn" @click="onViewAllEvents">查看全部活动 →</button>
          </div>

          <!-- 为什么要加入社团 -->
          <div class="sidebar-card why-card" @mousemove="onCardGlare" @mouseleave="onCardGlareLeave">
            <div class="sidebar-card-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span>为什么要加入社团</span>
            </div>
            <ul class="why-list">
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-green)" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>培养兴趣，发现自我</span>
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-green)" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>结识挚友，拓展人脉</span>
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-green)" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>锻炼能力，提升综合素质</span>
              </li>
              <li>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-green)" stroke-width="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>丰富履历，助力升学</span>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>

    <!-- ===== 申请创建社团 CTA ===== -->
    <section class="cta-section">
      <div class="cta-inner">
        <h2 class="cta-title">还没有找到心仪的社团？</h2>
        <p class="cta-desc">你也可以发起创建一个新社团！只要有共同的兴趣和目标，就能组建你的团队。</p>
        <div class="cta-wrap">
          <StarBorder class="cta-star" color="#7c3aed" speed="5s" :border-radius="999" @click="handleCreateClub">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            申请创建社团
          </StarBorder>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMessage } from 'naive-ui'
import api from '@/api/client'
import { useAuthStore } from '@/stores/auth'
import SideRays from '@/components/SideRays.vue'
import GradualBlur from '@/components/GradualBlur.vue'
import StarBorder from '@/components/StarBorder.vue'

const router = useRouter()
const message = useMessage()
const authStore = useAuthStore()

interface Category {
  key: string
  label: string
}

const categories: Category[] = [
  { key: 'all', label: '全部社团' },
  { key: '学术', label: '学术科技' },
  { key: '艺术', label: '文化艺术' },
  { key: '体育', label: '体育竞技' },
  { key: '公益', label: '公益实践' },
  { key: '兴趣', label: '兴趣拓展' },
]

const categoryMap: Record<string, string> = {
  '学术': 'academic',
  '艺术': 'art',
  '体育': 'sports',
  '公益': 'public',
  '兴趣': 'interest',
}

const clubs = ref<any[]>([])
const activeCategory = ref<string>('all')
const loading = ref<boolean>(true)
const recentEvents = ref<any[]>([])

const filteredClubs = computed<any[]>(() => {
  if (activeCategory.value === 'all') return clubs.value
  return clubs.value.filter((c) => c.category === activeCategory.value)
})

/**
 * 封面墙数据：按人数降序排列，分为 3 行、每行 8 张（内容复制两遍实现无缝滚动），
 * 各行错开起点、速度与方向不同，形成 GridMotion 式的流动感。
 * 没有社团数据时用随机图片占位。
 */
const wallRows = computed<any[]>(() => {
  const perRow = 8
  const source = clubs.value.length
    ? [...clubs.value].sort((a, b) => (b.memberCount || 0) - (a.memberCount || 0))
    : null
  const rows: any[] = []
  for (let r = 0; r < 3; r++) {
    const items: any[] = []
    for (let i = 0; i < perRow * 2; i++) {
      if (source) {
        items.push(source[(r * 3 + i) % source.length]) // 各行错开起始，内容不同
      } else {
        items.push({
          placeholder: true,
          image: `https://picsum.photos/seed/hdcc-club-${r}-${i}/300/190`,
          name: '',
        })
      }
    }
    rows.push({ items, dur: 28 + r * 8, rev: r % 2 === 1 })
  }
  return rows
})

/** 封面背景：社团图 → 占位随机图 → 分类渐变 */
function wallCoverStyle(club: any) {
  if (club.coverUrl) return { backgroundImage: `url(${club.coverUrl})` }
  if (club.placeholder) return { backgroundImage: `url(${club.image})` }
  return null
}

/** 分类 → 封面渐变色 class（兼容中文分类与英文 key） */
function getCoverClass(category: string): string {
  if (!category) return 'interest'
  if (categoryMap[category]) return categoryMap[category]
  if (['academic', 'art', 'sports', 'public', 'interest'].includes(category)) return category
  return 'interest'
}

function getCategoryLabel(key: string): string {
  const cat = categories.find((c) => c.key === key)
  return cat ? cat.label : key
}

function goClub(id: number): void {
  if (id) router.push(`/clubs/${id}`)
}

function handleCreateClub(): void {
  if (!authStore.isAuthenticated) {
    router.push({ path: '/login', query: { redirect: '/clubs' } })
    return
  }
  message.info('申请创建社团功能即将上线，敬请期待')
}

function onViewAllEvents(): void {
  message.info('活动中心即将上线，敬请期待')
}

async function fetchRecentEvents(): Promise<void> {
  try {
    const d: any = await api.get('/clubs/events/recent', { params: { limit: 5 } })
    recentEvents.value = Array.isArray(d) ? d.filter((e: any) => e.status !== 'cancelled') : []
  } catch { /* ignore */ }
}

async function fetchClubs(): Promise<void> {
  loading.value = true
  try {
    const params: Record<string, unknown> = {}
    if (activeCategory.value !== 'all') params.category = activeCategory.value
    const d: any = await api.get('/clubs', { params })
    clubs.value = d?.list || []
  } catch (err) {
    console.error('获取社团列表失败:', err)
  } finally {
    loading.value = false
  }
}

// 切换分类时重新加载
watch(activeCategory, () => fetchClubs())

function formatActMonth(t: string): string {
  if (!t) return ''
  const d = new Date(t)
  return `${d.getMonth() + 1}月`
}
function formatActDay(t: string): string {
  if (!t) return ''
  const d = new Date(t)
  return String(d.getDate()).padStart(2, '0')
}

/** 液态玻璃高光 — 跟随鼠标 */
function onCardGlare(e: MouseEvent): void {
  const card = e.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100
  card.style.setProperty('--glare-x', `${x}%`)
  card.style.setProperty('--glare-y', `${y}%`)
  card.style.setProperty('--glare-opacity', '0.65')
}

function onCardGlareLeave(e: MouseEvent): void {
  const card = e.currentTarget as HTMLElement
  card.style.setProperty('--glare-opacity', '0')
  card.style.setProperty('--glare-x', '50%')
  card.style.setProperty('--glare-y', '5%')
}

onMounted(() => {
  fetchClubs()
  fetchRecentEvents()
})
</script>

<style scoped>
/* ===== 页面容器 ===== */
.clubs-page {
  min-height: 75vh;
  background: var(--theme-bg-deep);
}

/* ===== Hero 横幅：占满整个屏幕 ===== */
.hero-section {
  position: relative;
  overflow: hidden;
  min-height: 80vh;
  min-height: 80dvh;
  display: flex;
  flex-direction: column;
  padding: 0;
  background: var(--theme-bg-deep);
}

.hero-aurora {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.hero-content {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 16px;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  margin: 0 0 16px;
  letter-spacing: -0.02em;
}

.hero-highlight {
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.7;
  margin: 0 auto 32px;
  max-width: 520px;
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-num {
  font-size: 28px;
  font-weight: 800;
  color: #fff;
  letter-spacing: -0.01em;
}

.stat-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
}

/* ===== 社团封面墙（自动滚动，悬停显示名字） ===== */
/* 封面墙作为前景层撑满 hero，直接叠在极光背景之上 */
.wall-wrap {
  position: relative;
  z-index: 1;
  height: 83vh;
  height: 83dvh;
  padding: 0;
  margin-top: 0;
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
}

.wall-grid {
  /* 斜着铺满全屏：rotate 使左端下移约 90px（视口 1280 宽时），translateY 补偿、高度加长，让斜墙覆盖整个屏幕 */
  transform: rotate(-8deg) translateY(-43px);
  transform-origin: top center;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  gap: 10px;
  width: 100%;
  height: calc(100% + 80px);
  margin: 0 auto;
}

.wall-row {
  display: flex;
  gap: 16px;
  width: max-content;
  animation: wallScroll var(--dur, 30s) linear infinite;
  animation-direction: var(--dir, normal);
  will-change: transform;
}

@keyframes wallScroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

.wall-card {
  /* 卡片大小随视口变化：高约占屏高 30%（3 行铺满），宽按比例自适应 */
  width: clamp(300px, 20vh, 460px);
  height: clamp(200px, 15vh, 320px);
  flex-shrink: 0;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.3s ease;
}
.wall-card:hover {
  transform: translateY(-4px) scale(1.03);
  border-color: rgba(147, 197, 253, 0.5);
}

.wall-cover {
  position: relative;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wall-icon {
  width: clamp(40px, 7vh, 64px);
  height: clamp(40px, 7vh, 64px);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.wall-name {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(5, 7, 13, 0.65);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  color: #fff;
  font-size: clamp(13px, 2.2vh, 20px);
  font-weight: 600;
  letter-spacing: 0.06em;
  opacity: 0;
  transition: opacity 0.3s ease;
}
.wall-card:hover .wall-name { opacity: 1; }

/* ===== 主容器 ===== */
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 60px;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
  align-items: start;
}

/* ===== 筛选栏 ===== */
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: var(--radius-full);
  font-size: 14px;
  font-weight: 500;
  color: var(--theme-text-secondary);
  background: var(--theme-card-bg);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid var(--theme-card-border);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-chip:hover {
  border-color: var(--theme-border-strong);
  color: var(--theme-text-primary);
  background: var(--theme-card-hover);
}

.filter-chip.active {
  background: color-mix(in srgb, var(--theme-primary) 22%, transparent);
  color: color-mix(in srgb, var(--theme-primary) 60%, white);
  border-color: color-mix(in srgb, var(--theme-primary) 40%, transparent);
}

/* ===== 社团卡片网格 ===== */
.clubs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.club-card {
  position: relative;
  background: var(--theme-card-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--theme-card-border);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.02),
    0 4px 24px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  transition: all var(--transition-base);
  text-decoration: none;
  color: inherit;
  opacity: 0;
  transform: translateY(20px);
  animation: cardFadeIn var(--duration-slow) var(--ease-out-expo) forwards;
}

@keyframes cardFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.club-card:hover {
  transform: translateY(-4px);
  background: var(--theme-card-hover);
  border-color: var(--theme-border-strong);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.04),
    0 8px 32px rgba(0, 0, 0, 0.45);
}

/* === 鼠标光晕 === */
.club-card::after,
.sidebar-card::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 5;
  border-radius: inherit;
  background: radial-gradient(
    ellipse 70% 50% at var(--glare-x, 50%) var(--glare-y, 5%),
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.03) 40%,
    transparent 70%
  );
  opacity: var(--glare-opacity, 0);
  transition: opacity 0.3s ease;
}

/* 卡片封面 */
.card-cover {
  position: relative;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.card-cover.cover-academic {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}
.card-cover.cover-art {
  background: linear-gradient(135deg, #a855f7 0%, #7c3aed 100%);
}
.card-cover.cover-sports {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}
.card-cover.cover-public {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}
.card-cover.cover-interest {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
}

.cover-pattern {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle at 30% 70%, rgba(255,255,255,0.15) 1px, transparent 1px);
  background-size: 24px 24px;
}

.cover-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px) saturate(160%);
  -webkit-backdrop-filter: blur(10px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  position: relative;
  z-index: 1;
}

.cover-category {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  color: rgba(255, 255, 255, 0.9);
  font-size: 11px;
  font-weight: 600;
}

/* 卡片内容 */
.card-body {
  padding: 18px 20px 20px;
}

.card-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--theme-text-primary);
  margin: 0 0 2px;
}

.card-desc {
  font-size: 13px;
  color: var(--theme-text-secondary);
  line-height: 1.55;
  margin: 0 0 12px;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.tag {
  padding: 3px 10px;
  border-radius: var(--radius-xs);
  background: var(--theme-card-hover);
  border: 1px solid var(--theme-card-border);
  color: var(--theme-text-secondary);
  font-size: 12px;
  font-weight: 500;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid var(--theme-card-border);
}

.footer-info {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
  color: var(--theme-text-muted);
}

.footer-arrow {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.45);
  transition: all var(--transition-fast);
}

.club-card:hover .footer-arrow {
  color: #60a5fa;
  transform: translateX(3px);
}

/* ===== 空状态 ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  color: var(--theme-text-muted);
  font-size: 15px;
  gap: 12px;
}

/* ===== 侧边栏 ===== */
.clubs-sidebar {
  position: sticky;
  top: 88px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  position: relative;
  background: var(--theme-card-bg);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: var(--radius-lg);
  border: 1px solid var(--theme-card-border);
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.02),
    0 4px 24px rgba(0, 0, 0, 0.35);
  padding: 20px;
}

.sidebar-card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: var(--theme-text-primary);
  margin-bottom: 16px;
}

/* 活动列表 */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 10px 0;
  cursor: pointer;
}

.activity-item + .activity-item {
  border-top: 1px solid var(--theme-card-border);
}

.act-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--theme-primary) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--theme-primary) 18%, transparent);
  flex-shrink: 0;
}

.act-date-month {
  font-size: 10px;
  font-weight: 700;
  color: var(--theme-primary);
  line-height: 1;
}

.act-date-day {
  font-size: 16px;
  font-weight: 800;
  color: var(--theme-primary);
  line-height: 1.2;
}

.act-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.act-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--theme-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.act-club {
  font-size: 12px;
  color: var(--theme-text-muted);
}

.activity-empty { text-align: center; padding: 24px; color: var(--theme-text-muted); font-size: 13px; }

.view-all-btn {
  display: block; width: 100%; margin-top: 12px; padding: 10px;
  background: var(--theme-card-bg);
  border: 1px solid var(--theme-card-border);
  color: var(--theme-text-secondary);
  border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; font-family: inherit;
  transition: all .2s;
}
.view-all-btn:hover { background: var(--theme-card-hover); color: var(--theme-text-primary); border-color: var(--theme-border-strong); }

/* 为什么加入 */
.why-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.why-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: var(--theme-text-secondary);
  line-height: 1.5;
}

.why-list li svg {
  flex-shrink: 0;
  margin-top: 2px;
}

/* ===== CTA 区域 ===== */
.cta-section {
  background: var(--theme-card-bg);
  border-top: 1px solid var(--theme-card-border);
  padding: 60px 24px;
}

.cta-inner {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.cta-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--theme-text-primary);
  margin: 0 0 12px;
}

.cta-desc {
  font-size: 15px;
  color: var(--theme-text-secondary);
  line-height: 1.6;
  margin: 0 0 28px;
}

.cta-wrap {
  position: relative;
  display: inline-block;
}
.cta-star {
  display: block;
}
.cta-star :deep(.sb-content) {
  padding: 13px 32px;
  font-size: 15px;
  font-weight: 700;
  /* 透明背景 + 光晕边框，字体随主题切换 */
  background: transparent;
  color: var(--theme-text-primary);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.cta-star :deep(.sb-label) {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.cta-star:hover:not(:disabled) :deep(.sb-content) {
  border-color: rgba(147, 197, 253, 0.75);
  box-shadow: 0 8px 30px rgba(124, 58, 237, 0.35);
}
/* 透明背景下光晕会穿透显示，压暗以免抢眼 */
.cta-star :deep(.sb-glow) {
  filter: opacity(0.22);
}

/* ===== 骨架屏 ===== */
.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.club-card-skeleton {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

.skeleton-cover {
  height: 120px;
  background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-line {
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line.w-60 { width: 60%; }
.skeleton-line.w-80 { width: 80%; }
.skeleton-line.w-40 { width: 40%; }

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* ===== 响应式 ===== */
@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .clubs-sidebar {
    position: static;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 80px 20px 48px;
  }

  .hero-title {
    font-size: 32px;
  }

  .hero-desc {
    font-size: 14px;
  }

  .hero-stats {
    gap: 20px;
  }

  .stat-num {
    font-size: 22px;
  }

  .clubs-grid {
    grid-template-columns: 1fr;
  }

  .main-container {
    padding: 24px 16px 40px;
  }

  .cta-title {
    font-size: 24px;
  }
}
</style>
