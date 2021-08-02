<template>
  <div class="flex flex-row cursor-pointer">
    <div
      class="pl-3 pr-2 py-1 rounded-tl-md"
      :class="autoClasses"
      @click="activeMode = 'auto'"
    >
      <span>
        Auto
        <span v-if="autoActive" class="text-primary ml-1 font-bold">
          {{ cycleTimeValue }}
        </span>
      </span>
    </div>
    <div class="px-2 py-1" :class="fixedClasses" @click="activeMode = 'fixed'">
      <span>
        Fixed
        <app-click-to-edit
          v-if="fixedActive"
          v-model="fixedValue"
          input-class="w-16"
          class="text-primary ml-1 font-bold"
          :validate="isPositiveNumber"
        ></app-click-to-edit>
      </span>
    </div>
    <div
      class="pl-2 pr-3 py-1 rounded-br-md"
      :class="loopClasses"
      @click="activeMode = 'loop'"
    >
      <span>
        Loop
        <span v-if="loopActive" class="text-primary ml-1 font-bold">
          {{ cycleTimeValue }}
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { CycleTimeMode } from "../model/cycle";
import { useStore } from "../store";
import { isPositiveNumber } from "../util";

export default defineComponent({
  setup() {
    const store = useStore();

    const activeMode = computed({
      get: () => store.state.cycleTimeInput.mode,
      set(mode) {
        store.commit("cycle-time-input", { mode });
      },
    });

    const cycleTimeValue = computed(() => store.state.cycleTime);

    const fixedValue = computed({
      get: () => store.state.cycleTimeInput.fixedValue,
      set(fixedValue: number) {
        store.commit("cycle-time-input", { fixedValue });
      },
    });

    const activeClasses = [
      "bg-on-surface",
      "bg-opacity-10",
      "border",
      "border-on-surface",
      "border-opacity-50",
    ];
    const inactiveClasses = [
      "bg-on-surface",
      "bg-opacity-5",
      "hover:bg-opacity-10",
      "hover:border-1",
      "hover:border-on-surface",
      "hover:border-opacity-20",
    ];

    const autoActive = computed(() => activeMode.value === CycleTimeMode.Auto);
    const autoClasses = computed(() =>
      autoActive.value ? activeClasses : inactiveClasses
    );

    const fixedActive = computed(
      () => activeMode.value === CycleTimeMode.Fixed
    );
    const fixedClasses = computed(() =>
      fixedActive.value ? activeClasses : inactiveClasses
    );

    const loopActive = computed(() => activeMode.value === CycleTimeMode.Loop);
    const loopClasses = computed(() =>
      loopActive.value ? activeClasses : inactiveClasses
    );

    return {
      activeMode,
      cycleTimeValue,
      fixedValue,
      autoActive,
      autoClasses,
      fixedActive,
      fixedClasses,
      loopActive,
      loopClasses,
      isPositiveNumber,
    };
  },
});
</script>
