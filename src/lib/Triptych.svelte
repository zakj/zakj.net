<script lang="ts">
  import { spring } from 'svelte/motion';

  export let bg: string;
  export let images: string[];

  const IMAGE_OVERSIZE = 0.4;

  const imgPosition = spring([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);

  let startPosition: { x: number; y: number } = { x: 0, y: 0 };

  const isTouchEvent = (event: MouseEvent | TouchEvent): event is TouchEvent =>
    'touches' in event;

  function getClientCoords(event: MouseEvent | TouchEvent): {
    x: number;
    y: number;
  } {
    return isTouchEvent(event)
      ? {
          x: event.touches.item(0).clientX,
          y: event.touches.item(0).clientY,
        }
      : { x: event.clientX, y: event.clientY };
  }

  function handleEnter(
    index: number
  ): (event: MouseEvent | TouchEvent) => void {
    return (event) => (startPosition = getClientCoords(event));
  }

  function handleMove(index: number): (event: MouseEvent | TouchEvent) => void {
    return function (event: MouseEvent | TouchEvent) {
      event.preventDefault(); // prevent scrolling on mobile touchmove
      const slice = event.currentTarget as HTMLElement;
      const box = slice.getBoundingClientRect();
      const current = getClientCoords(event);

      const deltaX = (current.x - startPosition.x) / (box.right - box.left);
      const deltaY = (current.y - startPosition.y) / (box.bottom - box.top);
      const x = deltaX * box.width * (IMAGE_OVERSIZE / 2);
      const y = deltaY * box.height * (IMAGE_OVERSIZE / 2);

      imgPosition.update((v) => {
        v[index] = { x, y };
        return v;
      });
    };
  }

  function handleLeave(index: number) {
    return () =>
      imgPosition.update((v) => {
        v[index] = { x: 0, y: 0 };
        return v;
      });
  }
</script>

<div class="container" style="--bg-img: url({bg})">
  {#each images as image, index}
    {@const pos = $imgPosition[index]}
    <div
      class="slice"
      on:mouseenter={handleEnter(index)}
      on:mousemove={handleMove(index)}
      on:mouseleave={handleLeave(index)}
      on:touchstart={handleEnter(index)}
      on:touchmove={handleMove(index)}
      on:touchend={handleLeave(index)}
    >
      <div
        class="img"
        style:background-image={`url(${images[index]})`}
        style:transform={`translate(${pos.x}px, ${pos.y}px)`}
      />
    </div>
  {/each}
</div>

<style>
  .container {
    --image-scale: 140%;
    --slice-width: 44%;
    /* background-image: linear-gradient(to bottom, #22222266, #222222ff); */
    background-image: var(--bg-img);
    background-position: center 99%; /* TODO */
    background-size: cover;
    display: flex;
    height: 175px;
    margin-top: var(--padding);
  }
  .slice {
    clip-path: polygon(0 100%, 39% 0, 100% 0%, 61% 100%);
    display: grid;
    grid: var(--image-scale) / var(--image-scale);
    margin-left: calc((100% - var(--slice-width) * 3) / 2);
    place-content: center;
    width: var(--slice-width);
  }
  .slice:first-child {
    margin-left: 0;
  }
  .img {
    background-size: cover;
  }

  @media screen and (min-width: 750px) {
    .container {
      height: 350px;
    }
  }
</style>
