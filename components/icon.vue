<template>
  <a :href="href" :class="icon" class="no-underline"><slot></slot></a>
</template>


<style lang="stylus" scoped>
  @require '~assets/util'
  icon-size = 26px

  a
    hide-text()
    background-color text-color
    background-position center center
    background-repeat no-repeat
    background-size icon-size icon-size
    border-radius icon-size
    display inline-block
    height icon-size
    margin-right 5px
    width icon-size

    position relative
    &:hover::after
      background-image linear-gradient(to bottom, alpha(#fff, .2), transparent)
      content ""
      display block
      height 60%
      left 0
      position absolute
      right 0
      top 0

  for name in email github linkedin twitter
    .{name}
      background-image url('~assets/img/' + name + '.png')
      +retina()
        background-image url('~assets/img/' + name + '_2x.png')
</style>


<script>
  export default {
    props: ['href', 'icon'],
  };
</script>
