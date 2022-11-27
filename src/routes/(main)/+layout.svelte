<script lang="ts">
  import { navigating, page } from '$app/stores';
  import HeadMeta from '$lib/HeadMeta.svelte';
  import Mark, { animateMark } from '$lib/Mark.svelte';
  import { isDesktopMedia } from '$lib/store';
  import { cssVar } from '$lib/util';
  import { spring } from 'svelte/motion';

  // TODO: try social/nav menu in top right
  // TODO: page title vertically in right gutter on scroll, click to scroll to top

  type Layout = {
    isRoot: boolean;
    maxWidth: string;
    title: string;
    description: string;
    image: string;
  };

  const defaultLayout: Layout = {
    isRoot: false,
    maxWidth: null,
    title: 'Zak Johnson',
    description: 'Whiskey ginger & a dash of bitters.',
    image: null,
  };

  let layout: Layout;
  $: layout = { ...defaultLayout, ...$page.data?.layout };

  let scrollY: number;

  function handleMarkClick(e: Event) {
    animateMark();
    if (scrollY > 0) {
      scrollY = 0;
      e.preventDefault();
    }
  }

  let padding: number;
  isDesktopMedia.subscribe(
    (val) => (padding = parseInt(cssVar('--padding'), 10))
  );

  let canAnimateMark = false;
  $: canAnimateMark = !layout.isRoot && !$navigating && $isDesktopMedia;

  const slashX = spring(0, {
    stiffness: 0.2,
    damping: 0.35,
  });
  $: {
    if (!canAnimateMark) slashX.set(0, { hard: true });
    else $slashX = scrollY > 0 ? padding * -0.5 : 0;
  }
</script>

<svelte:window bind:scrollY />

<HeadMeta
  title={layout.title}
  description={layout.description}
  image={layout.image}
/>

<div
  class="layout"
  class:no-title={layout.isRoot}
  style:--max-width={layout.maxWidth ?? '100%'}
>
  <div class="mark" style:translate={`${$slashX}px`}>
    <a href={layout.isRoot ? null : '/'} on:click={handleMarkClick}>
      <Mark />
    </a>
  </div>
  {#if !layout.isRoot}
    <h1>{layout.title}</h1>
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
  .mark a {
    -webkit-tap-highlight-color: transparent;
  }

  h1 {
    grid-area: title;
    /* TODO: move to app.css */
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
      z-index: 1; /* fix compositing bug on safari */
    }
    .no-title .mark {
      position: static;
      translate: 0;
      transition: none;
    }
  }
</style>
