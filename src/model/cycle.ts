/**
 * Main API to calculate cycles
 * There is first the task API (Task, Cycle, etc.) which describe tasks and how they relate to each other
 * Then, there is the plan API (TaskPlan, CyclePlan, etc.) which contain scheduled tasks with start and end times
 */

/**
 * Interface for an object that can plan itself
 */
export interface Planner {
  /**
   * Forward planning for early times
   * @param ctx the ctx for each task to retrieve its plan
   * @param earlyStart the minimal early start to consider for this plan
   */
  forwardPlan(ctx: PlanContext, earlyStart: number): number;
  /**
   * Backward planning for late times
   * @param ctx the ctx for each task to retrieve its plan
   * @param lateFinish the maximal late finish to consider for this plan
   */
  backwardPlan(plan: PlanContext, lateFinish: number): number;
}

/**
 * Each task has in-docks and out-docks
 * Docks are starting points for dependencies
 */
abstract class Dock {
  constructor(public readonly task: Task) {}

  readonly links = new Array<Link>();

  get docked(): boolean {
    return this.links.length != 0;
  }
}

/**
 * A dock for in-coming links
 */
class InDock extends Dock {}
/**
 * A dock for out-going links
 */
class OutDock extends Dock {}

export class Link {
  private constructor(
    public readonly from: OutDock,
    public readonly to: InDock,
    public readonly lag: number
  ) {}

  static create(from: OutDock, to: InDock, lag = 0): Link {
    const l = new Link(from, to, lag);
    from.links.push(l);
    to.links.push(l);
    return l;
  }
}

export abstract class Task implements Planner {
  readonly startIn = new InDock(this);
  readonly startOut = new OutDock(this);
  readonly finishOut = new OutDock(this);

  /** index of the task within the cycle */
  ind = 0;

  /**
   * Forward planning for early times
   * @param ctx the ctx for each task to retrieve its plan
   * @param earlyStart the minimal early start to consider for this plan
   */
  abstract forwardPlan(ctx: PlanContext, earlyStart: number): number;

  /**
   * Backward planning for late times
   * @param ctx the ctx for each task to retrieve its plan
   * @param lateFinish the maximal late finish to consider for this plan
   */
  abstract backwardPlan(ctx: PlanContext, lateFinish: number): number;

  /**
   * A Task "seeds" a cycle if it there are no tasks before it.
   */
  get seeds(): boolean {
    return this.startIn.links.length == 0;
  }

  /**
   * A Task "leaves" a cycle if it there are no tasks after it.
   */
  get leaves(): boolean {
    return this.startOut.links.length == 0 && this.finishOut.links.length == 0;
  }
}

export class AtomTask extends Task {
  constructor(public duration: number) {
    super();
  }

  forwardPlan(ctx: PlanContext, earlyStart: number): number {
    const plan = ctx.lookUp(this);

    plan.earlyStart = Math.max(earlyStart, plan.earlyStart);
    plan.earlyFinish = plan.earlyStart + this.duration;

    let res = plan.earlyFinish;

    for (const l of this.startOut.links) {
      res = Math.max(res, l.to.task.forwardPlan(ctx, plan.earlyStart + l.lag));
    }
    for (const l of this.finishOut.links) {
      res = Math.max(res, l.to.task.forwardPlan(ctx, plan.earlyFinish + l.lag));
    }
    return res;
  }

  backwardPlan(ctx: PlanContext, lateFinish: number): number {
    const plan = ctx.lookUp(this);

    plan.lateFinish = Math.min(lateFinish, plan.lateFinish);
    plan.lateStart = plan.lateFinish - this.duration;

    let res = plan.lateStart;
    for (const l of this.startIn.links) {
      res = Math.min(
        res,
        l.from.task.backwardPlan(ctx, plan.lateStart - l.lag)
      );
    }
    return res;
  }
}

export enum CycleTimeMode {
  Auto = "auto",
  Fixed = "fixed",
  Loop = "loop",
}

/**
 * Definition of the looping cycle time is set by selecting on which tasks we loop
 * to the previous and next cycle.
 *
 * Using generics allows to map this type to another where the task is not referenced
 * in the same way (the store references tasks by number id).
 */
export interface LoopCycleTime<T> {
  /** mode is set to loop */
  mode: CycleTimeMode.Loop;
  /** At start of cycle, the loopIn task is starting */
  loopIn?: T;
  /** The cycle can loop when all tasks attached to the loopOut dock are done */
  loopOut?: T;
}

/**
 * Cycle time can be set to a fixed value through this interface
 */
export interface FixedCycleTime<T> {
  /** mode is set to value */
  mode: CycleTimeMode.Fixed;
  /** Optionally, the cycle time starts by a task */
  loopIn?: T;
  /** The value of the cycle time */
  value: number;
}

/**
 * Cycle time can be set to automatic, which mean it will loop at the end of the last task
 * to the start of the first task of the next cycle (no overlap possible)
 */
export interface AutoCycleTime {
  /** mode is set to auto */
  mode: CycleTimeMode.Auto;
}

export type CycleTime<T> = LoopCycleTime<T> | FixedCycleTime<T> | AutoCycleTime;

export function isAutoCycleTime<T>(ct: CycleTime<T>): ct is AutoCycleTime {
  return ct.mode === CycleTimeMode.Auto;
}

export function isFixedCycleTime<T>(ct: CycleTime<T>): ct is FixedCycleTime<T> {
  return ct.mode === CycleTimeMode.Fixed;
}

export function isLoopCycleTime<T>(ct: CycleTime<T>): ct is LoopCycleTime<T> {
  return ct.mode === CycleTimeMode.Loop;
}

export function mapCycleTime<F, T>(
  ct: CycleTime<F>,
  fn: (task: F) => T
): CycleTime<T> {
  if (isLoopCycleTime(ct)) {
    return {
      mode: ct.mode,
      loopIn: ct.loopIn !== undefined ? fn(ct.loopIn) : undefined,
      loopOut: ct.loopOut !== undefined ? fn(ct.loopOut) : undefined,
    };
  } else if (isFixedCycleTime(ct)) {
    return {
      mode: ct.mode,
      loopIn: ct.loopIn != undefined ? fn(ct.loopIn) : undefined,
      value: ct.value,
    };
  } else {
    return {
      mode: ct.mode,
    };
  }
}

export class Cycle {
  constructor(readonly tasks: Task[] = new Array<Task>()) {}

  cycleTime: CycleTime<Task> = { mode: CycleTimeMode.Auto };

  get seedingTasks(): Task[] {
    return this.tasks.filter((t) => t.seeds);
  }

  get leavingTasks(): Task[] {
    return this.tasks.filter((t) => t.leaves);
  }

  link(from: OutDock, to: InDock, lag = 0): Link {
    return Link.create(from, to, lag);
  }
}

interface PlanContext {
  lookUp(task: Task): TaskPlan;
}

export interface PlanTimes {
  earlyStart: number;
  earlyFinish: number;
  lateStart: number;
  lateFinish: number;
}

export class TaskPlan implements PlanTimes {
  earlyStart = 0;
  earlyFinish = 0;
  lateStart = 0;
  lateFinish = 0;

  constructor(public readonly task: Task, public readonly index: number) {}

  get times(): PlanTimes {
    return {
      earlyStart: this.earlyStart,
      earlyFinish: this.earlyFinish,
      lateStart: this.lateStart,
      lateFinish: this.lateFinish,
    };
  }

  get slack(): number {
    return this.lateStart - this.earlyStart;
  }

  get isCriticalPath(): boolean {
    return this.slack == 0;
  }
}

export class CyclePlan implements PlanContext {
  constructor(
    public readonly cycle: Cycle,
    public readonly tasks: TaskPlan[]
  ) {}

  lookUp(task: Task): TaskPlan {
    return this.tasks[task.ind];
  }

  cycleTime = 0;
}

export function planCycle(cycle: Cycle): CyclePlan {
  cycle.tasks.forEach((t, i) => {
    t.ind = i;
  });

  const plan = new CyclePlan(
    cycle,
    cycle.tasks.map((t, index) => new TaskPlan(t, index))
  );

  let time = 0;
  for (const t of cycle.seedingTasks) {
    time = Math.max(time, t.forwardPlan(plan, 0));
  }

  let finish: number;
  if (isFixedCycleTime(cycle.cycleTime)) {
    finish = cycle.cycleTime.value;
  } else if (isLoopCycleTime(cycle.cycleTime) && cycle.cycleTime.loopOut) {
    finish = plan.lookUp(cycle.cycleTime.loopOut).earlyFinish;
  } else {
    finish = time;
  }

  plan.tasks.forEach((tp) => (tp.lateFinish = finish));

  for (const t of cycle.leavingTasks) {
    t.backwardPlan(plan, finish);
  }

  const ct = cycle.cycleTime;
  if (isLoopCycleTime(ct)) {
    const loopIn = plan.lookUp(ct.loopIn as Task).earlyStart;
    const loopOut = plan.lookUp(ct.loopOut as Task).earlyFinish;
    if (loopOut < loopIn) {
      throw new Error("Cycle can't loop out before it loops in");
    }
    plan.cycleTime = loopOut - loopIn;
  } else if (isFixedCycleTime(ct)) {
    plan.cycleTime = ct.value;
  } else {
    plan.cycleTime = finish;
  }

  return plan;
}

export function makeTestCycle(): Cycle {
  const tasks = [new AtomTask(2), new AtomTask(3), new AtomTask(5)];
  const cycle = new Cycle(tasks);
  cycle.link(tasks[0].finishOut, tasks[1].startIn);
  cycle.link(tasks[1].finishOut, tasks[2].startIn);
  return cycle;
}
