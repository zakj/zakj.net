<script lang="ts">
  import pingHiSrc from '$assets/audio/ping-hi.mp3';
  import pingLoSrc from '$assets/audio/ping-lo.mp3';
  import { onDestroy } from 'svelte';

  // Playing this sound muted here in a user-interaction handler allows us to
  // play it later without a user interaction on mobile Safari.
  function prePlayAudio(s: HTMLAudioElement) {
    s.muted = true;
    setTimeout(() => (s.muted = false), 500);
    s.play();
    // HACK: On mobile Safari, replaying without a load cuts off the beginning
    // of the audio. Even setting s.currentTime = 0 doesn't work.
    s.addEventListener('ended', () => s.load());
  }

  // TODO move to assets
  let pingHi: HTMLAudioElement = new Audio(pingHiSrc);
  let pingLo: HTMLAudioElement = new Audio(pingLoSrc);
  // TODO: move to an interation handler; or not needed at all?
  // prePlayAudio(pingHi);
  // prePlayAudio(pingLo);

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
    const gen = cycle(timer);
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
    <button on:click={() => stopTimer()}> X </button>
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
  }

  button {
    width: 60px;
    height: 60px;
    cursor: pointer;
    border-radius: 60px;
    border: 1px solid var(--color-fg);
  }

  .rest {
    opacity: 0.6;
    color: red;
  }
</style>
