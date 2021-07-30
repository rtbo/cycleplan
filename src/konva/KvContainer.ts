import {
  defineComponent,
  inject,
  onUnmounted,
  PropType,
  provide,
  watch,
} from "vue";
import Kv from "konva";
import { kvContainerKey } from "./keys";

export default (
  Class: new (config: Kv.ContainerConfig | undefined) => Kv.Container
) =>
  defineComponent({
    props: {
      config: {
        type: Object as PropType<Kv.ContainerConfig>,
      },
    },

    setup(props, { slots }) {
      const parent = inject(kvContainerKey);

      const container = new Class(props.config);

      parent?.add(container);

      watch(
        () => props.config,
        (newVal) => {
          container.setAttrs(newVal);
        }
      );
      onUnmounted(() => {
        container.destroy();
      });

      provide(kvContainerKey, container);

      return () => slots.default?.();
    },
  });
