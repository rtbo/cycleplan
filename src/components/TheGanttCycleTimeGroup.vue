<template>
  <kv-group>
    <kv-line :config="cycleStartCfg"></kv-line>
    <kv-line :config="cycleEndCfg"></kv-line>
  </kv-group>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "../store";
import { CycleTimeMode } from "../model/cycle";
import { injectStageHeight } from "../gantt-style";

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

    const mapCfg = (time: number) => ({
      x: store.getters.time2px(time),
      y: 0,
      points: [0, 0, 0, stageHeight.value ?? 100],
      stroke: "#bb2222",
      strokeWidth: 1,
    });

    const cycleStartCfg = computed(() => mapCfg(cycleStart.value));
    const cycleEndCfg = computed(() => mapCfg(cycleEnd.value));

    return {
      cycleStartCfg,
      cycleEndCfg,
    };
  },
});
</script>
