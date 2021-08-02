import { computed, ComputedRef, inject, InjectionKey, provide } from "vue";

export interface GanttStyle {
  dark: boolean;
  taskBar: string;
  cycleLine: string;
  ruler: string;
  grad: string;
  text: string;
}

const darkKey: InjectionKey<ComputedRef<boolean>> = Symbol();
const appStyleKey: InjectionKey<ComputedRef<GanttStyle>> = Symbol();
const stageWidthKey: InjectionKey<ComputedRef<number>> = Symbol();
const stageHeightKey: InjectionKey<ComputedRef<number>> = Symbol();


export function provideDark(dark: ComputedRef<boolean>): void {
  provide(darkKey, dark);
}

export function useDark(): ComputedRef<boolean> | undefined {
  return inject(darkKey);
}

export function provideAppStyle(dark: ComputedRef<boolean>): void {
  const ganttStyle = computed(() => {
    const style = getComputedStyle(document.documentElement);

    return {
      dark: dark.value,
      taskBar: style.getPropertyValue("--color-gantt-task-bar"),
      cycleLine: style.getPropertyValue("--color-gantt-cycle-line"),
      ruler: style.getPropertyValue("--color-gantt-ruler"),
      grad: style.getPropertyValue("--color-gantt-grad"),
      text: style.getPropertyValue("color"),
    };
  });
  provide(appStyleKey, ganttStyle);
}

export function useGanttStyle(): ComputedRef<GanttStyle> {
  return inject(appStyleKey) as ComputedRef<GanttStyle>;
}

export function provideStageWidth(stageWidth: ComputedRef<number>): void {
  provide(stageWidthKey, stageWidth);
}

export function provideStageHeight(stageHeight: ComputedRef<number>): void {
  provide(stageHeightKey, stageHeight);
}

export function injectStageWidth(): ComputedRef<number> {
  return inject(stageWidthKey) as ComputedRef<number>;
}

export function injectStageHeight(): ComputedRef<number> {
  return inject(stageHeightKey) as ComputedRef<number>;
}
