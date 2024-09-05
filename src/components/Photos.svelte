<script lang="ts">
  import { disableScroll, type Image } from '$util';
  import { isDesktopMedia, urlHash } from '$store';
  import Icon from '$components/Icon.svelte';
  import iconFilterOff from '$assets/icons/filter-off.svg';
  import ImageGrid from './ImageGrid.svelte';
  import ZoomedImage from './ZoomedImage.svelte';

  type Selected = { image: Image; node: Element };

  export let images: Image[];
  let allTags: string[] = [];
  let availableTags = new Set<string>();
  let filterTags = new Set<string>();
  let filteredImages: Image[] = [];
  let selected: Selected | undefined;

  $: {
    filteredImages = images
      .filter((i) => filterTags.size === 0 || filterTags.isSubsetOf(i.tags))
      .toSorted((a, b) => b.date.getTime() - a.date.getTime());
  }
  $: allTags = [
    ...images.reduce((acc, img) => acc.union(img.tags), new Set<string>()),
  ].toSorted();
  $: availableTags = filteredImages.reduce(
    (acc, img) => acc.union(img.tags),
    new Set<string>()
  );

  urlHash.once((value) => {
    const params = Object.fromEntries(
      value.split(';').map((kv) => kv.split(':'))
    );
    if ('tags' in params) filterTags = new Set(params.tags.split(','));
    if ('id' in params) {
      const image = images.find((image) => image.id === params.id);
      const node = document.querySelector(`[data-id="${params.id}"]`);
      if (image && node) {
        node.scrollIntoView({ behavior: 'instant', block: 'center' });
        selected = { image, node };
      }
    }
  });

  function serializeHash(tags?: Set<string>, id?: string): string {
    const params = new Map<string, string>();
    if (tags?.size) params.set('tags', [...tags].join(','));
    if (id) params.set('id', id);
    return [...params.entries()]
      .map((kv) => kv.map(encodeURI).join(':'))
      .join(';');
  }
  $: urlHash.set(serializeHash(filterTags, selected?.image.id));

  function toggleTag(tag: string) {
    if (filterTags.has(tag)) filterTags.delete(tag);
    else filterTags.add(tag);
    filterTags = filterTags; // tell svelte it changed
  }

  function select(value?: Selected) {
    selected = $isDesktopMedia ? value : undefined;
  }

  // TODO rss
  // TODO exclude full images from service worker?
  // TODO header
  // TODO tag button fg color is blue on mobile
</script>

<svelte:body use:disableScroll={!!($isDesktopMedia && selected)} />

<header>
  <h1>Photos</h1>
  <div class="filters">
    {#each allTags as tag (tag)}
      <button
        class:tag
        class:selected={filterTags.has(tag)}
        disabled={!availableTags.has(tag)}
        on:click={() => toggleTag(tag)}>{tag}</button
      >
    {/each}
    {#if filterTags.size}
      <button on:click={() => (filterTags = new Set())} class="icon">
        <Icon src={iconFilterOff} />
      </button>
    {/if}
  </div>
</header>

<ImageGrid images={filteredImages} on:select={({ detail }) => select(detail)} />

{#if $isDesktopMedia && selected}
  <ZoomedImage
    image={selected.image}
    fromNode={selected.node}
    on:close={() => select()}
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
  button {
    /* TODO: global button styles? */
    border-radius: 4px;
    border: none;
    box-shadow: var(--shadow-card);
    color: var(--color-fg);
    padding: 0 0.5em;
  }
  button:disabled {
    /* TODO relative colors aren't broadly supported */
    color: oklch(0.25 0 0 / 0.3);
  }
  button.tag {
  }
  button.icon {
    display: block;
    padding: 0 0.3em;
    text-align: center;
  }
  button.tag.selected {
    outline: 2px solid black;
  }
</style>
