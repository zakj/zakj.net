<template>
  <nav :class="$style.social">
    <Menu :class="$style.menu" :pose="backgroundPose">
      <a href="https://twitter.com/zakj"><span :class="$style.at">@</span>zakj</a>
      <a href="https://github.com/zakj">GitHub</a>
      <a href="https://www.linkedin.com/in/zakjohnson">LinkedIn</a>
      <a href="mailto:me@zakj.net">Email</a>
    </Menu>
  </nav>
</template>


<style lang="stylus" module>
  +breakpoint($mobile)
    .social
      bottom 0
      left 0
      position fixed
      right 0
      top 0

    .menu
      background-color #1d7c87
      bottom 0
      display flex
      flex-direction column
      font-family $header-font-stack
      font-size 56px
      font-weight bold
      justify-content center
      left 0
      letter-spacing -0.02em
      line-height 1.1
      padding $small-padding
      position absolute
      right 0
      text-transform uppercase
      top 0
      a
        text-decoration none
    .at
      position relative
      top -5px

  +breakpoint($desktop)
    .social
      side-nav()
      right 0

    // The @ character doesn't match the rest of the font's baseline.
    .at
      position relative
      left 3px
</style>


<script>
import {mapGetters, mapState} from 'vuex';
import posed from 'vue-pose';

export default {
  components: {
    Menu: posed.div({
      open: {
        // clipPath: 'polygon(0% 0%, 200% 0%, 0% 200%)',
        opacity: 1,
        transition: {duration: 400, ease: 'easeOut'},
      },
      closed: {
        // clipPath: 'polygon(0% 0%, 0% 0%, 0% 0%)',
        opacity: 0,
        transition: {duration: 400, ease: 'easeIn'},
      },
      desktop: {
        // clipPath: 'none',
        opacity: 1,
      },
    }),
  },

  computed: {
    backgroundPose() {
      if (this.isMobile) {
        return this.socialMenuOpen ? 'open' : 'closed';
      }
      return 'desktop';
    },
    ...mapGetters(['isMobile']),
    ...mapState(['socialMenuOpen']),
  },
};
</script>
