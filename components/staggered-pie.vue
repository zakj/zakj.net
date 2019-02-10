<template>
  <svg :height="height" :width="width" :viewBox="`0 0 ${innerSize} ${innerSize}`" :class="$style.pie">
    <g :transform="`translate(${innerSize / 2}, ${innerSize / 2 * 1.1})`" fill="white">
      <path
        v-for="(arcData, i) in arcs"
        :key="`path-${i}`" :d="arc(arcData)"
        :class="{[$style.selected]: selected == i}"
        :style="{opacity: arcOpacity(i)}"
        @click="$emit('select', i)" @mouseenter="$emit('select', i)"
      />
      <text :class="$style.label" text-anchor="middle" x="-1" y="25">{{selectedLabel}}</text>
      <text :class="$style.sub" text-anchor="middle" x="-1" y="43">{{selectedSub}}</text>
    </g>
  </svg>
</template>


<style lang="stylus" module>
  .pie path
    transition transform 200ms ease-out

  .selected
    fill $copper-color
    transform scale(1.1)

  .label, .sub
    font-family $header-font-stack

  .label
    font-size 80px
    font-weight bold

  .sub
    font-size 12px
    letter-spacing 0.5px
    opacity .6
    text-transform uppercase
</style>


<script>
import {arc, pie} from 'd3-shape';

export default {
  computed: {
    arcs() {
      return this.pie(this.data);
    },

    selectedLabel() {
      return this.data[this.selected].label;
    },

    selectedSub() {
      return this.data[this.selected].sub;
    },
  },

  data() {
    return {
      arc: arc()
        .innerRadius(75)
        .outerRadius(({index}) => {
          const maxRadius = this.innerSize / 2;
          return maxRadius - (this.data.length - index) * this.staggerSize;
        }),
      innerSize: 500,
      pie: pie().value(d => d.size).sortValues(null),
      staggerSize: 6,
    };
  },

  methods: {
    arcOpacity(index) {
      if (this.selected === index) return 1;
      const maxOpacity = 1;
      const minOpacity = .2;
      const step = (maxOpacity - minOpacity) / (this.data.length - 1);
      return maxOpacity - (this.data.length - 1 - index) * step;
    },
  },

  props: {
    data: Array,  // {size, label, sub}  (label/sub currently unused)
    height: Number,
    selected: Number,
    width: Number,
  },
};
</script>
