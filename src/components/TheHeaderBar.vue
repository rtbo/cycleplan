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
    <div>
      <app-toggle-button class="w-8 h-8 p-1" v-model="taskInsertMode">
        <icon-task-insert class="w-6 h-6"></icon-task-insert>
      </app-toggle-button>
    </div>
    <div class="flex-grow"></div>
    <app-icon-button
      @click="setDarkMode(dark ? 'light' : 'dark')"
      :icon="dark ? 'mdi-brightness-5' : 'mdi-brightness-4'"
      class="text-lg"
    />
  </header>
</template>

<script lang="ts">
import { useStore } from "../store";
import { DarkMode } from "../store/state";
import { computed, defineComponent } from "vue";
import TheAppIcon from "../assets/logo.svg?component";
import IconTaskInsert from "./IconTaskInsert.vue";
import TheCycleTimeGroup from "./TheCycleTimeGroup.vue";
import { useDark } from "../app-style";

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

    const dark = useDark();

    const setDarkMode = (mode: DarkMode) => {
      store.commit("dark-mode", mode);
    };

    return {
      cycleName,
      editMode,
      taskInsertMode,
      dark,
      setDarkMode,
    };
  },
});
</script>
