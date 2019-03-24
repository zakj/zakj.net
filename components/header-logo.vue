<template>
  <header :class="$style.header" v-scroll-to="'body'" @mouseenter="hover = true" @mouseleave="hover = false">
    <MarkIcon :class="{[$style.mark]: true, [$style.dark]: isLightBackground}" ref="icon" />
  </header>
</template>

<style lang="stylus" module>
  $small-mark-size = 38px
  $large-mark-size = 64px

  .header
    cursor pointer
    left 50%
    margin-left -($small-mark-size / 2)
    position fixed
    top ($small-padding / 4 * 3)
    padding ($small-padding / 4) 0
    width $small-mark-size
    +breakpoint($desktop)
      margin-left -($large-mark-size / 2)
      padding ($large-padding / 4) 0
      top ($large-padding / 4 * 3)
      width $large-mark-size

  .mark
    height $small-mark-size
    width $small-mark-size
    +breakpoint($desktop)
      height $large-mark-size
      width $large-mark-size
    g
      fill $light-text-color
      transition fill $light-dark-transition-ms ease-in
    &.dark g
      fill $dark-text-color
</style>

<script>
import {mapGetters} from 'vuex';
import {easing, styler, timeline} from 'popmotion';

import MarkIcon from '~/assets/mark.svg?inline';

export default {
  components: {MarkIcon},

  computed: {
    ...mapGetters(['isLightBackground']),
  },

  data() {
    return {
      hover: false,
      timeline: null,
    };
  },

  watch: {
    hover(isHovered) {
      // TODO: don't use hover state on touch devices (or just on small screens?)
      // TODO: factor out this animation to use when the mobile menu is open
      const mark = this.$el.querySelector(`.${this.$style.mark}`);
      const top = styler(mark.querySelector('#mark-top-clip rect'));
      const bottom = styler(mark.querySelector('#mark-bottom-clip rect'));

      if (isHovered) {
        const duration = 200;
        const offset = -135;
        this.timeline = timeline([
          {track: 'top', from: 0, to: offset, duration},
          duration / 2,
          {track: 'bottom', from: offset, to: 0, duration},
        ], {easing: easing.easeOut}).start(v => {
          top.set({x: v.top});
          bottom.set({x: v.bottom});
        });
      }
      else {
        this.timeline.reverse();
        this.timeline.resume();
      }
    },
  },
};
</script>
