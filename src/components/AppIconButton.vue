<template>
  <button
    :class="dynClasses"
    class="transition duration-300"
    :disabled="disabled"
  >
    <span class="iconify" :data-icon="icon"></span>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { ensureArray } from "@/util";

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
    colorClass: {
      type: [String, Array],
      default: ["text-black", "dark:text-white"],
    },
    opacityClass: {
      type: [String, Array],
      default: [
        "text-opacity-60",
        "hover:text-opacity-100",
        "dark:text-opacity-60",
        "dark:hover:text-opacity-100",
      ],
    },
    disabled: Boolean,
  },

  setup(props, { emit }) {
    const clickHandler = (event: MouseEvent) => {
      if (!props.disabled) {
        emit("click", event);
      }
    };

    const dynClasses = computed(() => {
      const cc = ensureArray(props.colorClass);
      const oc = props.disabled
        ? ["text-opacity-30"]
        : ensureArray(props.opacityClass);
      const cursor = props.disabled ? "cursor-default" : "cursor-pointer";
      return [...cc, ...oc, cursor];
    });

    return {
      clickHandler,
      dynClasses,
    };
  },
});
</script>
