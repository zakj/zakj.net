<script lang="ts">
  const { date }: { date: Date } = $props();
</script>

<time datetime={date.toISOString()}
  >{date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</time
>

<style>
  /* Shown on hover over the photo it sits in; the parent must be positioned. */
  time {
    background: oklch(from var(--color-black) l c h / 0.3);
    text-shadow: 0px 0px 2px var(--color-black);
    border-radius: var(--radius-s);
    bottom: 0;
    color: #fff;
    font-size: 16px;
    line-height: 1;
    margin: 0.5em;
    opacity: 0;
    padding: 0.5em 0.75em;
    position: absolute;
    right: 0;
    transition: opacity 150ms ease-in;
  }

  @media screen and (min-width: 750px) {
    :global(:hover) > time {
      opacity: 1;
    }
  }
</style>
