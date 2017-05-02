<template>
  <div class="container">
    <div class="main">
      <div class="blurb">
        <p>Hello! I'm a full-stack developer with a background in information security.
        I've been building and breaking things on the web since the nineties—previously with companies like
        <a href="http://www.etsy.com/">Etsy</a>
        and
        <a href="http://www.good.is">GOOD</a>,
        and more recently independently or with my partner as
        <a href="http://madebycabin.com/">Cabin</a>.</p>

        <p>I'm passionate about simplicity,
        <a href="https://en.wikipedia.org/wiki/Vim_(text_editor)">text editors</a>,
        <a href="https://www.python.org/">significant whitespace</a>, and
        <a href="http://public.wsu.edu/~brians/errors/">grammar</a>.</p>

        <p class="social">
          <icon href="https://twitter.com/zakj" class="twitter">@zakj</icon>
          <icon href="https://github.com/zakj" class="github">zakj on GitHub</icon>
          <icon href="mailto:me@zakj.net" class="email">me@zakj.net</icon>
          <icon href="https://www.linkedin.com/in/zakjohnson" class="linkedin">LinkedIn</icon>
        </p>
      </div>
    </div>

    <div class="banner-pic"></div>
  </div>
</template>

<style lang="stylus" scoped>
  @require '~assets/util'

  // Make a sticky footer out of anything outside of .main.
  .container
    display flex
    flex-direction column
    min-height 100vh
  .main
    flex 1
    +breakpoint(800px)
      display flex
      flex-direction column
      justify-content center
      padding-bottom 4%
      padding-right 20%
    +breakpoint(1200px)
      padding-right 25%

  .blurb
    margin 0 auto
    max-width 30em
    padding 2.5em
    +breakpoint(800px)
      background-color #fff
      box-shadow 0 0 1px alpha(#000, .3)
      max-width 25em

  .social
    margin: 1.5em 0

  .banner-pic
    background-image: url('~assets/img/zak-stripe.jpg')
    background-size: cover
    &:before
      content: ""
      display: block
      // Set element size to match image dimension ratio.
      padding-top: percentage(880 / 1600)
    +breakpoint(800px)
      background-image: url('~assets/img/zak-cover.jpg')
      background-position: center center
      bottom: 0
      left: 0
      position: absolute
      right: 0
      top: 0
      z-index: -1
</style>

<script>
  import Icon from '~components/icon'

  export default {
    head: {
      title: 'Zak Johnson',
      meta: [
        {hid: 'description', name: 'description', content: ''},
      ],
    },

    components: {Icon},
  };
</script>
