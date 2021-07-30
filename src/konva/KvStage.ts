import {
  defineComponent,
  h,
  onMounted,
  onUnmounted,
  PropType,
  provide,
  Ref,
  ref,
  watch,
} from "vue";
import Kv from "konva";
import { kvStageKey } from "./keys";

type StageConfig = ConstructorParameters<typeof Kv.Stage>[0];

export default defineComponent({
  props: {
    config: {
      type: Object as PropType<StageConfig>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const div: Ref<HTMLDivElement | null> = ref(null);

    const stage = new Kv.Stage({
      ...props.config,
      container: document.createElement("div"),
    });

    onMounted(() => {
      stage.container(div.value as HTMLDivElement);
    });

    onUnmounted(() => {
      stage.destroy();
    });

    watch(
      () => props.config,
      (newVal) => {
        stage.setAttrs(newVal);
      }
    );

    provide(kvStageKey, stage);

    return () => h("div", { ref: div }, slots.default?.());
  },
});
