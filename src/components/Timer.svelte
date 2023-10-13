<script lang="ts">
  import pingHiSrc from '$assets/audio/ping-hi.mp3';
  import pingLoSrc from '$assets/audio/ping-lo.mp3';
  import NoSleep from '@zakj/no-sleep';
  import { onDestroy } from 'svelte';

  // Playing this sound muted here in a user-interaction handler allows us to
  // play it later without a user interaction on mobile Safari.
  function prePlayAudio(s: HTMLAudioElement) {
    s.muted = true;
    s.play();
    setTimeout(() => (s.muted = false), s.duration * 1000);
    // HACK: On mobile Safari, replaying without a load cuts off the beginning
    // of the audio. Even setting s.currentTime = 0 doesn't work.
    s.addEventListener('ended', () => s.load());
  }

  const noSleep = new NoSleep();
  const pingHi: HTMLAudioElement = new Audio(pingHiSrc);
  const pingLo: HTMLAudioElement = new Audio(pingLoSrc);

  type Section = {
    seconds: number;
    label: string;
  };
  type Timer = Section[];

  function* cycle<T>(elements: T[]): Generator<T> {
    while (true) {
      for (const element of elements) yield element;
    }
  }

  let elapsedMs = 0;
  let previousRAF: number;
  function startTimer(ms: number): Promise<void> {
    cancelAnimationFrame(previousRAF);
    return new Promise((resolve) => {
      const start = performance.now();
      function tick() {
        elapsedMs = performance.now() - start;
        if (elapsedMs >= ms) resolve();
        else previousRAF = requestAnimationFrame(tick);
      }
      tick();
    });
  }

  const timers: Timer[] = [
    [
      { seconds: 45, label: 'work' },
      { seconds: 10, label: 'rest' },
    ],
    [
      { seconds: 30, label: 'work' },
      { seconds: 5, label: 'rest' },
    ],
  ];

  let current: Section | null;
  function selectTimer(timer: Timer) {
    noSleep.enable();
    const gen = cycle(timer);
    prePlayAudio(pingLo);
    function run() {
      const next = gen.next();
      if (next.done) return;
      current = next.value;
      if (current.label === 'work') pingHi.play();
      if (current.label === 'rest') pingLo.play();
      startTimer(current.seconds * 1000).then(run);
    }
    run();
  }

  function stopTimer() {
    cancelAnimationFrame(previousRAF);
    noSleep.disable();
    current = null;
  }
  onDestroy(stopTimer);
</script>

<div class="wrapper">
  <main>
    {#if current}
      <span class={current.label}>
        {Math.ceil(current.seconds - elapsedMs / 1000)}
      </span>
    {/if}
  </main>

  <footer>
    {#each timers as timer}
      <button on:click={() => selectTimer(timer)}>
        {timer.map((t) => t.seconds).join('/')}
      </button>
    {/each}
    <button class="stop" on:click={() => stopTimer()}> X </button>
  </footer>
</div>

<style>
  .wrapper {
    display: grid;
    grid-template-rows: 1fr auto;
    min-height: 100dvh;
    padding: 1em;
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
