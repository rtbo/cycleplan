import { InjectionKey } from "vue";
import Kv from "konva";

export const kvStageKey: InjectionKey<Kv.Stage> = Symbol();
export const kvContainerKey: InjectionKey<Kv.Container> = Symbol();

export function optionalProp<T>(propType: T): { type: T; default: undefined } {
  return {
    type: propType,
    default: undefined,
  };
}
