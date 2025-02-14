<script lang="ts">
  const initialBoxSize = 100;
  let boxSize = $state(initialBoxSize);
  let startDegrees = $state(90);
  let endDegrees = $state(220);
  let x = $state(initialBoxSize / 2);
  let y = $state(initialBoxSize / 2);
  let r = $state((initialBoxSize / 2) * 0.8);
  const path = $derived(describeArc(x, y, r, startDegrees, endDegrees));

  // Clamp to [0, 360), handling negatives.
  function clamp(v: number): number {
    return ((v % 360) + 360) % 360;
  }

  function polarToCartesian(x: number, y: number, r: number, degrees: number) {
    const radians = ((degrees - 90) * Math.PI) / 180;
    return { x: x + r * Math.cos(radians), y: y + r * Math.sin(radians) };
  }

  function describeArc(
    x: number,
    y: number,
    r: number,
    startDegrees: number,
    endDegrees: number,
  ) {
    const start = polarToCartesian(x, y, r, endDegrees);
    const end = polarToCartesian(x, y, r, startDegrees);
    if (endDegrees < startDegrees) endDegrees += 360;
    const largeArcFlag = endDegrees - startDegrees <= 180 ? 0 : 1;

    return [
      `M ${start.x} ${start.y}`,
      `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    ].join('\n');
  }
</script>

<form>
  <div class="inputs">
    <div class="input-group">
      <label
        >Start° <input
          type="number"
          bind:value={() => startDegrees, (v) => (startDegrees = clamp(v))}
        /></label
      >
      <div>&rarr;</div>
      <label
        >End° <input
          type="number"
          bind:value={() => endDegrees, (v) => (endDegrees = clamp(v))}
        /></label
      >
    </div>
    <div class="input-group">
      <label>Radius: <input type="number" bind:value={r} /></label>
      <label>Center x: <input type="number" bind:value={x} /></label>
      <label>Center y: <input type="number" bind:value={y} /></label>
    </div>
    <div class="input-group">
      <label>viewBox size: <input type="number" bind:value={boxSize} /></label>
    </div>
  </div>

  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {boxSize} {boxSize}">
    <path
      d={path}
      fill="none"
      stroke="var(--color-accent)"
      stroke-width={r / 4}
      stroke-linecap="round"
    />
  </svg>
</form>

<pre>{path}</pre>

<style>
  form {
    display: flex;
    margin-block: 1em;
  }
  form > * {
    flex: 1;
  }

  .inputs {
    display: flex;
    gap: 1em;
    flex-direction: column;
  }

  .input-group {
    display: flex;
    align-items: flex-end;
    gap: 0.5em;
  }

  label {
    display: flex;
    flex-direction: column;
    font-size: var(--font-size-small);
    text-transform: uppercase;
    font-family: var(--font-family-display);
    white-space: nowrap;
  }
  label input {
    font-family: var(--font-family-body);
    font-size: var(--font-size-body);
  }

  svg {
    max-width: 40%;
  }

  input[type='number'] {
    width: 3em;
  }
  input[type='number']::-webkit-inner-spin-button {
    height: 100%;
    position: absolute;
    right: 0;
    top: 0;
    padding-inline: 2px;
  }
</style>
