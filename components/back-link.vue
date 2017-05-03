<template>
  <nuxt-link v-if="!click" to="/" class="no-underline"><slot></slot></nuxt-link>
  <a v-else @click="click" class="no-underline"><slot></slot></a>
</template>

<style lang="stylus" scoped>
  @require '~assets/util'

  a
    color text-color
    position relative
    &::before
      padding-right 10px
      position absolute
      right 100%
      content "«"
      color #ddd
    &:hover::before
      color text-color
</style>

<script>
  export default {
    props: ['click'],
  };
</script>
