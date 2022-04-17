<script lang="ts">
  export let title = 'Zak Johnson';
  export let description = 'Whiskey ginger & a dash of bitters.';
  export let image: string = null;
</script>

<svelte:head>
  <title>{title} &middot; zakj.net</title>
  <meta name="description" content={description} />
  <meta property="og:type" content="website" />
  {#if image}
    <meta property="og:image" content={image} />
    <meta property="twitter:card" content="summary_large_image" />
  {/if}
  <slot />
</svelte:head>
