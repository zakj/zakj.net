<script lang="ts">
  import Mark from '$lib/Mark.svelte';
  import Menu from '$lib/Menu.svelte';
  import mostVisibleChild from '$lib/most-visible-child';
  import Nav from '$lib/Nav.svelte';
  import { currentSection, sections } from '$lib/store';
  import { scrollTo } from '$lib/util';

  function updateSection(event: CustomEvent): void {
    $currentSection = event.detail.dataset['name'];
  }
</script>

<svelte:head>
  <title>Zak Johnson &middot; zakj.net</title>
</svelte:head>

<div class="background" />

<Mark on:click={() => scrollTo(0)} />
<Menu />
<Nav current={$currentSection} />

<main use:mostVisibleChild on:changemostvisiblechild={updateSection}>
  <section class="splash" data-name="splash">
    <h1>Whiskey ginger&nbsp;&amp; a&nbsp;dash&nbsp;of bitters.</h1>
  </section>

  <section data-name="bio" bind:this={$sections.bio}>TODO bio section</section>
  <section data-name="history" bind:this={$sections.history}>
    TODO history section
  </section>
</main>

<style>
  section {
    min-height: 100vh;
    padding: var(--padding);
  }

  .splash {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: calc(var(--padding) * 2 + var(--mark-size));
  }

  h1 {
    font-size: 12vw;
    line-height: 0.9;
    max-width: calc(100vw - var(--padding) * 4);
    text-transform: uppercase;

    /* color: white;
    mix-blend-mode: difference; */
    text-shadow: 0px 0px 100px #ffffff99;
    margin-top: 0;
  }

  .background {
    background-image: url(/img/bg.jpg);
    background-position: center center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100vh;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -1;
  }

  @media screen and (min-width: 750px) {
    h1 {
      font-size: 10vw;
    }
  }
</style>
