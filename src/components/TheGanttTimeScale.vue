<template>
  <kv-group>
    <kv-rect :config="bgRectCfg"></kv-rect>
    <kv-line v-for="cfg in gradsLineCfg" :key="cfg.x" :config="cfg"></kv-line>
    <kv-text v-for="cfg in gradsTxtCfg" :key="cfg.x" :config="cfg"></kv-text>
  </kv-group>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "../store";
import {
  injectStageHeight,
  injectStageWidth,
  useGanttStyle,
} from "../gantt-style";

const MIN_PX = 50;
const GRAD_FACTORS = [2, 2.5, 2];

export default defineComponent({
  setup() {
    const store = useStore();
    const ganttStyle = useGanttStyle();
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

    const gradsLineCfg = computed(() =>
      grads.value.map((grad) => ({
        x: grad.px,
        y: 0,
        points: [0, 0, 0, stageHeight.value],
        stroke: `rgba(${ganttStyle.value.grad}, 0.5)`,
        strokeWidth: 0.5,
      }))
    );

    const gradsTxtCfg = computed(() =>
      grads.value.map((grad) => ({
        x: grad.px + 6,
        y: store.getters.headerHeight / 2,
        text: grad.time,
        fontSize: 10,
        align: "left",
        verticalAlign: "middle",
        fill: ganttStyle.value.text,
      }))
    );

    const bgRectCfg = computed(() => ({
      x: 0,
      y: 0,
      width: stageWidth.value,
      height: store.getters.headerHeight,
      fill: `rgba(${ganttStyle.value.ruler}, 0.15)`,
    }));

    return {
      grads,
      bgRectCfg,
      gradsLineCfg,
      gradsTxtCfg,
    };
  },
});
</script>
