<script lang="ts">
  import { writable, type Subscriber } from 'svelte/store';

  export let ts: Date;
  export let label: string = '';

  // A countdown store.
  const remaining = ((end: Date) => {
    const { subscribe, set } = writable(0);
    const update = () => set(end.getTime() - Date.now());
    return {
      subscribe: (fn: Subscriber<number>) => {
        subscribe(fn);
        const interval = setInterval(update, 10_000);
        return () => clearInterval(interval);
      },
      setEnd: (newEnd: Date) => {
        end = newEnd;
        update();
      },
    };
  })(ts);
  // Ensure we update immediately when `ts` changes.
  $: remaining.setEnd(ts);

  function msToHumanDuration(ms: number): string {
    ms = Math.abs(ms);
    const msTo = {
      day: 1000 * 60 * 60 * 24,
      hour: 1000 * 60 * 60,
      minute: 1000 * 60,
    };

    const pluralize = (n: number, label: string): string =>
      `${label}${n === 1 ? '' : 's'}`;

    return (
      Object.entries(msTo)
        .map(([label, conv]) => {
          const n = Math.trunc(ms / conv);
          if (n > 0) {
            ms -= n * conv;
            return `${n} ${pluralize(n, label)}`;
          }
          return false;
        })
        .filter(Boolean)
        .join(', ') || '0 minutes'
    );
  }

  // TODO: just use format from date-fns. maybe formatDuration too
  function formatDateTime(d: Date): string {
    return `${d.toLocaleTimeString(undefined, {
      hour: 'numeric',
      dayPeriod: 'narrow',
    })} on ${d.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
    })}`;
  }
</script>

<div>
  {msToHumanDuration($remaining)}
  <div class="label">
    {$remaining > 0 ? 'until' : 'since'}
    {label || formatDateTime(ts)}
  </div>
</div>

<style>
  .label {
    opacity: 0.5;
    font-size: 0.7rem;
  }
</style>
