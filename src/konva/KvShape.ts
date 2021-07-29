import { PropType } from "vue";
import Kv from "konva";
import { KvNodeProps } from "./KvNode";
import { optionalProp } from ".";

export const KvShapeProps = {
  ...KvNodeProps,
  fill: optionalProp(String),
  fillPatternImage: optionalProp(HTMLImageElement),
  fillPatternX: optionalProp(Number),
  fillPatternY: optionalProp(Number),
  fillPatternOffset: optionalProp(Object as PropType<Kv.Vector2d>),
  fillPatternOffsetX: optionalProp(Number),
  fillPatternOffsetY: optionalProp(Number),
  fillPatternScale: optionalProp(Object as PropType<Kv.Vector2d>),
  fillPatternScaleX: optionalProp(Number),
  fillPatternScaleY: optionalProp(Number),
  fillPatternRotation: optionalProp(Number),
  fillPatternRepeat: optionalProp(String),
  fillLinearGradientStartPoint: optionalProp(Object as PropType<Kv.Vector2d>),
  fillLinearGradientStartPointX: optionalProp(Number),
  fillLinearGradientStartPointY: optionalProp(Number),
  fillLinearGradientEndPoint: optionalProp(Object as PropType<Kv.Vector2d>),
  fillLinearGradientEndPointX: optionalProp(Number),
  fillLinearGradientEndPointY: optionalProp(Number),
  fillLinearGradientColorStops: optionalProp(
    Array as PropType<Array<number | string>>
  ),
  fillRadialGradientStartPoint: optionalProp(Object as PropType<Kv.Vector2d>),
  fillRadialGradientStartPointX: optionalProp(Number),
  fillRadialGradientStartPointY: optionalProp(Number),
  fillRadialGradientEndPoint: optionalProp(Object as PropType<Kv.Vector2d>),
  fillRadialGradientEndPointX: optionalProp(Number),
  fillRadialGradientEndPointY: optionalProp(Number),
  fillRadialGradientStartRadius: optionalProp(Number),
  fillRadialGradientEndRadius: optionalProp(Number),
  fillRadialGradientColorStops: optionalProp(
    Array as PropType<Array<number | string>>
  ),
  fillEnabled: optionalProp(Boolean),
  fillPriority: optionalProp(String),
  stroke: optionalProp([String, Object as PropType<CanvasGradient>]),
  strokeWidth: optionalProp(Number),
  fillAfterStrokeEnabled: optionalProp(Boolean),
  hitStrokeWidth: optionalProp([Number, String]),
  strokeScaleEnabled: optionalProp(Boolean),
  strokeHitEnabled: optionalProp(Boolean),
  strokeEnabled: optionalProp(Boolean),
  lineJoin: optionalProp(String as PropType<"round" | "bevel" | "miter">),
  lineCap: optionalProp(String as PropType<"butt" | "round" | "square">),
  sceneFunc: optionalProp(
    Function as PropType<(con: Kv.Context, shape: Kv.Shape) => void>
  ),
  hitFunc: optionalProp(
    Function as PropType<(con: Kv.Context, shape: Kv.Shape) => void>
  ),
  shadowColor: optionalProp(String),
  shadowBlur: optionalProp(Number),
  shadowOffset: optionalProp(Object as PropType<Kv.Vector2d>),
  shadowOffsetX: optionalProp(Number),
  shadowOffsetY: optionalProp(Number),
  shadowOpacity: optionalProp(Number),
  shadowEnabled: optionalProp(Boolean),
  shadowForStrokeEnabled: optionalProp(Boolean),
  dash: optionalProp(Array as PropType<number[]>),
  dashOffset: optionalProp(Number),
  dashEnabled: optionalProp(Boolean),
  perfectDrawEnabled: optionalProp(Boolean),
};
