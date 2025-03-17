<script lang="ts">
  import { onMount } from 'svelte';
  import svg from '$assets/ergonaut_one.svg?raw';

  interface Props {
    layer: string;
    keys: number[];
    showCombos: boolean;
  }
  const props: Props = $props();

  let svgContainer: HTMLDivElement | undefined = $state();

  $effect(() =>
    svgContainer
      ?.querySelectorAll('g[class^=layer-]')
      .forEach((el) =>
        el.classList.toggle(
          'active',
          el.classList.contains(`layer-${props.layer}`),
        ),
      ),
  );

  $effect(() => {
    const activeClasses = new Set(props.keys.map((k) => `keypos-${k}`));
    svgContainer?.querySelectorAll('g.key').forEach((el) => {
      el.classList.toggle(
        'active',
        activeClasses.intersection(new Set(el.classList.value.split(' ')))
          .size > 0,
      );
    });
  });

  /* Clean up default values from the imported SVG. */
  onMount(() => {
    const el = svgContainer?.querySelector('svg');
    if (!el) return;
    el.removeAttribute('width');
    el.removeAttribute('height');
    el.setAttribute('viewBox', '0 0 840 280');
  });
</script>

<div class:show-combos={props.showCombos} bind:this={svgContainer}>
  {@html svg}
</div>

<style>
  div {
    margin-block: 1em;

    /* Hide layer names and footer text. */
    :global(svg > g > text:first-child),
    :global(text.footer) {
      display: none;
    }
    /* Position all layers at the top. */
    :global(svg > g),
    :global(svg > g > g) {
      transform: none;
    }

    /* Only show the active layer. */
    :global(g[class^='layer-']:not(.active)) {
      display: none;
    }

    /* Highlight active key and dim others when appropriate. */
    :global(g.key.active rect) {
      stroke: var(--color-fg);
    }
    :global(g.key:has(~ g.key.active):not(.active)),
    :global(g.key.active ~ g.key:not(.active)) {
      opacity: 0.5;
    }

    /* Only show combos when needed. */
    &:not(.show-combos) :global(.combo) {
      display: none;
    }
  }
</style>
