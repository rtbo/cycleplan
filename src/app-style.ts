import {
  computed,
  ComputedRef,
  inject,
  InjectionKey,
  provide,
  Ref,
  ref,
} from "vue";

export interface AppStyle {
  darkMode: boolean;
  taskBar: string;
  cycleLine: string;
  textColor: string;
}

const darkModeKey: InjectionKey<ComputedRef<boolean>> = Symbol();
const appStyleKey: InjectionKey<ComputedRef<AppStyle>> = Symbol();

function darkModeRef(): Ref<boolean> {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const darkMode = ref(mq.matches);

  mq.addEventListener("change", () => {
    darkMode.value = mq.matches;
  });

  return darkMode;
}

export function provideDarkMode(): void {
  provide(darkModeKey, darkModeRef());
}

export function injectDarkMode(): ComputedRef<boolean> {
  const dm = inject(darkModeKey) || darkModeRef();
  return computed(() => dm.value);
}

function appStyleRef(): ComputedRef<AppStyle> {
  const darkMode = injectDarkMode();

  return computed(() => {
    const dm = darkMode.value;
    const style = getComputedStyle(document.documentElement);

    return {
      darkMode: dm,
      taskBar: style.getPropertyValue("--task-bar"),
      cycleLine: style.getPropertyValue("--cycle-line"),
      textColor: style.getPropertyValue("color"),
    };
  });
}


export function provideAppStyle(): void {
  provide(appStyleKey, appStyleRef());
}

export function useAppStyle(): ComputedRef<AppStyle> {
  return inject(appStyleKey) || appStyleRef();
}
