<script lang="ts">
  import pingHiSrc from '$assets/audio/ping-hi.mp3';
  import pingLoSrc from '$assets/audio/ping-lo.mp3';
  import { prePlayAudio, timer, type Timer } from '$util';
  import NoSleep from '@zakj/no-sleep';
  import { onDestroy, tick } from 'svelte';

  const noSleep = new NoSleep();
  const pingHi: HTMLAudioElement = new Audio(pingHiSrc);
  const pingLo: HTMLAudioElement = new Audio(pingLoSrc);

  type Phase = {
    seconds: number;
    label: string;
  };
  type IntervalTimer = Phase[];

  const timers: IntervalTimer[] = [
    [
      { seconds: 45, label: 'work' },
      { seconds: 10, label: 'rest' },
    ],
    [
      { seconds: 30, label: 'work' },
      { seconds: 5, label: 'rest' },
    ],
  ];

  function* cycle<T>(elements: T[]): Generator<T> {
    while (true) {
      for (const element of elements) yield element;
    }
  }

  function secondsToMinutes(s: number) {
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  let showingOverallForm = false;
  let overallInput: HTMLInputElement;
  let overallValue: number;
  let overallTimer: Timer;
  let phase: Phase | null;
  let currentTimer: Timer;

  async function showOverallForm() {
    showingOverallForm = true;
    await tick();
    overallInput.focus();
  }

  function startOverallTimer() {
    overallTimer = timer(overallValue * 60 * 1000);
  }

  function selectInterval(interval: IntervalTimer) {
    noSleep.enable();
    prePlayAudio(pingLo);
    const gen = cycle(interval);
    function run() {
      const next = gen.next();
      if (next.done) return;
      phase = next.value;
      if (phase.label === 'work') pingHi.play();
      if (phase.label === 'rest') pingLo.play();
      currentTimer = timer(phase.seconds * 1000);
      currentTimer.completed.then(run);
    }
    run();
  }

  function stopInterval() {
    currentTimer?.cancel();
    noSleep.disable();
    phase = null;
  }

  onDestroy(() => {
    overallTimer?.cancel();
    stopInterval();
  });
</script>

<div class="wrapper">
  <header
    class:countdown={overallTimer}
    style:--progress={$overallTimer?.progress}
  >
    {#if overallTimer}
      {secondsToMinutes($overallTimer.remaining)}
    {:else if showingOverallForm}
      <form on:submit|preventDefault={startOverallTimer}>
        <input
          type="number"
          inputmode="numeric"
          placeholder="Minutes…"
          required
          bind:this={overallInput}
          bind:value={overallValue}
        />
        <button type="submit">Start</button>
      </form>
    {:else}
      <button on:click={showOverallForm}>Start class timer</button>
    {/if}
  </header>

  <main class={phase?.label}>
    {#if phase}{$currentTimer.remaining}{/if}
  </main>

  <footer>
    {#each timers as timer}
      <button on:click={() => selectInterval(timer)}>
        {timer.map((t) => t.seconds).join('/')}
      </button>
    {/each}
    <button class="stop" on:click={stopInterval}> X </button>
  </footer>
</div>

<style>
  .wrapper {
    display: grid;
    grid-template-rows: auto 1fr auto;
    min-height: 100dvh;
    padding: 1em;
  }

  header {
    color: color-mix(
      in srgb,
      currentColor,
      red calc((var(--progress) - 0.9) / 0.1 * 100%)
    );
    display: flex;
    justify-content: center;
  }
  header.countdown {
    font-family: var(--font-family-numeric);
    font-size: fluid(60px, 80px, 375px, 800px);
    font-variant: tabular-nums;
    font-weight: bold;
  }
  header input {
    font: inherit;
    width: 7em;
  }
  header button[type='submit'] {
    background-color: transparent;
    box-shadow: none;
    color: inherit;
    font: inherit;
    height: auto;
    padding: 0 0 0 0.5em;
  }

  main {
    display: grid;
    font-family: var(--font-family-numeric);
    font-size: min(50vw, 60vh);
    font-variant: tabular-nums;
    font-weight: bold;
    place-content: center;
  }

  footer {
    display: flex;
    gap: 1em;
    justify-content: center;
    padding-bottom: env(safe-area-inset-bottom);
  }

  button {
    background: var(--color-white);
    border-radius: 60px;
    border: none;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    color: var(--color-black);
    cursor: pointer;
    font-family: var(--font-family-numeric);
    font-size: fluid(16px, 20px, 320px, 800px);
    height: fluid(48px, 60px, 320px, 800px);
    padding-inline: 1.5em;
    user-select: none;
  }
  button:active {
    box-shadow: rgba(6, 24, 44, 0.4) 0px 0px 0px 2px;
  }
  button.stop {
    padding-inline: 0;
    width: fluid(48px, 60px, 320px, 800px);
  }

  .rest {
    opacity: 0.6;
    color: red;
  }
</style>
