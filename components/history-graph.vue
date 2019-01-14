<template>
  <div :class="$style.history">
    <h2 :class="$style.title">History</h2>
    <div :class="$style.date">{{dateRange(selectedItem)}}</div>
    <p :class="$style.description">{{selectedItem.description}}</p>
    <ul :class="$style.list">
      <li
        v-for="(item, i) in history" :key="i"
        :class="{[$style.selected]: selectedIndex === i}"
        @mouseenter="selectedIndex = i"
      >{{item.place}}</li>
    </ul>
    <StaggeredPie :class="$style.graph" @hover="hoverPie" :data="historyPie" :selected="selectedIndex" :height="650" :width="650" />
  </div>
</template>


<style lang="stylus" module>
  .history
    display grid
    grid-template-areas:
      "title       graph" \
      "date        graph" \
      "description graph" \
      "list        graph"
    
  .title
    grid-area title

  .date
    grid-area date

  .list
    grid-area list
    .selected
      color $copper-color

  .graph
    grid-area graph
</style>


<script>
import parse from 'date-fns/parse';
import zip from 'lodash/zip';

import StaggeredPie from '~/components/staggered-pie';

const historyRaw = [
  ['1980-04', 'Brisbane', 'some brisbane text'],
  ['1984-06', 'San Diego', 'XXX'],
  ['1989-12', 'Portland', 'XXX'],
  ['1998-04', 'San Diego', 'XXX'],
  ['2000-01', 'Washington, DC', 'XXX'],
  ['2004-05', 'San Francisco', 'XXX'],
  ['2008-03', 'Oakland', 'XXX'],
  ['2010-09', 'Los Angeles', 'XXX'],
  ['2011-04', 'Idyllwild', 'XXX'],
  ['2011-10', 'Portland', 'XXX'],
  ['2013-12', 'Los Angeles', 'XXX'],
  ['2014-11', 'San Francisco', 'XXX'],
  ['2016-08', 'Oakland', 'XXX'],
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
      return this.history.map(h => ({size: h.duration, ...h}));
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
