<script lang="ts">
  import { disableScroll, type Image } from '$util.svelte';
  import { url } from '$store';
  import iconFilterOff from '$assets/icons/filter-off.svg?raw';
  import ImageGrid from './ImageGrid.svelte';
  import ZoomedImage from './ZoomedImage.svelte';
  import { onMount } from 'svelte';
  import { SvelteSet } from 'svelte/reactivity';

  type Selected = { image: Image; node: Element };

  interface Props {
    images: Image[];
  }
  const { images }: Props = $props();

  let selected: Selected | undefined = $state();
  const filterTags = new SvelteSet<string>();

  const allTags: string[] = $derived(
    [
      ...images.reduce(
        (acc, img) => acc.union(new Set(img.tags)),
        new Set<string>(),
      ),
    ].toSorted(),
  );
  const filteredImages = $derived(
    images
      .filter(
        (i) => filterTags.size === 0 || filterTags.isSubsetOf(new Set(i.tags)),
      )
      .toSorted((a, b) => b.date.getTime() - a.date.getTime()),
  );
  const availableTags = $derived(
    filteredImages.reduce(
      (acc, img) => acc.union(new Set(img.tags)),
      new Set<string>(),
    ),
  );

  url.once((value) => {
    if (value.startsWith('id:')) {
      const id = value.split(':')[1];
      const image = images.find((image) => image.id === id);
      const node = document.querySelector(`[data-id="${id}"]`);
      if (image && node) {
        node.scrollIntoView({ behavior: 'instant', block: 'center' });
        selected = { image, node };
      }
    } else if (value) {
      onMount(() => {
        value.split(',').forEach((t) => filterTags.add(t));
      });
    }
  });

  function serializeUrl(tags?: Set<string>, id?: string): string {
    let url = '/photos';
    if (id) url += `/${id}`;
    if (tags?.size) url += '#' + [...tags].join(',');
    return url;
  }

  $effect(() => url.set(serializeUrl(filterTags, selected?.image.id)));

  function toggleTag(tag: string) {
    if (filterTags.has(tag)) filterTags.delete(tag);
    else filterTags.add(tag);
  }

  function select(value?: Selected) {
    selected = value;
  }

  // TODO exclude full images from service worker?
  // TODO header
  // TODO tag button fg color is blue on mobile
  // TODO tag buttons are broken fg color on mobile dark mode
</script>

<svelte:body use:disableScroll={!!selected} />

<header>
  <h1>Photos</h1>
  <div class="filters">
    {#each allTags as tag (tag)}
      <button
        class:tag
        class:selected={filterTags.has(tag)}
        disabled={!availableTags.has(tag)}
        onclick={() => toggleTag(tag)}>{tag}</button
      >
    {/each}
    {#if filterTags.size}
      <button
        onclick={() => filterTags.clear()}
        class="icon"
        aria-label="Clear filters"
      >
        {@html iconFilterOff}
      </button>
    {/if}
  </div>
</header>

<ImageGrid
  images={filteredImages}
  select={(image, node) => select({ image, node })}
/>

{#if selected}
  <ZoomedImage
    image={selected.image}
    fromNode={selected.node}
    close={() => select()}
  />
{/if}

<style>
  /* TODO: style tags/filters */
  header {
    margin: 1em;
  }
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5em;
    margin: 1em 0;
  }
  .tag {
    background-color: var(--color-bg-elevate);
    border-radius: 4px;
    border: none;
    box-shadow: var(--shadow-card);
    color: var(--color-fg);
    padding: 0 0.5em;
    &.selected {
      outline: 2px solid var(--color-fg);
      box-shadow: none;
    }
    &:disabled {
      background-color: var(--color-bg);
      box-shadow: var(--shadow-border);
      color: oklch(from var(--color-fg) l c h / 0.4);
    }
  }
  .icon {
    display: block;
    padding: 0 0.3em;
    text-align: center;
  }
  .icon :global(svg) {
    height: fluid(16px, 24px, 390px, 750px);
    stroke: var(--color-fg);
  }
</style>
