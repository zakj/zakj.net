<script lang="ts">
  import boopSrc from '$assets/audio/boop.mp3';
  import {
    choice,
    isBrowser,
    prePlayAudio,
    timer,
    type Timer,
  } from '$util.svelte';
  import NoSleep, { type INoSleep } from '@zakj/no-sleep';
  import { onDestroy } from 'svelte';

  type Exercise = {
    name: string;
    duration: number;
  };

  const EXERCISES: Exercise[] = [
    { name: 'Basic plank', duration: 60 },
    { name: 'Forearm plank', duration: 30 },
    { name: 'Forearm plank (right leg lifted)', duration: 30 },
    { name: 'Forearm plank (left leg lifted)', duration: 30 },
    { name: 'Side plank (left hand base)', duration: 30 },
    { name: 'Side plank (right hand base)', duration: 30 },
    { name: 'Basic plank', duration: 30 },
    { name: 'Forearm plank', duration: 60 },
  ];
  const BREAK_TIME = 2000;

  const State = {
    Idle: 'Idle',
    Exercise: 'Exercise',
    Done: 'Done',
    Break: 'Break',
  } as const;
  // TODO: Svelte prevents types and values to share a name: <https://github.com/sveltejs/svelte/issues/11416>
  type TState = keyof typeof State;

  let curState: TState = $state(State.Idle);
  let curTimer: Timer | undefined = $state();
  let index = $state(0);
  let canvas: HTMLCanvasElement | undefined = $state();
  const exercise = $derived(EXERCISES[index]);

  let noSleep: INoSleep;
  let boop: HTMLAudioElement;
  if (isBrowser) {
    noSleep = new NoSleep();
    boop = new Audio(boopSrc);
  }

  function handlePlay() {
    prePlayAudio(boop);
    noSleep.enable();
    curState = State.Break;
    curTimer = timer(500);
    curTimer.completed.then(handleTimerComplete);
  }

  function handleTimerComplete() {
    if (curState === State.Break) {
      curState = State.Exercise;
      curTimer = timer(exercise.duration * 1000);
      curTimer.completed.then(handleTimerComplete);
    } else if (curState === State.Exercise) {
      boop.play();
      if (index + 1 < EXERCISES.length) {
        index++;
        curState = State.Break;
        curTimer = timer(BREAK_TIME);
        curTimer.completed.then(handleTimerComplete);
      } else {
        curState = State.Done;
        noSleep.disable();
      }
    }
  }

  function drawCanvas(
    canvas: HTMLCanvasElement,
    elapsed: number,
    duration: number,
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const c = canvas.width / 2;
    const r = canvas.width;
    const startAngle = 1.5;
    const percentComplete = elapsed / duration;
    const endAngle = (percentComplete * 2 + startAngle) % 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(c, c);
    ctx.arc(c, c, r, Math.PI * startAngle, Math.PI * endAngle);
    ctx.lineTo(c, c);
    ctx.fillStyle = '#ffffff33';
    ctx.fill();
  }

  $effect(() => {
    if (!canvas) return;
    drawCanvas(canvas, curTimer?.elapsedMs ?? 0, exercise.duration * 1000);
  });

  onDestroy(() => {
    curTimer?.cancel();
  });
</script>

<div class="page">
  <main>
    {#if curState === State.Exercise}
      <canvas width="1000" height="1000" bind:this={canvas}></canvas>
    {/if}
    <button
      class="circle"
      class:clickable={curState === State.Idle}
      onclick={() => (curState === State.Idle ? handlePlay() : null)}
    >
      {#if curState === State.Idle}
        <svg viewBox="0 0 100 100">
          <path
            d="M78.627,47.203L24.873,16.167c-1.082-0.625-2.227-0.625-3.311,0C20.478,16.793,20,17.948,20,19.199V81.27 c0,1.25,0.478,2.406,1.561,3.031c0.542,0.313,1.051,0.469,1.656,0.469c0.604,0,1.161-0.156,1.703-0.469l53.731-31.035 c1.083-0.625,1.738-1.781,1.738-3.031C80.389,48.984,79.71,47.829,78.627,47.203z"
          />
        </svg>
      {:else if curState === State.Break}
        {exercise.duration}
      {:else if curState === State.Exercise}
        {curTimer?.remaining}
      {:else if curState === State.Done}
        {choice(['🙌', '🎉'])}
      {/if}
    </button>
  </main>
  <footer>
    {#if curState == State.Break || curState == State.Exercise}
      <div class="progress">
        {#each EXERCISES as _, i}
          <div class="progress-item" class:done={i <= index}></div>
        {/each}
      </div>
    {/if}
    {#if curState === State.Idle}
      <h1>Plank!</h1>
    {:else if curState === State.Break}
      <div class="exercise break">{exercise.name}</div>
    {:else if curState === State.Exercise}
      <div class="exercise">{exercise.name}</div>
    {:else if curState === State.Done}
      <h1>Nice work!</h1>
    {/if}
  </footer>
</div>

<style>
  .page {
    --padding: 24px;
    background-color: oklch(from var(--color-accent) calc(l * 0.9) c h);
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
    border: none;
    color: inherit;
    display: flex;
    font-family: var(--font-family-display);
    font-size: 84px;
    font-variant-numeric: tabular-nums;
    font-weight: bold;
    height: var(--size);
    justify-content: center;
    padding: 0;
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
    background: var(--color-accent);
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
    font-family: var(--font-family-display);
    font-size: 18px;
    font-weight: bold;
    line-height: 0.9;
  }
  .exercise.break {
    opacity: 0.6;
  }

  @media screen and (min-width: 750px) {
    .page {
      --padding: 36px;
    }

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
      font-size: 42px;
    }
  }
</style>
