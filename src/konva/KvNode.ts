import { defineComponent, inject, onUnmounted, PropType, watch } from "vue";
import Kv from "konva";
import { kvContainerKey } from "./keys";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default (Class: new (config: Kv.NodeConfig | undefined) => Kv.Node) =>
  defineComponent({
    props: {
      config: {
        type: Object as PropType<Kv.NodeConfig>,
      },
    },

    setup(props) {
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
