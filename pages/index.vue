<template>
  <div :class="{container: true, 'light-bg': lightBackground}">
    <main>
      <section :class="$style.splash" id="splash" v-viewport-overlap="overlapHandler">
        <h1>Whiskey ginger&nbsp;&amp; a&nbsp;dash&nbsp;of bitters.</h1>
      </section>

      <section :class="$style.bio" id="bio" v-viewport-overlap="overlapHandler">
        <h2>Bio</h2>

        <p>Hello! I’m Zak Johnson, a design-minded full-stack developer with
        a background in information security. I’ve been building and breaking
        things on the web since the nineties at companies like
        <a href="https://www.etsy.com/">Etsy</a>,
        <a href="https://www.good.is/">GOOD</a>, and
        <a href="http://madebycabin.com/">Cabin</a>. I currently lead a team
        of product engineers at
        <a href="https://mixpanel.com/">Mixpanel</a>.</p>

        <p>I’m passionate about simplicity,
        <a href="https://github.com/zakj/dotfiles/blob/master/vimrc">text
        editors</a>,
        <a href="https://www.python.org/">significant whitespace</a>, and
        <a href="https://brians.wsu.edu/common-errors-in-english-usage/">grammar</a>.</p>
      </section>

      <section :class="$style.history" id="history" v-viewport-overlap="overlapHandler">
        <h2>History</h2>
      </section>

      <section :class="$style.code" id="code" v-viewport-overlap="overlapHandler">
        <h2>Code</h2>
      </section>

      <section :class="$style.qa" id="qa" v-viewport-overlap="overlapHandler">
        <h2>Q/A</h2>
      </section>
    </main>

    <BackgroundView />
    <HeaderLogo />
    <NavMenu />
    <SocialMenu />
  </div>
</template>

<style lang="stylus" module>
  .splash
    align-items center
    display flex
    // background-image url('~/assets/splash-bg.jpg')
    // background-size cover
    // background-position bottom right

  .bio
    // background-color #dbc69e
    // transition background-color 200ms ease-in

  .history
    // background-color #1d7c87

  .code
    // background-color #fff
    // color $dark-text-color

  .qa
    // background-color #4a4a4a
</style>

<script>
  import {mapGetters, mapMutations} from 'vuex';

  import BackgroundView from '~/components/background-view';
  import HeaderLogo from '~/components/header-logo';
  import NavMenu from '~/components/nav-menu';
  import SocialMenu from '~/components/social-menu';

  export default {
    head: {
      title: 'Zak Johnson',
      meta: [
        {hid: 'description', name: 'description', content: 'XXX'},
      ],
    },

    components: {BackgroundView, HeaderLogo, NavMenu, SocialMenu},

    computed: {
      greatestOverlapElement() {
        return this.elementOverlaps
          .map(([el, overlap]) => ({el, overlap}))
          .filter(({overlap}) => overlap > 0)
          .sort((a, b) => b.overlap - a.overlap)
          .map(({el}) => el)[0] || null;
      },

      ...mapGetters(['lightBackground']),
    },

    data() {
      return {
        elementOverlaps: [],
      }
    },

    methods: {
      overlapHandler(el, overlap) {
        // Vue is not reactive on Map, so we translate as needed.
        const map = new Map(this.elementOverlaps);
        // TODO: pass name from callers, just use an object?
        map.set(el, overlap);
        this.elementOverlaps = Array.from(map);
      },

      ...mapMutations(['setCurrentSection']),
    },

    watch: {
      greatestOverlapElement: function(section) {
        this.setCurrentSection(section.id);
      },
    },
  };
</script>
