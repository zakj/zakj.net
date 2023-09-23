<script lang="ts">
  import calendarPlusIcon from '$assets/icons/calendar-plus.svg';
  import circleXIcon from '$assets/icons/circle-x.svg';
  import { writable } from 'svelte/store';
  import TimeDelta from './TimeDelta.svelte';

  // A store to sync timers with URL searchParams.
  const timers = (() => {
    const dateSort = (a: Date, b: Date): number => a.getTime() - b.getTime();
    const url = new URL(document.location.href);
    const ts: Date[] = url.searchParams
      .getAll('t')
      .map((t) => new Date(Number(t) * 1000));
    ts.sort(dateSort);
    const { subscribe, update } = writable(ts);

    subscribe((ts) => {
      url.searchParams.delete('t');
      ts.map((d) => d.getTime() / 1000).forEach((s) =>
        url.searchParams.append('t', s.toString())
      );
      history.replaceState({}, '', url.toString());
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

<main>
  <div class="timers">
    {#each $timers as ts, i}
      <div class="timer">
        <TimeDelta {ts} />
        <div>
          <button on:click={() => timers.removeAt(i)}>
            <img src={circleXIcon.src} alt="Remove" width="24" height="24" />
          </button>
        </div>
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
    min-height: 100vh;
  }
  main {
    display: flex;
    flex-direction: column;
    flex: 1;
    place-content: center;
    place-items: center;
  }
  .timers {
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    gap: 0.7em;
    translate: -12px 0; /* ignore remove button when centering */
  }
  footer {
    display: grid;
    margin: 1em;
    place-content: center;
  }

  :is(.timer button, .add) {
    border: none;
    cursor: pointer;
    opacity: 0.4;
    padding: 0;
    transition: opacity 150ms;
  }
  :is(.timer button, .add):hover {
    opacity: 1;
  }

  .timer {
    display: flex;
    flex-direction: row-reverse;
    gap: 0.4em;
    align-items: center;
  }
  .timer button {
    background: transparent;
    opacity: 0;
  }
  .timer:hover button {
    opacity: 0.4;
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
</style>
