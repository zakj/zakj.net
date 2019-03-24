<template>
  <div :class="$style.bg">
    <PoseTransition mode="in-out">
      <HistoryBackgroundImage
        v-if="currentSection === 'history'"
        :class="$style.history"
        :style="{backgroundImage: `url(${historyBackgroundImage})`}"
        :key="historyBackgroundImage"
        ></HistoryBackgroundImage>
    </PoseTransition>
    <Color :pose="currentSection" />
    <PoseTransition mode="in-out">
      <Splash v-if="!splashLoaded" :class="[$style.splash, $style.lqip]" key="lq" :pose="hideSplash ? 'hidden' : 'visible'" />
      <Splash v-else :class="$style.splash" key="hq" :pose="hideSplash ? 'hidden' : 'visible'" />
    </PoseTransition>
  </div>
</template>


<style lang="stylus" module>
  .bg
    position fixed
    z-index -1

  .bg, .bg > div
    bottom 0
    left 0
    right 0
    top 0

  .bg > div
    background-size cover
    position absolute

  .splash
    background-image url('~/assets/splash-bg.jpg');
    background-position bottom right 20%
    &.lqip
      background-image url('~/assets/splash-bg.svg?data');
    +breakpoint($desktop)
      background-position bottom right

  .history
    background-position bottom center
    filter grayscale(100%) blur(3px)
    transform scale(1.01)  // avoid the weird edges due to blur filter
</style>


<script>
import throttle from 'lodash/throttle';
import posed, {PoseTransition} from 'vue-pose';
import {mapState} from 'vuex';

const SPLASH_BG_HQ = require('~/assets/splash-bg.jpg');

const transition = {
  duration: 600,
};

export default {
  components: {
    PoseTransition,

    Color: posed.div({
      splash: {backgroundColor: '#ccba97', opacity: 1, transition},
      bio: {backgroundColor: '#ccba97', opacity: 1, transition},
      history: {backgroundColor: '#1d7c87', opacity: 0.7, transition},
      code: {backgroundColor: '#fff', opacity: 1, transition},
      qa: {backgroundColor: '#4a4a4a', opacity: 1, transition},
    }),

    HistoryBackgroundImage: posed.div({
      enter: {
        applyAtStart: {opacity: 0},
        opacity: 1,
        transition: {duration: 1500, easing: 'linear'},
      },
    }),

    Splash: posed.div({
      visible: {
        opacity: 1,
        scale: 1,
        transition: {duration: 300, ease: 'easeOut'},
      },
      hidden: {
        opacity: 0,
        scale: 1.2,
        transition: {duration: 300, ease: 'easeIn'},
      },

      enter: {
        applyAtStart: {opacity: 0},
        opacity: 1,
        transition: {duration: 600, easing: 'easeIn'},
      },
    }),
  },

  computed: {
    hideSplash() {
      // Show the splash at the very top of the page, or within a threshold when scrolling upwards.
      // XXX mobile overscroll
      return (this.scrollDelta >= 0 && this.scrollY > 0) || this.scrollY >= 150;
    },
    ...mapState(['currentSection', 'historyBackgroundImage']),
  },

  data() {
    return {
      scrollDelta: 0,
      scrollY: 0,
      splashLoaded: false,
    };
  },

  methods: {
    loadBgImage() {
      const i = document.createElement('img');
      i.addEventListener('load', () => this.splashLoaded = true);
      i.setAttribute('src', SPLASH_BG_HQ);
    },

    updateScroll: throttle(function () {
      this.scrollDelta = window.scrollY - this.scrollY;
      this.scrollY = window.scrollY;
    }, 20, {leading: false}),
  },

  mounted() {
    this.loadBgImage();
    window.addEventListener('scroll', this.updateScroll);
  },

  destroyed() {
    window.removeEventListener('scroll', this.updateScroll);
  },
};
</script>
