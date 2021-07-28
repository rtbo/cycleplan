import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";

import { State, createState } from "./state";
import { mutations } from "./mutations";
import { getters } from "./getters";

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: createState,
  mutations,
  getters,
});

export function useStore(): Store<State> {
  return baseUseStore(key);
}
