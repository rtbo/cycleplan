import { defineComponent, inject, onUnmounted, PropType, provide, watch } from "vue";
import Kv from "konva";
import { kvContainerKey } from "./keys";

export default (
  Class: new (config: Kv.NodeConfig | undefined) => Kv.Node
) =>
  defineComponent({
    props: {
      config: {
        type: Object as PropType<Kv.NodeConfig>,
      },
    },

    setup(props, { slots }) {
      const parent = inject(kvContainerKey);

      const node = new Class(props.config);

      parent?.add(node);

      watch(
        () => props.config,
        (newVal) => {
          node.setAttrs(newVal);
        }
      );

      onUnmounted(() => {
        node.destroy();
      });

      return () => null;
    },
  });
