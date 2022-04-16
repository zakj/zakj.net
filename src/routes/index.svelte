<script lang="ts">
  import HeadMeta from '$lib/HeadMeta.svelte';
  import Mark from '$lib/Mark.svelte';
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

<HeadMeta />

<Mark />

<main>
  <div>
    <p>
      Hello! I&rsquo;m Zak, a design-minded engineer in Oakland, CA. I currently
      lead a team responsible for building UX across all our client platforms at
      <a rel="external" href="https://www.grammarly.com">Grammarly</a>. I have
      been building/breaking things on the web since the mid-nineties,
      previously with companies like
      <a rel="external" href="https://mixpanel.com">Mixpanel</a>
      and
      <a rel="external" href="https://www.etsy.com">Etsy</a>.
    </p>

    <p>
      I have various interests, including but not limited to: motorcycling,
      yoga, <a rel="external" href="https://www.instagram.com/p/BkwS992lCsW/"
        >hammock camping</a
      >, text editors, significant whitespace, making lists,
      <a
        rel="external"
        href="https://brians.wsu.edu/common-errors-in-english-usage/">grammar</a
      >, and sitting quietly.
    </p>

    <p>
      Find me on
      <a rel="external" href="https://github.com/zakj">GitHub</a>,
      <a rel="external" href="https://twitter.com/zakj">Twitter</a>,
      <a rel="external" href="https://www.instagram.com/zakj/">Instagram</a>,
      <a rel="external" href="https://www.linkedin.com/in/zakjohnson"
        >LinkedIn</a
      >, or
      <a href="mailto:me@zakj.net">via email</a>.
    </p>

    <p>New designs coming… sometime.</p>

    <!-- <img class="headshot" src="/img/headshot.jpg" alt="Zak Johnson" /> -->

    <div class="triptych">
      <!-- TODO: three images side by cropped. maybe slashed crop? do something fun on hover -->

      <div class="img" />
      <div class="img" />
      <div class="img" />
    </div>

    <div class="triptych2">
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
  </div>
</main>

<style>
  .triptych2 {
    --image-width: 44%;
    background-image: url(/img/bg.jpg);
    background-position: bottom center;
    background-size: cover;
    display: flex;
    margin-top: var(--padding);
  }
  .triptych2 .img {
    width: var(--image-width);
  }
  .triptych2 .img {
    margin-left: calc((100% - var(--image-width) * 3) / 2);
  }
  .triptych2 .img:first-child {
    margin-left: 0;
  }
  .triptych2 .img {
    background-size: 120%;
    clip-path: polygon(0 100%, 39% 0, 100% 0%, 61% 100%);
    height: 300px;
  }
  .triptych2 .img:nth-child(1) {
    background-image: url(/img/headshot.jpg);
    background-position: 50% 50%;
  }
  .triptych2 .img:nth-child(2) {
    background-image: url(/img/headshot.jpg);
    background-position: 50% 50%;
  }
  .triptych2 .img:nth-child(3) {
    background-image: url(/img/headshot.jpg);
    background-position: 50% 50%;
  }

  .XXXtriptych2 {
    display: flex;
    justify-content: center;
    /* padding-right: 180px; */
    margin-top: var(--padding);
    /* transform: translateX(-90px); */
    background-image: url(/img/bg.jpg);
    background-size: 100%;
    background-position: bottom right;
  }
  .XXXtriptych2 .wrap {
    /* transform: skew(-31deg); */
    transform-origin: bottom left;
    overflow: hidden;
    flex: 1;
    outline: 3px dashed red;
    margin-right: 5px;
  }
  .XXXtriptych2 .wrap:last-child {
    margin-right: 0;
  }
  .XXXtriptych2 .img {
    background: #eee;
    height: 300px;
    width: 220px;
    /* transform: skew(31deg) scale(1.8); */
    transform-origin: bottom left;
    background-size: 150%;
    outline: 2px solid red;
    /* background-position: 100px 100px; */
    /* clip-path: path('M10,300 L160,0 L400,0 L250,300'); */
    /* margin-right: -250px; */
  }
  .XXXtriptych2 .wrap:nth-child(1) .img {
    background-image: url(/img/headshot.jpg);
    background-position: 0% -20%;
  }
  .XXXtriptych2 .wrap:nth-child(2) .img {
    background-image: url(/img/headshot.jpg);
    background-position: 0% -80%;
  }
  .XXXtriptych2 .wrap:nth-child(3) .img {
    background-image: url(/img/headshot.jpg);
    background-position: 0% -120%;
  }

  .triptych {
    display: flex;
    display: none;
    justify-content: center;
    margin-top: var(--padding);
  }
  .triptych .img {
    background: #eee;
    height: 300px;
    width: 500px;
    clip-path: path('M10,300 L160,0 L400,0 L250,300');
    margin-right: -250px;
  }
  .triptych .img:nth-child(1) {
    background: url(/img/headshot.jpg);
    background-size: cover;
    background-position: 0% 60%;
  }
  .triptych .img:nth-child(2) {
    background: url(/img/headshot.jpg);
    background-size: cover;
    background-position: 0% 30%;
  }
  .triptych .img:nth-child(3) {
    background: url(/img/headshot.jpg);
    background-size: cover;
    background-position: 0% 0%;
  }

  main {
    display: grid;
    grid-template-columns: minmax(auto, 30em);
    margin-top: calc(var(--padding) + var(--mark-size));
    padding: var(--padding);
    place-content: center;
  }
  p:first-child {
    margin-top: 0;
  }

  a {
    color: var(--color-text);
    text-decoration-color: var(--color-underline);
    text-underline-position: from-font;
    text-decoration-thickness: 0.07em;
    transition: text-decoration-color 150ms;
  }
  a:hover {
    text-decoration-color: var(--color-text);
  }

  .headshot {
    border-radius: 50%;
    display: block;
    margin: var(--padding) auto;
    max-width: calc(var(--mark-size) * 2);
  }
</style>
