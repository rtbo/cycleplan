import { PropType } from "vue";
import Kv from "konva";
import { KvNodeProps } from "./KvNode";

export const KvContainerProps = {
  ...KvNodeProps,
  clearBeforeDraw: Boolean,
  clipFunc: Function as PropType<(ctx: Kv.Context) => void>,
  clipX: Number,
  clipY: Number,
  clipWidth: Number,
  clipHeight: Number,
};
