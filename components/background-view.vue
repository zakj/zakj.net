<template>
  <div :class="$style.bg">
    <div
      v-if="historyBackgroundImage"
      ref="history"
      :class="$style.history"
      :style="{backgroundImage: `url(${historyBackgroundImage})`}"
      ></div>
    <div ref="color" :class="$style.color"></div>
    <div :class="{[$style.splash]: true, [$style.up]: hideSplash}"></div>
<!--
  TODO
  fade-through history background changes --- save previous background, add new element, fade through
  fade in from low-quality splash background on load
-->
  </div>
</template>


<style lang="stylus" module>
  .bg, .splash, .history, .color
    top 0
    left 0
    right 0
    bottom 0

  .bg
    position fixed
    z-index -1

  .splash, .history, .color
    position absolute

  .splash, .history
    background-size cover

  .splash
    background-image url('~/assets/splash-bg.jpg');
    background-position bottom right 20%
    transition all 300ms ease-out
    +breakpoint($desktop)
      background-position bottom right
    &.up
      transform scale(1.2)
      opacity 0

  .history
    background-position bottom center
    filter grayscale(100%) blur(3px)
    opacity 0

  .color
    background-color hsl(209, 18%, 34%)
    opacity 1
</style>


<script>
import anime from 'animejs';
import throttle from 'lodash/throttle';
import {mapGetters, mapState} from 'vuex';

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
      scrollDelta: 0,
      scrollY: 0,
    };
  },

  methods: {
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
  },
};
</script>
