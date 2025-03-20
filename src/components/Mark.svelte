<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    desc?: string;
    children: Snippet;
  }
  const { desc, children }: Props = $props();
</script>

<div>
  <svg width="300" height="300" viewBox="0 0 300 250">
    <g fill="#222">
      {@render children()}
    </g>
  </svg>
  <p>{desc}</p>
</div>

<style>
  div {
    border-bottom: 1px solid #ddd;
    padding-bottom: 0.5em;
  }
</style>
