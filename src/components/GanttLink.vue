<template>
  <g>
    <path :d="mainPath" class="gantt-link--main" />
    <path v-if="slackPath" :d="slackPath" class="gantt-link--slack" />
    <use
      href="#gantt-def--link-arrow"
      :transform="arrowTransform"
      class="gantt-link--arrow"
    />
  </g>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from "vue";
import { TASKBAR_HEIGHT } from "@/gantt-style";
import { useStore } from "@/store";
import { LinkState } from "@/store/state";
import { pointsToSvgPath } from "@/util";

export default defineComponent({
  props: {
    modelValue: {
      type: Object as PropType<LinkState>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();

    const nlag = computed(() => {
      const link = props.modelValue;
      return link.lag < 0;
    });

    const config = computed(() => {
      const link = props.modelValue;
      if (link.from === link.to) throw new Error("Impossible Link");
      const taskFrom = store.state.tasks.find((t) => t.id === link.from);
      const taskTo = store.state.tasks.find((t) => t.id === link.to);
      if (!taskFrom || !taskTo) {
        throw new Error("Dead Link");
      }
      const timeFrom = link.fromStart
        ? taskFrom.earlyStart
        : taskFrom.earlyFinish;
      const timeTo = taskTo.earlyStart;

      const down = taskFrom.vbounds.top < taskTo.vbounds.top;

      const middleFrom = (taskFrom.vbounds.top + taskFrom.vbounds.bottom) / 2;
      const yFrom = down
        ? middleFrom + TASKBAR_HEIGHT / 2
        : middleFrom - TASKBAR_HEIGHT / 2;

      const hor = timeTo - timeFrom;
      const slack = hor - link.lag;
      const direct = link.lag === 0 && slack == 0;

      const middleTo = (taskTo.vbounds.top + taskTo.vbounds.bottom) / 2;
      let yTo;
      if (link.lag > 0 || slack > 0) {
        if (nlag.value) {
          console.log("middle " + slack);
        }
        yTo = middleTo;
      } else {
        if (nlag.value) {
          console.log("not middle");
        }
        yTo = down
          ? middleTo - TASKBAR_HEIGHT / 2
          : middleTo + TASKBAR_HEIGHT / 2;
      }

      // y stop for negative lag
      const yNlagStop = down ? taskTo.vbounds.top : taskTo.vbounds.bottom;

      return {
        timeFrom,
        timeTo,
        yFrom,
        yTo,
        direct,
        lag: link.lag,
        timeLagEnd: timeFrom + link.lag,
        slack,
        yNlagStop,
        down,
      };
    });

    const withinArrow = 4; // length to be shorten to stop the line within the arrow

    const mainPath = computed(() => {
      const {
        timeFrom,
        yFrom,
        timeTo,
        yTo,
        direct,
        lag,
        timeLagEnd,
        yNlagStop,
        down,
        slack,
      } = config.value;
      const xFrom = store.getters.time2px(timeFrom);
      const xTo = store.getters.time2px(timeTo);
      const points = [xFrom, yFrom];
      if (direct) {
        points.push(xTo, down ? yTo - withinArrow : yTo + withinArrow);
      } else if (lag >= 0) {
        const xLagEnd = store.getters.time2px(timeLagEnd);
        points.push(xFrom, yTo);
        points.push(slack == 0 ? xLagEnd - withinArrow : xLagEnd, yTo);
      } else {
        const xLagEnd = store.getters.time2px(timeLagEnd);
        const arrowOffset = slack == 0 ? withinArrow : 0;
        points.push(xFrom, yNlagStop);
        points.push(xLagEnd, yNlagStop);
        points.push(xLagEnd, down ? yTo - arrowOffset : yTo + arrowOffset);
      }
      return pointsToSvgPath(points);
    });

    const slackPath = computed(() => {
      const { slack, timeLagEnd, timeTo, yTo } = config.value;
      if (slack === 0) return null;
      const xLagEnd = store.getters.time2px(timeLagEnd);
      const xTo = store.getters.time2px(timeTo) - withinArrow;
      const points = [xLagEnd, yTo, xTo, yTo];
      return pointsToSvgPath(points);
    });

    const arrowTransform = computed(() => {
      const { slack, lag, timeTo, yTo } = config.value;
      const xTo = store.getters.time2px(timeTo);
      const translate = `translate(${xTo} ${yTo})`;
      return lag > 0 || slack > 0 ? `${translate} rotate(-90)` : translate;
    });

    return {
      mainPath,
      slackPath,
      arrowTransform,
    };
  },
});
</script>

<style lang="postcss">
.gantt-link--main {
  fill: none;
  stroke: var(--color-gantt-link);
  stroke-width: 1.5;
}
.gantt-link--slack {
  fill: none;
  stroke: var(--color-gantt-link--slack);
  stroke-dasharray: 4;
  stroke-width: 1.5;
}
.gantt-link--arrow {
  stroke: none;
  fill: var(--color-gantt-link);
}
</style>
