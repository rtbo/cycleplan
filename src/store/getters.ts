import { CycleTime, CycleTimeMode } from "../model/cycle";
import { State, TaskState, VerticalBounds } from "./state";

export function cycleTimeDef(state: State): CycleTime<number> {
  switch (state.cycleTimeInput.mode) {
    case CycleTimeMode.Auto:
      return { mode: CycleTimeMode.Auto };
    case CycleTimeMode.Loop:
      return {
        mode: CycleTimeMode.Loop,
        loopIn: state.cycleTimeInput.loopIn,
        loopOut: state.cycleTimeInput.loopOut,
      };
    case CycleTimeMode.Fixed:
      return {
        mode: CycleTimeMode.Fixed,
        value: state.cycleTimeInput.fixedValue,
      };
  }
}

export const getters = {
  cycleTimeDef,

  taskForId:
    (state: State) =>
    (id: number | undefined): TaskState | undefined =>
      id === undefined ? undefined : state.tasks.find((t) => t.id === id),

  vbounds: (state: State): VerticalBounds => {
    const header = state.headerVBounds;
    if (!state.tasks.length) return header;

    const last = state.tasks[state.tasks.length - 1].vbounds;
    return {
      top: header.top,
      bottom: last.bottom,
    };
  },

  headerHeight: (state: State): number =>
    state.headerVBounds.bottom - state.headerVBounds.top,

  time2px:
    (state: State) =>
    (time: number): number =>
      (time - state.timeOffset) * state.timeScale,

  px2time:
    (state: State) =>
    (px: number): number =>
      state.timeOffset + px / state.timeScale,
};

export type Getters = typeof getters;
