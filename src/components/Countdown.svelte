<script lang="ts">
  import { formatDistanceToNow, isFuture } from 'date-fns';
  import { writable, type Subscriber } from 'svelte/store';
  import TimeDelta from './TimeDelta.svelte';

  // A store to sync timer state with URL hash.
  const target = (() => {
    const { subscribe, set } = writable<Date | null>();

    function updateTs() {
      const hash = document.location.hash.slice(1);
      if (hash) set(new Date(Number(hash) * 1000));
    }

    updateTs();
    addEventListener('hashchange', updateTs);

    subscribe((ts) => {
      const url = new URL(document.location.href);
      url.hash = ts ? (ts.getTime() / 1000).toString() : '';
      if (url.hash !== document.location.hash)
        history.pushState({}, '', url.toString());
    });

    return { subscribe, set };
  })();

  // Put the timer in the document title.
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
    target.subscribe((ts) => {
      let titleParts = ['Countdown', 'zakj.net'];
      if (ts && isFuture(ts))
        titleParts = [formatDistanceToNow(ts), ...titleParts];
      document.title = titleParts.join(' · ');
    });
  });

  let value: string;

  function setTargetFromForm() {
    const d = new Date(value);
    if (isNaN(d.getTime())) return;
    target.set(d);
    value = '';
  }

  function onKeyDown(e: KeyboardEvent) {
    if ($target && ['Backspace', 'Delete'].includes(e.key)) target.set(null);
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<main>
  {#if $target}
    <TimeDelta ts={$target} />
  {:else}
    <form on:submit|preventDefault={setTargetFromForm}>
      <input type="datetime-local" bind:value />
      <button class="button" type="submit">Countdown!</button>
    </form>
  {/if}
</main>

<style>
  /* TODO font sizes on mobile especially */
  main {
    min-height: 100dvh;
    display: grid;
    place-content: center;
    outline: 2px solid orange;
    padding-bottom: 10vh; /* position contents slightly above center visually */
  }

  /* Fixes a weird vertical-centering bug when the input is empty on Mobile Safari. */
  form {
    display: flex;
    gap: 8px;
  }
</style>
