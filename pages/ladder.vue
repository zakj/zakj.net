<template>
  <div class="ladder" v-touch="nextExercise">
    <div class="header">
      <transition name="title">
        <h1 :key="exercise.title">{{exercise.title}}</h1>
      </transition>
    </div>
    <div class="count">
      <transition name="count">
        <div :key="exercise.title">{{count}}</div>
      </transition>
    </div>
  </div>
</template>


<style lang="stylus" scoped>
  @require '~assets/util'

  .ladder
    border-radius 5px
    display flex
    flex-direction column
    height 100vh
    max-width 25em
    padding-bottom 2em
    padding-top 25vh
    text-align center
    width 100%

  .header
    height 70px
    position relative
    h1
      margin 0
      position absolute
      width 100%

  .count
    font-size 60px
    position relative
    div
      position absolute
      width 100%

  .title-enter-active, .count-enter-active
    transition all 350ms ease

  .title-leave-active, .count-leave-active
    transition all 250ms ease

  .title-enter, .count-enter
    opacity 0
    transform translateX(30%)

  .title-leave-to, .count-leave-to
    opacity 0
    transform translateX(-30%) scale(.5)

  +breakpoint(400px)
    .ladder
      background #fff
      box-shadow 0 1px 8px #666
      height auto
      margin 3em auto
      padding-top 0
    .header
      margin-top 30px
    .count
      height 100px
</style>


<script>
  import touchIcon from '~/assets/ladder-apple-touch-icon.png';

  const EXERCISES = [
    {
      name: 'bend',
      title: 'Bend and bounce',
    },
    {
      name: 'sitUp',
      title: 'Sit up',
    },
    {
      name: 'legLift',
      title: 'Prone lift',
    },
    {
      name: 'pushUp',
      title: 'Push up',
    },
    {
      name: 'steps',
      title: 'Run and jump',
    },
  ];

  const LADDER = [
    {rung: 16, bend: 14, sitUp: 10, legLift: 12, pushUp: 9, steps: 340},
  ];

  export default {
    head: {
      title: 'Ladder',
      meta: [
        {name: 'apple-mobile-web-app-capable', content: 'yes'},
      ],
      link: [
        {rel: 'apple-touch-icon', sizes: '512x512', href: touchIcon},
      ],
    },

    data() {
      return {
        exerciseIndex: 0,
        rungNumber: 16,
      };
    },

    computed: {
      exercise() {
        return EXERCISES[this.exerciseIndex];
      },

      rung() {
        return LADDER.find(r => r.rung === this.rungNumber);
      },

      count() {
        return this.rung[this.exercise.name];
      },
    },

    methods: {
      nextExercise() {
        if (this.exerciseIndex < EXERCISES.length - 1) {
          this.exerciseIndex++;
        }
      },
    }
  };
</script>
