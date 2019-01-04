<template>
  <div :class="{[$style.container]: true, [$style.lightBg]: lightBackground}">
    <main>
      <section :class="$style.splash" id="splash" v-viewport-overlap="overlapHandler">
        <h1>Whiskey&nbsp;&amp; a&nbsp;dash of&nbsp;bitters.</h1>
      </section>

      <section :class="$style.bio" id="bio" v-viewport-overlap="overlapHandler">
        <h2>Bio</h2>

        <p>Hello! I’m Zak Johnson, a design-minded full-stack developer with
        a background in information security. I’ve been building and breaking
        things on the web since the nineties at companies like Etsy, GOOD,
        and Cabin. I currently lead a team of product engineers at Mixpanel.</p>

        <p>I’m passionate about simplicity, text editors, significant
        whitespace, and grammar. (TODO text, links, etc)</p>
      </section>

      <section :class="$style.history" id="history" v-viewport-overlap="overlapHandler">
        <h2>History</h2>
      </section>

      <section :class="$style.code" id="code" ref="code" v-viewport-overlap="overlapHandler">
        <h2>Code</h2>
      </section>

      <section :class="$style.qa" id="qa" v-viewport-overlap="overlapHandler">
        <h2>Q / A</h2>
      </section>
    </main>

    <BackgroundView />
    <HeaderLogo />
    <NavMenu />
    <SocialMenu />
  </div>
</template>

<style lang="stylus" module>
  .container, .container a
    color $light-text-color
    transition color 400ms ease-in
  .light-bg, .light-bg a
    color $dark-text-color

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
      bg() {
        const colorsRGB = {
          bio: '#dbc69e',
          history: '#1d7c87',
          code: '#fff',
          qa: '#4a4a4a',
        };
        const colorsHSL = {
          bio: 'hsl(39, 46%, 74%)',
          history: 'hsl(186, 65%, 32%)',
          code: 'hsl(0, 0%, 100%)',
          qa: 'hsl(0, 0%, 29%)',
        };
        const colors = colorsHSL;
        return colors[this.greatestOverlapElement && this.greatestOverlapElement.id] || 'transparent';
      },

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
