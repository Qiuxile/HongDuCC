<template>
<div class="auth-page">
  <!-- 动态背景：彩色弯曲带（全屏固定，外包一层避开组件根样式冲突） -->
  <div class="auth-bg">
    <ColorBends
      :colors="['#2563eb', '#7c3aed', '#06b6d4', '#1e3a5f']"
      :speed="0.25"
      :intensity="1.2"
      :scale="1.5"
      :frequency="1.1"
      :warp-strength="1.2"
      :parallax="0.4"
      :band-width="5"
      :noise="0.06"
      :rotation="120"
      transparent
    />
  </div>
  <div class="bg-overlay" />

  <div class="auth-wrap">
      <n-config-provider :theme="isDark ? darkTheme : lightTheme" :theme-overrides="themeOverrides">
      <div class="auth-card">
        <div class="card-logo">
          <img :src="logo" alt="洪都中学" :style="isDark ? { filter: 'brightness(10)' } : {}" />
        </div>
        <h1 class="card-title">洪都中学智慧校园</h1>
        <p class="card-subtitle">登录或注册，开启校园生活</p>

        <!-- 登录表单 -->
        <transition name="tab" mode="out-in">
          <div v-if="current === 'login'" key="login" class="tab-panel">
            <n-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
              <n-form-item path="studentId">
                <n-input v-model:value="loginForm.studentId" placeholder="学号" :input-props="{ autocomplete: 'username' }">
                  <template #prefix>
                    <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item path="password">
                <n-input v-model:value="loginForm.password" type="password" show-password-on="click" placeholder="密码" :input-props="{ autocomplete: 'current-password' }" @keyup.enter="handleLogin">
                  <template #prefix>
                    <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </template>
                </n-input>
              </n-form-item>
            </n-form>
            <StarBorder
              class="submit-star"
              color="#7c3aed"
              speed="5s"
              :thickness="3"
              :disabled="loading"
              @click="handleLogin"
            >
              {{ loading ? '正在登录...' : '登 录' }}
            </StarBorder>
            <p class="switch-link">还没有账号？<button type="button" class="link-btn" @click="switchMode('register')">前往注册</button></p>
          </div>

          <!-- 注册表单 -->
          <div v-else key="register" class="tab-panel">
            <n-form ref="registerFormRef" :model="registerForm" :rules="registerRules" size="large">
              <n-form-item path="studentId">
                <n-input v-model:value="registerForm.studentId" placeholder="学号（4-32 位）" :input-props="{ autocomplete: 'off' }">
                  <template #prefix>
                    <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item path="nickname">
                <n-input v-model:value="registerForm.nickname" placeholder="昵称" :input-props="{ autocomplete: 'off' }">
                  <template #prefix>
                    <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item path="password">
                <n-input v-model:value="registerForm.password" type="password" show-password-on="click" placeholder="密码（至少 6 位）" :input-props="{ autocomplete: 'new-password' }">
                  <template #prefix>
                    <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </template>
                </n-input>
              </n-form-item>
              <n-form-item path="confirmPassword">
                <n-input v-model:value="registerForm.confirmPassword" type="password" show-password-on="click" placeholder="确认密码" :input-props="{ autocomplete: 'new-password' }" @keyup.enter="handleRegister">
                  <template #prefix>
                    <svg class="field-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </template>
                </n-input>
              </n-form-item>
            </n-form>
            <StarBorder
              class="submit-star"
              color="#7c3aed"
              speed="5s"
              :thickness="3"
              :disabled="loading"
              @click="handleRegister"
            >
              {{ loading ? '正在注册...' : '注 册' }}
            </StarBorder>
            <p class="switch-link">已有账号？<button type="button" class="link-btn" @click="switchMode('login')">前往登录</button></p>
          </div>
        </transition>
      </div>
    </n-config-provider>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, defineAsyncComponent } from 'vue'
import { useRouter } from 'vue-router'
import {
  NForm, NFormItem, NInput,
  useMessage, darkTheme, lightTheme, type FormInst, type FormRules,
} from 'naive-ui'
import { useAuthStore } from '@/stores/auth'
import StarBorder from '@/components/StarBorder.vue'
import { useTheme } from '@/composables/useTheme'
import logo from '@/assets/logo/logo.png'

// three.js 较重，懒加载仅在认证页引入
const ColorBends = defineAsyncComponent(() => import('@/components/ColorBends.vue'))

// 登录/注册页跟随全局主题切换
const { theme, themeOverrides } = useTheme()
const isDark = computed(() => theme.value === 'dark')

const props = defineProps<{ mode?: 'login' | 'register' }>()

const router = useRouter()
const auth = useAuthStore()
const message = useMessage()
const loading = ref(false)

const current = ref<'login' | 'register'>(props.mode === 'register' ? 'register' : 'login')
watch(() => props.mode, (m) => {
  if (m === 'login' || m === 'register') current.value = m
})

function switchMode(m: 'login' | 'register') {
  if (m === current.value || loading.value) return
  current.value = m
  // 切换到注册时清空密码，避免串味
  if (m === 'register') {
    loginForm.password = ''
  } else {
    registerForm.password = ''
    registerForm.confirmPassword = ''
  }
}

/* ---------- 登录 ---------- */
const loginFormRef = ref<FormInst | null>(null)
const loginForm = reactive({ studentId: '', password: '' })
const loginRules: FormRules = {
  studentId: { required: true, message: '请输入学号', trigger: ['blur', 'input'] },
  password: { required: true, message: '请输入密码', trigger: ['blur', 'input'] },
}

async function handleLogin() {
  if (loading.value) return
  try { await loginFormRef.value?.validate() } catch { return }
  loading.value = true
  try {
    await auth.login({ studentId: loginForm.studentId, password: loginForm.password })
    message.success('登录成功，欢迎回来！')
    router.push('/')
  } catch (e: any) {
    message.error(e.message || '登录失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

/* ---------- 注册 ---------- */
const registerFormRef = ref<FormInst | null>(null)
const registerForm = reactive({ studentId: '', nickname: '', password: '', confirmPassword: '' })
const registerRules: FormRules = {
  studentId: { required: true, message: '请输入学号', trigger: ['blur', 'input'] },
  nickname: { required: true, message: '请输入昵称', trigger: ['blur', 'input'] },
  password: { required: true, min: 6, message: '密码至少 6 位', trigger: ['blur', 'input'] },
  confirmPassword: {
    required: true,
    message: '请再次输入密码',
    trigger: ['blur', 'input'],
    validator: (_rule: any, value: string) => value === registerForm.password || new Error('两次输入的密码不一致'),
  },
}

async function handleRegister() {
  if (loading.value) return
  try { await registerFormRef.value?.validate() } catch { return }
  loading.value = true
  try {
    await auth.register({
      studentId: registerForm.studentId,
      nickname: registerForm.nickname,
      password: registerForm.password,
    })
    message.success('注册成功，欢迎加入！')
    router.push('/')
  } catch (e: any) {
    message.error(e.message || '注册失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--theme-bg-page);
  display: flex;
  padding: 24px;
  position: relative;
}

/* 动态背景铺满整个视口（固定定位，滚动内容时背景不动） */
.auth-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
}
.bg-overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, transparent 0%, var(--theme-overlay) 100%),
    var(--theme-overlay);
}

/* margin auto 在 flex 中水平和垂直都居中，内容超高时也能滚动查看 */
.auth-wrap {
  position: relative;
  z-index: 2;
  margin: auto;
  width: 100%;
  max-width: 420px;
}

/* 毛玻璃卡片 */
.auth-card {
  background: var(--theme-glass);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid var(--theme-card-border);
  border-radius: 20px;
  padding: 28px 30px 24px;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.02),
    0 20px 60px rgba(0, 0, 0, 0.5);
  animation: cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

@keyframes cardIn {
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.card-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}
.card-logo img {
  height: 46px;
  width: auto;
}

.card-title {
  text-align: center;
  font-size: 21px;
  font-weight: 700;
  color: var(--theme-text-primary);
  margin: 0 0 4px;
  letter-spacing: 0.02em;
}

.card-subtitle {
  text-align: center;
  font-size: 13px;
  color: var(--theme-text-secondary);
  margin: 0 0 22px;
}

/* ===== 表单面板切换 ===== */
.tab-panel {
  min-height: 200px;
}
.tab-enter-active { transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1); }
.tab-leave-active { transition: all 0.18s ease; }
.tab-enter-from { opacity: 0; transform: translateY(10px); }
.tab-leave-to { opacity: 0; transform: translateY(-6px); }

.field-icon {
  color: var(--theme-text-muted);
}

/* 输入框：深色底 + 浅色文字，紧凑间距 */
.auth-card :deep(.n-form-item) {
  margin-bottom: 4px;
  /* 压缩空 label 行(28px)，预留错误提醒行(20px)，出现错误时布局不跳动 */
  grid-template-rows: 0 auto 20px;
}
.auth-card :deep(.n-input) {
  border-radius: 10px;
  background-color: var(--theme-input-bg);
}
.auth-card :deep(.n-input .n-input__input-el) {
  color: var(--theme-text-primary);
  font-size: 15px;
}
.auth-card :deep(.n-input .n-input__placeholder) {
  color: var(--theme-text-muted);
}

/* 前往登录 / 前往注册 小链接 */
.switch-link {
  text-align: center;
  margin-top: 16px;
  font-size: 13px;
  color: var(--theme-text-muted);
}
.link-btn {
  border: none;
  background: none;
  padding: 0;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  color: var(--theme-primary);
  cursor: pointer;
  transition: color 0.2s;
}
.link-btn:hover { color: var(--theme-primary-hover); }

/* 星星边框按钮（StarBorder）：全宽 + 主题色光晕，深浅主题观感统一 */
.submit-star {
  display: block;
  width: 100%;
  margin-top: 4px;
}
.submit-star :deep(.sb-content) {
  padding: 14px 0;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.2em;
  /* 透明背景 + 紫色光晕边框，字体随主题切换 */
  background: transparent;
  color: var(--theme-text-primary);
  border: 3px solid rgba(124, 58, 237, 0.55);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.submit-star:hover:not(:disabled) :deep(.sb-content) {
  border-color: rgba(147, 197, 253, 0.75);
  box-shadow: 0 6px 20px rgba(124, 58, 237, 0.35);
}
.submit-star:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}
/* 透明背景下光晕会穿透显示，压暗以免抢眼 */
.submit-star :deep(.sb-glow) {
  filter: opacity(0.22);
}
</style>
