<script lang="ts">
  import { onMount } from 'svelte';

  // interface Props {
  // width: number;
  // height: number;
  // gap: number;
  // descender: number;
  // }
  // const props: Props = $props();

  function getDiagonalGap(w: number, h: number, gap: number): number {
    const diagonal = Math.sqrt(w ** 2 + (h - gap) ** 2);
    return (gap * diagonal) / w;
  }

  let zWidth = $state(50);
  let zHeight = $state(150);
  let gap = $state(10);
  const diagonalGap = $derived(getDiagonalGap(zWidth, zHeight, gap));
  let descenderHeight = $state(100);

  const zPath1 = $derived(`0,0 ${zWidth},0 0,${zHeight - diagonalGap}`);
  const zPath2 = $derived(
    `0,${zHeight} ${zWidth},${zHeight} ${zWidth},${diagonalGap}`,
  );
  const jPath = $derived(
    `0,0 ${zWidth},0 ${zWidth},${zHeight} 0,${zHeight + descenderHeight}`,
  );

  onMount(() => {
    zWidth = 25;
    zHeight = 50;
    gap = 0;
    descenderHeight = 0;

    const start = performance.now();
    function grow() {
      const d = Math.min(1, (performance.now() - start) / 500);
      if (d < 1) requestAnimationFrame(grow);
      else requestAnimationFrame(grow2);
      zWidth = 25 + d * 25;
      zHeight = 50 + d * 100;
    }
    function grow2() {
      const d = Math.min(1, (performance.now() - (start + 500)) / 500);
      if (d < 1) requestAnimationFrame(grow2);
      gap = d * 10;
      descenderHeight = d * 100;
    }
    requestAnimationFrame(grow);
  });

  const width = $derived(zWidth * 2 + gap);
  const height = $derived(zHeight + descenderHeight);
  const viewBox = $derived(`0 0 ${width} ${height}`);
</script>

<svg {width} {height} {viewBox}>
  <polygon points={zPath1}></polygon>
  <polygon points={zPath2}></polygon>
  <polygon points={jPath} transform={`translate(${zWidth + gap},0)`} />
</svg>

<!--
<label
  >Width
  <input type="range" bind:value={zWidth} min="10" max="300" />
</label>
<label
  >Height
  <input type="range" bind:value={zHeight} min="30" max="300" />
</label>
<label
  >Gap
  <input type="range" bind:value={gap} min="0" max="50" />
</label>
<label
  >Descender
  <input type="range" bind:value={descenderHeight} min="0" max="200" />
</label>
-->
