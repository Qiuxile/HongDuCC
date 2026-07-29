import { ref } from 'vue'

type Theme = 'light' | 'dark'

const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'light')

function applyTheme(t: Theme) {
  document.documentElement.setAttribute('data-theme', t)
  localStorage.setItem('theme', t)
  theme.value = t
}

function toggleTheme() {
  applyTheme(theme.value === 'dark' ? 'light' : 'dark')
}

// Init on load
applyTheme(theme.value)

export function useTheme() {
  return { theme, toggleTheme, applyTheme }
}
