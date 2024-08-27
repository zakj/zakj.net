<script lang="ts">
  import calendarPlusIcon from '$assets/icons/calendar-plus.svg';
  import circleXIcon from '$assets/icons/circle-x.svg';
  import { formatDistanceToNow, isFuture } from 'date-fns';
  import { writable, type Subscriber } from 'svelte/store';
  import TimeDelta from './TimeDelta.svelte';
  import TimeDeltaBig from './TimeDeltaBig.svelte';

  // A store to sync timers with URL hash.
  const timers = (() => {
    const dateSort = (a: Date, b: Date): number => a.getTime() - b.getTime();
    const { subscribe, update, set } = writable<Date[]>([]);

    // Migrate from previous searchParams URLs. TODO: remove this later
    (() => {
      const ts = new URL(document.location.href).searchParams.getAll('t');
      if (ts.length < 1) return;
      document.location.hash = ts.join(',');
      document.location.search = '';
    })();

    function updateTs() {
      const hash = document.location.hash.slice(1);
      const ts: Date[] = hash
        .split(',')
        .filter((x) => x !== '')
        .map((t) => new Date(Number(t) * 1000));
      ts.sort(dateSort);
      set(ts);
    }

    updateTs();
    addEventListener('hashchange', updateTs);

    subscribe((ts) => {
      const url = new URL(document.location.href);
      url.hash = ts.map((d) => d.getTime() / 1000).join(',');
      if (url.hash !== document.location.hash)
        history.pushState({}, '', url.toString());
    });

    return {
      subscribe,
      add: (t: Date) => {
        update((ts) => {
          ts.push(t);
          ts.sort(dateSort);
          return ts;
        });
      },
      removeAt: (i: number) => {
        update((ts) => {
          ts.splice(i, 1);
          return ts;
        });
      },
    };
  })();

  // Put the next upcoming timer in the document title.
  const now = (() => {
    const { subscribe, set } = writable<Date>();
    const update = () => set(new Date());
    return {
      subscribe: (fn: Subscriber<Date>) => {
        update();
        subscribe(fn);
        const interval = setInterval(update, 10_000);
        return () => clearInterval(interval);
      },
    };
  })();
  now.subscribe(() => {
    timers.subscribe((timers) => {
      const next = timers.find(isFuture);
      if (!next) return;
      document.title = formatDistanceToNow(next) + ' · Countdown · zakj.net';
    });
  });

  let showAddForm = false;
  let value: string;

  function addItem() {
    const d = new Date(value);
    if (isNaN(d.getTime())) return;
    timers.add(d);
    showAddForm = false;
    value = '';
  }
</script>

<main tabindex="-1">
  <div class="timers">
    {#each $timers as ts, i}
      <div class="timer" tabindex="-1">
        <div class="close-button">
          <button on:click={() => timers.removeAt(i)}>
            <img src={circleXIcon.src} alt="Remove" width="24" height="24" />
          </button>
        </div>
        {#if $timers.length == 1}
          <TimeDeltaBig {ts} />
        {:else}
          <TimeDelta {ts} />
        {/if}
      </div>
    {/each}
  </div>
</main>

<footer>
  {#if showAddForm || $timers.length === 0}
    <form on:submit|preventDefault={addItem}>
      <input type="datetime-local" bind:value />
      <button type="submit">Set</button>
    </form>
  {:else}
    <button class="add" on:click={() => (showAddForm = true)}>
      <img
        src={calendarPlusIcon.src}
        alt="Add countdown"
        width="24"
        height="24"
      />
    </button>
  {/if}
</footer>

<style>
  :global(body) {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
  }
  /* TODO font sizes on mobile especially */
  main {
    display: flex;
    flex-direction: column;
    flex: 1;
    place-content: center;
    place-items: center;
  }
  .timers {
    display: grid;
    grid-template-columns: 40px max-content 40px;
    row-gap: 0.7em;
  }
  footer {
    display: grid;
    margin: 1em;
    place-content: center;
    /* TODO: footer should get a constant height to avoid wiggle when showing the add form */
  }

  :is(.timer button, .add) {
    border: none;
    box-shadow: none; /* TODO: handle this better when refactoring button styles */
    cursor: pointer;
    opacity: 0.4;
    padding: 0;
    transition: opacity 150ms;
  }
  :is(.timer button, .add):hover {
    opacity: 1;
  }

  .timer {
    display: grid;
    grid-column: 1 / 4;
    grid-template-rows: subgrid;
    grid: subgrid/subgrid;
  }
  .close-button {
    grid-column: 1 / 2;
  }
  .timer button {
    background: transparent;
    display: none;
    opacity: 0;
  }
  .timer:is(:focus, :hover) button {
    opacity: 0.4;
    display: inline;
  }
  .timer:hover button:hover {
    opacity: 1;
  }

  .add {
    --size: 50px;
    border-radius: 100%;
    height: var(--size);
    width: var(--size);
  }
  .add img {
    margin: 0 auto;
  }

  /* TODO duplicated from elsewhere; move to base? */
  :root {
    --input-radius: 5px;
    --input-margin: 8px;
    --input-padding: 0.5em;
  }
  input {
    border-radius: var(--input-radius);
    border: none;
    box-shadow:
      color-mix(in srgb, currentColor 2%, transparent) 0 1px 3px,
      color-mix(in srgb, currentColor 15%, transparent) 0 0 0 1px;
    font: inherit;
    line-height: 1.5;
    margin: var(--input-margin);
    padding-inline: var(--input-padding);
  }

  /* TODO copied from input; need to decide on global styles */
  button {
    border-radius: var(--input-radius);
    border: none;
    box-shadow:
      color-mix(in srgb, currentColor 2%, transparent) 0 1px 3px,
      color-mix(in srgb, currentColor 15%, transparent) 0 0 0 1px;
    font: inherit;
    line-height: 1.5;
    margin: var(--input-margin);
    padding-inline: var(--input-padding);
  }

  form {
    /* Fixes a weird vertical-centering bug when the input is empty on Mobile Safari. */
    display: flex;
  }
</style>
