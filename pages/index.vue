<template>
  <div :class="{container: true, 'light-bg': isLightBackground}">
    <BackgroundView />
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
        <HistoryGraph />
      </section>

      <!-- <section :class="$style.code" id="code" v-viewport-overlap="overlapHandler">
        <h2>Code</h2>
      </section>

      <section :class="$style.qa" id="qa" v-viewport-overlap="overlapHandler">
        <h2>Q/A</h2>
      </section> -->
    </main>

    <HeaderLogo />
    <SocialMenu />
    <NavMenu />
    <SocialMenuIcon />
  </div>
</template>

<style lang="stylus" module>
  .splash
    align-items top
    display flex
    +breakpoint($desktop)
      align-items center
</style>

<script>
  import throttle from 'lodash/throttle';
  import {mapGetters, mapMutations, mapState} from 'vuex';

  import BackgroundView from '~/components/background-view';
  import HeaderLogo from '~/components/header-logo';
  import HistoryGraph from '~/components/history-graph';
  import NavMenu from '~/components/nav-menu';
  import SocialMenu from '~/components/social-menu';
  import SocialMenuIcon from '~/components/social-menu-icon';

  export default {
    head() {
      return {
        title: 'Zak Johnson',
        meta: [
          {hid: 'description', name: 'description', content: 'XXX'},
        ],
        bodyAttrs: this.socialMenuOpen ? {class: 'no-scroll'} : {},
      };
    },

    components: {BackgroundView, HistoryGraph, HeaderLogo, NavMenu, SocialMenu, SocialMenuIcon},

    computed: {
      greatestOverlapElement() {
        const x = this.elementOverlaps
          .map(([el, overlap]) => ({el, overlap}))
          .filter(({overlap}) => overlap > 0)
          .sort((a, b) => b.overlap - a.overlap)
          .map(({el}) => el) || null;
          // .map(({el}) => el)[0] || null;
        // const y = (window.scrollY > 0 && x === 'splash') ? 'bio' : x;
        if (x.length === 2 && x[1].id === 'bio') return x[1];
        return x[0] || null;
        // console.log(x)
        // // return y;
        // return null;
      },

      ...mapGetters(['isLightBackground']),
      ...mapState(['socialMenuOpen', 'windowHeight', 'windowWidth']),
    },

    data() {
      return {
        elementOverlaps: [],
      };
    },

    methods: {
      overlapHandler(el, overlap) {
        // Vue is not reactive on Map, so we translate as needed.
        const map = new Map(this.elementOverlaps);
        // TODO: pass name from callers, just use an object?
        map.set(el, overlap);
        this.elementOverlaps = Array.from(map);
      },

      updateWindowSize: throttle(function (event) {
        const height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        this.setWindowSize({width, height});
      }, 20, {leading: false}),

      ...mapMutations(['setCurrentSection', 'setWindowSize']),
    },

    mounted() {
      this.updateWindowSize();
      window.addEventListener('resize', this.updateWindowSize);
    },

    destroyed() {
      window.removeEventListener('resize', this.updateWindowSize);
    },

    watch: {
      greatestOverlapElement: function(section) {
        this.setCurrentSection(section.id);
      },
    },
  };
</script>
