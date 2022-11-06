<script lang="ts">
  import HeadMeta from '$lib/HeadMeta.svelte';
  import Mark from '$lib/Mark.svelte';
  import { layout } from '$lib/store';

  // TODO: try social/nav menu in top right
  // TODO: page title vertically in right gutter on scroll, click to scroll to top

  let scrollY: number;
</script>

<svelte:window bind:scrollY />

<HeadMeta
  title={$layout.title}
  description={$layout.description}
  image={$layout.image}
/>

<div
  class="layout"
  class:no-title={$layout.isRoot}
  style:--max-width={$layout.maxWidth ?? '100%'}
>
  <div class="mark" class:scrolled={scrollY > 0}>
    <!-- TODO: remove click handler from Mark -->
    <a href={$layout.isRoot ? null : '/'}><Mark /></a>
  </div>
  {#if !$layout.isRoot}
    <h1>{$layout.title}</h1>
  {/if}
  <main>
    <slot />
  </main>
</div>

<style>
  .layout {
    --main-width: minmax(
      min-content,
      calc(var(--max-width) - var(--mark-size))
    );
    display: grid;
    grid-template-areas:
      'mark title'
      'main main';
    grid-template-columns: var(--mark-size) var(--main-width);
    padding: var(--padding);
    place-content: center;
    row-gap: var(--padding);
  }
  .layout.no-title {
    grid-template-columns: minmax(min-content, var(--max-width, 100%));
    grid-template-areas:
      'mark'
      'main';
  }

  .mark {
    grid-area: mark;
    text-align: right;
  }
  .no-title .mark {
    text-align: center;
  }

  h1 {
    grid-area: title;
    line-height: var(--mark-size);
    font-size: calc(var(--mark-size) * 1.4);
    translate: 0 3.5%; /* position caps exactly with their line-height */
  }

  main {
    grid-area: main;
  }
  main > :global(:first-child) {
    margin-top: 0 !important;
  }

  @media screen and (min-width: 750px) {
    .layout {
      /* --gutter-width: calc(var(--mark-size) + 2 * var(--tap-padding)); */
      --gutter-width: var(--mark-size);
      grid-template-columns:
        var(--gutter-width)
        var(--main-width)
        var(--gutter-width);
      grid-template-areas:
        'mark title ....'
        '.... main  ....';
    }

    .mark {
      position: sticky;
      top: var(--padding);
      transition: translate 300ms cubic-bezier(0.68, -0.6, 0.32, 1.6);
    }
    .mark.scrolled {
      translate: calc(var(--padding) * -0.5);
    }
    .no-title .mark {
      position: static;
      translate: 0;
      transition: none;
    }
  }
</style>
