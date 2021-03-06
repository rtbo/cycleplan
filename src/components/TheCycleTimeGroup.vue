<template>
  <div class="flex flex-row">
    <div
      class="pl-3 pr-2 py-1 rounded-tl-md"
      :class="autoClasses"
      @click="activeMode = 'auto'"
    >
      <span>
        Auto
        <span
          v-if="autoActive"
          class="text-indigo-800 dark:text-indigo-300 ml-1 font-bold"
        >
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
          class="text-indigo-800 dark:text-indigo-300 ml-1 font-bold"
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
        <span
          v-if="loopActive"
          class="text-indigo-800 dark:text-indigo-300 ml-1 font-bold"
        >
          {{ cycleTimeValue }}
        </span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { CycleTimeMode } from "@/model/cycle";
import { useStore } from "@/store";
import { isPositiveNumber } from "@/util";

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
      "bg-gray-200",
      "dark:bg-gray-700",
      "border",
      "border-gray-500",
    ];
    const inactiveClasses = [
      "cursor-pointer",
      "bg-gray-50",
      "dark:bg-gray-800",
      "border",
      "border-opacity-0",
      "hover:bg-gray-100",
      "hover:border-opacity-100",
      "hover:border-gray-500",
      "transition",
      "duration-200",
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
