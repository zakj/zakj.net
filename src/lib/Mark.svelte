<script lang="ts">
  import { quartOut as easing } from 'svelte/easing';
  import { draw } from 'svelte/transition';

  let expanded = false;
  let hovered = false;
  let recentlyClicked = false;
  let clickTimeout: NodeJS.Timeout;
  let transitionFirst = { duration: 200, easing };
  let transitionSecond = { duration: 200, delay: 100, easing };

  $: expanded = hovered || recentlyClicked;

  function handleClick() {
    window.scrollTo({ top: 0 });
    recentlyClicked = true;
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => (recentlyClicked = false), 2000);
  }
</script>

<svg
  width="200px"
  height="217px"
  viewBox="0 0 200 217"
  on:click={handleClick}
  on:touchstart={handleClick}
  on:touchend|preventDefault
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
>
  <defs>
    <mask id="mark-slash-mask" maskUnits="userSpaceOnUse">
      <rect fill="white" x="0" y="0" width="200" height="217" />
    </mask>
    <mask id="mark-bar-mask" maskUnits="userSpaceOnUse">
      <polygon points="0,0 120.5,0 0,202" fill="white" />
      <polygon points="200,217 79.5,217 200,15" fill="white" />
    </mask>
  </defs>

  <path
    d="M35,217 165,0"
    stroke-width="60"
    stroke-linecap="square"
    mask="url(#mark-slash-mask)"
  />

  {#if expanded}
    <path
      d="M120,26.5 15,26.5"
      stroke-width="53"
      mask="url(#mark-bar-mask)"
      in:draw={transitionFirst}
      out:draw={transitionSecond}
    />
    <path
      d="M75,190.5 190,190.5"
      stroke-width="53"
      mask="url(#mark-bar-mask)"
      in:draw={transitionSecond}
      out:draw={transitionFirst}
    />
  {/if}
</svg>

<style>
  svg {
    box-sizing: content-box;
    cursor: pointer;
    height: var(--mark-size);
    margin: calc(-1 * var(--tap-padding));
    padding: var(--tap-padding);
    stroke: var(--color-text);
    vertical-align: bottom;
    width: var(--mark-size);
  }
</style>
