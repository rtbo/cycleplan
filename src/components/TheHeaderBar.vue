<template>
  <header class="h-14 p-2 gap-3 flex flex-row items-center">
    <the-app-icon class="w-6 h-6"></the-app-icon>
    <h1 class="text-xl">Cycle Plan</h1>
    <app-divider vertical></app-divider>
    <app-click-to-edit v-model="cycleName" class="text-lg"> </app-click-to-edit>
    <app-divider vertical></app-divider>
    <div class="flex items-center">
      <span>Cycle Time:&nbsp;</span>
      <the-cycle-time-group></the-cycle-time-group>
    </div>
    <app-divider vertical></app-divider>
    <div class="flex flex-row items-center">
      <app-toggle-button class="w-8 h-8" v-model="taskInsertMode">
        <icon-task-insert class="w-5 h-5"></icon-task-insert>
      </app-toggle-button>
      <app-toggle-button class="w-8 h-8" v-model="taskDeleteMode">
        <span
          class="text-xl text-red-600 dark:text-red-400 iconify"
          data-icon="mdi:trash-can"
        ></span>
      </app-toggle-button>
      <app-toggle-button class="w-8 h-8" v-model="taskDurationMode">
        <span
          class="text-xl text-indigo-600 dark:text-indigo-400 iconify"
          data-icon="mdi:arrow-split-vertical"
        ></span>
      </app-toggle-button>
    </div>
    <div class="flex-grow"></div>
    <app-icon-button
      @click="setDarkMode(dark ? 'light' : 'dark')"
      class="text-lg"
      :icon="dark ? 'mdi:brightness-5' : 'mdi:brightness-4'"
    />
  </header>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import TheAppIcon from "@/assets/logo.svg?component";
import { useDark } from "@/gantt-style";
import { useStore } from "@/store";
import { DarkMode } from "@/store/state";
import IconTaskInsert from "./IconTaskInsert.vue";
import TheCycleTimeGroup from "./TheCycleTimeGroup.vue";

export default defineComponent({
  components: { IconTaskInsert, TheAppIcon, TheCycleTimeGroup },
  setup() {
    const store = useStore();

    const cycleName = computed({
      get: () => store.state.name,
      set: (v) => store.commit("cycle-name", v),
    });

    const editMode = computed({
      get: () => store.state.editMode,
      set: (v) => store.commit("edit-mode", v),
    });

    const taskInsertMode = computed({
      get: () => store.state.editMode === "task-insert",
      set: (v) => store.commit("edit-mode", v ? "task-insert" : undefined),
    });

    const taskDurationMode = computed({
      get: () => store.state.editMode === "task-duration",
      set: (v) => store.commit("edit-mode", v ? "task-duration" : undefined),
    });

    const taskDeleteMode = computed({
      get: () => store.state.editMode === "task-delete",
      set: (v) => {
        if (v) {
          store.commit("selected-tasks", []);
        }
        store.commit("edit-mode", v ? "task-delete" : undefined);
      },
    });

    const dark = useDark();

    const setDarkMode = (mode: DarkMode) => {
      store.commit("dark-mode", mode);
    };

    return {
      cycleName,
      editMode,
      taskInsertMode,
      taskDurationMode,
      taskDeleteMode,
      dark,
      setDarkMode,
    };
  },
});
</script>
