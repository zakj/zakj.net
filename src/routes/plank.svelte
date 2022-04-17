<script lang="ts">
  import HeadMeta from '$lib/HeadMeta.svelte';
  import mobile100vh from '$lib/mobile-100vh';
  import NoSleep from '@uriopass/nosleep.js';

  class Exercise {
    constructor(
      public name: string,
      public duration: number,
      public description?: string
    ) {}
  }

  const EXERCISES: Exercise[] = [
    new Exercise('Basic plank', 60),
    new Exercise('Forearm plank', 30),
    new Exercise('Forearm plank (right leg lifted)', 30),
    new Exercise('Forearm plank (left leg lifted)', 30),
    new Exercise('Side plank (left hand base)', 30),
    new Exercise('Side plank (right hand base)', 30),
    new Exercise('Basic plank', 30),
    new Exercise('Forearm plank', 60),
  ];
  const BREAK_TIME = 2000;

  enum State {
    Idle,
    Exercise,
    Done,
    Break,
  }

  let noSleep: NoSleep;
  let state = State.Idle;
  let elapsedMs = 0;
  let index = 0;
  let canvas: HTMLCanvasElement;
  $: exercise = EXERCISES[index];
  $: elapsed = elapsedMs / 1000;

  const choice = <T extends unknown>(xs: T[]) =>
    xs[Math.floor(Math.random() * xs.length)];
  const successEmoji = () => choice(['🙌', '🎉']);

  function startTimer(ms: number): Promise<void> {
    return new Promise((resolve) => {
      const start = performance.now();
      function tick() {
        elapsedMs = performance.now() - start;
        if (elapsedMs >= ms) resolve();
        else requestAnimationFrame(tick);
      }
      tick();
    });
  }

  function handlePlay() {
    noSleep = new NoSleep(); // Can't initialize earlier due to no SSR support.
    noSleep.enable();
    state = State.Break;
    startTimer(500).then(handleTimerComplete);
  }

  function handleTimerComplete() {
    if (state === State.Break) {
      state = State.Exercise;
      startTimer(exercise.duration * 1000).then(handleTimerComplete);
    } else if (state === State.Exercise) {
      if (index + 1 < EXERCISES.length) {
        index++;
        state = State.Break;
        startTimer(BREAK_TIME).then(handleTimerComplete);
      } else {
        state = State.Done;
        noSleep.disable();
      }
    }
  }

  function drawCanvas(
    canvas: HTMLCanvasElement,
    elapsed: number,
    duration: number
  ) {
    const ctx = canvas?.getContext('2d');
    if (!(canvas && ctx)) return;
    const c = canvas.width / 2;
    const r = canvas.width;
    const startAngle = 1.5;
    const percentComplete = elapsed / (duration * 1000);
    const endAngle = (percentComplete * 2 + startAngle) % 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.arc(c, c, r, Math.PI * startAngle, Math.PI * endAngle);
    ctx.lineTo(c, c);
    ctx.fillStyle = '#ffffff33';
    ctx.fill();
  }

  $: drawCanvas(canvas, elapsedMs, exercise.duration);
</script>

<HeadMeta title="Plank!" description="A simple timer for five-minute planks.">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1, viewport-fit=cover"
  />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta
    name="apple-mobile-web-app-status-bar-style"
    content="black-translucent"
  />
  <meta name="apple-mobile-web-app-title" content="Plank!" />
  <link rel="apple-touch-icon" href="/img/plank-touch-icon.png" />
</HeadMeta>

<div class="page" use:mobile100vh>
  <main>
    {#if state === State.Exercise}
      <canvas width="1000" height="1000" bind:this={canvas} />
    {/if}
    <div
      class="circle"
      class:clickable={state === State.Idle}
      on:click={() => (state === State.Idle ? handlePlay() : null)}
    >
      {#if state === State.Idle}
        <svg viewBox="0 0 100 100">
          <path
            d="M78.627,47.203L24.873,16.167c-1.082-0.625-2.227-0.625-3.311,0C20.478,16.793,20,17.948,20,19.199V81.27 c0,1.25,0.478,2.406,1.561,3.031c0.542,0.313,1.051,0.469,1.656,0.469c0.604,0,1.161-0.156,1.703-0.469l53.731-31.035 c1.083-0.625,1.738-1.781,1.738-3.031C80.389,48.984,79.71,47.829,78.627,47.203z"
          />
        </svg>
      {:else if state === State.Break}
        {exercise.duration}
      {:else if state === State.Exercise}
        {Math.ceil(exercise.duration - elapsed)}
      {:else if state === State.Done}
        {successEmoji()}
      {/if}
    </div>
  </main>
  <footer>
    {#if [State.Break, State.Exercise].includes(state)}
      <div class="progress">
        {#each EXERCISES as x, i}
          <div class="progress-item" class:done={i <= index} />
        {/each}
      </div>
    {/if}
    {#if state === State.Idle}
      <h1>Plank!</h1>
    {:else if state === State.Break}
      <div class="exercise break">{exercise.name}</div>
    {:else if state === State.Exercise}
      <div class="exercise">{exercise.name}</div>
    {:else if state === State.Done}
      <h1>Nice work!</h1>
    {/if}
  </footer>
</div>

<style>
  .page {
    background-color: var(--color-green);
    color: var(--color-black);
    display: flex;
    flex-direction: column;
    height: 100vh;
    height: 100svh;

    /* Account for viewport-fit=cover. */
    box-sizing: content-box;
    padding-top: env(safe-area-inset-top);
  }

  main {
    align-items: center;
    display: flex;
    flex: 1;
    justify-content: center;
    margin-top: calc(-1 * env(safe-area-inset-top));
    position: relative;
    width: 100%;
  }

  canvas {
    height: 100%;
    position: absolute;
    width: 100%;
  }

  .circle {
    --size: 200px;
    align-items: center;
    background-color: var(--color-white);
    border-radius: calc(var(--size) / 2);
    display: flex;
    font-family: var(--font-header);
    font-size: 84px;
    font-variant-numeric: tabular-nums;
    font-weight: bold;
    height: var(--size);
    justify-content: center;
    width: var(--size);
    z-index: 1;
  }
  .circle.clickable {
    cursor: pointer;
  }
  .circle svg {
    height: calc(var(--size) / 2);
    width: calc(var(--size) / 2);
    margin-left: 5%;
    fill: var(--color-black);
  }

  footer {
    background: var(--color-white);
    line-height: 24px;
    padding: var(--padding);
    position: relative;
    text-align: center;
    width: 100%;

    /* Account for viewport-fit=cover. */
    padding-bottom: max(var(--padding), env(safe-area-inset-bottom));
  }

  .progress {
    --progress-margin: 1px;
    display: flex;
    justify-content: space-between;
    left: 0;
    position: absolute;
    right: var(--progress-margin);
    top: var(--progress-margin);
  }
  .progress-item {
    background: var(--color-green);
    flex: 1;
    height: 3px;
    margin-left: var(--progress-margin);
    opacity: 0.2;
    transition: opacity 150ms;
  }
  .progress-item.done {
    opacity: 1;
  }

  h1 {
    text-transform: uppercase;
  }

  h1,
  .exercise {
    font-family: var(--font-header);
    font-size: 18px;
    font-weight: bold;
    line-height: 0.9;
  }
  .exercise.break {
    opacity: 0.6;
  }

  @media screen and (min-width: 750px) {
    .circle {
      --size: 350px;
      font-size: 128px;
    }

    footer {
      text-align: left;
    }

    .progress {
      --progress-margin: 2px;
    }
    .progress-item {
      height: 6px;
    }

    h1,
    .exercise {
      font-size: 30px;
    }
  }
</style>
