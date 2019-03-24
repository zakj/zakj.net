<template>
  <div :class="$style.history">
    <h2 :class="$style.title">History</h2>
    <ul :class="$style.list">
      <li
        v-for="(item, i) in history" :key="i"
        :class="{[$style.selected]: selectedIndex === i}"
        @mouseenter="selectSlice(i)"
      >{{item.place}}</li>
    </ul>
    <div :class="$style.date">{{dateRange(selectedItem)}}</div>
    <p :class="$style.description">{{selectedItem.description}}</p>
    <StaggeredPie :class="$style.graph" @select="selectSlice" :data="historyPie" :selected="selectedIndex" :height="pieSize" :width="pieSize" />
  </div>
</template>


<style lang="stylus" module>
  .history
    display grid
    grid-template-areas:
      "title" \
      "list" \
      "graph" \
      "date" \
      "description"
    +breakpoint($desktop)
      grid-template-areas:
        "title       graph" \
        "list        graph" \
        "date        graph" \
        "description graph"
      grid-template-rows auto auto auto 1fr
      grid-template-columns 1fr auto
    
  .title
    grid-area title

  .list, .date
    font-family $header-font-stack
    font-size 20px
    text-transform uppercase

  .list
    align-items flex-start
    cursor default
    display flex  // prevent children from expanding to 100% width
    flex-direction column
    grid-area list
    line-height 1.3
    list-style none
    padding 0
    +breakpoint($mobile)
      margin 0
      > li
        display none
      .selected
        display block
    +breakpoint($desktop)
      margin 1em 0 2em
      .selected
        color $copper-color

  .date
    grid-area date

  .description
    grid-area description
    margin .3em 0
    min-height 3em
    +breakpoint($mobile)
      margin-right 2em

  .graph
    grid-area graph
    justify-self center
    align-self bottom
</style>


<script>
import distanceInWordsStrict from 'date-fns/distance_in_words_strict';
import parse from 'date-fns/parse';
import debounce from 'lodash/debounce';
import zip from 'lodash/zip';
import {mapState, mapMutations} from 'vuex';

import StaggeredPie from '~/components/staggered-pie';

const historyRaw = [
  ['1980-04', 'Brisbane',
    'Zak springs forth, product of the unholy union between an Aussie and an American.',
    require('~/assets/history/01-AU.jpg')],
  ['1984-06', 'San Diego', 'Australia cannot contain Zak and his family for long… though he still misses proper fish & chips.'],
  ['1989-12', 'Portland', 'Clean air and green trees summon him northwards. A blur of school.'],
  ['1998-04', 'San Diego', 'XXX'],
  ['2000-01', 'Washington, DC', 'Zak kicks off an information security startup and loses faith in anyone’s ability to keep secrets.'],
  ['2004-05', 'San Francisco', 'Venturing at last into full-time web development, Zak takes a job at Etsy, and later begins consulting.'],
  ['2008-03', 'Oakland', 'XXX'],
  ['2010-09', 'Los Angeles',
    'Zak joins Bek at GOOD, having been lured back to southern California.',
    require('~/assets/history/06-WEHO.jpg')],
  ['2011-04', 'Idyllwild',
    'An excursion to the woods to build Cabin.',
    require('~/assets/history/07-IDY.jpg')],
  ['2011-10', 'Portland',
    'Silicon Forest—home to our favorite espresso, exquisite cuisine, and unstoppable green.',
    require('~/assets/history/08-PDX.jpg')],
  ['2013-12', 'Los Angeles',
    'Hello again, sunshine! Some things are just too good not to play on repeat.',
    require('~/assets/history/09-LA.jpg')],
  ['2014-11', 'San Francisco',
    `The verdict is in! San Francisco, we're yours.`,
    require('~/assets/history/10-SF.jpg')],
  ['2016-08', 'Oakland',
    'FLYTRAP',
    require('~/assets/history/11-OAK.jpg')],
].map(([startDate, place, description, img]) => ({startDate: parse(startDate), place, description, img}));

const history = zip(historyRaw, historyRaw.slice(1).concat({startDate: parse(new Date())}))
  .map(([current, next]) => {
    const {startDate, place, description, img} = current;
    const endDate = next.startDate;
    return {
      description,
      duration: endDate - startDate,
      endDate,
      img,
      place,
      startDate,
    };
  });

export default {
  components: {StaggeredPie},

  computed: {
    historyPie() {
      return this.history.map(h => {
        const [label, sub] = distanceInWordsStrict(h.startDate, h.endDate).split(' ');
        return {
          size: h.duration,
          label,
          sub,
        };
      });
    },

    pieSize() {
      if (!this.windowWidth) return 0;
      if (this.windowWidth < 750) {
        return this.windowWidth - 24 * 3;
      }
      // TODO: figure out the right numbers here
      return Math.max(this.windowWidth, this.windowHeight) / 2;
    },

    selectedItem() {
      return this.history[this.selectedIndex];
    },

    ...mapState(['currentSection', 'windowHeight', 'windowWidth']),
  },

  data() {
    return {
      history,
      selectedIndex: 0,
      selectionInterval: null,
    };
  },

  methods: {
    dateRange({startDate, endDate}) {
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      return startYear === endYear ? startYear : `${startYear}–${endYear}`
    },

    selectSlice(index) {
      clearInterval(this.selectionInterval);
      this.selectedIndex = index;
    },

    ...mapMutations(['setHistoryBackgroundImage']),
  },

  mounted() {
    const images = this.history.map(({img}) => img).filter(img => img);
    this.setHistoryBackgroundImage(images[0]);
    // Preload.
    images.forEach(img => {
      document.createElement('img').setAttribute('src', img);
    });
  },

  watch: {
    currentSection(section) {
      if (section === 'history' && !this.selectionInterval) {
        this.selectionInterval = setInterval(() => {
          this.selectedIndex++;
          if (this.selectedIndex >= this.history.length) this.selectedIndex = 0;
        }, 3000);
      }
    },

    selectedItem: debounce(function (item) {
      this.setHistoryBackgroundImage(item.img);
    }, 400),
  },
};
</script>
