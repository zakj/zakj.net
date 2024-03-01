<script lang="ts">
  import {
    formatDuration,
    formatRelative,
    intervalToDuration,
    isFuture,
    type Locale,
  } from 'date-fns';
  import { enUS } from 'date-fns/locale';
  import { writable, type Subscriber } from 'svelte/store';

  export let ts: Date;
  export let label: string = '';

  const timeFormat = 'h:mmaaa';
  const formatRelativeLocale = {
    lastWeek: `'last' eeee 'at' ${timeFormat}`,
    yesterday: `'yesterday at' ${timeFormat}`,
    today: timeFormat,
    tomorrow: `'tomorrow at' ${timeFormat}`,
    nextWeek: `eeee 'at' ${timeFormat}`,
    other: 'eeee, MMMM do',
  };
  const locale: Locale = {
    ...enUS,
    formatRelative: (token) => formatRelativeLocale[token],
  };

  // A countdown store.
  const remaining = ((end: Date) => {
    const { subscribe, set } = writable<{ distance: string; label: string }>();
    const update = () => {
      const now = new Date();
      const duration = intervalToDuration(
        end >= now ? { start: now, end } : { start: end, end: now },
      );
      duration.seconds = 0; // we don't update with enough granularity to show this

      set({
        distance: formatDuration(duration, { delimiter: ', ' }),
        label: [
          isFuture(end) ? 'until' : 'since',
          formatRelative(ts, now, { locale }),
        ].join(' '),
      });
    };
    return {
      subscribe: (fn: Subscriber<{ distance: string; label: string }>) => {
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
</script>

<div>
  {$remaining.distance}
  <div class="label">{label || $remaining.label}</div>
</div>

<style>
  .label {
    opacity: 0.5;
    font-size: 0.7rem;
  }
</style>
