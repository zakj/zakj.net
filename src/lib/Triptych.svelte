<script lang="ts">
  import { spring } from 'svelte/motion';

  export let bg: string;
  export let images: string[];

  const imgBgPos = spring([
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 0.5 },
  ]);

  const startEvents: MouseEvent[] = [];

  function handleMouseenter(index: number): (event: MouseEvent) => void {
    return (event) => (startEvents[index] = event);
  }

  function handleImgMousemove(index: number): (event: MouseEvent) => void {
    return function (event: MouseEvent) {
      const el = event.target as HTMLElement;
      const box = el.getBoundingClientRect();

      const moveX =
        (event.clientX - startEvents[index].clientX) / (box.right - box.left);
      const moveY =
        (event.clientY - startEvents[index].clientY) / (box.bottom - box.top);
      const x = 0.5 - moveX / 2;
      const y = 0.5 - moveY / 2;

      imgBgPos.update((v) => {
        v[index] = { x, y };
        return v;
      });
    };
  }

  function handleImgMouseout(index: number) {
    return () =>
      imgBgPos.update((v) => {
        v[index] = { x: 0.5, y: 0.5 };
        return v;
      });
  }
</script>

<div class="container" style="--bg-img: url({bg})">
  {#each images as image, index}
    <!-- TODO handle mobile drag -->
    <div
      class="img"
      on:mouseenter={handleMouseenter(index)}
      on:mousemove={handleImgMousemove(index)}
      on:mouseout={handleImgMouseout(index)}
      on:blur={handleImgMouseout(index)}
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
    background-position: bottom center;
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
