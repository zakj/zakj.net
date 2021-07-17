<script lang="ts">
  import historyEntries from '$lib/history';
  import StaggeredPie from '$lib/StaggeredPie.svelte';

  const historyPieData = historyEntries.map((e) => {
    const [label, sub] = e.durationInWords.split(' ');
    return { size: e.duration, label, sub };
  });

  let historyIndex = 0;
  let historyItem;
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
  $: historyItem = historyEntries[historyIndex];
</script>

<svelte:window bind:innerHeight bind:innerWidth />

<div class="grid">
  <h2>History</h2>

  <ul>
    {#each historyEntries as item, i (i)}
      <li class:selected={historyIndex === i} on:mouseenter={select(i)}>
        {item.city}
      </li>
    {/each}
  </ul>

  <div class="date">{historyItem.yearRange}</div>

  <p class="description">{historyItem.description}</p>

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

  ul {
    font-size: 20px;
    grid-area: list;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    cursor: default;
    margin: 3px 0;
    transform-origin: left center;
    transform: scale(1);
    transition: transform 150ms ease-out;
    display: none;
  }
  li.selected {
    color: var(--color-green);
    display: block;
    transform: scale(1.1);
  }

  ul,
  .date {
    font-family: var(--font-header);
    text-transform: uppercase;
  }

  .description {
    grid-area: description;
  }

  @media screen and (min-width: 750px) {
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
