<template>
  <div :class="$style.history">
    <h2 :class="$style.title">History</h2>
    <ul :class="$style.list">
      <li
        v-for="(item, i) in history" :key="i"
        :class="{[$style.selected]: selectedIndex === i}"
        @mouseenter="selectedIndex = i"
      >{{item.place}}</li>
    </ul>
    <div :class="$style.date">{{dateRange(selectedItem)}}</div>
    <p :class="$style.description">{{selectedItem.description}}</p>
    <StaggeredPie :class="$style.graph" @hover="hoverPie" :data="historyPie" :selected="selectedIndex" :height="650" :width="650" />
  </div>
</template>


<style lang="stylus" module>
  .history
    display grid
    grid-template-areas:
      "title       graph" \
      "list        graph" \
      "date        graph" \
      "description description"
    grid-template-rows auto 1fr auto auto
    
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
    margin 0
    padding 0
    .selected
      color $copper-color

  .date
    grid-area date

  .description
    grid-area description
    margin .3em 0
    min-height 3em

  .graph
    grid-area graph
    justify-self center
    align-self bottom
</style>


<script>
import distanceInWordsStrict from 'date-fns/distance_in_words_strict';
import parse from 'date-fns/parse';
import zip from 'lodash/zip';

import StaggeredPie from '~/components/staggered-pie';

const historyRaw = [
  ['1980-04', 'Brisbane', 'Zak springs forth, product of the unholy union between an Aussie and an American.'],
  ['1984-06', 'San Diego', 'Australia cannot contain Zak and his family for long… though he still misses proper fish & chips.'],
  ['1989-12', 'Portland', 'Clean air and green trees summon him northwards. A blur of school.'],
  ['1998-04', 'San Diego', 'XXX'],
  ['2000-01', 'Washington, DC', 'Zak kicks off an information security startup and loses faith in anyone’s ability to keep secrets.'],
  ['2004-05', 'San Francisco', 'Venturing at last into full-time web development, Zak takes a job at Etsy, and later begins consulting.'],
  ['2008-03', 'Oakland', 'XXX'],
  ['2010-09', 'Los Angeles', 'Zak joins Bek at GOOD, having been lured back to southern California.'],
  ['2011-04', 'Idyllwild', 'An excursion to the woods to build Cabin.'],
  ['2011-10', 'Portland', 'Silicon Forest—home to our favorite espresso, exquisite cuisine, and unstoppable green.'],
  ['2013-12', 'Los Angeles', 'Hello again, sunshine! Some things are just too good not to play on repeat.'],
  ['2014-11', 'San Francisco', `The verdict is in! San Francisco, we're yours.`],
  ['2016-08', 'Oakland', 'FLYTRAP'],
].map(([startDate, place, description]) => ({startDate: parse(startDate), place, description}));

const history = zip(historyRaw, historyRaw.slice(1).concat({startDate: parse(new Date())}))
  .map(([current, next]) => {
    const {startDate, place, description} = current;
    const endDate = next.startDate;
    return {
      description,
      duration: endDate - startDate,
      endDate,
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

    selectedItem() {
      return this.history[this.selectedIndex];
    },
  },

  data() {
    return {
      history,
      selectedIndex: 0,
    };
  },

  methods: {
    dateRange({startDate, endDate}) {
      const startYear = startDate.getFullYear();
      const endYear = endDate.getFullYear();
      return startYear === endYear ? startYear : `${startYear}–${endYear}`
    },

    hoverPie(index) {
      this.selectedIndex = index;
    },
  },
};
</script>
