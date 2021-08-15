<template>
  <div class="overflow-x-auto h-full px-1">
    <table id="task-table" class="table-auto w-full">
      <thead>
        <tr class="border-b border-opacity-75 dark:border-opacity-50 h-12">
          <th v-if="deleteMode" class="px-1 text-center">
            <app-button
              :disabled="selectedTasks.length === 0"
              class="
                bg-red-600
                p-1
                dark:bg-red-400
                text-center text-white
                dark:text-black
              "
              @click="deleteSelected"
            >
              <span class="iconify" data-icon="mdi:trash-can"></span>
            </app-button>
          </th>
          <th scope="col" class="text-left">Name</th>
          <th
            v-for="header in headers"
            :key="header.value"
            scope="col"
            class="px-3"
          >
            {{ header.text }}
          </th>
        </tr>
      </thead>
      <tbody @mouseleave="insertSlot = undefined">
        <tr
          v-for="row in rows"
          :key="row.id"
          class="border-b border-opacity-75 dark:border-opacity-50"
          :class="rowDynClasses(row)"
          v-on="rowDynHandlers(row)"
        >
          <td v-if="deleteMode" class="text-center">
            <input type="checkbox" v-model="selectedTasks" :value="row.id" />
          </td>
          <th scope="row" v-if="!row.insert" class="text-left">
            <app-click-to-edit
              :model-value="row.name"
              @update:model-value="updateTask(row, 'name', $event)"
            />
          </th>
          <!-- eslint-disable vue/no-use-v-if-with-v-for -->
          <td
            v-if="!row.insert"
            v-for="{ editable, mapValue, value, validate } in headers"
            :key="value"
            class="text-right px-3"
          >
            <app-click-to-edit
              v-if="editable"
              :model-value="row[value]"
              :validate="validate"
              @update:model-value="
                updateTaskPlan(row, value, mapValue ? mapValue($event) : $event)
              "
              input-class="w-16 text-right"
              pencil-before
            />
            <span
              v-else
              :class="{ 'error-text': validate && !validate(row[value]) }"
            >
              {{ row[value] }}
            </span>
          </td>
          <!-- The insert slot is here -->
          <td
            v-if="row.insert"
            :colspan="headers.length + 1"
            class="bg-pink-600 dark:bg-pink-400 cursor-pointer"
            @click="insertTask"
          ></td>
        </tr>
        <!-- The next and last row is used to append tasks at the end of the task list -->
        <tr
          id="append-task-row"
          class="h-10"
          @mouseenter="insertSlot = undefined"
        >
          <td v-if="deleteMode"></td>
          <td>
            <app-input
              placeholder="Append Task here"
              v-model="appendTaskName"
              @keydown.esc="appendTaskCancel"
              @keyup.enter="appendTask"
              ref="appendTaskEl"
            />
            <app-icon-button
              v-show="!!appendTaskName"
              @click="appendTask"
              icon="mdi:keyboard-return"
            />
            <app-icon-button
              v-show="!!appendTaskName"
              @click="appendTaskCancel"
              icon="mdi:keyboard-esc"
            />
          </td>
          <td v-for="header in headers" :key="header.value"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import {
  computed,
  ComputedRef,
  defineComponent,
  nextTick,
  onMounted,
  ref,
  Ref,
  watch,
} from "vue";
import { useStore } from "@/store";
import { TaskState, VerticalBounds } from "@/store/state";
import { isPositiveInt } from "@/util";

function elVerticalBounds(el: Element, offset = 0): VerticalBounds {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + offset,
    bottom: rect.bottom + offset,
  };
}

type InsertRow = { id: -1; insert: true };
type Row = InsertRow | TaskState;

function isInsertRow(row: Row): row is InsertRow {
  return (row as InsertRow).insert === true;
}

export default defineComponent({
  setup() {
    const store = useStore();

    const headers = [
      {
        text: "Duration",
        value: "duration",
        editable: true,
        validate: isPositiveInt,
        mapValue: parseInt,
        align: "end",
      },
      {
        text: "Start",
        value: "earlyStart",
        align: "end",
      },
      {
        text: "Finish",
        value: "earlyFinish",
        align: "end",
      },
      {
        text: "Slack",
        value: "slack",
        align: "end",
        validate: isPositiveInt,
      },
    ];

    const updateVerticalGeometry = () => {
      const comp = document.querySelector("#task-table");
      const headerEl = document.querySelector("#task-table thead");
      const rowEls = document.querySelectorAll("#task-table tbody tr.task-row");

      const offset = -(comp?.getBoundingClientRect().top as number);

      const vbounds = {
        header: elVerticalBounds(headerEl as Element, offset),
        rows: Array.from(rowEls, (val: Element) =>
          elVerticalBounds(val, offset)
        ),
      };
      store.commit("vertical-bounds", vbounds);
    };

    const editMode = computed(() => store.state.editMode);
    const insertMode = computed(() => editMode.value === "task-insert");
    const deleteMode = computed(() => editMode.value === "task-delete");

    const tasks = computed(() => store.state.tasks);

    const selectedTasks = computed({
      get: () => store.getters.selectedTasks,
      set(value: number[]) {
        store.commit("selected-tasks", value);
      },
    });

    const insertSlot: Ref<undefined | number> = ref(undefined);

    const rows: ComputedRef<Row[]> = computed(() => {
      const tsks: Row[] = tasks.value;
      if (insertSlot.value !== undefined) {
        return [
          ...tsks.slice(0, insertSlot.value),
          { id: -1, insert: true },
          ...tsks.slice(insertSlot.value),
        ];
      }
      return tsks;
    });

    const rowDynClasses = (row: Row) => {
      if (isInsertRow(row)) {
        return ["insert-row", "h-3"];
      } else {
        const classes = ["task-row", "h-10", "bg-indigo-500"];
        if (store.state.currentTaskId === row.id) {
          classes.push("bg-opacity-20");
        } else {
          classes.push("bg-opacity-0", "hover:bg-opacity-10");
        }
        return classes;
      }
    };

    const rowDynHandlers = (row: Row) => {
      const handlers: {
        click?: () => void;
        mousemove?: (ev: MouseEvent) => void;
      } = {};

      if (!isInsertRow(row)) {
        handlers.click = () => store.commit("current-task", row.id);

        if (insertMode.value) {
          handlers.mousemove = (event) => updateInsertSlot(row, event);
        }
      }
      return handlers;
    };

    const updateInsertSlot = (
      { id, vbounds }: TaskState,
      event: MouseEvent
    ) => {
      if (id === -1) return;

      const slt = tasks.value.findIndex((t) => t.id === id);

      const low = (vbounds.bottom - vbounds.top) / 2;
      insertSlot.value = event.offsetY > low ? slt + 1 : slt;
    };

    watch(insertSlot, () => {
      nextTick(updateVerticalGeometry);
    });

    const insertTask = () => {
      if (editMode.value != "task-insert") return;
      if (insertSlot.value === undefined) return;

      store.commit("insert-task", { index: insertSlot.value });
      insertSlot.value = undefined;

      nextTick(updateVerticalGeometry);
    };

    const appendTaskName = ref("");
    const appendTaskEl: Ref<HTMLElement | null> = ref(null);
    const appendTask = () => {
      const name = appendTaskName.value;
      if (!name) return;
      store.commit("append-task", { name, duration: 1 });
      appendTaskName.value = "";
      (appendTaskEl.value as HTMLElement).focus();

      nextTick(updateVerticalGeometry); // todo updateVerticalGeometry in watcher
    };
    const appendTaskCancel = () => {
      appendTaskName.value = "";
      (document.activeElement as HTMLElement)?.blur();
    };

    const updateTask = (
      task: TaskState,
      prop: string,
      value: string | number
    ) => {
      store.commit("update-task", {
        id: task.id,
        [prop]: value,
      });
    };
    const updateTaskPlan = (
      task: TaskState,
      prop: string,
      value: string | number
    ) => {
      store.commit("update-task-plan", {
        id: task.id,
        [prop]: value,
      });
    };

    const deleteSelected = () => {
      store.commit("delete-tasks", selectedTasks.value);
      store.commit("edit-mode", undefined);
      nextTick(updateVerticalGeometry);
    };

    onMounted(updateVerticalGeometry);

    return {
      headers,
      rows,
      rowDynClasses,
      rowDynHandlers,

      selectedTasks,

      editMode,

      insertSlot,
      insertMode,
      updateInsertSlot,
      insertTask,

      appendTaskName,
      appendTaskEl,
      appendTask,
      appendTaskCancel,
      updateTask,
      updateTaskPlan,

      deleteMode,
      deleteSelected,
    };
  },
});
</script>
