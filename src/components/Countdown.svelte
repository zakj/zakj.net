<script lang="ts">
  import { formatDistanceToNow, isFuture } from 'date-fns';
  import TimeDelta from './TimeDelta.svelte';
  import { onDestroy, onMount } from 'svelte';
  import { UrlState } from '$util.svelte';

  let target: Date | undefined = $state();
  let value = $state('');
  let now = $state(new Date());
  const url = new UrlState();

  const interval = setInterval(() => (now = new Date()), 10_000);
  onDestroy(() => clearInterval(interval));

  const title = $derived.by(() => {
    now; // trigger periodic updates
    let parts = ['Countdown', 'zakj.net'];
    if (target && isFuture(target))
      parts = [formatDistanceToNow(target), ...parts];
    return parts.join(' · ');
  });

  function urlToState(loc?: Location) {
    const hash = loc?.hash.slice(1);
    target =
      hash && !isNaN(Number(hash)) ? new Date(Number(hash) * 1000) : undefined;
  }

  // Keep state and URL in sync.
  $effect(() => urlToState(url.current));
  $effect(() => url.push(target ? `#${target.getTime() / 1000}` : ''));
  // Put the timer in the document title.
  $effect(() => {
    document.title = title;
  });

  function onsubmit(e: SubmitEvent) {
    e.preventDefault();
    const d = new Date(value);
    if (isNaN(d.getTime())) return;
    target = d;
    value = '';
  }

  function onkeydown(e: KeyboardEvent) {
    if (target && ['Backspace', 'Delete'].includes(e.key)) target = undefined;
  }
</script>

<svelte:window {onkeydown} />

<main>
  {#if target}
    <TimeDelta ts={target} />
  {:else}
    <form {onsubmit}>
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
