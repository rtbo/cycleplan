<template>
  <div ref="wrapperEl">
    <svg
      :width="width"
      :height="height"
      :viewBox="`0 0 ${width} ${height}`"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
    >
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
        <gantt-task
          v-for="task in tasks"
          :key="task.id"
          :model-value="task"
          @duration-grab="onDurationGrab"
        />
      </g>
      <gantt-cycle-time-group />
    </svg>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  Ref,
  watchEffect,
} from "vue";
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
    let rect = new DOMRect();

    onMounted(() => {
      const wrapper = wrapperEl.value as HTMLElement;

      const observer1 = new ResizeObserver(() => {
        width.value = wrapper.clientWidth;
        rect = wrapper.getBoundingClientRect();
      });
      observer1.observe(wrapper);

      const observer2 = new IntersectionObserver(() => {
        rect = wrapper.getBoundingClientRect();
      });
      observer2.observe(wrapper);
    });

    provideStageWidth(computed(() => width.value));
    provideStageHeight(height);

    const links = computed(() => store.state.links);
    const tasks = computed(() => store.state.tasks);

    let taskDurationGrab: number | undefined = undefined;

    watchEffect(() => {
      if (store.state.editMode !== "task-duration")
        taskDurationGrab = undefined;
    });

    const onDurationGrab = (id: number) => {
      taskDurationGrab = id;
    };

    const onMouseMove = (ev: MouseEvent) => {
      if (taskDurationGrab !== undefined) {
        const x = ev.clientX - rect.x;
        const task = store.getters.taskForId(taskDurationGrab);
        if (!task) return;
        const duration = Math.max(
          0,
          Math.round(store.getters.px2time(x) - task.earlyStart)
        );
        store.commit("update-task-plan", {
          id: taskDurationGrab,
          duration,
        });
      }
    };

    const onMouseUp = () => {
      taskDurationGrab = undefined;
    };

    return {
      wrapperEl,
      width,
      height,
      links,
      tasks,

      onDurationGrab,
      onMouseMove,
      onMouseUp,
    };
  },
});
</script>
