<template>
  <hr
    class="border-gray-500"
    :class="classes"
    :style="style"
    role="separator"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    vertical: {
      type: Boolean,
      default: false,
    },
    opacity: {
      type: Number,
      default: 10,
    },
  },
  setup(props) {
    const horizontalClasses = ["border-t", "w-full", "h-0"];
    const verticalClasses = ["border-r", "h-full", "w-0"];
    return {
      classes: computed(() =>
        props.vertical ? verticalClasses : horizontalClasses
      ),
      style: computed(() => ({
        "--tw-border-opacity": `${props.opacity * 0.01}`,
      })),
    };
  },
});
</script>
