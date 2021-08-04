import { InjectionKey } from "vue";
import {
  CommitOptions,
  createStore,
  Store,
  useStore as baseUseStore,
} from "vuex";

import { getters, Getters } from "./getters";
import { mutations, Mutations } from "./mutations";
import { createState, State } from "./state";

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: createState,
  mutations,
  getters,
});

export interface CyclePlanStore extends Store<State> {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
    key: K,
    payload: P,
    options?: CommitOptions
  ): void;

  getters: {
    [K in keyof Getters]: ReturnType<Getters[K]>;
  };
}

export function useStore(): CyclePlanStore {
  return baseUseStore(key);
}
