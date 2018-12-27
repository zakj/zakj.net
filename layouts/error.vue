<template>
  <div>
    <h1>
      <back-link>
        <span v-if="error.statusCode === 404">404 not found</span>
        <span v-else>Oops</span>
      </back-link>
    </h1>
  </div>
</template>

<style lang="stylus" scoped>
  div
    align-items center
    display flex
    flex-direction column
    justify-content center
    margin 0 auto
    max-width 30em
    min-height calc(100vh - 80px)
</style>

<script>
  export default {
    props: ['error'],
    head: {title: 'Error'},
  };
</script>
