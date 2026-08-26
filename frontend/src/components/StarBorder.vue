<template>
  <component
    :is="as"
    :class="['star-border', customClass]"
    v-bind="restAttrs"
    :style="[componentStyle, { borderRadius: props.borderRadius + 'px' }]"
  >
    <div
      class="sb-glow sb-glow-bottom"
      :style="{
        background: `radial-gradient(circle, ${color}, transparent 10%)`,
        animationDuration: speed
      }"
    ></div>

    <div
      class="sb-glow sb-glow-top"
      :style="{
        background: `radial-gradient(circle, ${color}, transparent 10%)`,
        animationDuration: speed
      }"
    ></div>

    <div
      class="sb-content"
      :style="{ borderRadius: props.borderRadius + 'px' }"
    >
      <span class="sb-label"><slot /></span>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue';

interface StarBorderProps {
  as?: string;
  customClass?: string;
  color?: string;
  speed?: string;
  thickness?: number;
  borderRadius?: number;
}

const props = withDefaults(defineProps<StarBorderProps>(), {
  as: 'button',
  customClass: '',
  color: 'white',
  speed: '6s',
  thickness: 1,
  borderRadius: 20
});

const restAttrs = useAttrs();

const componentStyle = computed(() => {
  const base = {
    padding: `${props.thickness}px 0`
  };
  const userStyle = (restAttrs.style as Record<string, string>) || {};
  return { ...base, ...userStyle };
});
</script>

<style scoped>
.star-border {
  position: relative;
  display: inline-block;
  overflow: hidden;
  background: transparent;
  border: none;
  font-family: inherit;
  cursor: pointer;
}

/* 光晕层（底部/顶部各一条流动光带） */
.sb-glow {
  position: absolute;
  z-index: 0;
  opacity: 0.7;
  border-radius: 50%;
  width: 300%;
  height: 50%;
}
.sb-glow-bottom {
  right: -250%;
  bottom: -11px;
  animation: sb-move-bottom linear infinite alternate;
}
.sb-glow-top {
  top: -10px;
  left: -250%;
  animation: sb-move-top linear infinite alternate;
}

/* 内容区 */
.sb-content {
  position: relative;
  overflow: hidden;
  z-index: 10;
  background: #0b0b0b;
  padding: 14px 64px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  text-align: center;
  font-size: 16px;
  white-space: nowrap;
}
.sb-label {
  position: relative;
  z-index: 1;
}

@keyframes sb-move-bottom {
  0% {
    transform: translate(0%, 0%);
    opacity: 1;
  }
  100% {
    transform: translate(-100%, 0%);
    opacity: 0;
  }
}

@keyframes sb-move-top {
  0% {
    transform: translate(0%, 0%);
    opacity: 1;
  }
  100% {
    transform: translate(100%, 0%);
    opacity: 0;
  }
}
</style>
