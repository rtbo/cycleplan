import { InjectionKey } from "vue";
import { createStore, Store, useStore as baseUseStore } from "vuex";

import { getters } from "./getters";
import { mutations } from "./mutations";
import { State, createState } from "./state";

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: createState,
  mutations,
  getters,
});

export function useStore(): Store<State> {
  return baseUseStore(key);
}
