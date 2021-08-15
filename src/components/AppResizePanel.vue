<template>
  <div class="relative overflow-hidden" ref="viewportEl">
    <div
      class="absolute h-full flex flex-row transtion-all duration-200"
      ref="wrapEl"
      :style="wrapStyle"
    >
      <div class="flex-shrink-0 h-full" ref="panelEl">
        <slot name="panel"></slot>
      </div>
      <div class="flex-none border-r border-gray-500 h-full w-0 relative">
        <div class="absolute left-1/2 top-full">
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
      <div class="flex-grow flex-shrink h-full">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, Ref, ref } from "vue";

export default defineComponent({
  props: {
    modelValue: {
      type: Boolean,
      default: true,
    },
  },

  emits: ["update:modelValue", "update:splitterPos"],

  setup(props, { emit }) {
    const viewportEl: Ref<HTMLDivElement | null> = ref(null);
    const wrapEl: Ref<HTMLDivElement | null> = ref(null);
    const panelEl: Ref<HTMLDivElement | null> = ref(null);

    // dummy values that will be replaced in onMounted
    const viewportSz = ref(100);
    const panelSz = ref(50);

    onMounted(() => {
      const viewport = viewportEl.value as HTMLDivElement;
      const panel = panelEl.value as HTMLDivElement;

      const szObserver = new ResizeObserver(() => {
        viewportSz.value = viewport.clientWidth;
        panelSz.value = panel.clientWidth;
      });
      szObserver.observe(viewport);
      szObserver.observe(panel);
    });

    const toggleVisible = () => {
      emit("update:modelValue", !props.modelValue);
    };

    const wrapStyle = computed(() => ({
      width: props.modelValue
        ? `${viewportSz.value}px`
        : `${viewportSz.value + panelSz.value}px`,
      left: props.modelValue ? "0px" : `${-panelSz.value}px`,
    }));

    return {
      viewportEl,
      wrapEl,
      panelEl,
      wrapStyle,
      toggleVisible,
    };
  },
});
</script>
