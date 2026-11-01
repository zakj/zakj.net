<script lang="ts">
  import { disableScroll, UrlState, type Image } from '$util.svelte';
  import iconFilterOff from '$assets/icons/filter-off.svg?raw';
  import ImageGrid from './ImageGrid.svelte';
  import ZoomedImage from './ZoomedImage.svelte';

  interface Props {
    images: Image[];
    selectedId?: string;
  }
  const { images, selectedId }: Props = $props();

  type Selected = { image: Image; node: Element };
  let selected: Selected | undefined = $state();
  let filterTag: string | undefined = $state();
  const url = new UrlState();

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
      .filter((i) => !filterTag || i.tags.includes(filterTag))
      .toSorted((a, b) => b.date.getTime() - a.date.getTime()),
  );
  function urlHashToState(loc?: Location) {
    // Older links could name several tags, comma-separated; keep the first.
    filterTag = loc?.hash.slice(1).split(',')[0] || undefined;
  }

  function serializeUrl(tag?: string, id?: string): string {
    let url = '/photos';
    if (id) url += `/${id}`;
    if (tag) url += `#${tag}`;
    return url;
  }

  $effect(() => {
    if (selectedId) {
      const image = images.find((image) => image.id === selectedId);
      const node = document.querySelector(`[data-id="${selectedId}"]`);
      if (image && node) {
        node.scrollIntoView({ behavior: 'instant', block: 'center' });
        selected = { image, node };
      }
    }
  });
  $effect(() => urlHashToState(url.current));
  $effect(() => url.replace(serializeUrl(filterTag, selected?.image.id)));

  function toggleTag(tag: string) {
    filterTag = filterTag === tag ? undefined : tag;
  }

  function select(value?: Selected) {
    selected = value;
  }

  // TODO exclude full images from service worker?
  // TODO header
</script>

<svelte:body use:disableScroll={!!selected} />

<header>
  <h1>
    Photos{#if filterTag}<span class="title-tag">{' · '}{filterTag}</span>{/if}
  </h1>
  <div class="filters">
    {#each allTags as tag (tag)}
      <button
        class="tag"
        class:selected={filterTag === tag}
        aria-pressed={filterTag === tag}
        onclick={() => toggleTag(tag)}>{tag}</button
      >
    {/each}
    {#if filterTag}
      <button
        onclick={() => (filterTag = undefined)}
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
  header {
    margin: 1em;
  }
  /* Tags as a line of muted words; the chosen one reads like a link. */
  .filters {
    display: flex;
    flex-wrap: wrap;
    column-gap: 0.6em;
    margin: 1em 0;
  }
  .tag,
  .icon {
    color: var(--color-muted);
    text-decoration: underline 0.07em transparent;
    text-underline-position: from-font;
    transition:
      color 150ms,
      text-decoration-color 150ms;
    @media (hover: hover) {
      &:hover {
        color: var(--color-fg);
      }
    }
  }
  .tag {
    &.selected {
      color: var(--color-fg);
      text-decoration-color: var(--color-link);
    }
  }
  .title-tag {
    color: var(--color-muted);
  }

  .icon {
    display: block;
    padding: 0 0.3em;
    text-align: center;
  }
  .icon :global(svg) {
    height: fluid(16px, 24px, 390px, 750px);
    stroke: currentColor;
  }
</style>
