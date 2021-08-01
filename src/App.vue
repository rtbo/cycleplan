<template>
  <div class="flex flex-col h-screen">
    <div class="flex-grow-0">
      <TheHeaderBar class="shadow-lg"></TheHeaderBar>
    </div>
    <main class="flex-grow">
      <splitpanes>
        <pane :size="panePos">
          <the-task-table></the-task-table>
        </pane>
        <pane :size="100 - panePos">
          <the-gantt-stage></the-gantt-stage>
        </pane>
      </splitpanes>
    </main>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, readonly, ref, watchEffect } from "vue";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import { useStore } from "./store";
import { provideAppStyle, provideDark } from "./app-style";
import TheGanttStage from "./components/TheGanttStage.vue";
import TheHeaderBar from "./components/TheHeaderBar.vue";
import TheTaskTable from "./components/TheTaskTable.vue";

function prefersDarkColorScheme() {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const prefers = ref(mq.matches);
  mq.addEventListener("change", () => {
    prefers.value = mq.matches;
  });
  return readonly(prefers);
}

export default defineComponent({
  name: "App",

  components: { Pane, Splitpanes, TheGanttStage, TheHeaderBar, TheTaskTable },

  setup() {
    const store = useStore();

    const pageTitle = computed(() => {
      if (store.state.name) {
        return `${store.state.name} - Cycle Plan`;
      } else {
        return "Cycle Plan";
      }
    });
    watchEffect(() => {
      document.title = pageTitle.value;
    });

    const prefersDark = prefersDarkColorScheme();
    const darkMode = computed(() => store.state.darkMode);
    const dark = computed(
      () =>
        (darkMode.value === "media" && prefersDark.value) ||
        darkMode.value === "dark"
    );
    watchEffect(() => {
      if (dark.value) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    });

    provideDark(dark);
    provideAppStyle(dark);

    const panePos = computed(() => store.state.panePos);

    return {
      panePos,
    };
  },
});
</script>

<style>
.splitpanes--vertical > .splitpanes__splitter {
  min-width: 6px;
  background-color: rgba(128, 128, 128, 0.2);
  position: relative;
}
</style>
