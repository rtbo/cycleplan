<template>
  <div class="flex flex-col h-screen">
    <div class="flex-grow-0">
      <the-header-bar
        class="
          shadow-lg
          border-b border-on-background border-opacity-25
          dark:border-opacity-10
        "
      ></the-header-bar>
    </div>
    <main class="flex-grow">
      <app-resize-panel class="h-full" v-model="tableOn">
        <template #panel>
          <the-task-table></the-task-table>
        </template>

        <app-slide-over-panel v-model="propsPanelOn" class="h-full">
          <gantt-stage></gantt-stage>

          <template #panel>
            <the-props-panel></the-props-panel>
          </template>
        </app-slide-over-panel>
      </app-resize-panel>
    </main>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, readonly, ref, watchEffect } from "vue";
import GanttStage from "./components/GanttStage.vue";
import TheHeaderBar from "./components/TheHeaderBar.vue";
import ThePropsPanel from "./components/ThePropsPanel.vue";
import TheTaskTable from "./components/TheTaskTable.vue";
import { provideAppStyle, provideDark } from "./gantt-style";
import { useStore } from "./store";

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

  components: {
    GanttStage,
    TheHeaderBar,
    ThePropsPanel,
    TheTaskTable,
  },

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

    const tableOn = ref(true);
    const propsPanelOn = ref(true);

    return {
      tableOn,
      propsPanelOn,
    };
  },
});
</script>
