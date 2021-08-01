import { computed, ComputedRef, inject, InjectionKey, provide } from "vue";

export interface AppStyle {
  dark: boolean;
  taskBar: string;
  cycleLine: string;
  textColor: string;
}

const darkKey: InjectionKey<ComputedRef<boolean>> = Symbol();
const appStyleKey: InjectionKey<ComputedRef<AppStyle>> = Symbol();

export function provideDark(dark: ComputedRef<boolean>): void {
  provide(darkKey, dark);
}

export function useDark(): ComputedRef<boolean> | undefined {
  return inject(darkKey);
}

export function provideAppStyle(dark: ComputedRef<boolean>): void {
  const appStyle = computed(() => {
    const style = getComputedStyle(document.documentElement);

    return {
      dark: dark.value,
      taskBar: style.getPropertyValue("--color-task-bar"),
      cycleLine: style.getPropertyValue("--color-cycle-line"),
      textColor: style.getPropertyValue("color"),
    };
  });
  provide(appStyleKey, appStyle);
}

export function useAppStyle(): ComputedRef<AppStyle> | undefined {
  return inject(appStyleKey);
}
