<template>
  <div ref="wrapperEl">
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`">
      <gantt-header />
      <gantt-task-group />
      <gantt-cycle-time-group />
    </svg>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, Ref } from "vue";
import { useStore } from "../store";
import { provideStageHeight, provideStageWidth } from "../gantt-style";
import GanttCycleTimeGroup from "./GanttCycleTimeGroup.vue";
import GanttHeader from "./GanttHeader.vue";
import GanttTaskGroup from "./GanttTaskGroup.vue";

export default defineComponent({
  components: { GanttCycleTimeGroup, GanttHeader, GanttTaskGroup },
  setup() {
    const store = useStore();

    const wrapperEl: Ref<HTMLElement | null> = ref(null);

    const height = computed(() => {
      const vbounds = store.getters.vbounds;
      return vbounds.bottom - vbounds.top;
    });

    const width = ref(500);

    onMounted(() => {
      const wrapper = wrapperEl.value as HTMLElement;

      const observer = new ResizeObserver(() => {
        width.value = wrapper.clientWidth;
      });
      observer.observe(wrapper);
    });

    provideStageWidth(computed(() => width.value));
    provideStageHeight(height);

    return {
      wrapperEl,
      width,
      height,
    };
  },
});
</script>
