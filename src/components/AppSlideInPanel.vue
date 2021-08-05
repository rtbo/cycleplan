<template>
  <div
    class="h-full slidein-panel transition-width duration-200"
    :class="dynClasses"
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: Boolean,
    visibleWidthClass: {
      type: String,
      default: "w-auto",
    },
  },

  setup(props) {
    const dynClasses = computed(() =>
      props.modelValue ? [props.visibleWidthClass] : ["w-0"]
    );
    return {
      dynClasses,
    };
  },
});
</script>
