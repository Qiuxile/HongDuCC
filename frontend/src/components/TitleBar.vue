<template>
  <header class="navbar" :class="{ 'menu-open': mobileOpen, fullscreen: isTransitioning, 'no-transition': noTransition }">
    <div class="navbar-inner">
      <!-- Logo -->
      <router-link :ref="setLogoRef" to="/" class="logo" :style="logoFlyStyle">
        <img class="logo-img" :src="logo_img" alt="洪都中学" />
        <img class="logo-title" :src="logo_title" alt="洪都中学" />
      </router-link>

      <!-- 桌面导航 -->
      <nav ref="navLinksRef" class="nav-links" :style="navLinksFlyStyle">
        <router-link
          v-for="link in navLinks" :key="link.path" :to="link.path"
          :class="['nav-link', { active: isActive(link.path) }]">
          {{ link.name }}
          <span class="nav-underline" />
        </router-link>
      </nav>

      <!-- 深浅主题切换 -->
      <button class="theme-toggle" :aria-label="isDark ? '切换浅色主题' : '切换深色主题'" :title="isDark ? '切换浅色主题' : '切换深色主题'" @click="toggleTheme">
        <svg v-if="isDark" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
        <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </button>

      <div class="nav-actions">
        <template v-if="!isAuth">
          <router-link to="/login" class="btn-login">登录</router-link>
          <div class="reg-wrap">
            <StarBorder
              as="router-link"
              to="/register"
              class="reg-star"
              color="#7c3aed"
              speed="5s"
              :border-radius="8"
            >
              注册
            </StarBorder>
          </div>
        </template>
        <template v-else>
          <n-dropdown color="#000" trigger="hover" :options="userOptions" @select="onUserMenu">
            <span class="user-name">{{ userNick }}</span>
          </n-dropdown>
        </template>

        <!-- 汉堡菜单按钮 -->
        <button class="hamburger" @click="mobileOpen = !mobileOpen" aria-label="菜单">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- 移动端菜单遮罩 -->
    <transition name="mobile-overlay">
      <div v-if="mobileOpen" class="mobile-overlay" @click="mobileOpen = false">
        <transition name="mobile-menu">
          <nav v-if="mobileOpen" class="mobile-menu" @click.stop>
            <router-link v-for="(link, i) in navLinks" :key="link.path" :to="link.path"
              :class="['mobile-link', { active: isActive(link.path) }]" :style="{ transitionDelay: `${i * 60}ms` }" @click="mobileOpen = false">
              {{ link.name }}
            </router-link>
            <div class="mobile-divider" :style="{ transitionDelay: `${navLinks.length * 60}ms` }"></div>
            <template v-if="!isAuth">
              <router-link to="/login" class="mobile-link" :style="{ transitionDelay: `${(navLinks.length + 1) * 60}ms` }" @click="mobileOpen = false">登录</router-link>
              <router-link to="/register" class="mobile-link highlight" :style="{ transitionDelay: `${(navLinks.length + 2) * 60}ms` }" @click="mobileOpen = false">注册</router-link>
            </template>
            <template v-else>
              <router-link to="/profile" class="mobile-link" :style="{ transitionDelay: `${(navLinks.length + 1) * 60}ms` }" @click="mobileOpen = false">个人中心</router-link>
              <a class="mobile-link danger" :style="{ transitionDelay: `${(navLinks.length + 2) * 60}ms` }" @click="logout">退出登录</a>
            </template>
          </nav>
        </transition>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NDropdown, type DropdownOption } from 'naive-ui'
import logo_img from '@/assets/logo/logo.png'
import logo_title from '@/assets/logo/logo_title.png'
import { getMe } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'
import StarBorder from '@/components/StarBorder.vue'

interface NavLink { name: string; path: string }

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
// 基于 Pinia 响应式状态，登录/登出后导航栏立即更新
const isAuth = computed(() => authStore.isAuthenticated)
const userNick = ref('')
// 主题切换
const { theme, toggleTheme } = useTheme()
const isDark = computed(() => theme.value === 'dark')
const mobileOpen = ref(false)
/** 初始化加载界面：初次进入即处于全屏状态（标题栏盖满、Logo 居中放大、导航居中），加载完毕后平滑收回 */
const isTransitioning = ref(true)
const noTransition = ref(true) // 初始无过渡，收回时恢复过渡

/* 校徽 Logo 飞行到屏幕中心并逐渐放大 */
const logoRef = ref<HTMLElement | null>(null)
/** router-link 是组件，ref 需解出真实 DOM 元素（$el） */
function setLogoRef(el: unknown) {
  const node = (el as { $el?: HTMLElement } | null)?.$el ?? (el as HTMLElement | null)
  logoRef.value = node ?? null
}
const logoFlyStyle = ref<Record<string, string> | null>(null)
function computeLogoFly() {
  const el = logoRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2
  logoFlyStyle.value = {
    transform: `translate(calc(50vw - ${cx}px), calc(50vh - ${cy}px)) scale(2.8)`,
  }
}

/* 导航链接水平居中（垂直位置不变，仅左右滑到中央） */
const navLinksRef = ref<HTMLElement | null>(null)
const navLinksFlyStyle = ref<Record<string, string> | null>(null)
function computeNavFly() {
  const el = navLinksRef.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const cx = r.left + r.width / 2
  navLinksFlyStyle.value = {
    transform: `translateX(calc(50vw - ${cx}px))`,
  }
}

const userOptions: DropdownOption[] = [
  { label: '个人中心', key: 'profile' },
  { label: '管理后台', key: 'admin' },
  { type: 'divider' },
  { label: '退出登录', key: 'logout' },
]

const navLinks: NavLink[] = [
  { name: '新闻公告', path: '/news' },
  { name: '学校概况', path: '/about' },
  { name: '学习资源', path: '/resources' },
  { name: '社团活动', path: '/clubs' },
]

function isActive(path: string) { return route.path === path || route.path.startsWith(path + '/') }

function onUserMenu(key: string) {
  if (key === 'profile') router.push('/profile')
  else if (key === 'admin') router.push('/admin')
  else if (key === 'logout') logout()
}

function logout() {
  authStore.logout()
  mobileOpen.value = false
  router.go(0)
}

watch(() => route.path, () => { mobileOpen.value = false })
watch(mobileOpen, (v) => { document.body.style.overflow = v ? 'hidden' : '' })

onMounted(async () => {
  // 初始渲染已处于全屏（加载界面），先定位 Logo 与导航的居中位置
  try {
    computeLogoFly()
    computeNavFly()
  } catch (err) {
    console.error('初始化加载界面定位失败:', err)
  }

  // 等加载完毕：路由就绪（含懒加载 chunk）+ 首屏数据缓冲，然后平滑收回
  try { await router.isReady() } catch { /* ignore */ }
  await new Promise<void>((r) => setTimeout(r, 700))

  // 先恢复过渡，强制浏览器应用 transition（同一帧改会被跳过导致突然消失）
  noTransition.value = false
  void document.body.offsetHeight // 强制重排，确保 transition 已生效
  requestAnimationFrame(() => {
    // 下一帧再移除全屏 → 平滑收回：Logo 飞回左上、导航滑回右侧、标题栏收回
    isTransitioning.value = false
    logoFlyStyle.value = null
    navLinksFlyStyle.value = null
  })

  if (isAuth.value) {
    try {
      const u: any = await getMe()
      userNick.value = u.nickname
      const saved = JSON.parse(localStorage.getItem('user') || '{}')
      saved.role = u.role
      localStorage.setItem('user', JSON.stringify(saved))
    } catch {}
  }
})
</script>

<style scoped>
/* ===== 导航栏 ===== */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  height: 64px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.55) 0%, transparent 100%);
  transition: height 0.7s cubic-bezier(0.16, 1, 0.3, 1), background 0.7s ease;
}

/* 页面切换过渡：标题栏延展盖满全屏 */
.navbar.fullscreen {
  height: 100vh;
  background: #0a0e18;
}

/* 加载界面阶段为瞬变（无延展、无滑入），仅保留收回动画 */
.navbar.no-transition,
.navbar.no-transition .logo,
.navbar.no-transition .nav-links {
  transition: none !important;
}

.navbar-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 64px;
  display: flex; align-items: center; gap: 40px;
}

/* ===== Logo ===== */
.logo {
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}
.logo:hover { transform: scale(1.04); }

.logo-img {
  height: 36px; width: auto; filter: brightness(10);
  transition: filter 0.35s ease, transform 0.25s ease;
}
.logo-title {
  height: 26px; width: auto; filter: brightness(10);
  transition: filter 0.35s ease;
}

/* ===== 导航链接 ===== */
.nav-links { display: flex; gap: 2px; margin-left: auto; transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1); }

.nav-link {
  position: relative; padding: 8px 16px; font-size: 14px; font-weight: 500;
  color: rgba(255, 255, 255, 0.82); border-radius: 8px;
  text-decoration: none; white-space: nowrap;
  transition: color 0.25s ease, background 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.nav-link:hover {
  color: #fff; background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}
.nav-link.active { color: #fff; font-weight: 600; }

/* ===== 主题切换按钮 ===== */
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  margin-left: 6px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  transform: rotate(20deg);
}
.theme-toggle svg { display: block; }

/* 下划线 */
.nav-underline {
  position: absolute; bottom: 3px; left: 50%;
  width: 18px; height: 2.5px;
  background: #fff;
  border-radius: 2px;
  transform: translateX(-50%) scaleX(0);
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0.9;
}
.nav-link.active .nav-underline { transform: translateX(-50%) scaleX(1); width: 24px; background: var(--color-accent, #372c6d); }
.nav-link:hover .nav-underline { transform: translateX(-50%) scaleX(0.7); }

/* ===== 用户区域 ===== */
.nav-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

.btn-login {
  color: rgba(255, 255, 255, 0.85); font-size: 13px; font-weight: 500;
  text-decoration: none; padding: 7px 16px; border-radius: 8px;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.btn-login:hover { color: #fff; background: rgba(255, 255, 255, 0.1); transform: translateY(-1px); }

/* 注册按钮：StarBorder 样式 */
.reg-wrap {
  position: relative;
  display: inline-block;
}
.reg-star {
  display: block;
}
.reg-star :deep(.sb-content) {
  padding: 7px 18px;
  font-size: 13px;
  font-weight: 600;
  background: transparent;
}
.reg-star:hover:not(:disabled) :deep(.sb-content) {
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 16px rgba(124, 58, 237, 0.4);
}
/* 透明背景下光晕会穿透显示，压暗以免抢眼 */
.reg-star :deep(.sb-glow) {
  filter: opacity(0.22);
}

.user-name {
  color: rgba(255, 255, 255, 0.85); font-size: 13px; font-weight: 500;
  cursor: pointer; padding: 7px 14px; border-radius: 8px;
  transition: all 0.25s ease;
}
.user-name:hover { color: #fff; background: rgba(255, 255, 255, 0.1); }

/* ===== 汉堡按钮 ===== */
.hamburger {
  display: none; flex-direction: column; justify-content: center; gap: 5px;
  width: 36px; height: 36px; padding: 8px; border: none; border-radius: 8px;
  background: none; cursor: pointer; transition: background 0.2s; position: absolute; right: 10px;
}
.hamburger:hover { background: rgba(255, 255, 255, 0.1); }
.hamburger span {
  display: block; height: 2px; background: #fff; border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.menu-open .hamburger span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.menu-open .hamburger span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.menu-open .hamburger span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* ===== 移动端菜单面板 ===== */
.mobile-overlay {
  position: fixed; inset: 0; top: 64px; z-index: 998;
}
.mobile-overlay-enter-active { transition: opacity 0.25s ease; }
.mobile-overlay-leave-active { transition: opacity 0.15s ease; }
.mobile-overlay-enter-from,
.mobile-overlay-leave-to { opacity: 0; }

.mobile-menu {
  z-index: 999;
  margin: 10px;
  padding: 8px;
  border-radius: 16px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  /* 跟随主题的毛玻璃背景 */
  background: var(--theme-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--theme-card-border);
}
.mobile-menu-enter-active { transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.mobile-menu-leave-active { transition: all 0.2s ease-in; }
.mobile-menu-enter-from { opacity: 0; transform: translateY(-20px); }
.mobile-menu-leave-to   { opacity: 0; transform: translateY(-20px); }

.mobile-link {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 18px; font-size: 16px; font-weight: 500;
  color: var(--theme-text-secondary); border-radius: 12px;
  text-decoration: none; transition: all 0.3s ease;
}
.mobile-menu-enter-from .mobile-link,
.mobile-menu-leave-to .mobile-link { opacity: 0; transform: translateY(8px); }

.mobile-link:hover,
.mobile-link.active { color: var(--theme-text-primary); background: var(--theme-card-hover); }
.mobile-link.highlight { color: var(--theme-primary); font-weight: 600; }
.mobile-link.danger { color: #ff6b6b; }
.mobile-divider { height: 1px; background: var(--theme-card-border); margin: 4px 0; }

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .navbar-inner { padding: 0 16px; gap: 12px; }
  .nav-links { display: none; }
  .nav-actions .btn-login,
  .nav-actions .reg-wrap,
  .nav-actions .user-name { display: none; }
  .hamburger { display: flex; }
  .logo-img { height: 30px; }
  .logo-title { height: 22px; }
}
</style>
