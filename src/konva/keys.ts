import { InjectionKey } from "vue";
import Kv from "konva";

export const kvStageKey: InjectionKey<Kv.Stage> = Symbol();
export const kvLayerKey: InjectionKey<Kv.Layer> = Symbol();
export const kvContainerKey: InjectionKey<Kv.Container> = Symbol();
