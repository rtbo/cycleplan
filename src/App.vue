<template>
  <div class="flex flex-col h-screen">
    <div class="flex-grow-0">
      <TheHeaderBar class="shadow-lg"></TheHeaderBar>
    </div>
    <main class="flex-grow">
      <splitpanes>
        <pane :size="panePos"> </pane>
        <pane :size="100 - panePos"> </pane>
      </splitpanes>
    </main>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watchEffect } from "vue";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import { useStore } from "./store";
import TheHeaderBar from "./components/TheHeaderBar.vue";

export default defineComponent({
  name: "App",

  components: { TheHeaderBar, Pane, Splitpanes },

  setup() {
    const store = useStore();
    const panePos = computed(() => store.state.panePos);

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
