<template>
  <div id="gantt-wrapper" ref="wrapperEl">
    <kv-stage :config="config">
      <kv-layer>
        <TheGanttTimeScale></TheGanttTimeScale>
        <TheGanttTaskGroup></TheGanttTaskGroup>
        <TheGanttCycleTimeGroup></TheGanttCycleTimeGroup>
      </kv-layer>
    </kv-stage>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from "vue";
import { useStore } from "../store";
import TheGanttTimeScale from "./TheGanttTimeScale.vue";
import TheGanttTaskGroup from "./TheGanttTaskGroup.vue";
import TheGanttCycleTimeGroup from "./TheGanttCycleTimeGroup.vue";
import { provideStageHeight, provideStageWidth } from "../gantt-style";

export default defineComponent({
  components: { TheGanttCycleTimeGroup, TheGanttTaskGroup, TheGanttTimeScale },
  setup() {
    const store = useStore();

    const wrapperEl: Ref<HTMLElement | null> = ref(null);

    const height = computed(() => {
      const vbounds = store.getters.vbounds;
      return vbounds.bottom - vbounds.top;
    });

    const width = ref(500);

    const config = computed(() => ({
      width: width.value,
      height: height.value,
    }));

    onMounted(() => {
      const wrapper = wrapperEl.value as HTMLElement;

      const observer = new ResizeObserver(() => {
        width.value = wrapper.clientWidth;
      });
      observer.observe(wrapper);
    });

    provideStageWidth(computed(() => width.value));
    provideStageHeight(height);

    return { wrapperEl, config };
  },
});
</script>

<style scoped>
div#gantt-wrapper {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
}
</style>
