<script lang="ts">
  import { formatDistanceToNow, isFuture } from 'date-fns';
  import TimeDelta from './TimeDelta.svelte';
  import { onDestroy, onMount } from 'svelte';

  let target: Date | undefined = $state();
  let value = $state('');
  let now = $state(new Date());

  const interval = setInterval(() => (now = new Date()), 10_000);
  onDestroy(() => clearInterval(interval));

  const title = $derived.by(() => {
    now; // trigger periodic updates
    let parts = ['Countdown', 'zakj.net'];
    if (target && isFuture(target))
      parts = [formatDistanceToNow(target), ...parts];
    return parts.join(' · ');
  });

  function updateTargetFromHash() {
    const hash = document.location.hash.slice(1);
    if (hash && !isNaN(Number(hash))) target = new Date(Number(hash) * 1000);
    else target = undefined;
  }

  // Update target on load and browser back/forward.
  onMount(() => {
    updateTargetFromHash();
    addEventListener('hashchange', updateTargetFromHash);
  });
  onDestroy(() => {
    removeEventListener('hashchange', updateTargetFromHash);
  });

  // Update URL fragment on target change.
  $effect(() => {
    const url = new URL(document.location.href);
    url.hash = target ? (target.getTime() / 1000).toString() : '';
    if (url.hash !== document.location.hash)
      history.pushState({}, '', url.toString());
  });

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
