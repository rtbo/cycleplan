<template>
  <header class="h-14 p-2 gap-3 flex flex-row items-center">
    <the-app-icon class="w-6 h-6"></the-app-icon>
    <h1 class="text-xl">Cycle Plan</h1>
    <app-divider vertical></app-divider>
    <app-click-to-edit v-model="cycleName" class="text-lg"> </app-click-to-edit>
    <app-divider vertical></app-divider>
    <span>Cycle Time:</span>
    <the-cycle-time-group></the-cycle-time-group>
  </header>
</template>

<script lang="ts">
import { useStore } from "../store";
import { computed, defineComponent } from "vue";
import TheAppIcon from "../assets/logo.svg?component";
import TheCycleTimeGroup from "./TheCycleTimeGroup.vue"
import AppClickToEdit from "./AppClickToEdit.vue";
import AppDivider from "./AppDivider.vue";

export default defineComponent({
  components: { AppClickToEdit, AppDivider, TheAppIcon, TheCycleTimeGroup },
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

    return {
      cycleName,
      editMode,
    };
  },
});
</script>
