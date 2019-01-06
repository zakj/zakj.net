<template>
  <nav :class="$style.social">
    <a href="https://twitter.com/zakj">Twitter</a>
    <a href="https://github.com/zakj">GitHub</a>
    <a href="mailto:me@zakj.net">Email</a>
    <a href="https://www.linkedin.com/in/zakjohnson">LinkedIn</a>
  </nav>
</template>


<style lang="stylus" module>
  .social
    display none
    +breakpoint($desktop)
      @extend $side-nav
      display block
      right 0
</style>


<script>
export default {
}
</script>
