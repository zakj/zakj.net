<template>
  <nav :class="$style.nav" @click="closeSocialMenu">
    <div :class="$style.container">
      <div :class="$style.marker" ref="marker"></div>
      <a href="#bio" v-scroll-to="'#bio'" ref="bio">Bio</a>
      <a href="#history" v-scroll-to="'#history'" ref="history">History</a>
      <!-- <a href="#code" v-scroll-to="'#code'" ref="code">Code</a>
      <a href="#qa" v-scroll-to="'#qa'" ref="qa">Q/A</a> -->
    </div>
  </nav>
</template>


<style lang="stylus" module>
  .nav
    side-nav()
    right 0
    +breakpoint($desktop)
      left 0
      right auto

  // This is here only to work around a Chrome+retina bug: the nav would shift
  // during fast scrolls. Removing position: relative on the contained A
  // elements also worked around it, but that is needed for the hover underline
  // positioning.
  .container
    display flex
    justify-content center

  .marker
    background-color $light-text-color
    left -3px
    position absolute
    top 0
    transition background-color $light-dark-transition-ms ease-in
    width 2px
    :global(.light-bg) &
      background-color $dark-text-color
    +breakpoint($desktop)
      width 3px
</style>


<script>
import {styler, timeline} from 'popmotion';
import {mapMutations, mapState} from 'vuex';

const itemPadding = 12;

export default {
  computed: {
    ...mapState(['currentSection', 'windowHeight']),
  },

  data() {
    return {
      styler: null,
      timeline: null,
    };
  },

  methods: {
    closeSocialMenu() {
      this.toggleSocialMenu(false);
    },

    moveMarker(section, {animate=true}={}) {
      this.styler = this.styler || styler(this.$refs.marker);
      this.timeline && this.timeline.pause();

      const navItem = this.$refs[section];
      const to = {};
      if (navItem) {
        const rect = navItem.getBoundingClientRect();
        to.height = rect.height - itemPadding * 2;
        to.y = rect.top + itemPadding;
        to.stagger = 0;
      }
      else {
        to.height = 0;
        to.y = this.$refs.bio.getBoundingClientRect().top + itemPadding;
        to.stagger = 50;  // prevent the marker disappearing before it reaches the top
      }

      if (animate) {
        this.timeline = timeline([
          {track: 'y', from: this.styler.get('y'), to: to.y},
          to.stagger,
          {track: 'height', from: this.styler.get('height'), to: to.height},
        ], {duration: 300}).start(v => this.styler.set(v))
      }
      else {
        this.styler.set(to);
      }
    },

    ...mapMutations(['toggleSocialMenu']),
  },

  mounted() {
    this.moveMarker(this.currentSection);
  },

  watch: {
    currentSection(section) {
      this.moveMarker(section);
    },

    windowHeight() {
      this.moveMarker(this.currentSection, {animate: false});
    },
  },
};
</script>
