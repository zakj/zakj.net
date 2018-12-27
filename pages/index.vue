<template>
  <div :class="$style.container">
    <div :class="$style.main">
      <transition mode="out-in">
        <div :class="$style.blurb" v-if="!showProjects" key="blurb">
          <vue-marked>
            Hello! I'm a design-minded full-stack developer with a background
            in information security. I've been building and breaking things on
            the web since the nineties---most recently with companies like
            [Etsy][], [GOOD][], and [Cabin][]. I currently lead a team of
            product engineers at [Mixpanel][].

            I'm passionate about simplicity, [text editors][vimrc],
            [significant whitespace][python], and [grammar][].

            [Etsy]: https://www.etsy.com/
            [GOOD]: https://www.good.is
            [Cabin]: http://madebycabin.com/
            [Mixpanel]: https://mixpanel.com/
            [vimrc]: https://github.com/zakj/dotfiles/blob/master/vimrc
            [python]: https://www.python.org/
            [grammar]: https://brians.wsu.edu/common-errors-in-english-usage/
          </vue-marked>

          <p :class="$style.links">
            <icon href="https://twitter.com/zakj" class="twitter">@zakj</icon>
            <icon href="https://github.com/zakj" class="github">zakj on GitHub</icon>
            <icon href="mailto:me@zakj.net" class="email">me@zakj.net</icon>
            <icon href="https://www.linkedin.com/in/zakjohnson" class="linkedin">LinkedIn</icon>
            <a v-if="this.$config.projects" @click="toggleProjects" :class="$style.projectsLink">Projects</a>
          </p>

        </div>

        <div :class="$style.projects" v-else key="projects">
          <h2><back-link :click="toggleProjects">Projects</back-link></h2>
          <p>Links to some little toys and projects I've been working on.</p>
          <ul>
            <li><nuxt-link to="/flex">Flex playground</nuxt-link></li>
            <li><nuxt-link to="/nato">NATO alphabet</nuxt-link></li>
            <li><nuxt-link to="/ladder">Exercise ladder</nuxt-link></li>
            <li><a href=XXX>Linkhunter</a>, a Chrome extension for Pinboard</li>
            <li><a href=XXX>mourning</a>, a color scheme for vim</li>
          </ul>
        </div>
      </transition>
    </div>

    <div :class="$style.bannerPic"></div>
  </div>
</template>

<style lang="stylus" module>
  // Make a sticky footer out of anything outside of .main.
  .container
    display flex
    flex-direction column
    min-height 100vh
  .main
    flex 1
    margin 0 auto
    max-width 30em
    +breakpoint(800px)
      display flex
      flex-direction column
      justify-content center
      margin-bottom 4%
      margin-left 15%
      max-width 25em
    +breakpoint(1200px)
      margin-left 20%

  .blurb, .projects
    padding 2.5em
    > :first-child, div > :first-child
      margin-top 0
    > :last-child
      margin-bottom 0
    +breakpoint(800px)
      background-color #fff
      box-shadow 0 0 1px alpha(#000, .3)

  .links
    display flex
    margin 1.5em 0
    .projects-link
      line-height 26px  // icon size
      margin-left auto

  .banner-pic
    background-image url('~/assets/img/zak-stripe.jpg')
    background-size cover
    &:before
      content ""
      display block
      // Set element size to match image dimension ratio.
      padding-top round(percentage(880 / 1600))
    +breakpoint(800px)
      background-image url('~/assets/img/zak-cover.jpg')
      background-position center center
      bottom 0
      left 0
      position absolute
      right 0
      top 0
      z-index -1
</style>

<style lang="stylus" scoped>
  +breakpoint(800px)
    .v-enter-active, .v-leave-active
      transition all 200ms ease
    .v-leave-active
      transition-duration 100ms
    .v-enter, .v-leave-to
      transform scale(.85)
      opacity 0
</style>

<script>
  import VueMarked from 'vue-marked';

  export default {
    head: {
      title: 'Zak Johnson',
      meta: [
        {hid: 'description', name: 'description', content: ''},
      ],
    },

    components: {VueMarked},

    data() {
      return {
        showProjects: false,
      };
    },

    methods: {
      toggleProjects() {
        this.showProjects = !this.showProjects;
      },
    },
  };
</script>
