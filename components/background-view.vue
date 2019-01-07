<template>
  <div :class="$style.bg">
    <div :class="{[$style.image]: true, [$style.swiped]: currentSection !== 'splash'}"></div>
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
    background-position bottom right
    background-size cover
    background-image url('~/assets/splash-bg.jpg')
    transition transform 200ms ease-in
    // &.swiped
    //   transform translateY(-100vh)

  .color
    background-color hsl(209, 18%, 34%)
    opacity .5
    transition background-color $light-dark-transition-ms ease-in, opacity $light-dark-transition-ms ease-in
</style>


<script>
import {mapState} from 'vuex';

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
