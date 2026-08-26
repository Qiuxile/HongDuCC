<template>
  <n-message-provider>
    <n-config-provider :theme-overrides="themeOverrides">
      <div id="app">
        <title-bar />
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </n-config-provider>
  </n-message-provider>
</template>

<script setup lang="ts">
import { NMessageProvider, NConfigProvider } from 'naive-ui'
import { useTheme } from '@/composables/useTheme'
import TitleBar from '@/components/TitleBar.vue'

const { themeOverrides } = useTheme()
</script>

<style scoped>
/* 页面切换过渡间隙露出主题深色底，避免闪烁浅色 */
#app {
  min-height: 100vh;
  background: var(--theme-bg-page, #05070d);
}
</style>
