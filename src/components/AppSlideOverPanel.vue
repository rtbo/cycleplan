<template>
  <div class="relative">
    <div class="absolute w-full h-full">
      <slot></slot>
    </div>

    <div
      class="absolute h-full flex flex-row transition-all duration-200"
      :style="panelWrapStyle"
      ref="panelWrapEl"
    >
      <div class="border-l border-gray-500 w-0 relative">
        <div class="absolute h-full left-1/2 top-full">
          <button
            class="
              rounded-full
              w-10
              h-10
              bg-transparent
              text-center
              relative
              -left-1/2
              -top-24
              z-10
            "
            @click="toggleVisible"
          >
            <span
              class="
                inline-block
                transition-all
                duration-200
                text-3xl text-gray-600
                dark:text-gray-400
                hover:text-gray-700
                active:text-gray-900
                dark:hover:text-gray-300 dark:active:text-gray-100
                iconify
              "
              data-icon="mdi:unfold-more-vertical"
            ></span>
          </button>
        </div>
      </div>

      <div>
        <slot name="panel"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from "vue";

export default defineComponent({
  props: {
    modelValue: Boolean,
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const panelWrapEl: Ref<HTMLDivElement | null> = ref(null);

    const width = ref(200);

    onMounted(() => {
      const wrapper = panelWrapEl.value as HTMLDivElement;
      const observer = new ResizeObserver(() => {
        width.value = wrapper.clientWidth;
      });
      observer.observe(wrapper);
    });

    const toggleVisible = () => {
      emit("update:modelValue", !props.modelValue);
    };

    const panelWrapStyle = computed(() => ({
      right: `${props.modelValue ? 0 : -width.value}px`,
    }));

    return {
      panelWrapEl,
      panelWrapStyle,
      toggleVisible,
    };
  },
});
</script>
