<template>
  <kv-group>
    <kv-rect v-for="cfg in tasksCfg" :key="cfg.vforKey" :config="cfg"></kv-rect>
  </kv-group>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "../store";
import { useAppStyle } from "../app-style";

const HEIGHT = 20;

export default defineComponent({
  setup() {
    const store = useStore();
    const appStyle = useAppStyle();
    const tasksCfg = computed(() =>
      store.state.tasks.map((task) => {
        const bounds = task.vbounds;
        const middle = (bounds.top + bounds.bottom) / 2.0;
        return {
          vforKey: task.id,
          x: store.getters.time2px(task.earlyStart),
          y: middle - HEIGHT / 2,
          width: store.state.timeScale * task.duration,
          height: HEIGHT,
          fill: task.color ?? `rgb(${appStyle.value.taskBar})`,
        };
      })
    );
    return {
      tasksCfg,
    };
  },
});
</script>
