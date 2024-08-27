<script lang="ts">
  import {
    formatRelative,
    intervalToDuration,
    isFuture,
    type Duration,
    type Locale,
  } from 'date-fns';
  import { enUS } from 'date-fns/locale';
  import { writable, type Subscriber } from 'svelte/store';

  export let ts: Date;
  export let label = '';

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

  type OrderedDuration = [keyof Duration, number][];

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
      []
    );
  }

  // A countdown store.
  type Remaining = { ordered: OrderedDuration; label: string };
  const remaining = ((end: Date) => {
    const { subscribe, set } = writable<Remaining>();
    const update = () => {
      const now = new Date();
      const duration = intervalToDuration(
        end >= now ? { start: now, end } : { start: end, end: now }
      );
      duration.seconds = 0; // we don't update with enough granularity to show this

      set({
        ordered: durationToOrdered(duration),
        label: [
          isFuture(end) ? 'until' : 'since',
          formatRelative(ts, now, { locale }),
        ].join(' '),
      });
    };
    return {
      subscribe: (fn: Subscriber<Remaining>) => {
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

  function singular(word: string, n: number): string {
    return n === 1 ? word.replace(/s$/, '') : word;
  }
</script>

<section>
  <div class="container">
    {#each $remaining.ordered as [units, n]}
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
  <footer>{label || $remaining.label}</footer>
</section>

<style>
  .container {
    --width: 60vw;
    --phi: 1.618;
    display: grid;
    gap: 1em;
    grid-template:
      'big med' 1.618fr
      'big small' 1fr
      / 1.618fr 1fr;
    height: calc(var(--width) / var(--phi));
    width: var(--width);
  }

  .card {
    background-color: #eee;
    border-radius: 8px;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
      rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    display: grid;
    font-family: var(--font-family-display);
    grid-template:
      'gap' 1fr
      'num' auto
      'unit' 1fr;
    justify-items: center;
    align-items: flex-end;
    padding: 0.3em 0;
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

  .card .num {
    --num-size: 20vw;
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
    font-size: 1.2vw;
    grid-area: unit;
    opacity: 0.3;
    text-transform: uppercase;
  }

  footer {
    opacity: 0.5;
    margin-top: 0.5em;
  }

  @media screen and (max-width: 750px) {
    .container {
      --height: 40vh;
      height: var(--height);
      width: calc(var(--height) / var(--phi));
      grid-template:
        'big big' 1.618fr
        'med small' 1fr
        / 1.618fr 1fr;
    }
    .card .unit {
      font-size: 2vw;
    }
  }
</style>
