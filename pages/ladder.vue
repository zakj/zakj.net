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
    <div class="rung">
      <div>
        <a class="rung-button no-underline"
          :class="{disabled: rungNumber <= minRung}"
          v-touch="setPreviousRung">&minus;</a>
        {{rungNumber}}
        <a class="rung-button no-underline"
          :class="{disabled: rungNumber >= maxRung}"
          v-touch="setNextRung">+</a>
      </div>
    </div>
  </div>
</template>


<style lang="stylus" scoped>
  @require '~assets/util'

  .ladder
    background #000
    color #fff
    display flex
    flex-direction column
    height 100vh
    max-width 25em
    padding-bottom 2em
    // TODO: max(2em, env(safe-area-inset-bottom))
    padding-bottom 5em
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

  .rung
    display flex
    flex 1
    flex-direction column-reverse

  .rung-button
    padding 5px 10px
    &.disabled
      pointer-events none
      opacity .1

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

  +breakpoint(640px)
    .ladder
      background bg-color
      border-radius 5px
      box-shadow 0 1px 8px #666
      color text-color
      height auto
      margin 3em auto
      min-height 450px
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

  const LADDER = {
    1: {bend: 2, sitUp: 3, legLift: 4, pushUp: 2, steps: 105},
    2: {bend: 3, sitUp: 4, legLift: 5, pushUp: 3, steps: 140},
    3: {bend: 4, sitUp: 6, legLift: 6, pushUp: 3, steps: 170},
    4: {bend: 6, sitUp: 7, legLift: 8, pushUp: 4, steps: 200},
    5: {bend: 7, sitUp: 9, legLift: 9, pushUp: 5, steps: 225},
    6: {bend: 8, sitUp: 10, legLift: 10, pushUp: 6, steps: 255},
    7: {bend: 10, sitUp: 11, legLift: 12, pushUp: 7, steps: 280},
    8: {bend: 12, sitUp: 13, legLift: 14, pushUp: 8, steps: 305},
    9: {bend: 14, sitUp: 15, legLift: 16, pushUp: 9, steps: 325},
    10: {bend: 16, sitUp: 16, legLift: 18, pushUp: 1, steps: 350},
    11: {bend: 18, sitUp: 18, legLift: 20, pushUp: 1, steps: 370},
    12: {bend: 20, sitUp: 20, legLift: 22, pushUp: 1, steps: 390},
    13: {bend: 23, sitUp: 21, legLift: 25, pushUp: 1, steps: 405},
    14: {bend: 25, sitUp: 23, legLift: 27, pushUp: 1, steps: 425},
    15: {bend: 28, sitUp: 25, legLift: 30, pushUp: 1, steps: 440},
    16: {bend: 14, sitUp: 10, legLift: 12, pushUp: 9, steps: 340},
    17: {bend: 15, sitUp: 11, legLift: 14, pushUp: 1, steps: 355},
    18: {bend: 16, sitUp: 12, legLift: 16, pushUp: 1, steps: 375},
    19: {bend: 18, sitUp: 13, legLift: 17, pushUp: 1, steps: 390},
    20: {bend: 19, sitUp: 14, legLift: 19, pushUp: 1, steps: 405},
    21: {bend: 21, sitUp: 15, legLift: 21, pushUp: 1, steps: 420},
    22: {bend: 22, sitUp: 16, legLift: 23, pushUp: 1, steps: 435},
    23: {bend: 24, sitUp: 17, legLift: 25, pushUp: 1, steps: 445},
    24: {bend: 25, sitUp: 18, legLift: 27, pushUp: 1, steps: 460},
    25: {bend: 27, sitUp: 20, legLift: 29, pushUp: 1, steps: 470},
    26: {bend: 29, sitUp: 21, legLift: 31, pushUp: 1, steps: 480},
    27: {bend: 31, sitUp: 23, legLift: 33, pushUp: 2, steps: 490},
    28: {bend: 33, sitUp: 24, legLift: 36, pushUp: 2, steps: 500},
    29: {bend: 34, sitUp: 26, legLift: 38, pushUp: 2, steps: 510},
    30: {bend: 36, sitUp: 28, legLift: 40, pushUp: 2, steps: 515},
    31: {bend: 38, sitUp: 29, legLift: 43, pushUp: 2, steps: 525},
    32: {bend: 40, sitUp: 31, legLift: 45, pushUp: 2, steps: 530},
    33: {bend: 43, sitUp: 33, legLift: 48, pushUp: 2, steps: 535},
    34: {bend: 45, sitUp: 35, legLift: 51, pushUp: 2, steps: 540},
    35: {bend: 47, sitUp: 37, legLift: 54, pushUp: 2, steps: 540},
    36: {bend: 49, sitUp: 39, legLift: 56, pushUp: 2, steps: 545},
    37: {bend: 51, sitUp: 41, legLift: 59, pushUp: 3, steps: 545},
    38: {bend: 54, sitUp: 43, legLift: 62, pushUp: 3, steps: 545},
    39: {bend: 56, sitUp: 46, legLift: 65, pushUp: 3, steps: 550},
    40: {bend: 59, sitUp: 48, legLift: 68, pushUp: 3, steps: 555},
    41: {bend: 61, sitUp: 50, legLift: 72, pushUp: 3, steps: 555},
    42: {bend: 64, sitUp: 53, legLift: 75, pushUp: 3, steps: 555},
    43: {bend: 66, sitUp: 55, legLift: 78, pushUp: 3, steps: 560},
    44: {bend: 69, sitUp: 58, legLift: 81, pushUp: 3, steps: 560},
    45: {bend: 72, sitUp: 61, legLift: 85, pushUp: 3, steps: 560},
    46: {bend: 74, sitUp: 64, legLift: 88, pushUp: 3, steps: 575},
    47: {bend: 77, sitUp: 66, legLift: 92, pushUp: 4, steps: 575},
    48: {bend: 80, sitUp: 69, legLift: 96, pushUp: 4, steps: 575},
  };

  export default {
    head: {
      title: 'Ladder',
      meta: [
        {name: 'apple-mobile-web-app-capable', content: 'yes'},
        {name: 'viewport', content: 'initial-scale=1, viewport-fit=cover'},
      ],
      link: [
        {rel: 'apple-touch-icon', sizes: '512x512', href: touchIcon},
      ],
    },

    data() {
      return {
        exerciseIndex: 0,
        rungNumber: 16,
        maxRung: Math.max(...Object.keys(LADDER)),
        minRung: Math.min(...Object.keys(LADDER)),
      };
    },

    computed: {
      exercise() {
        return EXERCISES[this.exerciseIndex];
      },

      rung() {
        return LADDER[this.rungNumber];
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

      setNextRung(e) {
        e.stopPropagation();
        this.rungNumber = Math.min(this.rungNumber + 1, this.maxRung);
      },

      setPreviousRung(e) {
        e.stopPropagation();
        this.rungNumber = Math.max(this.rungNumber - 1, this.minRung);
      },
    }
  };
</script>
