/**
 * 主题系统：集中定义色彩搭配，支持多主题切换与扩展。
 *
 * 每个主题是一组 Token（页面背景/卡片/文字/品牌色/渐变），
 * 通过 applyThemeTokens 注入为全局 CSS 变量（--theme-*），
 * 页面样式统一引用这些变量，切换主题即全局换肤。
 */

export interface ThemeTokens {
  id: string
  label: string
  /** 页面背景 */
  bgPage: string
  /** 更深的背景（Hero、强调区） */
  bgDeep: string
  /** 卡片背景 / hover / 边框 */
  cardBg: string
  cardHover: string
  cardBorder: string
  /** 文字层级 */
  textPrimary: string
  textSecondary: string
  textMuted: string
  /** 品牌色 */
  primary: string
  primaryHover: string
  accent: string
  /** 主渐变 */
  gradient: string
  /** 光晕 / 发光色 */
  glow: string
  /** 输入框背景 */
  inputBg: string
  /** 强调边框 */
  borderStrong: string
  /** 页面遮罩（用于渐变背景上的对比层） */
  overlay: string
  /** 毛玻璃卡片背景 */
  glass: string
  /** naive-ui 组件主题覆盖 */
  naive: Record<string, string>
}

/* ---------- 主题定义 ---------- */

/** 深色主题：洪都蓝紫（登录页色彩搭配） */
export const darkTheme: ThemeTokens = {
  id: 'dark',
  label: '深色 · 洪都蓝紫',
  /* 带蓝紫光晕的深色渐变背景，比纯色更有层次 */
  bgPage:
    'radial-gradient(ellipse 90% 65% at 50% -12%, rgba(37, 99, 235, 0.14), transparent 62%),' +
    'radial-gradient(ellipse 70% 55% at 105% 110%, rgba(124, 58, 237, 0.12), transparent 60%),' +
    'radial-gradient(ellipse 55% 45% at -8% 85%, rgba(6, 182, 212, 0.08), transparent 58%),' +
    '#0c1122',
  bgDeep: '#101730',
  cardBg: 'rgba(255, 255, 255, 0.03)',
  cardHover: 'rgba(255, 255, 255, 0.06)',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  textPrimary: 'rgba(255, 255, 255, 0.92)',
  textSecondary: 'rgba(255, 255, 255, 0.6)',
  textMuted: 'rgba(255, 255, 255, 0.4)',
  primary: '#2563eb',
  primaryHover: '#3b82f6',
  accent: '#7c3aed',
  gradient: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
  glow: '#7c3aed',
  inputBg: 'rgba(0, 0, 0, 0.35)',
  borderStrong: '#2a3648',
  overlay: 'rgba(5, 7, 13, 0.45)',
  glass: 'rgba(13, 18, 30, 0.55)',
  naive: {},
}

/** 浅色主题（保留，便于切换或后续扩展） */
export const lightTheme: ThemeTokens = {
  id: 'light',
  label: '浅色',
  bgPage: '#f5f6f8',
  bgDeep: '#eef1f6',
  cardBg: '#ffffff',
  cardHover: '#f8f9fa',
  cardBorder: '#eee',
  textPrimary: '#1a1a2e',
  textSecondary: '#666',
  textMuted: '#999',
  primary: '#1e3a5f',
  primaryHover: '#2d5a8e',
  accent: '#372c6d',
  gradient: 'linear-gradient(135deg, #1e3a5f 0%, #372c6d 100%)',
  glow: '#4a90d9',
  inputBg: 'rgba(255, 255, 255, 0.5)',
  borderStrong: '#e0e0e0',
  overlay: 'rgba(255, 255, 255, 0.4)',
  glass: 'rgba(255, 255, 255, 0.75)',
  naive: {},
}

/** 已注册的主题（新增主题在此登记即可） */
export const themes: Record<string, ThemeTokens> = {
  dark: darkTheme,
  light: lightTheme,
}

export type ThemeId = keyof typeof themes

/* ---------- 工具 ---------- */

/** 生成 naive-ui 的 theme-overrides（组件主题跟随当前主题 token） */
export function naiveOverrides(t: ThemeTokens) {
  return {
    common: {
      primaryColor: t.primary,
      primaryColorHover: t.primaryHover,
      /* naive-ui 组件 body 用纯色（渐变可能不兼容） */
      bodyColor: t.bgDeep,
      cardColor: t.cardBg,
      textColor1: t.textPrimary,
      textColor2: t.textSecondary,
      textColor3: t.textMuted,
      borderColor: t.cardBorder,
      inputColor: t.inputBg,
    },
  }
}

/** 把主题 token 注入为全局 CSS 变量（--theme-*），供页面样式引用 */
export function applyThemeTokens(t: ThemeTokens) {
  const root = document.documentElement.style
  const vars: [string, string][] = [
    ['--theme-bg-page', t.bgPage],
    ['--theme-bg-deep', t.bgDeep],
    ['--theme-card-bg', t.cardBg],
    ['--theme-card-hover', t.cardHover],
    ['--theme-card-border', t.cardBorder],
    ['--theme-text-primary', t.textPrimary],
    ['--theme-text-secondary', t.textSecondary],
    ['--theme-text-muted', t.textMuted],
    ['--theme-primary', t.primary],
    ['--theme-primary-hover', t.primaryHover],
    ['--theme-accent', t.accent],
    ['--theme-gradient', t.gradient],
    ['--theme-glow', t.glow],
    ['--theme-input-bg', t.inputBg],
    ['--theme-border-strong', t.borderStrong],
    ['--theme-overlay', t.overlay],
    ['--theme-glass', t.glass],
  ]
  for (const [k, v] of vars) root.setProperty(k, v)
}
