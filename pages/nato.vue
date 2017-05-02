<template>
  <div class="page">
    <h1>NATO alphabet</h1>

    <div class="result">
      <span v-for="code in codedText">{{ code }}</span>
    </div>
    <input autofocus v-model="text">
    <ul>
      <li v-for="code in alphabet">{{ code }}</li>
    </ul>
  </div>
</template>


<style lang="stylus" scoped>
  @require '~assets/util'

  .result
    display flex
    flex-wrap wrap

  .result span
    margin-right 10px
    white-space nowrap

  input
    width 100%

  ul
    align-content center
    align-items flex-start
    display flex
    flex-direction column
    flex-wrap wrap
    list-style-type none
    max-height 350px
    padding 0
    padding-left 50px

    +breakpoint(420px)
      max-height 220px

  li
    font-family header-font-stack
    margin-right 50px
    text-transform uppercase
    &::first-letter
      color #b75
</style>


<script>
  import alphabet from '~assets/nato-alphabet';

  function mapInput(c) {
    c = c.toLowerCase();
    if (c in alphabet) return alphabet[c];
    if (c.match(/\s/)) return ' ';
    return c;
  }

  export default {
    head: {
      title: 'NATO alphabet',
    },

    data() {
      return {
        alphabet,
        text: '',
      };
    },

    computed: {
      codedText() {
        return this.text.split('').map(mapInput);
      },
    },
  };
</script>
