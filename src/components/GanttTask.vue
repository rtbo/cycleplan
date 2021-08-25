<template>
  <g>
    <rect :x="x" :y="y" :width="w" :height="h" :style="style" />
    <rect
      v-if="durationGrab"
      :x="x + w - 10"
      :y="y"
      width="20"
      :height="h"
      fill="none"
      stroke="none"
      cursor="col-resize"
      pointer-events="visible"
      @mousedown="$emit('duration-grab', modelValue.id, $event)"
    />
  </g>
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
  emits: ["duration-grab"],
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

    const durationGrab = computed(
      () => store.state.editMode === "task-duration"
    );

    return {
      x,
      y,
      w,
      h,
      style,
      durationGrab,
    };
  },
});
</script>
