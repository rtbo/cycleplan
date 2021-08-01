<template>
  <table id="task-table" class="mx-1 table-auto w-full">
    <thead>
      <tr class="border-b border-opacity-75 dark:border-opacity-50 h-12">
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
        :class="row.insert ? 'insert-row' : 'task-row'"
        class="border-b border-opacity-75 dark:border-opacity-50 h-10"
        @mouseover="updateInsertSlot(row.id)"
      >
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
            :max-input-width="40"
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
          @click="insertTask"
        ></td>
      </tr>
      <!-- The next and last row is used to append tasks at the end of the task list -->
      <tr
        id="append-task-row"
        class="h-10"
        @mouseenter="insertSlot = undefined"
      >
        <td>
          <input
            placeholder="Append Task here"
            class="
              bg-on-surface bg-opacity-5
              outline-none
              ring-1 ring-on-surface ring-opacity-20
              rounded-sm
              text-on-surface text-opacity-80
              placeholder-on-surface placeholder-opacity-20
              focus:bg-opacity-10 focus:ring-opacity-50 focus:ring-2
            "
            v-model="appendTaskName"
            @keydown.esc="appendTaskCancel"
            @keyup.enter="appendTask"
            ref="appendTaskEl"
          />
          <button v-show="!!appendTaskName" @click="appendTask">
            <span class="mdi mdi-keyboard-return"></span>
          </button>
          <button v-show="!!appendTaskName" @click="appendTaskCancel">
            <span class="mdi mdi-keyboard-esc"></span>
          </button>
        </td>
        <td v-for="header in headers" :key="header.value"></td>
      </tr>
    </tbody>
  </table>
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
import { isPositiveInt } from "./util";
import { useStore } from "../store";
import { TaskState, VerticalBounds } from "../store/state";

function elVerticalBounds(el: Element, offset = 0): VerticalBounds {
  const rect = el.getBoundingClientRect();
  return {
    top: rect.top + offset,
    bottom: rect.bottom + offset,
  };
}

type InsertRow = { id: -1; insert: true };
type Row = InsertRow | TaskState;

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

    const insertSlot: Ref<undefined | number> = ref(undefined);

    const tasks = computed(() => store.state.tasks);

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

    const updateInsertSlot = (id: number) => {
      if (editMode.value != "task-insert") return;
      if (id === -1) return;

      insertSlot.value = tasks.value.findIndex((t) => t.id === id);
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

    onMounted(updateVerticalGeometry);

    return {
      headers,
      rows,

      insertSlot,
      updateInsertSlot,
      insertTask,

      appendTaskName,
      appendTaskEl,
      appendTask,
      appendTaskCancel,
      updateTask,
      updateTaskPlan,
    };
  },
});
</script>
