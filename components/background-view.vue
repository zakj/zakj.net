<template>
  <div :class="$style.bg" :style="backgroundStyle"></div>
</template>


<style lang="stylus" module>
  .bg
    background-position bottom right
    background-size cover
    bottom 0
    left 0
    position fixed
    right 0
    top 0
    transition background-color 600ms ease-in
    z-index -1
</style>


<script>
import {mapGetters} from 'vuex';

export default {
  computed: {
    ...mapGetters(['backgroundStyle']),
  },
}
</script>
