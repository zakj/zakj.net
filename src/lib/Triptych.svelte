<script lang="ts">
  import { spring } from 'svelte/motion';

  export let bg: string;
  export let images: string[];

  const imgBgPos = spring([
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 0.5 },
  ]);

  let startPos: { x: number; y: number } = { x: 0, y: 0 };

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
    return (event) => (startPos = getClientCoords(event));
  }

  function handleMove(index: number): (event: MouseEvent | TouchEvent) => void {
    return function (event: MouseEvent | TouchEvent) {
      event.preventDefault(); // prevent scrolling on mobile touchmove
      const el = event.target as HTMLElement;
      const box = el.getBoundingClientRect();
      const current = getClientCoords(event);

      const moveX = (current.x - startPos.x) / (box.right - box.left);
      const moveY = (current.y - startPos.y) / (box.bottom - box.top);
      const x = 0.5 - moveX / 2;
      const y = 0.5 - moveY / 2;

      imgBgPos.update((v) => {
        v[index] = { x, y };
        return v;
      });
    };
  }

  function handleLeave(index: number) {
    return () =>
      imgBgPos.update((v) => {
        v[index] = { x: 0.5, y: 0.5 };
        return v;
      });
  }
</script>

<div class="container" style="--bg-img: url({bg})">
  {#each images as image, index}
    <div
      class="img"
      on:mouseenter={handleEnter(index)}
      on:mousemove={handleMove(index)}
      on:mouseleave={handleLeave(index)}
      on:blur={handleLeave(index)}
      on:touchstart={handleEnter(index)}
      on:touchmove={handleMove(index)}
      on:touchend={handleLeave(index)}
      style:background-image={`url(${images[index]})`}
      style:background-position={`${$imgBgPos[index].x * 100}% ${
        $imgBgPos[index].y * 100
      }%`}
    />
  {/each}
</div>

<style>
  .container {
    --image-width: 44%;
    /* background-image: linear-gradient(to bottom, #22222266, #222222ff); */
    background-image: var(--bg-img);
    background-position: center 99%; /* TODO */
    background-size: cover;
    display: flex;
    margin-top: var(--padding);
    height: 175px;
  }
  .img {
    background-size: 140%;
    clip-path: polygon(0 100%, 39% 0, 100% 0%, 61% 100%);
    margin-left: calc((100% - var(--image-width) * 3) / 2);
    width: var(--image-width);
  }
  .img:first-child {
    margin-left: 0;
  }

  @media screen and (min-width: 750px) {
    .container {
      height: 350px;
    }
  }
</style>
