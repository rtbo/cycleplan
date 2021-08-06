<template>
  <div class="props-panel">
    <h2 class="props-panel__title">Properties</h2>
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
      <app-divider :opacity="30" class="mt-2" />
      <h2 class="props-panel__title">Starting conditions</h2>
      <div class="px-1">
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
        <app-divider class="my-2" />
        <div v-for="(cond, index) in startingConds" :key="index">
          <div class="grid grid-cols-12 gap-x-1 gap-y-2">
            <select
              class="
                col-span-4
                text-sm
                underline
                bg-transparent
                cursor-pointer
                move-left-1
              "
              :value="cond.mode"
              @change="setLinkMode(cond, $event.target.value)"
            >
              <option value="with" class="add-colon">With</option>
              <option value="after" class="add-colon">After</option>
            </select>
            <select
              class="col-span-8 font-semibold bg-transparent"
              :value="cond.taskFromId"
            >
              <option
                v-for="task in possibleTaskFrom(cond.taskFromId)"
                :key="task.id"
                :value="task.id"
              >
                {{ task.name }}
              </option>
            </select>
            <span class="text-sm underline col-span-4 add-colon"> Lag </span>
            <app-click-to-edit
              class="col-span-6 font-semibold"
              input-class="font-semibold"
              :model-value="cond.lag"
              @update:model-value="setLinkLag(cond, value)"
              :validate="isNumber"
            />
            <app-button
              class="
                col-span-2
                bg-red-600
                dark:bg-red-400
                text-on-error
                mdi mdi-trash-can
              "
              @click="deleteStartingCond(cond.taskFromId)"
            ></app-button>
          </div>
          <app-divider class="my-2" />
        </div>
        <div class="flex flex-row">
          <div class="flex-grow"></div>
          <app-icon-button
            class="mx-2 text-xl"
            icon="mdi-plus"
          ></app-icon-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent } from "vue";
import { useStore } from "@/store";
import { isPositiveNumber, isNumber } from "@/util";

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

    const taskFromIds = computed(() =>
      startingConds.value.map((sc) => sc.taskFromId)
    );

    const possibleTaskFrom = (currTaskFrom: number | undefined) => {
      if (!task.value) return [];
      return store.state.tasks.filter(
        (t) =>
          (t.id === currTaskFrom || !taskFromIds.value.includes(t.id)) &&
          t.id !== task.value?.id
      );
    };

    const setLinkMode = (cond: StartingCond, mode: "with" | "after") => {
      if (!task.value) return;

      store.commit("update-link", {
        from: cond.taskFromId,
        to: task.value.id,
        fromStart: mode === "with",
      });
    };

    const setLinkLag = (cond: StartingCond, lag: string) => {
      if (!task.value) return;

      const lagVal = parseFloat(lag.replace(",", "."));
      if (!isNaN(lagVal)) {
        store.commit("update-link", {
          from: cond.taskFromId,
          to: task.value.id,
          lag: lagVal,
        });
      }
    };

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
      possibleTaskFrom,
      setLinkMode,
      setLinkLag,
      deleteStartingCond,
      isPositiveNumber,
      isNumber,
    };
  },
});
</script>

<style lang="postcss">
.props-panel {
  @apply h-full p-2 bg-on-background bg-opacity-5 border-l border-on-background border-opacity-20 dark:border-opacity-20;
  box-shadow: -5px 0px 10px -2px rgba(var(--color-on-background), 0.1);
}

.props-panel__title {
  @apply text-lg my-2;
}

.props-panel__form {
  @apply grid grid-cols-12 items-center gap-1;
}

.props-panel__label {
  @apply text-sm underline col-span-4;
  @apply add-colon;
}

/* .props-panel__label::after {
} */

.props-panel__field {
  @apply col-span-8;
}
</style>
