<template>
  <hr :class="classes" class="border-opacity-25" role="separator" />
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    vertical: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const horizontalClasses = ["border-t", "w-full", "h-0"];
    const verticalClasses = ["border-r", "h-full", "w-0"];
    return {
      classes: computed(() =>
        props.vertical ? verticalClasses : horizontalClasses
      ),
    };
  },
});
</script>
