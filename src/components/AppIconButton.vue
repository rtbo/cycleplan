<template>
  <button :class="dynClasses" class="transition duration-300">
    <span class="mdi" :class="icon"></span>
  </button>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
      validator: (icon: string) => icon.startsWith("mdi-"),
    },
    colorClass: {
      type: [String, Array],
      validator: (cc: string | string[]) => {
        if (typeof cc === "string") {
          return cc.startsWith("text-");
        } else {
          return cc.every((cc) => cc.includes("text-"));
        }
      },
      default: "text-on-background",
    },
    opacityClass: {
      type: [String, Array],
      validator: (cc: string | string[]) => {
        if (typeof cc === "string") {
          return cc.startsWith("text-opacity");
        } else {
          return cc.every((cc) => cc.includes("text-opacity"));
        }
      },
      default: ["text-opacity-70", "hover:text-opacity-100"],
    },
  },
  setup(props) {
    const dynClasses = computed(() => {
      let cc = props.colorClass;
      if (typeof cc === "string") {
        cc = [cc];
      }
      let oc = props.opacityClass;
      if (typeof oc === "string") {
        oc = [oc];
      }
      return [...cc, ...oc];
    });
    return {
      dynClasses,
    };
  },
});
</script>
