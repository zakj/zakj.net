<script lang="ts">
  import { UrlState, type Image } from '$util.svelte';
  import iconFilterOff from '$assets/icons/filter-off.svg?raw';
  import ImageGrid from './ImageGrid.svelte';
  import ZoomedImage from './ZoomedImage.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    images: Image[];
    selectedId?: string;
    /** The site mark, rendered by Astro. */
    mark?: Snippet;
  }
  const { images, selectedId, mark }: Props = $props();

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
</script>

<header>
  <div class="page-header">
    {@render mark?.()}
    <h1>
      Photos{#if filterTag}<span class="title-tag">{' · '}{filterTag}</span
        >{/if}
    </h1>
  </div>
  <div class="filters">
    {#each allTags as tag (tag)}
      <button
        class="tag link"
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
  /* The header sits between the page gutters; the photos run edge to edge.
     Rows keep their content's height, so a short grid stays at the top. */
  :global(body) {
    --column-width: 100vw;
    align-content: start;
    padding-bottom: env(safe-area-inset-bottom);
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
    text-decoration-color: transparent;
    &[aria-pressed='true'] {
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
