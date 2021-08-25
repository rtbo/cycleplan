<template>
  <div ref="wrapperEl">
    <svg :width="width" :height="height" :viewBox="`0 0 ${width} ${height}`">
      <defs>
        <path id="gantt-def--link-arrow" d="M 0 0 L 2.5 -8 L -2.5 -8" />
      </defs>
      <gantt-header />
      <g>
        <gantt-link
          v-for="link in links"
          :key="`${link.from}.${link.to}`"
          :model-value="link"
        />
      </g>
      <g>
        <gantt-task v-for="task in tasks" :key="task.id" :model-value="task" />
      </g>
      <gantt-cycle-time-group />
    </svg>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, Ref } from "vue";
import { provideStageHeight, provideStageWidth } from "@/gantt-style";
import { useStore } from "@/store";
import GanttCycleTimeGroup from "./GanttCycleTimeGroup.vue";
import GanttHeader from "./GanttHeader.vue";
import GanttLink from "./GanttLink.vue";
import GanttTask from "./GanttTask.vue";

export default defineComponent({
  components: { GanttCycleTimeGroup, GanttHeader, GanttLink, GanttTask },
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

    const links = computed(() => store.state.links);
    const tasks = computed(() => store.state.tasks);

    return {
      wrapperEl,
      width,
      height,
      links,
      tasks,
    };
  },
});
</script>
