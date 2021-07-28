import { AtomTask, Cycle, planCycle, Task } from "../../src/model/cycle";
import { expect } from "chai";

describe("Basic cycle", function () {
  let cycle: Cycle;
  let tasks: Task[];

  beforeEach(function () {
    tasks = [new AtomTask(2), new AtomTask(3), new AtomTask(5)];
    cycle = new Cycle(tasks);
    cycle.link(tasks[0].finishOut, tasks[1].startIn);
    cycle.link(tasks[1].finishOut, tasks[2].startIn);
  });

  it("should contain tasks", function () {
    const cp = planCycle(cycle);

    expect(cp.tasks[0].task).to.eq(tasks[0]);
    expect(cp.tasks[1].task).to.eq(tasks[1]);
    expect(cp.tasks[2].task).to.eq(tasks[2]);
  });

  it("should plan", function () {
    const cp = planCycle(cycle);

    expect(cp.tasks[0]).to.include({
      earlyStart: 0,
      earlyFinish: 2,
    });
    expect(cp.tasks[1]).to.include({
      earlyStart: 2,
      earlyFinish: 5,
    });
    expect(cp.tasks[2]).to.include({
      earlyStart: 5,
      earlyFinish: 10,
    });
  });

  it("should report slack and critical path", function () {
    const cp = planCycle(cycle);

    expect(cp.tasks.map((t) => t.slack)).to.eql([0, 0, 0]);
    expect(cp.tasks.map((t) => t.isCriticalPath)).to.eql([true, true, true]);
  });

  it("should report cycle time", function () {
    const cp = planCycle(cycle);

    expect(cp.cycleTime).to.eq(10);
  });
});
