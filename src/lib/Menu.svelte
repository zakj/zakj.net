<script lang="ts">
  import { spring, tweened } from 'svelte/motion';

  const rotateModes = {
    closed: 0,
    open: -45,
  };
  const tweenModes = {
    closed: {
      r1: { x: 0, width: 32, height: 8 },
      r2: { x: 12, width: 20 },
      r3: { x: 4, y: 24, width: 28, height: 8 },
    },
    open: {
      r1: { x: 12, width: 8, height: 9 },
      r2: { x: 0, width: 32 },
      r3: { x: 12, y: 23, width: 8, height: 9 },
    },
  };

  const rotate = spring(rotateModes.closed, {
    stiffness: 0.2,
    damping: 0.35,
  });
  const tween = tweened(tweenModes.closed, { duration: 100 });

  let isOpen = false;
  function toggle() {
    isOpen = !isOpen;
    $rotate = rotateModes[isOpen ? 'open' : 'closed'];
    $tween = tweenModes[isOpen ? 'open' : 'closed'];
  }
</script>

<svg width="32px" height="32px" viewBox="0 0 32 32" on:click={toggle}>
  <g style="transform: rotate({$rotate}deg)">
    <rect
      x={$tween.r1.x}
      y="0"
      width={$tween.r1.width}
      height={$tween.r1.height}
    />
    <rect x={$tween.r2.x} y="12" width={$tween.r2.width} height="8" />
    <rect
      x={$tween.r3.x}
      y={$tween.r3.y}
      width={$tween.r3.width}
      height={$tween.r3.height}
    />
  </g>
</svg>

<style>
  svg {
    --tap-padding: 16px;
    box-sizing: content-box;
    cursor: pointer;
    height: 16px;
    padding: var(--tap-padding);
    position: fixed;
    right: calc(var(--padding) - var(--tap-padding));
    top: calc(var(--padding) - var(--tap-padding));
    user-select: none;
    -webkit-user-select: none;
    width: 16px;
  }
  g {
    transform-origin: center;
  }
</style>
