<template>
  <div class="nato">
    <input v-model="text">
    <div class="result">
      <div v-for="code in codedText">{{ code }}</div>
    </div>
    <ul class="alphabet">
      <li v-for="code in alphabet">{{ code }}</li>
    </ul>
  </div>
</template>

<script>
  import alphabet from './alphabet';

  function mapInput(c) {
    c = c.toLowerCase();
    if (c in alphabet) return alphabet[c];
    if (c.match(/\s/)) return ' ';
    return c;
  }

  module.exports = {
    data: function() {
      return {
        alphabet,
        text: '',
      };
    },

    computed: {
      codedText: function () {
        return this.text.split('').map(mapInput);
      },
    },
  };
</script>
