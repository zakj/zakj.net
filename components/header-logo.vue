<template>
  <header :class="$style.header" v-scroll-to="'body'" @mouseenter="hover = true" @mouseleave="hover = false">
    <MarkIcon :class="{[$style.mark]: true, [$style.dark]: lightBackground}" ref="icon" />
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
      fill #fff
      transition fill $light-dark-transition-ms ease-in
    &.dark g
      fill #000
</style>

<script>
import anime from 'animejs';
import {mapGetters} from 'vuex';

import MarkIcon from '~/assets/mark.svg';

export default {
  components: {MarkIcon},

  computed: {
    ...mapGetters(['lightBackground']),
  },

  data() {
    return {
      hover: false,
      timeline: null,
    };
  },

  watch: {
    hover(isHovered) {
      if (this.timeline) this.timeline.pause();
      const mark = this.$el.querySelector(`.${this.$style.mark}`);
      const topClip = mark.querySelector('#mark-top-clip rect');
      const botClip = mark.querySelector('#mark-bottom-clip rect');
      this.timeline = anime.timeline({
        duration: 200,
        easing: 'easeOutQuad',
      })
        .add({
          targets: topClip,
          x: isHovered ? 0 : 150,
        })
        .add({
          targets: botClip,
          width: isHovered ? 150 : 0,
          offset: 100,
        });
    },
  },
};
</script>
