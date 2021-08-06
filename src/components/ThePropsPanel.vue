<template>
  <div class="props-panel">
    <h2 class="props-panel__title">Properties</h2>
    <span v-if="!task" class="italic">No task selected</span>
    <div v-else>
      <div class="props-panel__form">
        <span class="props-panel__label"> Name </span>
        <app-input class="props-panel__field font-semibold" v-model="name" />
        <span class="props-panel__label"> Duration </span>
        <app-click-to-edit
          class="props-panel__field font-semibold"
          input-class="font-semibold"
          v-model="duration"
          :validate="isPositiveNumber"
        />
        <span class="props-panel__label"> Start </span>
        <span class="props-panel__field">
          {{ task.earlyStart }}
        </span>
        <span class="props-panel__label"> Finish </span>
        <span class="props-panel__field">
          {{ task.earlyFinish }}
        </span>
        <span class="props-panel__label"> Slack </span>
        <span class="props-panel__field">
          {{ task.slack }}
        </span>
      </div>
      <app-divider :opacity="30" class="mt-2" />
      <h2 class="props-panel__title">Starting conditions</h2>
      <div class="px-1">
        <div class="props-panel__form">
          <span class="props-panel__label"> Not before </span>
          <app-click-to-edit
            class="props-panel__field font-bold"
            v-model="notBefore"
          />
        </div>
        <app-divider class="my-2" />
        <div v-for="cond in startingConds" :key="`${cond.from}-${cond.to}`">
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
              <option value="with">With</option>
              <option value="after">After</option>
            </select>
            <select
              class="col-span-8 font-semibold bg-transparent"
              :value="cond.taskFromId"
              @change="setLinkFrom(cond, $event.target.value)"
            >
              <option
                v-for="task in cond.possibleTaskFrom"
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
              @update:model-value="setLinkLag(cond, $event)"
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
        <div>
          <div class="flex flex-row">
            <span class="flex-grow"> Add new </span>
            <app-icon-button
              class="mx-2 text-xl"
              icon="mdi-plus"
              :disabled="!newLinkFrom"
              @click="createNewLink"
            ></app-icon-button>
          </div>
          <div class="grid grid-cols-12 gap-x-1 gap-y-2">
            <select
              class="
                col-span-4
                text-sm
                underline
                bg-transparent
                cursor-pointer
                move-left-1
                text-gray-500
              "
              v-model="newLinkMode"
            >
              <option value="with">With</option>
              <option value="after">After</option>
            </select>
            <select
              class="col-span-8 font-semibold bg-transparent text-gray-500"
              v-model="newLinkFrom"
            >
              <option value="">
                {{
                  possibleNewLinkFrom.length
                    ? "(select previous)"
                    : "(none available)"
                }}
              </option>
              <option
                v-for="task in possibleNewLinkFrom"
                :key="task.id"
                :value="task.id"
              >
                {{ task.name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ComputedRef, defineComponent, Ref, ref } from "vue";
import { Task } from "@/model/cycle";
import { useStore } from "@/store";
import { TaskState } from "@/store/state";
import { isPositiveNumber, isNumber } from "@/util";

interface StartingCond {
  mode: "with" | "after";
  taskFromId: number;
  taskFrom: string;
  lag: number;
  possibleTaskFrom: TaskState[];
}

function canFindAncestorTask(task: Task, indToBeFound: number): boolean {
  if (task.ind === indToBeFound) return true;
  for (const l of task.startIn.links) {
    if (canFindAncestorTask(l.from.task, indToBeFound)) return true;
  }
  return false;
}

export default defineComponent({
  setup() {
    const store = useStore();

    const task = computed(() => store.getters.currentTask);
    const taskInd = computed(() =>
      store.state.tasks.findIndex((t) => t.id === task.value?.id)
    );

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

    const possibleTaskFrom = (currTaskFrom: number | undefined) => {
      if (!task.value) return [];
      const taskId = task.value.id;

      return store.state.tasks.filter((t, index) => {
        if (t.id === taskId) return false;
        if (t.id === currTaskFrom) return true;
        if (store.getters.linkExists(t.id, taskId)) return false;

        const task = store.state.cycleGraph.tasks[index];
        return !canFindAncestorTask(task, taskInd.value);
      });
    };

    const startingConds: ComputedRef<StartingCond[]> = computed(() =>
      store.getters.linksToTask(store.state.currentTaskId).map((l) => ({
        mode: l.fromStart ? "with" : "after",
        taskFromId: l.from,
        taskFrom: store.getters.taskForId(l.from)?.name || "",
        lag: l.lag,
        possibleTaskFrom: possibleTaskFrom(l.from),
      }))
    );

    const setLinkMode = (cond: StartingCond, mode: "with" | "after") => {
      if (!task.value) return;
      store.commit("update-link", {
        from: cond.taskFromId,
        to: task.value.id,
        fromStart: mode === "with",
      });
    };

    const setLinkFrom = (cond: StartingCond, taskFrom: number) => {
      if (!task.value) return;
      store.commit("update-link-from", {
        from: cond.taskFromId,
        to: task.value.id,
        newFrom: taskFrom,
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

    const newLinkMode: Ref<"with" | "after"> = ref("after");

    const newLinkFrom: Ref<number | ""> = ref("");

    const possibleNewLinkFrom = computed(() => possibleTaskFrom(undefined));

    const createNewLink = () => {
      if (!task.value) return;
      if (!newLinkFrom.value) return;
      const newLink = {
        from: newLinkFrom.value,
        to: task.value.id,
        fromStart: newLinkMode.value === "with",
        lag: 0,
      };
      store.commit("create-link", newLink);
    };

    return {
      task,
      name,
      notBefore,
      duration,
      startingConds,
      setLinkMode,
      setLinkFrom,
      setLinkLag,
      deleteStartingCond,
      newLinkMode,
      newLinkFrom,
      possibleNewLinkFrom,
      createNewLink,
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
