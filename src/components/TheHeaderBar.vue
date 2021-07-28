<template>
  <header class="h-12 flex flex-row items-center px-2 gap-2">
    <TheAppIcon class="w-6 h-6"></TheAppIcon>
    <h1 class="text-xl">Cycle Plan</h1>
  </header>
</template>

<script lang="ts">
import { useStore } from "../store";
import { computed, defineComponent } from "vue";
import TheAppIcon from "../assets/logo.svg?component";

export default defineComponent({
  components: { TheAppIcon },
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
