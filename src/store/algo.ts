import { AtomTask, Cycle, mapCycleTime, planCycle } from "../model/cycle";
import { cycleTimeDef } from "./getters";
import { State } from "./state";

export function planStateCycle(state: State): void {
  const stateTasks = state.tasks;
  const tasks = stateTasks.map(
    (t) => new AtomTask(t.duration, t.notStartBefore)
  );
  const mapTask = (id: number) => {
    const ind = stateTasks.findIndex((t) => t.id === id);
    if (ind === -1) {
      throw new Error(`Inconsistent task id ${id} in state`);
    }
    return tasks[ind];
  };
  const cycle = new Cycle(tasks);
  for (const l of state.links) {
    const fromTask = mapTask(l.from);
    const toTask = mapTask(l.to);
    const from = l.fromStart ? fromTask.startOut : fromTask.finishOut;
    const to = toTask.startIn;
    cycle.link(from, to, l.lag);
  }
  cycle.cycleTime = mapCycleTime(cycleTimeDef(state), mapTask);
  const plan = planCycle(cycle);
  plan.tasks.forEach((tp, index) => {
    stateTasks[index].earlyStart = tp.earlyStart;
    stateTasks[index].earlyFinish = tp.earlyFinish;
    stateTasks[index].lateStart = tp.lateStart;
    stateTasks[index].lateFinish = tp.lateFinish;
    stateTasks[index].slack = tp.slack;
    stateTasks[index].isCriticalPath = tp.isCriticalPath;
  });
  state.cycleTime = plan.cycleTime;
  state.tasks = stateTasks;
}
