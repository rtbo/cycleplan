<template>
  <g>
    <line
      :x1="cycleStartLine.x1"
      :y1="cycleStartLine.y1"
      :x2="cycleStartLine.x2"
      :y2="cycleStartLine.y2"
      class="gantt-cycletime--line"
    />
    <line
      :x1="cycleEndLine.x1"
      :y1="cycleEndLine.y1"
      :x2="cycleEndLine.x2"
      :y2="cycleEndLine.y2"
      class="gantt-cycletime--line"
    />
  </g>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { injectStageHeight } from "../gantt-style";
import { useStore } from "../store";
import { CycleTimeMode } from "../model/cycle";

export default defineComponent({
  setup() {
    const store = useStore();
    const stageHeight = injectStageHeight();

    const cycleStart: ComputedRef<number> = computed(() => {
      const ct = store.state.cycleTimeInput;
      if (ct.mode === CycleTimeMode.Auto) {
        return store.getters.taskForId(ct.loopIn)?.earlyStart || 0;
      }
      return 0;
    });

    const cycleEnd: ComputedRef<number> = computed(() => {
      const ct = store.state.cycleTimeInput;
      if (ct.mode === CycleTimeMode.Auto) {
        const finish = store.getters.taskForId(ct.loopOut);
        return finish?.earlyFinish as number;
      }
      return store.state.cycleTime;
    });

    const mapTime = (time: number) => {
      const x = store.getters.time2px(time);
      return {
        x1: x,
        y1: 0,
        x2: x,
        y2: stageHeight.value,
      };
    };

    const cycleStartLine = computed(() => mapTime(cycleStart.value));
    const cycleEndLine = computed(() => mapTime(cycleEnd.value));

    return {
      cycleStartLine,
      cycleEndLine,
    };
  },
});
</script>

<style lang="postcss">
.gantt-cycletime--line {
  stroke: rgb(var(--color-gantt-cycle-line));
  stroke-width: 0.5;
}
</style>