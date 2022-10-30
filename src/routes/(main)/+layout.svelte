<script lang="ts">
  import { page } from '$app/stores';
  import HeadMeta from '$lib/HeadMeta.svelte';
  import Mark from '$lib/Mark.svelte';

  const { title, description, isRoot, maxWidth, image } = $page.data;

  // TODO: try social/nav menu in top right
  // TODO: sticky Mark in desktop mode, move to to wider margin on scroll
  // TODO: page title vertically in right gutter on scroll, click to scroll to top
</script>

<HeadMeta {title} {description} {image} />

<div
  class="layout"
  class:no-title={isRoot}
  style:--max-width={maxWidth ?? '100%'}
>
  <div class="mark">
    {#if isRoot}
      <Mark />
    {:else}
      <!-- TODO: remove click handler from Mark -->
      <a href="/"><Mark /></a>
    {/if}
  </div>
  {#if !isRoot}
    <h1>{title}</h1>
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
  }
</style>
