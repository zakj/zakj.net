<script lang="ts">
  import KeyboardDiagram from '$components/KeyboardDiagram.svelte';

  const props = $props();
  let showCombos = $state(false);
  let activeLayer = $state('base');
  // let activeKey = $state([16]);
  let activeKeyStr = $state('');
  const activeKey = $derived(
    activeKeyStr.split(' ').filter(Boolean).map(Number),
  );
</script>

<p>
  <label><input bind:value={activeKeyStr} size="5" /> active key</label>
  <br />
  <label><input type="checkbox" bind:checked={showCombos} /> show combos</label>
  <br />
  <label
    ><select bind:value={activeLayer}>
      <option>base</option>
      <option>num</option>
      <option>fn</option>
    </select> layer</label
  >
</p>

<KeyboardDiagram layer={activeLayer} keys={activeKey} {showCombos} />

{@render props.children()}
