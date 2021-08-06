import { planStateCycle } from "./algo";
import {
  EditMode,
  State,
  TaskState,
  VerticalBounds,
  newId,
  CycleTimeInput,
  DarkMode,
} from "./state";

export type MutationTypes =
  | "edit-mode"
  | "dark-mode"
  | "vertical-bounds"
  | "cycle-name"
  | "insert-task"
  | "append-task"
  | "update-task"
  | "update-task-plan";

type NewTaskInput = { name?: string; duration?: number };

export function makeNewTask(input: NewTaskInput): TaskState {
  const name = input.name || "Task";
  const duration = input.duration || 1;
  return {
    id: newId(),
    selected: false,
    name,
    notStartBefore: 0,
    earlyStart: 0,
    earlyFinish: duration,
    lateStart: 0,
    lateFinish: duration,
    duration,
    slack: 0,
    isCriticalPath: false,
    tags: [],
    vbounds: {
      top: 0,
      bottom: 0,
    },
  };
}

export const mutations = {
  "edit-mode": (state: State, value: EditMode): void => {
    state.editMode = value;
  },

  "current-task": (state: State, currentId: number | undefined): void => {
    state.currentTaskId = currentId;
  },

  "selected-tasks": (state: State, value: number[]): void => {
    state.tasks.forEach((t) => {
      t.selected = value.includes(t.id);
    });
  },

  "select-task": (
    state: State,
    { id, selected }: { id: number; selected: boolean }
  ): void => {
    const t = state.tasks.find((t) => t.id === id);
    if (t) t.selected = selected;
  },

  "dark-mode": (state: State, value: DarkMode): void => {
    state.darkMode = value;
    localStorage.setItem("dark-mode", value);
  },

  "vertical-bounds": (
    state: State,
    { header, rows }: { header: VerticalBounds; rows: VerticalBounds[] }
  ): void => {
    if (rows.length !== state.tasks.length) {
      throw new Error("inconsistent vertical-bounds row number");
    }
    state.headerVBounds = header;
    state.tasks = state.tasks.map((task, index) => ({
      ...task,
      vbounds: rows[index],
    }));
  },

  "cycle-name": (state: State, value: string): void => {
    state.name = value;
  },

  "cycle-time-input": (
    state: State,
    payload: Partial<CycleTimeInput>
  ): void => {
    state.cycleTimeInput = {
      ...state.cycleTimeInput,
      ...payload,
    };
    planStateCycle(state);
  },

  "insert-task": (
    state: State,
    value: NewTaskInput & { index: number }
  ): void => {
    state.tasks.splice(value.index, 0, makeNewTask(value));
    planStateCycle(state);
  },

  "append-task": (state: State, value: NewTaskInput): void => {
    state.tasks.push(makeNewTask(value));
    planStateCycle(state);
  },

  "update-task": (
    state: State,
    task: Partial<TaskState> & { id: number }
  ): void => {
    const ind = state.tasks.findIndex((t) => t.id === task.id);
    const updated = {
      ...state.tasks[ind],
      ...task,
    };
    state.tasks[ind] = updated;
  },

  "update-task-plan": (
    state: State,
    task: Partial<TaskState> & { id: number }
  ): void => {
    const ind = state.tasks.findIndex((t) => t.id === task.id);
    const updated = {
      ...state.tasks[ind],
      ...task,
    };
    state.tasks[ind] = updated;
    planStateCycle(state);
  },

  "delete-tasks": (state: State, ids: number[]): void => {
    state.tasks = state.tasks.filter((t) => !ids.includes(t.id));
    state.links = state.links.filter((l) => {
      for (const id of ids) {
        if (l.from === id || l.to === id) {
          return false;
        }
      }
      return true;
    });

    if (state.currentTaskId && ids.includes(state.currentTaskId))
      state.currentTaskId = undefined;

    planStateCycle(state);
  },

  "delete-link": (
    state: State,
    { from, to }: { from: number; to: number }
  ): void => {
    state.links = state.links.filter((l) => l.from !== from || l.to !== to);

    planStateCycle(state);
  },
};

export type Mutations = typeof mutations;
