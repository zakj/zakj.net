<template>
  <header :class="$style.header" v-scroll-to="'body'">
    /
  </header>
</template>

<style lang="stylus" module>
  $header-width = 64px
  .header
    cursor pointer
    left 50%
    margin-left -($header-width / 2)
    position fixed
    line-height 1
    text-align center
    top ($small-padding / 4 * 3)
    padding ($small-padding / 4) 0
    width $header-width
    +breakpoint($desktop)
      top ($large-padding / 4 * 3)
      padding ($large-padding / 4) 0
    font 64px/1 $header-font-stack  // XXX
</style>

<script>
export default {
};
</script>
