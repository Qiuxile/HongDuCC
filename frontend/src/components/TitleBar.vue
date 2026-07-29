<template>
  <header>
    <div class="navbar-inner">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <img class="logo-img" :src="logo_img" alt="洪都中学" />
        <img class="logo-title" :src="logo_title" alt="洪都中学" />
      </router-link>

      <!-- 桌面导航 -->
      <nav class="nav-links">
        <router-link
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          :class="['nav-link', { active: route.path === link.path || route.path.startsWith(link.path + '/') }]"
        >
          {{ link.name }}
          <span class="nav-underline" />
        </router-link>
      </nav>

      </div>
  </header>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

import logo_img from '@/assets/logo/logo.png'
import logo_title from '@/assets/logo/logo_title.png'

interface NavLink {
  name: string
  path: string
}

const route = useRoute()

const navLinks: NavLink[] = [
  { name: '新闻公告', path: '/news' },
  { name: '学校概况', path: '/about' },
  { name: '校园论坛', path: '/forum' },
  { name: '学习资源', path: '/resources' },
  { name: '社团活动', path: '/clubs' },
]

</script>

<style scoped>
/* ===== 导航栏基础 ===== */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent);
  transition:
    background var(--transition-base),
    backdrop-filter var(--transition-base);
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  gap: 40px;
}

/* ===== Logo ===== */
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  transition: all var(--transition-base);
}

.logo-img {
  height: 36px;
  width: auto;
  filter: brightness(10);
  transition: all var(--transition-base);
}

.logo-title {
  height: 26px;
  width: auto;
  filter: brightness(10);
  transition: all var(--transition-base);
}

/* ===== 导航链接 ===== */
.nav-links {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.nav-link {
  position: relative;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  transition:
    color var(--transition-base),
    background var(--transition-base);
  white-space: nowrap;
  letter-spacing: 0.01em;
  text-decoration: none;
}

.nav-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.12);
}

.nav-link.active {
  color: #fff;
}

.nav-underline {
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 20px;
  height: 2.5px;
  background: var(--color-accent);
  border-radius: var(--radius-full);
  transition: transform var(--transition-spring);
}

.nav-link.active .nav-underline,
.nav-link:hover .nav-underline {
  transform: translateX(-50%) scaleX(1);
}

</style>