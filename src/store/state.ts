import { CycleTimeMode } from "@/model/cycle";
import { planStateCycle } from "./algo";
import { makeNewTask } from "./mutations";

let currentId = 0;
export function newId(): number {
  return ++currentId;
}

export interface VerticalBounds {
  top: number;
  bottom: number;
}

export interface TaskState {
  id: number;
  selected: boolean;
  name: string;
  notStartBefore: number;
  duration: number;
  earlyStart: number;
  earlyFinish: number;
  lateStart: number;
  lateFinish: number;
  isCriticalPath: boolean;
  slack: number;
  tags: string[];
  color?: string;
  vbounds: VerticalBounds;
}

export interface LinkState {
  from: number;
  to: number;
  fromStart: boolean;
  lag: number;
}

export type EditMode = undefined | "task-insert" | "task-delete";

export type DarkMode = "media" | "light" | "dark";

/**
 * Separate interface for the cycle time input
 *
 * Allows to keep in the state some unused values of value, loopIn...
 * for when the user toggles the cycle time to a different mode
 */
export interface CycleTimeInput {
  mode: CycleTimeMode;
  fixedValue: number;
  loopIn?: number;
  loopOut?: number;
}

export interface State {
  name: string;
  tasks: TaskState[];
  links: LinkState[];
  cycleTimeInput: CycleTimeInput;
  cycleTime: number;

  currentTaskId: number | undefined;
  darkMode: DarkMode;
  headerVBounds: VerticalBounds;
  panePos: number;
  editMode: EditMode;

  timeScale: number;
  timeOffset: number;
}

export function createState(): State {
  const starter = [
    {
      name: "Load product",
      duration: 3,
    },
    {
      name: "Process product",
      duration: 6,
    },
    {
      name: "Unload product",
      duration: 2,
    },
  ];

  const headerH = 56;
  const rowH = 52;

  const tasks: TaskState[] = starter.map((t, index) => ({
    ...makeNewTask(t),
    vbounds: {
      top: headerH + index * rowH,
      bottom: headerH + (index + 1) * rowH,
    },
  }));

  const links = [
    {
      from: tasks[0].id,
      to: tasks[1].id,
      fromStart: false,
      lag: 0,
    },
    {
      from: tasks[1].id,
      to: tasks[2].id,
      fromStart: false,
      lag: 0,
    },
  ];
  const state: State = {
    name: "Processing equipment",
    tasks,
    links,
    cycleTimeInput: {
      mode: CycleTimeMode.Fixed,
      fixedValue: 13,
      loopIn: tasks[0].id,
      loopOut: tasks[2].id,
    },
    cycleTime: 13,

    currentTaskId: tasks[0].id,
    darkMode: (localStorage.getItem("dark-mode") as DarkMode) || "media",
    panePos: 33,
    editMode: undefined,
    headerVBounds: {
      top: 0,
      bottom: headerH,
    },
    timeScale: 30,
    timeOffset: 0,
  };

  planStateCycle(state);
  return state;
}
