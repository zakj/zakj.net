<template>
  <nav :class="$style.social">
    <div :class="{[$style.menu]: true, [$style.open]: socialMenuOpen}">
      <a href="https://twitter.com/zakj"><span :class="$style.at">@</span>zakj</a>
      <a href="https://github.com/zakj">GitHub</a>
      <a href="https://www.linkedin.com/in/zakjohnson">LinkedIn</a>
      <a href="mailto:me@zakj.net">Email</a>
    </div>
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
      display none
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
      &.open
        display flex
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
import {mapState} from 'vuex';

export default {
  computed: {
    ...mapState(['socialMenuOpen']),
  },
};
</script>
