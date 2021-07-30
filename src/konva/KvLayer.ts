import { defineComponent, h, inject, onUnmounted, PropType, provide, watch } from "vue";
import Kv from "konva";
import { kvContainerKey, kvLayerKey, kvStageKey } from "./keys";

export default defineComponent({
  props: {
    config: {
      type: Object as PropType<Kv.LayerConfig>,
    },
  },

  setup(props, { slots }) {
    const stage = inject(kvStageKey);

    const layer = new Kv.Layer(props.config);

    stage?.add(layer);

    watch(
      () => props.config,
      (newVal) => {
        layer.setAttrs(newVal);
      }
    );

    onUnmounted(() => {
      layer.destroy();
    });

    provide(kvLayerKey, layer);
    provide(kvContainerKey, layer as unknown as Kv.Container);

    return () => slots.default?.();
  },
});
