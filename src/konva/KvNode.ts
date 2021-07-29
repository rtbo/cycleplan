import { PropType } from "vue";
import Kv from "konva";
import { optionalProp } from ".";

export const KvNodeProps = {
    x: optionalProp(Number),
    y: optionalProp(Number),
    width: optionalProp(Number),
    height: optionalProp(Number),
    visible: optionalProp(Boolean),
    listening: optionalProp(Boolean),
    id: optionalProp(String),
    name: optionalProp(String),
    opacity: optionalProp(Number),
    scale: optionalProp(Object as PropType<Kv.Vector2d>),
    scaleX: optionalProp(Number),
    scaleY: optionalProp(Number),
    rotation: optionalProp(Number),
    offset: optionalProp(Object as PropType<Kv.Vector2d>),
    offsetX: optionalProp(Number),
    offsetY: optionalProp(Number),
    draggable: optionalProp(Boolean),
    dragDistance: optionalProp(Number),
    dragBoundFunc: optionalProp(Function as PropType<(this: Node, pos: Kv.Vector2d) => Kv.Vector2d>),
    preventDefault: optionalProp(Boolean),
    globalCompositeOperation: optionalProp(String),
    filters: optionalProp(Array as PropType<Array<(this: Node, imageData: ImageData) => void>>),
}

// const KONVA_NODES = [
//   "Layer",
//   "FastLayer",
//   "Group",
//   "Label",
//   "Rect",
//   "Circle",
//   "Ellipse",
//   "Wedge",
//   "Line",
//   "Sprite",
//   "Image",
//   "Text",
//   "TextPath",
//   "Star",
//   "Ring",
//   "Arc",
//   "Tag",
//   "Path",
//   "RegularPolygon",
//   "Arrow",
//   "Shape",
//   "Transformer",
// ];
// const CONTAINERS = ["Layer", "FastLayer", "Group", "Label"];

// function defineNode(name: string) {
//   const isContainer = CONTAINERS.findIndex((v) => v === name) !== -1;

//   return defineComponent({
//     props: {
//       config: Object,
//     },
//     setup(props, { slots }) {
//       const parent = inject(kvNodeKey);

//     },
//   });
// }
