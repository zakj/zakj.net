<template>
  <svg :height="height" :width="width" :class="$style.pie">
    <g :transform="`translate(${width / 2}, ${height / 2 * 1.1})`" fill="white">
      <path
        v-for="(arcData, i) in arcs"
        :key="`path-${i}`" :d="arc(arcData)"
        :class="{[$style.selected]: selected == i}"
        :style="{opacity: arcOpacity(i)}"
        @mouseenter="$emit('hover', i)"
      />
    </g>
  </svg>
</template>


<style lang="stylus" module>
  .pie path
    transition transform 200ms ease-out

  .selected
    fill $copper-color
    transform scale(1.1)
</style>


<script>
import {arc, pie} from 'd3-shape';

export default {
  computed: {
    arcs() {
      return this.pie(this.data);
    },
  },

  data() {
    return {
      arc: arc()
        .innerRadius(0)
        .outerRadius(({index}) => {
          const maxSize = Math.min(this.height, this.width) / 2;
          return maxSize - (this.data.length - index) * this.staggerSize;
        }),
      pie: pie().value(d => d.size).sortValues(null),
      staggerSize: 8,
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
