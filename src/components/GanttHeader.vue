<template>
  <g>
    <rect
      x="0"
      y="0"
      :width="stageWidth"
      :height="headerHeight"
      class="gantt-header__rulerbg"
    />
    <g
      v-for="grad in grads"
      :key="grad.time"
      :transform="`translate(${grad.px} 0)`"
    >
      <line x1="0" y1="0" x2="0" :y2="stageHeight" class="gantt-header__grad" />
      <text x="5" :y="headerHeight - 5" class="gantt-header__text">
        {{ grad.time }}
      </text>
    </g>
  </g>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { injectStageHeight, injectStageWidth } from "@/gantt-style";
import { useStore } from "@/store";

const MIN_PX = 50;
const GRAD_FACTORS = [2, 2.5, 2];

export default defineComponent({
  setup() {
    const store = useStore();
    const stageWidth = injectStageWidth();
    const stageHeight = injectStageHeight();

    const interGrad = computed(() => {
      const scale = store.state.timeScale;
      let time = 1;
      let fact = 0;
      while (time * scale < MIN_PX) {
        time *= GRAD_FACTORS[fact];
        fact = (fact + 1) % 3;
      }
      return time;
    });

    const grads: ComputedRef<{ time: number; px: number }[]> = computed(() => {
      const width = stageWidth.value;
      const ig = interGrad.value;
      if (!width) return [];

      const min = store.getters.px2time(0);
      const max = store.getters.px2time(width);
      let g = 0;
      const grds = [];
      while (g > min) g -= ig;
      while (g < max) {
        grds.push({
          time: g,
          px: store.getters.time2px(g),
        });
        g += ig;
      }
      return grds;
    });

    const headerHeight = computed(() => store.getters.headerHeight);

    return {
      grads,
      stageWidth,
      stageHeight,
      headerHeight,
    };
  },
});
</script>

<style lang="postcss">
.gantt-header__rulerbg {
  fill: var(--color-gantt-ruler);
}
.gantt-header__grad {
  stroke: var(--color-gantt-grad);
  stroke-width: 0.5;
}
.gantt-header__text {
  fill: var(--color-gantt-text);
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  @apply text-sm;
}
</style>
