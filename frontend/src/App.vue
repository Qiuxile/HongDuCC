<template>
  <n-message-provider>
    <n-config-provider :theme-overrides="themeOverrides">
      <div id="app">
        <title-bar />
        <router-view v-slot="{ Component }">
          <transition name="slide-up" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </n-config-provider>
  </n-message-provider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NMessageProvider, NConfigProvider } from 'naive-ui'
import { useTheme } from '@/composables/useTheme'
import TitleBar from '@/components/TitleBar.vue'

const { theme } = useTheme()

const isDark = computed(() => theme.value === 'dark')

const themeOverrides = computed(() => ({
  common: {
    primaryColor: isDark.value ? '#4a90d9' : '#1e3a5f',
    primaryColorHover: isDark.value ? '#5da0e8' : '#2d5a8e',
    bodyColor: isDark.value ? '#0f1117' : '#f5f6f8',
    cardColor: isDark.value ? '#1a1c24' : '#ffffff',
    textColor1: isDark.value ? '#e8e8ed' : '#1a1a2e',
    textColor2: isDark.value ? '#9ca3af' : '#666',
    borderColor: isDark.value ? '#2a2c38' : '#eee',
    inputColor: isDark.value ? '#1e2030' : '#f5f6f8',
  },
}))
</script>
