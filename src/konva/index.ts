import { Plugin } from "vue";
import Kv from "konva";
import KvStage from "./KvStage";
import KvLayer from "./KvLayer";
import KvContainer from "./KvContainer";
import KvNode from "./KvNode";

const KONVA_CONTAINERS = ["FastLayer", "Group", "Label"];
const KONVA_NODES = [
  "Rect",
  "Circle",
  "Ellipse",
  "Wedge",
  "Line",
  "Sprite",
  "Image",
  "Text",
  "TextPath",
  "Star",
  "Ring",
  "Arc",
  "Tag",
  "Path",
  "RegularPolygon",
  "Arrow",
  "Shape",
  "Transformer",
];

type ContainerCtor = new (
  config: Kv.ContainerConfig | undefined
) => Kv.Container;

type NodeCtor = new (config: Kv.NodeConfig | undefined) => Kv.Node;

const konvaPlugin: Plugin = {
  install(app, options) {
    app.component("KvStage", KvStage);
    app.component("KvLayer", KvLayer);

    KONVA_CONTAINERS.forEach((name) => {
      const Class: ContainerCtor = (
        Kv as unknown as { [index: string]: ContainerCtor }
      )[name];
      app.component("Kv"+name, KvContainer(Class));
    });

    KONVA_NODES.forEach((name) => {
      const Class: NodeCtor = (
        Kv as unknown as { [index: string]: NodeCtor }
      )[name];
      app.component("Kv"+name, KvNode(Class));
    });
  },
};

export default konvaPlugin;
