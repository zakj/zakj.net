<script lang="ts">
  import {
    formatRelative,
    intervalToDuration,
    isFuture,
    type Duration,
    type Locale,
  } from 'date-fns';
  import { enUS } from 'date-fns/locale';
  import { onMount } from 'svelte';

  interface Props {
    ts: Date;
    label?: string;
  }
  type OrderedDuration = [keyof Duration, number][];

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

  const { ts, label }: Props = $props();
  let now = $state(new Date());
  const remaining = $derived.by(() => {
    const duration = intervalToDuration(
      ts >= now ? { start: now, end: ts } : { start: ts, end: now },
    );
    duration.seconds = 0; // we don't update with enough granularity to show this
    return durationToOrdered(duration);
  });
  const remainingLabel = $derived(
    [
      isFuture(ts) ? 'until' : 'since',
      formatRelative(ts, now, { locale }),
    ].join(' '),
  );

  onMount(() => {
    const interval = setInterval(() => (now = new Date()), 10_000);
    return () => clearInterval(interval);
  });

  function durationToOrdered(duration: Duration): OrderedDuration {
    const units: (keyof Duration)[] = [
      'years',
      'months',
      'days',
      'hours',
      'minutes',
    ];

    return units.reduce<OrderedDuration>(
      (acc, unit) =>
        (duration[unit] && acc.length === 0) ||
        (acc.length > 0 && acc.length < 3)
          ? [...acc, [unit, duration[unit] ?? 0]]
          : acc,
      [],
    );
  }

  function singular(word: string, n: number): string {
    return n === 1 ? word.replace(/s$/, '') : word;
  }
</script>

<section>
  <div class="container">
    {#each remaining as [units, n]}
      <div class="card">
        <span class="num">{n}</span>
        <span class="unit">{singular(units, n)}</span>
      </div>
    {:else}
      <div class="card">
        <span class="num">0</span>
        <span class="unit">minutes</span>
      </div>
    {/each}
  </div>
  <footer>{label || remainingLabel}</footer>
</section>

<style>
  /* The cards fill the section, and the numbers scale with its width.
     A page can narrow it with --fit-width. */
  section {
    container-type: inline-size;
    margin-inline: auto;
    width: var(--fit-width, 100%);
  }

  .container {
    --num-size: calc(100cqi / 3);
    aspect-ratio: var(--phi);
    display: grid;
    gap: 1em;
    /* fr units can't take var(--phi). */
    grid-template:
      'big med' 1.618fr
      'big small' 1fr
      / 1.618fr 1fr;
  }

  .card {
    background-color: var(--color-bg-elevate);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-card);
    display: grid;
    font-family: var(--font-family-display);
    grid-template:
      'gap' 1fr
      'num' auto
      'unit' 1fr;
    justify-items: center;
    align-items: flex-end;
    padding: 0.6em 0;
    line-height: 0.7;
  }

  .card:nth-child(1) {
    grid-area: big;
  }
  .card:nth-child(2) {
    grid-area: med;
  }
  .card:nth-child(3) {
    grid-area: small;
  }
  .card:only-child {
    grid-area: big / big / small / small;
  }
  .card:nth-child(2):not(:has(+ .card)) {
    grid-area: med / med / small / small;
  }

  .card .num {
    font-size: var(--num-size);
    grid-area: num;
  }
  .card:nth-child(2) .num {
    font-size: calc(var(--num-size) / var(--phi));
  }
  .card:nth-child(3) .num {
    font-size: calc(var(--num-size) / (var(--phi) * 2));
  }

  .card .unit {
    font-size: max(var(--font-size-small), 2cqi);
    grid-area: unit;
    opacity: 0.3;
    text-transform: uppercase;
  }

  footer {
    color: var(--color-muted);
    margin-top: 0.5em;
  }

  @media (orientation: portrait) {
    .container {
      --num-size: calc(100cqi / 2);
      aspect-ratio: 1 / var(--phi);
      grid-template:
        'big big' 1.618fr
        'med small' 1fr
        / 1.618fr 1fr;
    }
  }
</style>
