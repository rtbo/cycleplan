<template>
  <div id="gantt-wrapper" ref="wrapperEl">
    <kv-stage :config="config">
      <kv-layer></kv-layer>
    </kv-stage>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, provide, Ref, ref } from "vue";
import KvStage from "../konva/KvStage";
import KvLayer from "../konva/KvLayer";
import { useStore } from "../store";
// import TheGanttTimeScale from "./TheGanttTimeScale.vue";
// import TheGanttTaskGroup from "./TheGanttTaskGroup.vue";
// import TheGanttCycleTimeGroup from "./TheGanttCycleTimeGroup.vue";
import { stageHeightKey, stageWidthKey } from "./gantt";

export default defineComponent({
  // components: { TheGanttCycleTimeGroup, TheGanttTaskGroup, TheGanttTimeScale },
  components: { KvStage, KvLayer },
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

    provide(
      stageWidthKey,
      computed(() => width.value)
    );
    provide(stageHeightKey, height);

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
