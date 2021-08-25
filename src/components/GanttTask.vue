<template>
  <rect :x="x" :y="y" :width="w" :height="h" :style="style" />
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { TASKBAR_HEIGHT } from "@/gantt-style";
import { useStore } from "@/store";
import { TaskState } from "@/store/state";

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<TaskState>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const x = computed(() =>
      store.getters.time2px(props.modelValue.earlyStart)
    );
    const y = computed(() => {
      const middle =
        (props.modelValue.vbounds.top + props.modelValue.vbounds.bottom) / 2;
      return middle - TASKBAR_HEIGHT / 2;
    });
    const w = computed(() => store.state.timeScale * props.modelValue.duration);
    const h = TASKBAR_HEIGHT;
    const style = computed(() => ({
      fill: props.modelValue.color || "var(--color-gantt-task-bar)",
    }));

    return {
      x,
      y,
      w,
      h,
      style,
    };
  },
});
</script>
