<script lang="ts">
  import { browser } from '$app/environment';
  import HeadMeta from '$lib/HeadMeta.svelte';

  function pluralize(n: number, label: string): string {
    return `${label}${n === 1 ? '' : 's'}`;
  }

  function msToHumanDuration(ms: number): string {
    const msTo = {
      day: 1000 * 60 * 60 * 24,
      hour: 1000 * 60 * 60,
      minute: 1000 * 60,
    };

    return Object.entries(msTo)
      .map(([label, conv]) => {
        const n = Math.trunc(ms / conv);
        if (n > 0) {
          ms -= n * conv;
          return `${n} ${pluralize(n, label)}`;
        }
        return false;
      })
      .filter(Boolean)
      .join(', ');
  }

  function update(end: number) {
    if (isNaN(end)) {
      // TODO: offer a calendar widget to set it automatically.
      display = 'Put an ISO timestamp in the hash.';
      return;
    }
    const now = Date.now();
    const future = now > end;
    const delta = Math.abs(end - now);
    display = future ? '🎉' : msToHumanDuration(delta);
  }

  let display = '';
  if (browser) {
    const end = new Date(document.location.hash.slice(1)).getTime();
    update(end);
    setInterval(() => update(end), 500);
  }
</script>

<HeadMeta title="Countdown" description="A simple countdown." />

<div>{display}</div>

<style>
  div {
    display: grid;
    min-height: 100vh;
    place-content: center;
  }
</style>
