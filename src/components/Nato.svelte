<script lang="ts">
  interface Props {
    alphabet: Map<string, string>;
  }
  const { alphabet }: Props = $props();

  let value = $state('');
  let inputEl: HTMLInputElement;
  const output = $derived(
    [...value.trim()]
      .filter((c) => c !== ' ')
      .map((c) => alphabet.get(c.toLowerCase()) ?? c),
  );

  function onKeyDown(e: KeyboardEvent) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'Escape') {
      if (value.length > 0) value = '';
      else inputEl.blur();
    }
    if (e.key.toLowerCase().match(/^[a-z]$/)) inputEl.focus();
  }
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="preview">
  <input type="text" class:value bind:value bind:this={inputEl} />
  {#if value}
    <p>{output.join(' · ')}</p>
  {/if}
</div>

<style>
  :root {
    --preview-padding: 8px;
  }

  .preview {
    border-radius: calc(var(--radius-s) + var(--preview-padding));
    display: flex;
    flex-direction: column;
    gap: var(--preview-padding);
    margin-block: 1em;
    margin-inline: calc(-1 * var(--preview-padding));
    padding: var(--preview-padding);
  }
  .preview:has(input:is(:focus, .value)) {
    background-color: var(--color-bg-elevate);
    box-shadow: var(--shadow-float);
  }

  input:focus-visible {
    outline: none;
  }

  p {
    margin-inline: var(--padding-input);
  }
</style>
