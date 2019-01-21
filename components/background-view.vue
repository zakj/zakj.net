<template>
  <div :class="$style.bg">
    <div
      :class="$style.image"
      :style="{backgroundImage: `url(${backgroundImage})`}"
      ></div>
<!--
  TODO
  separate history background from splash background
  only show history background element when currentSection === history
  fade-through history background changes --- save previous background, add new element, fade through
  only show splash based on currentSection?
  fade in from low-quality splash background on load
-->
    <div :class="$style.color" :style="{backgroundColor: sectionColor, opacity: sectionOpacity}"></div>
  </div>
</template>


<style lang="stylus" module>
  .bg, .image, .color
    top 0
    left 0
    right 0
    bottom 0

  .bg
    position fixed
    z-index -1

  .image, .color
    position absolute

  .image
    background-position bottom right 20%
    background-size cover
    filter grayscale(100%) blur(3px)
    transition transform 200ms ease-in
    +breakpoint($desktop)
      background-position bottom right

  .color
    background-color hsl(209, 18%, 34%)
    opacity .5
    transition background-color $light-dark-transition-ms ease-in, opacity $light-dark-transition-ms ease-in
</style>


<script>
import {mapGetters, mapState} from 'vuex';

const SECTION_COLORS = {
  splash: 'hsl(209, 18%, 34%)',
  bio: '#ccba97',
  history: '#1d7c87',
  code: '#fff',
  qa: '#4a4a4a',
};

const SECTION_OPACITIES = {
  splash: 0,
  history: 0.7,
};

export default {
  computed: {
    sectionColor() {
      return SECTION_COLORS[this.currentSection];
    },
    sectionOpacity() {
      return this.currentSection in SECTION_OPACITIES ? SECTION_OPACITIES[this.currentSection] : 1;
    },
    ...mapGetters(['backgroundImage']),
    ...mapState(['currentSection']),
  },

  watch: {
    currentSection(newSection) {
      if (newSection === 'splash') {
        // XXX
      }
    },
  },
};
</script>
