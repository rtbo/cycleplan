<template>
  <g>
    <rect
      v-for="task in tasks"
      :key="task.vforKey"
      :x="task.x"
      :y="task.y"
      :width="task.w"
      :height="task.h"
      :style="task.style"
    />
  </g>
</template>

<script lang="ts">
import { useStore } from "../store";
import { computed, defineComponent } from "vue";
import { TASKBAR_HEIGHT } from "../gantt-style";

export default defineComponent({
  setup() {
    const store = useStore();

    const tasks = computed(() =>
      store.state.tasks.map((task) => {
        const middle = (task.vbounds.top + task.vbounds.bottom) / 2;
        return {
          vforKey: task.id,
          x: store.getters.time2px(task.earlyStart),
          y: middle - TASKBAR_HEIGHT / 2,
          w: store.state.timeScale * task.duration,
          h: TASKBAR_HEIGHT,
          style: {
            fill: task.color || "rgb(var(--color-gantt-task-bar))",
          },
        };
      })
    );

    return {
      tasks,
      time2px: store.getters.time2px,
    };
  },
});
</script>
