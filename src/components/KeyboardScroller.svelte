<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import KeyboardDiagram from '$components/KeyboardDiagram.svelte';
  import { SvelteMap } from 'svelte/reactivity';

  interface Props {
    children: Snippet;
  }
  const { children }: Props = $props();

  let container: HTMLDivElement;
  let showCombos = $state(false);

  const intersections: Map<string, number> = new SvelteMap();
  const bestIntersection = $derived(
    [...intersections.entries()]
      .sort((a, b) => b[1] - a[1])
      .map((e) => e[0])[0],
  );
  const activeLayer = $derived(bestIntersection?.split(' ')[0] ?? 'base');
  const activeKeys = $derived(
    bestIntersection?.split(' ').slice(1).map(Number) ?? [],
  );

  function observerCallback(entries: IntersectionObserverEntry[]) {
    entries.forEach((e) => {
      const active = (e.target as HTMLElement).dataset['active'];
      if (active) intersections.set(active, e.intersectionRatio);
    });
  }

  onMount(() => {
    const observer = new IntersectionObserver(observerCallback, {
      rootMargin: '-100px 0px 0px 0px',
      threshold: [...Array(11).keys()].map((n) => n / 10),
    });
    container.querySelectorAll('section').forEach((el) => observer.observe(el));
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

<div class="diagram">
  <KeyboardDiagram layer={activeLayer} keys={activeKeys} {showCombos} />
</div>

<div bind:this={container}>
  {@render children()}
</div>

<style>
  .diagram {
    position: sticky;
    top: calc(var(--page-padding) / 2);
  }
  :global(section) {
    min-height: 30vh;
  }
</style>
