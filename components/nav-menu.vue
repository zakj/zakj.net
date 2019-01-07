<template>
  <nav :class="$style.nav">
    <div :class="{[$style.marker]: true, [$style.dark]: lightBackground}" ref="marker"></div>
    <a href="#bio" v-scroll-to="'#bio'" ref="bio">Bio</a>
    <a href="#history" v-scroll-to="'#history'" ref="history">History</a>
    <a href="#code" v-scroll-to="'#code'" ref="code">Code</a>
    <a href="#qa" v-scroll-to="'#qa'" ref="qa">Q/A</a>
  </nav>
</template>


<style lang="stylus" module>
  .nav
    @extend $side-nav
    right 0
    +breakpoint($desktop)
      left 0
      right auto

  .marker
    background-color $light-text-color
    left -3px
    opacity 0.3
    position absolute
    transition background-color $light-dark-transition-ms ease-in
    width 2px
    &.dark
      background-color $dark-text-color
    +breakpoint($desktop)
      width 3px
</style>


<script>
import anime from 'animejs';
import {mapGetters, mapState} from 'vuex';

const itemPadding = 12;

export default {
  computed: {
    ...mapGetters(['lightBackground']),
    ...mapState(['currentSection']),
  },

  data() {
    return {
      markerAnimation: null,
    };
  },

  methods: {
    moveMarker(section) {
      if (this.markerAnimation) this.markerAnimation.pause();
      const marker = this.$refs.marker;
      const navItem = this.$refs[this.currentSection];
      const to = {};
      if (!navItem) {
        const bio = this.$refs.bio;
        const rect = bio.getBoundingClientRect();
        to.top = `${rect.top + itemPadding}px`;
        to.height = 0;
      }
      else {
        const rect = navItem.getBoundingClientRect();
        to.top = `${rect.top + itemPadding}px`;
        to.height = `${rect.height - itemPadding * 2}px`;
      }
      this.markerAnimation = anime({
        duration: 200,
        easing: 'easeInQuad',
        targets: marker,
        ...to,
      });
    },
  },

  mounted() {
    this.moveMarker(this.currentSection);
  },

  watch: {
    currentSection(section) {
      this.moveMarker(section);
    },
  },
};
</script>
