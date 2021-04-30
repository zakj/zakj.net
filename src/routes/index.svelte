<script lang="ts">
  import Mark from '$lib/Mark.svelte';
  import Menu from '$lib/Menu.svelte';
  import mobile100vh from '$lib/mobile-100vh';
  import mostVisibleChild from '$lib/most-visible-child';
  import Nav from '$lib/Nav.svelte';
  import { currentSection, sections } from '$lib/store';
  import { scrollTo } from '$lib/util';

  function updateSection(node: HTMLElement): void {
    $currentSection = node.dataset['name'];
  }
</script>

<svelte:head>
  <title>Zak Johnson &middot; zakj.net</title>
</svelte:head>

<div class="background" use:mobile100vh />

<Mark on:click={() => scrollTo(0)} />
<Nav current={$currentSection} />
<Menu />

<main use:mostVisibleChild={updateSection}>
  <section class="splash" data-name="splash" use:mobile100vh>
    <h1>Whiskey ginger&nbsp;&amp; a&nbsp;dash&nbsp;of bitters.</h1>
  </section>

  <section data-name="Bio" bind:this={$sections.Bio}>TODO bio section</section>
  <section data-name="History" bind:this={$sections.History}>
    TODO history section
  </section>
</main>

<style>
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

  section {
    padding: var(--padding);
    padding-top: calc(var(--padding) * 2 + var(--mark-size));
  }

  section:not(.splash) {
    min-height: 100vh;
  }
  .splash {
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: center;
  }

  h1 {
    font-size: 14vw;
    line-height: 0.9;
    max-width: calc(100vw - var(--padding) * 4);
    text-transform: uppercase;

    /* color: white;
    mix-blend-mode: difference; */
    text-shadow: 0px 0px 100px #ffffff99;
  }

  @media screen and (min-width: 750px) {
    h1 {
      font-size: 10vw;
    }
  }
</style>
