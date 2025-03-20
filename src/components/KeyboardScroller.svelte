<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import { SvelteMap } from 'svelte/reactivity';
  import KeyboardDiagram from '$components/KeyboardDiagram.svelte';

  // TODO show the currently-highlighted section
  // TODO topmost section with at least .5 intersection ratio
  // or centermost? these are going to be kind of short sections

  interface Props {
    children: Snippet;
  }
  const { children }: Props = $props();

  let container: HTMLDivElement;

  interface Intersection {
    el: HTMLElement;
    active: string;
    combos: boolean;
    ratio: number;
  }
  const intersections: Map<string, Intersection> = new SvelteMap();
  const bestIntersection = $derived(
    [...intersections.values()].sort((a, b) => b.ratio - a.ratio)[0],
  );
  const activeLayer = $derived(
    bestIntersection?.active.split(' ')[0] ?? 'base',
  );
  const activeKeys = $derived(
    bestIntersection?.active.split(' ').slice(1).map(Number) ?? [],
  );
  const showCombos = $derived(bestIntersection?.combos);

  $effect(() => {
    container.querySelectorAll('section').forEach((el) => {
      console.log(el, bestIntersection?.el);
      el.classList.toggle('active', bestIntersection?.el === el);
    });
  });

  function observerCallback(entries: IntersectionObserverEntry[]) {
    entries.forEach((e) => {
      const el = e.target as HTMLElement;
      const dataset = el.dataset;
      if (!dataset.index?.length) return;
      intersections.set(dataset.index, {
        el,
        active: dataset.active ?? 'base',
        combos: 'combos' in dataset,
        ratio: e.intersectionRatio,
      });
    });
  }

  onMount(() => {
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-150px 0px 0px 0px',
      threshold: [...Array(11).keys()].map((n) => n / 10),
    });
    container.querySelectorAll('section').forEach((el, i) => {
      el.dataset.index = `${i}`;
      observer.observe(el);
    });
  });
</script>

<!--
<p>
  <label><input bind:value={activeKeyStr} size="5" /> active key</label>
  <br />
  <label><input type="checkbox" bind:checked={showCombos} /> show combos</label>
  <br />
  <label
    ><select bind:value={activeLayer}>
      <option>base</option>
      <option>num</option>
      <option>fn</option>
    </select> layer</label
  >
</p>
-->

<div bind:this={container}>
  {@render children()}
  <div class="diagram">
    <KeyboardDiagram layer={activeLayer} keys={activeKeys} {showCombos} />
  </div>
</div>

<style>
  .diagram {
    bottom: 0;
    position: sticky;
    padding-top: 1em;
    padding-bottom: var(--page-padding);
  }
  .diagram::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;

    mask: linear-gradient(to bottom, transparent, black 3em);
    padding-inline: 1em;
    margin-inline: -1em;
    backdrop-filter: blur(12px);

    margin-top: -1em;
    padding-top: 1em;

    /*
    margin-inline: -1em;
    padding-inline: 1em;
    margin-top: -2em;
    inset: 0;
    z-index: -1;
    mask: linear-gradient(to bottom, transparent 15%, black);
    backdrop-filter: blur(12px);
    height: 110%;
    */
  }
  :global(section) {
    min-height: 50vh;
  }
  :global(section p) {
    border-left: 3px solid transparent;
    margin-left: -1em;
    padding-left: 1em;
  }
  :global(section.active p) {
    border-color: black;
  }
  :global(section:last-of-type) {
    min-height: 50vh;
  }
</style>
