<template>

<div class="home-page">


  <!-- 轮播图 Hero -->
  <section v-if="carouselItems && carouselItems.length" class="hero">
      <n-carousel
          autoplay
          draggable
          show-arrow
          dot-type="line"
          :interval="4500"
          class="hero-carousel"
      >
          <div
          v-for="(item, index) in carouselItems"
          :key="index"
          class="hero-slide"
          :style="{ backgroundImage: `url(${item.image})` }"
          >
          <div class="hero-content">
              <span class="hero-title">{{ item.title }}</span>
              <p class="hero-sub">{{ item.subtitle }}</p>
              <router-link :to="item.link">
              <button class="hero-btn">
                  <span class="hero-btn-text"> {{ item.buttonText }} </span>
                  <svg
                  id="hero-btn-arrow"
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="10"
                  viewBox="0 0 46 16"
                  >
                  <path
                      id="hero-btn-arrow-path"
                      data-name="Path 10"
                      d="M8,0,6.545,1.455l5.506,5.506H-30V9.039H12.052L6.545,14.545,8,16l8-8Z"
                      transform="translate(30)"
                  ></path>
                  </svg>
              </button>
              </router-link>
          </div>
          </div>
      </n-carousel>
  </section>

</div>

</template>

<script setup lang="ts">

// 轮播数据
interface CarouselItem {
  image: string
  title: string
  subtitle: string
  link: string
  buttonText: string
}

const carouselItems: CarouselItem[] = [
  {
    image: '/carousels/image.png',
    title: '南昌市洪都中学',
    subtitle: '厚德 · 笃学 · 创新 · 致远',
    link: '/about',
    buttonText: '了解学校',
  },
  {
    image: '/carousels/image2.png',
    title: '学习资源分享',
    subtitle: '共同进步，携手迎接高考',
    link: '/resources',
    buttonText: '查看资源',
  },
  {
    image: '/carousels/plane.png',
    title: '航空特色教育',
    subtitle: '无人机 · 航模 · 科技创新',
    link: '/clubs',
    buttonText: '查看社团',
  },
]

</script>

<style scoped>
/* Hero 轮播 */
.hero {
  position: relative;
  width: 100%;
  animation: fadeInDown 0.8s ease-out both;
}
.hero-carousel {
  width: 100%;
}
.hero-slide {
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-slide::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 0%, rgba(10, 20, 50, 0.55) 100%);
}
.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  color: #fff;
  animation: fadeInUp 0.8s ease-out both;
}
.hero-title {
  font-size: clamp(36px, 6vw, 72px);
  font-weight: 800;
  letter-spacing: 0.04em;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  margin-bottom: 16px;
  font-family: '楷体', 'KaiTi', serif;
}
.hero-sub {
  font-size: clamp(16px, 2.5vw, 24px);
  font-weight: 400;
  letter-spacing: 0.25em;
  opacity: 0.9;
  margin-bottom: 36px;
  font-family: '楷体', 'KaiTi', serif;
}

.hero-btn {
  border: none;
  background: none;
  cursor: pointer;
}
.hero-btn span {
  padding-bottom: 7px;
  letter-spacing: 4px;
  font-size: 14px;
  padding-right: 15px;
  text-transform: uppercase;
}
.hero-btn svg {
  transform: translateX(-8px);
  transition: all 0.3s ease;
  filter: brightness(0) invert(1);
}
.hero-btn:hover svg {
  transform: translateX(0);
}
.hero-btn:active svg {
  transform: scale(0.9);
}
.hero-btn-text {
  position: relative;
  color: rgb(255, 255, 255);
  padding-bottom: 20px;
}
.hero-btn-text:after {
  content: '';
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 2px;
  bottom: 0;
  left: 0;
  background-color: #ffffff;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
}
.hero-btn-text:hover:after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

/* ==================== 通用 ==================== */
.more-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-accent);
  font-size: 14px;
  font-weight: 600;
  transition: color var(--transition-fast);
  text-decoration: none;
}
.more-link:hover {
  color: var(--color-accent-hover);
}
.more-link:hover .arrow-right {
  transform: rotate(45deg) translateX(4px);
}

.arrow-right {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-top: 2px solid currentColor;
  border-right: 2px solid currentColor;
  transform: rotate(45deg);
  transition: transform var(--transition-fast);
}

/* 加载状态 */
.news-featured.loading {
  min-height: 400px;
}
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
@keyframes spin {
  0%   { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

.loading-text {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite reverse;
  border-radius: 4px;
  height: 20px;
  margin: 8px 0;
}
.news-featured-title.loading-text {
  height: 24px;
  width: 80%;
  margin-bottom: 16px;
}
.news-featured-excerpt.loading-text {
  height: 80px;
  width: 100%;
}
.news-item-title.loading-text {
  height: 16px;
  width: 90%;
}


/* 移动端顶部装饰条 */
.mobile-top {
  display: none;
  height: 66px;
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%);
  margin-bottom: 5px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.671);
}

/* ==================== 响应式 ==================== */
@media (max-width: 1024px) {
  .quick-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .resources-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .clubs-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .about-inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .school-name {
    font-size: 32px;
  }
  .stat-number {
    font-size: 28px;
  }
}

@media (max-width: 768px) {
  .news-content {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .news-featured-img img {
    height: 250px;
  }
}

@media (max-width: 640px) {
  .hero-slide {
    height: 30vh;
    border-radius: 10px;
  }
  .mobile-top {
    display: block;
  }

  .quick-section {
    padding: 40px 0;
  }
  .quick-grid {
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  .quick-card {
    padding: 16px;
    gap: 10px;
  }
  .quick-icon {
    width: 40px;
    height: 40px;
  }
  .quick-emoji {
    font-size: 20px;
  }
  .quick-title {
    font-size: 14px;
  }
  .quick-desc {
    font-size: 11px;
  }

  .resources-grid {
    grid-template-columns: 1fr;
  }
  .clubs-grid {
    grid-template-columns: 1fr;
  }

  .news-section,
  .resources-section,
  .clubs-section {
    padding: 60px 0;
  }
  .about-section {
    padding: 60px 0;
  }
  .news-featured-img img {
    height: 200px;
  }
  .news-item {
    flex-direction: column;
    gap: 8px;
  }
  .news-date {
    width: auto;
  }
  .stats-row {
    gap: 20px;
    flex-wrap: wrap;
  }
}
</style>
