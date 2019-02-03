<template>
  <div :class="$style.bg">
    <div
      v-if="prevHistoryBackgroundImage"
      ref="prevHistory"
      :class="$style.history"
      :style="{backgroundImage: `url(${prevHistoryBackgroundImage})`}"
      ></div>
    <div
      v-if="historyBackgroundImage"
      ref="history"
      :class="$style.history"
      :style="{backgroundImage: `url(${historyBackgroundImage})`}"
      ></div>
    <div ref="color" :class="$style.color"></div>
    <div :class="{[$style.splash]: true, [$style.up]: hideSplash}">
      <div ref="splashLQ" v-if="!splashLoaded" :class="$style.lq"></div>
      <div ref="splashHQ" :class="$style.hq"></div>
    </div>
  </div>
</template>


<style lang="stylus" module>
  .bg, .splash, .splash .lq, .splash .hq, .history, .color
    top 0
    left 0
    right 0
    bottom 0

  .bg
    position fixed
    z-index -1

  .splash, .splash .lq, .splash .hq, .history, .color
    position absolute

  .splash .lq, .splash .hq, .history
    background-size cover

  .splash
    transition all 300ms ease-out
    &.up
      transform scale(1.2)
      opacity 0

    .lq, .hq
      background-position bottom right 20%
      +breakpoint($desktop)
        background-position bottom right
    .lq
      background-image url('~/assets/splash-bg.svg?data');
    .hq
      background-image url('~/assets/splash-bg.jpg');
      opacity 0

  .history
    background-position bottom center
    filter grayscale(100%) blur(3px)
    transform scale(1.01)  // avoid the weird edges due to blur filter

  .color
    background-color hsl(209, 18%, 34%)
    opacity 1
</style>


<script>
import anime from 'animejs';
import throttle from 'lodash/throttle';
import {mapGetters, mapState} from 'vuex';

const SPLASH_BG = require('~/assets/splash-bg.jpg');

const SECTION_COLORS = {
  splash: '#ccba97',
  bio: '#ccba97',
  history: '#1d7c87',
  code: '#fff',
  qa: '#4a4a4a',
};

const SECTION_OPACITIES = {
  history: 0.7,
};

export default {
  computed: {
    hideSplash() {
      // Show the splash at the very top of the page, or within a threshold when scrolling upwards.
      return this.scrollDelta > 0 || this.scrollY >= 150;
    },
    sectionColor() {
      return SECTION_COLORS[this.currentSection];
    },
    sectionOpacity() {
      return this.currentSection in SECTION_OPACITIES ? SECTION_OPACITIES[this.currentSection] : 1;
    },
    ...mapState(['currentSection', 'historyBackgroundImage']),
  },

  data() {
    return {
      colorAnimation: null,
      colorAnimationDuration: 600,
      imageAnimation: null,
      imageAnimationDuration: 2000,
      prevHistoryBackgroundImage: null,
      scrollDelta: 0,
      scrollY: 0,
      splashLoaded: false,
    };
  },

  methods: {
    loadBgImage() {
      const i = document.createElement('img');
      i.addEventListener('load', () => {
        anime({
          complete: () => this.splashLoaded,
          duration: 350,
          easing: 'easeOutQuad',
          opacity: [0, 1],
          targets: this.$refs.splashHQ,
        });
      });
      i.setAttribute('src', SPLASH_BG);
    },

    updateScroll: throttle(function () {
      this.scrollDelta = window.scrollY - this.scrollY;
      this.scrollY = window.scrollY;
    }, 20, {leading: false}),

    updateColor() {
      this.colorAnimation && this.colorAnimation.pause()
      this.colorAnimation = anime({
        backgroundColor: this.sectionColor,
        duration: this.colorAnimationDuration,
        easing: 'easeInQuad',
        opacity: this.sectionOpacity,
        targets: this.$refs.color,
      });
    },

    updateHistoryVisibility(newSection, oldSection) {
      this.imageAnimation && this.imageAnimation.seek(this.imageAnimationDuration);
      if (newSection === 'history') {
        requestAnimationFrame(() => {
          this.imageAnimation = anime({
            duration: this.imageAnimationDuration,
            easing: 'easeOutQuad',
            opacity: [0, 1],
            targets: this.$refs.history,
          });
        });
      }
      else if (oldSection === 'history') {
        this.imageAnimation = anime({
          duration: this.imageAnimationDuration,
          easing: 'easeOutQuad',
          opacity: [1, 0],
          targets: this.$refs.history,
        });
      }
    },
  },

  mounted() {
    this.loadBgImage();
    this.updateColor();
    this.updateScroll();
    this.updateHistoryVisibility(this.currentSection);
    window.addEventListener('scroll', this.updateScroll);
  },

  destroyed() {
    window.removeEventListener('scroll', this.updateScroll);
  },

  watch: {
    currentSection(newSection, oldSection) {
      this.updateColor();
      this.updateHistoryVisibility(newSection, oldSection);
    },

    historyBackgroundImage(newImage, prevImage) {
      this.imageAnimation && this.imageAnimation.seek(this.imageAnimationDuration);
      this.prevHistoryBackgroundImage = prevImage;
      this.imageAnimation = anime({
        complete: () => this.prevHistoryBackgroundImage = null,
        duration: this.imageAnimationDuration,
        easing: 'easeOutQuad',
        targets: this.$refs.history,
        opacity: [0, 1],
      });
    },
  },
};
</script>
