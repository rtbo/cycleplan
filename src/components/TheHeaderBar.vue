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
    <div class="flex-grow"></div>
    <button @click="setDarkMode(dark ? 'light' : 'dark')">
      <span class="mdi" :class="dark ? 'mdi-brightness-5' : 'mdi-brightness-4'">
      </span>
    </button>
  </header>
</template>

<script lang="ts">
import { useStore } from "../store";
import { DarkMode } from "../store/state";
import { computed, defineComponent } from "vue";
import TheAppIcon from "../assets/logo.svg?component";
import TheCycleTimeGroup from "./TheCycleTimeGroup.vue";
import { useDark } from "../app-style";

export default defineComponent({
  components: { TheAppIcon, TheCycleTimeGroup },
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

    const dark = useDark();

    const setDarkMode = (mode: DarkMode) => {
      store.commit("dark-mode", mode);
    };

    return {
      cycleName,
      editMode,
      dark,
      setDarkMode,
    };
  },
});
</script>
