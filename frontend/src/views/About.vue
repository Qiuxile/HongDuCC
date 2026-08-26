<template>
<div class="about-page">
  <div class="container about-container">
    <h1 class="about-title">南昌市洪都中学</h1>
    <p class="about-motto">厚德 · 笃学 · 创新 · 致远</p>
    <div class="about-card">
      <p>南昌市洪都中学创建于1956年，是一所历史悠久、文化底蕴深厚的完全中学。学校坐落于英雄城南昌，毗邻美丽的赣江之滨。</p>
      <p class="about-p">学校秉承"厚德、笃学、创新、致远"的校训，坚持"以人为本、全面发展"的办学理念，培养了大批优秀人才。</p>
      <p class="about-p">学校现有教职工200余人，在校学生3000余人，是江西省重点中学、南昌市文明校园。</p>
    </div>
  </div>
</div>
</template>

<style scoped>
.about-page {
  min-height: 100vh;
  background: var(--theme-bg-page);
}

.about-container {
  padding-top: 100px;
  min-height: 100vh;
  max-width: 800px;
}

.about-title {
  font-family: var(--font-heading);
  text-align: center;
  margin-bottom: 8px;
  color: var(--theme-text-primary);
  font-size: 2rem;
}

.about-motto {
  text-align: center;
  color: var(--theme-text-muted);
  margin-bottom: 40px;
  font-size: 18px;
}

/* 玻璃拟态卡片 */
.about-card {
  background: var(--theme-card-bg);
  backdrop-filter: blur(14px) saturate(160%);
  -webkit-backdrop-filter: blur(14px) saturate(160%);
  border: 1px solid var(--theme-card-border);
  border-radius: 16px;
  padding: 32px;
  line-height: 2;
  color: var(--theme-text-secondary);
  font-size: 15px;
}
.about-p { margin-top: 16px; }
</style>
