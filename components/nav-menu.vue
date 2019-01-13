<template>
  <nav :class="$style.nav">
    <div :class="$style.marker" ref="marker"></div>
    <a href="#bio" v-scroll-to="'#bio'" ref="bio">Bio</a>
    <a href="#history" v-scroll-to="'#history'" ref="history">History</a>
    <a href="#code" v-scroll-to="'#code'" ref="code">Code</a>
    <a href="#qa" v-scroll-to="'#qa'" ref="qa">Q/A</a>
  </nav>
</template>


<style lang="stylus" module>
  .nav
    side-nav()
    right 0
    +breakpoint($desktop)
      left 0
      right auto

  .marker
    background-color $light-text-color
    left -3px
    position absolute
    transition background-color $light-dark-transition-ms ease-in
    width 2px
    :global(.light-bg) &
      background-color $dark-text-color
    +breakpoint($desktop)
      width 3px
</style>


<script>
import anime from 'animejs';
import {mapState} from 'vuex';

const itemPadding = 12;

export default {
  computed: {
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
      }
      else {
        const rect = navItem.getBoundingClientRect();
        to.top = `${rect.top + itemPadding}px`;
        to.height = `${rect.height - itemPadding * 2}px`;
      }
      this.markerAnimation = anime.timeline({
        duration: 200,
        easing: 'easeOutQuad',
        targets: marker,
      }).add(to);
      // Prevent the market disappearing before it reaches the top of the first item.
      if (!navItem) {
        this.markerAnimation.add({height: 0, offset: 50});
      }
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
