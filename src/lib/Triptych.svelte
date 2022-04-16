<script lang="ts">
  import { spring } from 'svelte/motion';

  let imgBgPos = spring([
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 0.5 },
    { x: 0.5, y: 0.5 },
  ]);
  function handleImgMousemove(index: number): (event: MouseEvent) => void {
    return function (event: MouseEvent) {
      const el = event.target as HTMLElement;
      const box = el.getBoundingClientRect();
      const dx = (event.clientX - box.left) / (box.right - box.left);
      const dy = (event.clientY - box.top) / (box.bottom - box.top);
      imgBgPos.update((v) => {
        v[index] = { x: dx, y: dy };
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

<div class="triptych">
  <div
    class="img"
    on:mousemove={handleImgMousemove(0)}
    on:mouseout={handleImgMouseout(0)}
    on:blur={handleImgMouseout(0)}
    style:background-position={`${$imgBgPos[0].x * 100}% ${
      $imgBgPos[0].y * 100
    }%`}
  />
  <div
    class="img"
    on:mousemove={handleImgMousemove(1)}
    on:mouseout={handleImgMouseout(1)}
    on:blur={handleImgMouseout(1)}
    style:background-position={`${$imgBgPos[1].x * 100}% ${
      $imgBgPos[1].y * 100
    }%`}
  />
  <div
    class="img"
    on:mousemove={handleImgMousemove(2)}
    on:mouseout={handleImgMouseout(2)}
    on:blur={handleImgMouseout(2)}
    style:background-position={`${$imgBgPos[2].x * 100}% ${
      $imgBgPos[2].y * 100
    }%`}
  />
</div>

<style>
  .triptych {
    --image-width: 44%;
    background-image: url(/img/bg.jpg);
    background-position: bottom center;
    background-size: cover;
    display: flex;
    margin-top: var(--padding);
  }
  .triptych .img {
    width: var(--image-width);
  }
  .triptych .img {
    margin-left: calc((100% - var(--image-width) * 3) / 2);
  }
  .triptych .img:first-child {
    margin-left: 0;
  }
  .triptych .img {
    background-size: 120%;
    clip-path: polygon(0 100%, 39% 0, 100% 0%, 61% 100%);
    height: 300px;
  }
  .triptych .img:nth-child(1) {
    background-image: url(/img/headshot.jpg);
    background-position: 50% 50%;
  }
  .triptych .img:nth-child(2) {
    background-image: url(/img/headshot.jpg);
    background-position: 50% 50%;
  }
  .triptych .img:nth-child(3) {
    background-image: url(/img/headshot.jpg);
    background-position: 50% 50%;
  }
</style>
