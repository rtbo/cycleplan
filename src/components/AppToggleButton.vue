<template>
  <button
    class="
      transition
      duration-200
      flex
      items-center
      justify-center
      hover:bg-gray-300
      dark:hover:bg-gray-700
      border border-gray-500
    "
    :class="butClass"
    :disabled="disabled"
    @click="toggle"
  >
    <span :class="spanClass">
      <slot></slot>
    </span>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: Boolean,
    disabled: Boolean,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const butClass = computed(() =>
      props.modelValue
        ? ["bg-gray-200", "dark:bg-gray-800", "border-opacity-100"]
        : ["bg-gray-100", "dark:bg-gray-900", "border-opacity-0"]
    );
    const spanClass = computed(() =>
      props.modelValue ? [] : ["filter", "contrast-25"]
    );
    const toggle = () => {
      emit("update:modelValue", !props.modelValue);
    };
    return {
      butClass,
      spanClass,
      toggle,
    };
  },
});
</script>
