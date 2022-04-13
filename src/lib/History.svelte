<script lang="ts">
  import { entries, History } from '$lib/history';
  import StaggeredPie from '$lib/StaggeredPie.svelte';

  const historyPieData = entries.map((e) => {
    const [label, sub] = e.durationInWords.split(' ');
    return { size: e.duration, label, sub };
  });

  let historyIndex = 0;
  let historyItem: History;
  let innerWidth: number;
  let innerHeight: number;
  let pieSize = 600;

  function select(i: number) {
    return () => (historyIndex = i);
  }

  // TODO: Improve this calculation.
  $: if (innerWidth) {
    pieSize =
      innerWidth < 750
        ? innerWidth - 24 * 3
        : Math.max(innerWidth, innerHeight) / 2;
  }
  $: historyItem = entries[historyIndex];
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<div class="grid">
  <h2>History</h2>

  <ul>
    {#each entries as item, i (i)}
      <li class:selected={historyIndex === i} on:mouseenter={select(i)}>
        {item.city}
      </li>
    {/each}
  </ul>

  <div class="date">{historyItem.yearRange}</div>

  <p class="description">{@html historyItem.description}</p>

  <div class="graph">
    <StaggeredPie
      width={pieSize}
      height={pieSize}
      data={historyPieData}
      selected={historyIndex}
      on:select={(ev) => (historyIndex = ev.detail)}
    />
  </div>
</div>

<style>
  .grid {
    display: grid;
    grid-template-areas:
      'title'
      'graph'
      'list'
      'date'
      'description';
  }

  h2 {
    grid-area: title;
  }

  .graph {
    grid-area: graph;
  }

  .date {
    grid-area: date;
  }

  ul,
  .date {
    font-family: var(--font-header);
    text-transform: uppercase;
  }

  ul {
    font-size: 20px;
    grid-area: list;
    list-style: none;
    margin: 0;
    padding: 0;
    max-width: 15em;
  }

  li {
    cursor: default;
    display: none;
    line-height: 1.2;
    opacity: 0.4;
  }
  li.selected {
    color: var(--color-green);
    opacity: 1;
    display: block;
  }

  .description {
    grid-area: description;
  }

  @media screen and (min-width: 750px) {
    ul {
      border-bottom: 1px solid var(--color-text);
      margin: 1em 0;
      padding-bottom: 1em;
    }
    li {
      display: block;
    }
    .grid {
      grid-template-areas:
        'title       graph'
        'list        graph'
        'date        graph'
        'description graph';
      grid-template-rows: auto auto auto 1fr;
      grid-template-columns: 1fr auto;
    }
  }
</style>
