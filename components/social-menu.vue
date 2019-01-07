<template>
  <nav :class="$style.social">
    <a href="https://twitter.com/zakj"><span :class="$style.at">@</span>zakj</a>
    <a href="https://github.com/zakj">GitHub</a>
    <a href="https://www.linkedin.com/in/zakjohnson">LinkedIn</a>
    <a href="mailto:me@zakj.net">Email</a>
  </nav>
</template>


<style lang="stylus" module>
  .social
    display none
    +breakpoint($desktop)
      @extend $side-nav
      display block
      right 0

  // The @ character doesn't match the rest of the font's baseline.
  +breakpoint($desktop)
    .at
      position relative
      left 3px
</style>


<script>
export default {
}
</script>
