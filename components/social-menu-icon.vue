<template>
  <div :class="$style.socialMenuIcon" @click="toggleSocialMenu">
    <XIcon v-if="socialMenuOpen" />
    <MenuIcon v-else />
  </div>
</template>


<style lang="stylus" module>
  .social-menu-icon
    $padding = 12px
    padding $padding
    position fixed
    right $small-padding - $padding
    top $small-padding - $padding
    svg
      display block
      height 16px
      width 16px
    g
      fill $light-text-color
      transition fill $light-dark-transition-ms ease-in
      :global(.light-bg) &
        fill $dark-text-color
    +breakpoint($desktop)
      display none
</style>


<script>
import {mapMutations, mapState} from 'vuex';

import MenuIcon from '~/assets/menu.svg?inline';
import XIcon from '~/assets/x.svg?inline';

export default {
  components: {MenuIcon, XIcon},

  computed: {
    ...mapState(['socialMenuOpen']),
  },

  methods: {
    ...mapMutations(['toggleSocialMenu']),
  },
};
</script>
