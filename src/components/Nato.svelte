<script lang="ts">
  export let alphabet: Map<string, string>;

  let value: string = '';
  let output: string[] = [];
  let inputEl: HTMLInputElement;
  $: output = [...value.trim()].map((c) => alphabet.get(c.toLowerCase()) ?? c);

  function onKeyDown(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    if (e.altKey || e.ctrlKey || e.metaKey || !key.match(/^[a-z]$/)) return;
    inputEl.focus();
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
    border-radius: var(--input-radius);
    display: flex;
    flex-direction: column;
    margin-block: 1em;
    margin-inline: calc(-1 * var(--input-margin));
  }
  .preview:has(input:is(:focus, .value)) {
    border-radius: calc(var(--input-radius) + var(--input-margin));
    box-shadow: rgba(0, 0, 0, 0.16) 0px 10px 36px 0px,
      rgba(0, 0, 0, 0.06) 0px 0px 0px 1px;
  }

  input {
    border-radius: var(--input-radius);
    border: none;
    box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
      rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
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
