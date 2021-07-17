<script lang="ts">
  import type { PieArcDatum } from 'd3-shape';
  import { arc, pie } from 'd3-shape';
  import { createEventDispatcher } from 'svelte';

  type Entry = { size: number; label: string; sub: string; index?: number };
  type Data = Entry[];

  export let height: number;
  export let width: number;
  export let selected: number = 0;
  export let data: Data;

  const dispatch = createEventDispatcher();
  const innerSize = 500;
  const staggerSize = 6;
  const getArcs = pie<Entry>()
    .value((d) => d.size)
    .sortValues(null);
  const getArcPath = arc<Entry>()
    .innerRadius(75)
    .outerRadius(({ index }) => {
      const maxRadius = innerSize / 2;
      return maxRadius - (data.length - index) * staggerSize;
    });

  let arcs: PieArcDatum<Entry>[];
  $: arcs = getArcs(data);

  function arcOpacity(index: number, selected: number): number {
    if (selected === index) return 1;
    const max = 1;
    const min = 0.2;
    const step = (max - min) / (data.length - 1);
    return max - (data.length - 1 - index) * step;
  }
</script>

<svg {height} {width} viewBox="0 0 {innerSize} {innerSize}">
  <g transform="translate({innerSize / 2}, {innerSize / 2})" fill="#222">
    {#each arcs as arc, i (i)}
      <path
        d={getArcPath(arc)}
        class:selected={selected == i}
        style="opacity: {arcOpacity(i, selected)}"
        on:click={() => dispatch('select', i)}
        on:mouseenter={() => dispatch('select', i)}
      />
      <text class="label" x="-1" y="25">{data[selected].label}</text>
      <text class="sub" x="-1" y="43">{data[selected].sub}</text>
    {/each}
  </g>
</svg>

<style>
  path {
    transition: transform 200ms ease-out;
    transform: scale(0.93);
    -webkit-tap-highlight-color: transparent;
  }

  text {
    font-family: var(--font-header);
    text-anchor: middle;
  }

  .label {
    font-size: 80px;
    font-weight: bold;
  }

  .sub {
    font-size: 12px;
    letter-spacing: 0.5px;
    opacity: 0.6;
    text-transform: uppercase;
  }

  .selected {
    fill: var(--color-green);
    transform: scale(1);
  }
</style>
