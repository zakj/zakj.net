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
    recentlyClicked = true;
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(() => (recentlyClicked = false), 2000);
  }
</script>

<div
  on:click={handleClick}
  on:mouseenter={() => (hovered = true)}
  on:mouseleave={() => (hovered = false)}
>
  <svg width="200px" height="217px" viewBox="0 0 200 217">
    <defs>
      <mask id="mark-slash-mask" maskUnits="userSpaceOnUse">
        <polygon points="0,0 120.5,0 0,202" fill="white" />
        <polygon points="200,217 79.5,217 200,15" fill="white" />
      </mask>
    </defs>

    <path d="M35,217 165,0" stroke-width="60" stroke-linecap="square" />

    {#if expanded}
      <path
        d="M120,26.5 15,26.5"
        stroke-width="53"
        mask="url(#mark-slash-mask)"
        in:draw={transitionFirst}
        out:draw={transitionSecond}
      />
      <path
        d="M75,190.5 190,190.5"
        stroke-width="53"
        mask="url(#mark-slash-mask)"
        in:draw={transitionSecond}
        out:draw={transitionFirst}
      />
    {/if}
  </svg>
</div>

<style>
  div {
    --tap-padding: 16px;
    cursor: pointer;
    left: 50%;
    padding: var(--tap-padding);
    position: fixed;
    top: calc(var(--padding) - var(--tap-padding));
    transform: translateX(
      calc((var(--mark-size) + var(--tap-padding) * 2) / -2)
    );
  }
  svg {
    height: var(--mark-size);
    width: var(--mark-size);
  }
  path {
    stroke: var(--color-text);
  }
</style>
