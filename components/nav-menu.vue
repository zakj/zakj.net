<template>
  <nav :class="$style.nav">
    <a href="#bio" v-scroll-to="'#bio'" x-title="Bio">Bio</a>
    <a href="#history" v-scroll-to="'#history'">History</a>
    <a href="#code" v-scroll-to="'#code'">Code</a>
    <a href="#qa" v-scroll-to="'#qa'">Q/A</a>
  </nav>
</template>


<style lang="stylus" module>
  .nav
    @extend $side-nav
    right 0
    +breakpoint($desktop)
      left 0
      right auto
</style>


<script>
export default {
}
</script>
