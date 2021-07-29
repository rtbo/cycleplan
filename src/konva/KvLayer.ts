import { defineComponent, h, inject, provide, watch } from "vue";
import Kv from "konva";
import { kvContainerKey, kvStageKey, optionalProp } from ".";
import { KvContainerProps } from "./KvContainer";

export const KvLayerProps = {
  ...KvContainerProps,

  clearBeforeDraw: optionalProp(Boolean),
  imageSmoothingEnabled: Boolean,
};

export default defineComponent({
  props: KvLayerProps,
  setup(props, { slots }) {
    const stage = inject(kvStageKey);

    const layer = new Kv.Layer(props as Kv.LayerConfig);
    console.log("create layer");
    console.log(props);

    stage?.add(layer);
    console.log("add layer");

    provide(kvContainerKey, layer as unknown as Kv.Container);

    let key: keyof typeof props;
    for (key in props) {
      watch(
        () => props[key],
        (newVal) => {
          layer.attrs({
            key: newVal,
          });
        }
      );
    }

    return () => h("template", slots.default?.());
  },
});
