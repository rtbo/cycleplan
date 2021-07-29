import { InjectionKey } from "vue";
import Kv from "konva";

export const kvStageKey: InjectionKey<Kv.Stage> = Symbol();
export const kvContainerKey: InjectionKey<Kv.Container> = Symbol();

export function optionalProp<T>(propType: T): { type: T, default: undefined, } {
  return {
    type: propType,
    default: undefined,
  };
}

export function makeUndefinedDefault(props: any) {
  for(const key in props) {
    if (typeof props[key] === "function") {
      props[key] = {
        type: props[key],
        default: undefined,
      }
    }
  }
}
