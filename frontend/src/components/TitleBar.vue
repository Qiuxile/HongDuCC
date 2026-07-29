<template>
  <header class="navbar" :class="{ scrolled, 'menu-open': mobileOpen }">
    <div class="navbar-inner">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <img class="logo-img" :src="logo_img" alt="洪都中学" />
        <img class="logo-title" :src="logo_title" alt="洪都中学" />
      </router-link>

      <!-- 桌面导航 -->
      <nav class="nav-links">
        <router-link
          v-for="link in navLinks" :key="link.path" :to="link.path"
          :class="['nav-link', { active: isActive(link.path) }]">
          {{ link.name }}
          <span class="nav-underline" />
        </router-link>
      </nav>

      <div class="nav-actions">
        <template v-if="!isAuth">
          <router-link to="/login" class="btn-login">登录</router-link>
          <router-link to="/register" class="btn-register">注册</router-link>
        </template>
        <template v-else>
          <n-dropdown trigger="hover" :options="userOptions" @select="onUserMenu">
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
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NDropdown, type DropdownOption } from 'naive-ui'
import logo_img from '@/assets/logo/logo.png'
import logo_title from '@/assets/logo/logo_title.png'
import { getMe } from '@/api/auth'

interface NavLink { name: string; path: string }

const route = useRoute()
const router = useRouter()
const isAuth = computed(() => !!localStorage.getItem('token'))
const userNick = ref('')
const scrolled = ref(false)
const mobileOpen = ref(false)

const userOptions: DropdownOption[] = [
  { label: '个人中心', key: 'profile' },
  { label: '管理后台', key: 'admin' },
  { type: 'divider' },
  { label: '退出登录', key: 'logout' },
]

const navLinks: NavLink[] = [
  { name: '新闻公告', path: '/news' },
  { name: '学校概况', path: '/about' },
  { name: '校园论坛', path: '/forum' },
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
  localStorage.removeItem('token'); localStorage.removeItem('user')
  mobileOpen.value = false; router.go(0)
}

function onScroll() { scrolled.value = window.scrollY > 60 }

watch(() => route.path, () => { mobileOpen.value = false })
watch(mobileOpen, (v) => { document.body.style.overflow = v ? 'hidden' : '' })

onMounted(async () => {
  window.addEventListener('scroll', onScroll, { passive: true })
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
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>

<style scoped>
/* ===== 导航栏 ===== */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.55) 0%, transparent 100%);
  transition: background 0.35s ease, backdrop-filter 0.35s ease;
  animation: navIn 0.5s ease-out both;
}
.navbar.scrolled {
  background: rgba(10, 14, 24, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.06);
}

@keyframes navIn {
  from { opacity: 0; transform: translateY(-100%); }
  to   { opacity: 1; transform: translateY(0); }
}

.navbar-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 24px; height: 64px;
  display: flex; align-items: center; gap: 40px;
}

/* ===== Logo ===== */
.logo {
  display: flex; align-items: center; gap: 10px; flex-shrink: 0;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
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
.nav-links { display: flex; gap: 2px; margin-left: auto; }

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

.btn-register {
  color: #fff; font-size: 13px; font-weight: 600; text-decoration: none;
  padding: 7px 18px; border-radius: 8px;
  background: var(--color-accent, #372c6d);
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.btn-register:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(24, 144, 255, 0.45); }

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
  background: rgba(183, 184, 186, 0.825);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.mobile-menu-enter-active { transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.mobile-menu-leave-active { transition: all 0.2s ease-in; }
.mobile-menu-enter-from { opacity: 0; transform: translateY(-20px); }
.mobile-menu-leave-to   { opacity: 0; transform: translateY(-20px); }

.mobile-link {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 18px; font-size: 16px; font-weight: 500;
  color: rgba(62, 62, 62, 0.82); border-radius: 12px;
  text-decoration: none; transition: all 0.3s ease;
}
.mobile-menu-enter-from .mobile-link,
.mobile-menu-leave-to .mobile-link { opacity: 0; transform: translateY(8px); }

.mobile-link:hover,
.mobile-link.active { color: #070707; background: rgba(255, 255, 255, 0.08); }
.mobile-link.highlight { color: var(--color-accent, #1890ff); font-weight: 600; }
.mobile-link.danger { color: #ff6b6b; }
.mobile-divider { height: 1px; background: rgba(255, 255, 255, 0.08); margin: 4px 0; }

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .navbar-inner { padding: 0 16px; gap: 12px; }
  .nav-links { display: none; }
  .nav-actions .btn-login,
  .nav-actions .btn-register,
  .nav-actions .user-name { display: none; }
  .hamburger { display: flex; }
  .logo-img { height: 30px; }
  .logo-title { height: 22px; }
}
</style>
