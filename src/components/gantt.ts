import { computed, ComputedRef, InjectionKey } from "vue";
import { useStore } from "../store";

export const stageWidthKey: InjectionKey<ComputedRef<number>> = Symbol();
export const stageHeightKey: InjectionKey<ComputedRef<number>> = Symbol();

interface HeaderTheme {
  rulerCol: string;
  gradCol: string;
  txtCol: string;
}

export function useHeaderTheme(): ComputedRef<HeaderTheme> {
  const store = useStore();

  return computed(() => ({
    rulerCol: "rgba(128, 128, 128, 0.15)",
    gradCol: "rgba(128, 128, 128, 0.5)",
    txtCol: store.state.darkMode
      ? "rgba(255, 255, 255, 0.85)"
      : "rgba(0, 0, 0, 0.85)",
  }));
}
