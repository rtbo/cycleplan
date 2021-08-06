<template>
  <div
    class="
      h-full
      p-2
      bg-on-background bg-opacity-5
      border-l border-on-background border-opacity-20
      dark:border-opacity-20
      props-panel
    "
  >
    <h2 class="text-lg">Properties</h2>
    <span v-if="!task" class="italic">No task selected</span>
    <div v-else>
      <div class="props-panel__form">
        <label for="props-panel__name" class="props-panel__label"> Name </label>
        <app-input
          id="props-panel__name"
          class="props-panel__field font-semibold"
          v-model="name"
        />
        <label for="props-panel__duration" class="props-panel__label">
          Duration
        </label>
        <app-click-to-edit
          id="props-panel__duration"
          class="props-panel__field font-semibold"
          input-class="font-semibold"
          v-model="duration"
          :validate="isPositiveNumber"
        />
        <label for="props-panel__start" class="props-panel__label">
          Start
        </label>
        <span id="props-panel__start" class="props-panel__field">
          {{ task.earlyStart }}
        </span>
        <label for="props-panel__finish" class="props-panel__label">
          Finish
        </label>
        <span id="props-panel__start" class="props-panel__field">
          {{ task.earlyFinish }}
        </span>
        <label for="props-panel__slack" class="props-panel__label">
          Slack
        </label>
        <span id="props-panel__slack" class="props-panel__field">
          {{ task.slack }}
        </span>
      </div>
      <app-divider :opacity="30" />
      <h2 class="text-lg">Starting conditions</h2>
      <div class="props-panel__form">
        <label for="props-panel__not-before" class="props-panel__label">
          Not before
        </label>
        <app-click-to-edit
          id="props-panel__not-before"
          class="props-panel__field font-bold"
          v-model="notBefore"
        />
      </div>
      <div v-for="(cond, index) in startingConds" :key="index">
        <app-divider />
        <div class="flex flex-row items-center p-2">
          <div class="flex-grow"></div>
          <div>
            <app-button
              class="bg-red-600 dark:bg-red-400 text-on-error mdi mdi-trash-can"
              @click="deleteStartingCond(cond.taskFromId)"
            ></app-button>
          </div>
        </div>
      </div>
      <div class="flex flex-row justify-end">
        <app-icon-button class="mx-3 text-xl" icon="mdi-plus"></app-icon-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "@/store";
import { isPositiveNumber } from "@/util";

interface StartingCond {
  mode: "with" | "after";
  taskFromId: number;
  taskFrom: string;
  lag: number;
}

export default defineComponent({
  setup() {
    const store = useStore();

    const task = computed(() => store.getters.currentTask);

    const name = computed({
      get: () => task.value?.name,
      set(name) {
        if (task.value)
          store.commit("update-task", { id: task.value.id, name });
      },
    });

    const notBefore = computed({
      get: () => task.value?.notStartBefore.toString() || "",
      set(notStartBefore: string) {
        if (task.value)
          store.commit("update-task-plan", {
            id: task.value.id,
            notStartBefore: parseFloat(notStartBefore.replace(",", ".")),
          });
      },
    });

    const duration = computed({
      get: () => task.value?.duration.toString() || "",
      set(duration: string) {
        if (task.value)
          store.commit("update-task-plan", {
            id: task.value.id,
            duration: parseFloat(duration.replace(",", ".")),
          });
      },
    });

    const startingConds: ComputedRef<StartingCond[]> = computed(() =>
      store.getters.linksToTask(store.state.currentTaskId).map((l) => ({
        mode: l.fromStart ? "with" : "after",
        taskFromId: l.from,
        taskFrom: store.getters.taskForId(l.from)?.name || "",
        lag: l.lag,
      }))
    );

    const deleteStartingCond = (taskFromId: number) => {
      if (task.value)
        store.commit("delete-link", { from: taskFromId, to: task.value.id });
    };

    return {
      task,
      name,
      notBefore,
      duration,
      startingConds,
      deleteStartingCond,
      isPositiveNumber,
    };
  },
});
</script>

<style lang="postcss">
.props-panel {
  box-shadow: -5px 0px 10px -2px rgba(var(--color-on-background), 0.1);
}
.props-panel__form {
  @apply grid grid-cols-12 items-center gap-1 my-2;
}
.props-panel__label {
  @apply text-sm underline col-span-4;
}
.props-panel__field {
  @apply col-span-8;
}
</style>
