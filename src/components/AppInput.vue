<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="
      bg-gray-100
      dark:bg-gray-800
      outline-none
      ring-1 ring-gray-300
      dark:ring-gray-600
      rounded-sm
      text-gray-800
      dark:text-gray-100
      placeholder-gray-600
      dark:placeholder-gray-400
      hover:ring-indigo-500
      focus:ring-indigo-700
      dark:focus:ring-indigo-300
      focus:ring-2
      transition-all
      duration-200
    "
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

const possibleTypes = ["text", "password", "email"];

export default defineComponent({
  props: {
    modelValue: String,
    type: {
      type: String,
      default: "text",
      validator: (val: string) => possibleTypes.includes(val),
    },
  },
  emits: ["update:modelValue"],
});
</script>
