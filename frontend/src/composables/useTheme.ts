import { ref, computed } from 'vue'
import { themes, applyThemeTokens, naiveOverrides, type ThemeId } from '@/theme'

const theme = ref<ThemeId>((localStorage.getItem('theme') as ThemeId) || 'dark')

function applyTheme(t: ThemeId) {
  const target = themes[t] ?? themes.dark
  document.documentElement.setAttribute('data-theme', t)
  applyThemeTokens(target)
  localStorage.setItem('theme', t)
  theme.value = t
}

function toggleTheme() {
  applyTheme(theme.value === 'dark' ? 'light' : 'dark')
}

// Init on load
applyTheme(theme.value)

export function useTheme() {
  /** naive-ui 组件主题覆盖（跟随当前主题 token） */
  const themeOverrides = computed(() => naiveOverrides(themes[theme.value] ?? themes.dark))
  /** 当前主题 token */
  const themeTokens = computed(() => themes[theme.value] ?? themes.dark)
  return { theme, themeTokens, themeOverrides, toggleTheme, applyTheme }
}
