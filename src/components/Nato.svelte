<script lang="ts">
  export let alphabet: Map<string, string>;

  let value: string = '';
  let output: string[] = [];
  let inputEl: HTMLInputElement;
  $: output = [...value.trim()]
    .filter((c) => c !== ' ')
    .map((c) => alphabet.get(c.toLowerCase()) ?? c);

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
    --input-radius: 5px;
    --input-margin: 8px;
    --input-padding: 0.5em;
  }

  .preview {
    border-radius: calc(var(--input-radius) + var(--input-margin));
    display: flex;
    flex-direction: column;
    margin-block: 1em;
    margin-inline: calc(-1 * var(--input-margin));
  }
  .preview:has(input:is(:focus, .value)) {
    background-color: var(--color-bg-elevate);
    box-shadow: var(--shadow-float);
  }

  input {
    border-radius: var(--input-radius);
    border: none;
    box-shadow: var(--shadow-border);
    font: inherit;
    line-height: 1.5;
    margin: var(--input-margin);
    padding-inline: var(--input-padding);
  }
  input:focus {
    outline: none;
  }

  .preview p {
    padding-inline: var(--input-padding);
    margin-block: var(--input-margin);
  }
</style>
