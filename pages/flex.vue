<template>
  <div class="page">
    <h1>display: flex</h1>

    <label>flex-direction
    <select v-model="style.flexDirection">
      <option value="">row (default)</option>
      <option>row-reverse</option>
      <option>column</option>
      <option>column-reverse</option>
    </select>
    </label>

    <label>flex-wrap
    <select v-model="style.flexWrap">
      <option value="">nowrap (default)</option>
      <option>wrap</option>
      <option>wrap-reverse</option>
    </select>
    </label>

    <label>
      flex-flow: <i>flex-direction</i> <i>flex-wrap</i>
    </label>

    <label>justify-content
    <select v-model="style.justifyContent">
      <option value="">flex-start (default)</option>
      <option>flex-end</option>
      <option>center</option>
      <option>space-between</option>
      <option>space-around</option>
    </select>
    </label>

    <label>align-items
    <select v-model="style.alignItems">
      <option value="">stretch (default)</option>
      <option>flex-start</option>
      <option>flex-end</option>
      <option>center</option>
      <option>baseline</option>
    </select>
    </label>

    <label :class="{disabled: !wrapped}">align-content
    <select v-model="style.alignContent" :disabled="!wrapped">
      <option value="">stretch (default)</option>
      <option>flex-start</option>
      <option>flex-end</option>
      <option>center</option>
      <option>space-between</option>
      <option>space-around</option>
    </select>
    </label>

    <div class="container" :style="nonEmptyStyle">
      <div v-for="numeral in items" class="child">{{ numeral }}</div>
    </div>
  </div>
</template>


<style lang="stylus" scoped>
  label
    display block
    margin 10px 0
    &.disabled
      opacity .6
    i
      margin-right 5px

  .container
    background #fbfbfb
    border 1px solid #ccc
    border-radius 4px
    display flex
    height 350px
    margin-top 2em
    position relative
    width 100%

  .child
    background #aaa
    border-radius 3px
    color #fff
    line-height 50px
    margin 10px
    text-align center
    width 13%

    &:nth-child(3)
      background #777
      width 16%
      line-height 60px
</style>


<script>
  import pickBy from 'lodash/pickBy';

  export default {
    head: {
      title: 'display: flex',
    },

    data() {
      return {
        transitionDuration: .6,
        style: {
          flexDirection: '',
          flexWrap: '',
          justifyContent: '',
          alignItems: '',
          alignContent: '',
        },
        checker: false,
      };
    },

    computed: {
      items() {
        return ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII']
          .slice(0, this.numItems);
      },
      numItems() {
        return this.wrapped ? 8 : 4;
      },
      nonEmptyStyle() {
        return pickBy(this.style);
      },
      wrapped() {
        return this.style.flexWrap.indexOf('wrap') === 0;
      },
    },

    watch: {
      style: {
        handler() {
          const container = this.$el.querySelector('.container');
          const children = Array.prototype.map.call(
            container.children,
            child => ({child, first: child.getBoundingClientRect()}));
          requestAnimationFrame(() => {
            children.forEach(({child, first}) => {
              const last = child.getBoundingClientRect()
              TweenLite.from(child, this.transitionDuration, {
                x: first.left - last.left,
                y: first.top - last.top,
              });
              TweenLite.fromTo(child, this.transitionDuration / 2, {
                height: first.height,
                width: first.width,
              }, {
                height: last.height,
                width: last.width,
                onComplete: () => TweenLite.set(child, {height: '', width: ''}),
              });
            });
          });
        },
        deep: true,
      },
    },
  };
</script>
