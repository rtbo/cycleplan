<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    class="
      bg-on-surface bg-opacity-5
      outline-none
      ring-1 ring-on-surface ring-opacity-20
      rounded-sm
      text-on-surface text-opacity-80
      placeholder-on-surface placeholder-opacity-20
      hover:ring-opacity-40
      focus:bg-opacity-10 focus:ring-opacity-50 focus:ring-2
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
