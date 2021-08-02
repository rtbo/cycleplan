<template>
  <button
    class="
      bg-on-background
      hover:bg-opacity-25
      hover:border
      hover:border-on-background
      hover:border-opacity-20
      transition
      duration-200
    "
    :class="opacityClass"
    @click="toggle"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: Boolean,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const opacityClass = computed(() =>
      props.modelValue
        ? [
            "bg-opacity-10",
            "border",
            "border-on-background",
            "border-opacity-10",
          ]
        : ["bg-opacity-5", "filter", "contrast-25"]
    );
    const toggle = () => {
      emit("update:modelValue", !props.modelValue);
    };
    return {
      opacityClass,
      toggle,
    };
  },
});
</script>
