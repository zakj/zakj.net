<script lang="ts">
  import type { Image } from '$util.svelte';
  import { fade, type TransitionConfig } from 'svelte/transition';
  import { cubicInOut } from 'svelte/easing';
  import { onMount, untrack } from 'svelte';

  interface Props {
    image: Image;
    fromNode: Element;
    close: () => void;
  }

  const { image, fromNode, close }: Props = $props();

  // Kept from mount: the parent clears its selection before the zoom-out runs.
  const thumbNode = untrack(() => fromNode);

  // Animating a full-size image is slow; better to animate the thumb and then switch.
  let animating = $state(false);

  // TODO utils?
  // Stolen from https://github.com/sveltejs/svelte/blob/master/src/runtime/transition/index.ts
  // Deferred to a microtask, so the zoom in measures the figure after showModal has displayed the dialog.
  // Measured once: Svelte calls this again to reverse a zoom in midway, while the figure is mid-flight.
  function zoomFromElement(
    node: Element,
    from: DOMRect,
  ): () => TransitionConfig {
    let config: TransitionConfig | undefined;
    return () => (config ??= measure());

    function measure(): TransitionConfig {
      const to = node.getBoundingClientRect();

      const dx = from.x - to.x;
      const dy = from.y - to.y;
      const dw = from.width / to.width;
      const dh = from.height / to.height;

      const style = getComputedStyle(node);
      const transform = style.transform === 'none' ? '' : style.transform;
      const opacity = +style.opacity;

      return {
        duration: 350,
        easing: cubicInOut,
        css: (t, u) => `
          opacity: ${t * opacity};
          transform-origin: top left;
          transform: ${transform}
            translate(${u * dx}px, ${u * dy}px)
            scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
        `,
      };
    }
  }

  $effect(() => {
    // We don't show the image while animating, but preloading it helps.
    const img = new Image();
    img.src = image.full.src;
  });

  function bgUrl(hrefs: string[]): string {
    return hrefs.map((h) => `url(${h})`).join(',');
  }

  // A modal dialog keeps focus inside and makes the page behind it inert.
  let dialog: HTMLDialogElement;
  onMount(() => {
    // The ring comes back only if the thumbnail showed one when it opened, i.e. from the keyboard.
    const focusVisible = thumbNode.matches(':focus-visible');
    dialog.showModal();
    // The dialog is removed rather than closed, so focus goes back to the thumbnail by hand.
    return () =>
      (thumbNode as HTMLElement).focus({ preventScroll: true, focusVisible });
  });

  // Escape and Space close through the parent, which leaves the dialog open for the zoom out.
  // On the window: tabbing past the dialog's end moves focus to the page body.
  function onkeydown(e: KeyboardEvent) {
    // A held Space would otherwise reopen and close the photo as the key repeats.
    if (e.repeat) return;
    if (['Escape', ' '].includes(e.key)) {
      e.preventDefault();
      close();
    }
  }
</script>

<svelte:window {onkeydown} />

<!-- oncancel and onclose catch a close the keydown handler didn't prevent. -->
<dialog
  bind:this={dialog}
  aria-label={image.alt || 'Photo'}
  onclick={close}
  oncancel={(e) => {
    e.preventDefault();
    close();
  }}
  onclose={close}
>
  <div class="backdrop" transition:fade={{ duration: 200 }}></div>
  <figure
    transition:zoomFromElement={thumbNode.getBoundingClientRect()}
    onintrostart={() => (animating = true)}
    onintroend={() => (animating = false)}
    style:aspect-ratio={image.width / image.height}
    style:background-image={animating
      ? bgUrl([image.thumb.src])
      : bgUrl([image.full.src, image.thumb.src])}
  >
    <!-- TODO (maybe) {image.description} -->
  </figure>
</dialog>

<style>
  /* TODO better styling on mobile? */
  dialog {
    --padding: 20px; /* TODO */
    background: none;
    border: none;
    cursor: zoom-out;
    height: 100vh;
    inset: 0;
    margin: 0;
    max-height: none;
    max-width: none;
    padding: var(--padding);
    width: 100vw;

    /* The backdrop div fades with the zoom; the native one can't animate out. */
    &::backdrop {
      background: none;
    }
    &:focus-visible {
      outline: none;
    }
  }

  .backdrop {
    background: rgba(0, 0, 0, 0.8);
    inset: 0;
    position: absolute;
  }

  figure {
    border-radius: 8px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    /* TODO: shadow-float? */
    box-shadow:
      0 1px 2px rgba(0, 0, 0, 0.07),
      0 2px 4px rgba(0, 0, 0, 0.07),
      0 4px 8px rgba(0, 0, 0, 0.07),
      0 8px 16px rgba(0, 0, 0, 0.07),
      0 16px 32px rgba(0, 0, 0, 0.07),
      0 32px 64px rgba(0, 0, 0, 0.07);
    max-height: calc(100vh - var(--padding) * 2);
    max-width: calc(100vw - var(--padding) * 2);
    user-select: none; /* because I keep double-clicking these things */

    /* HACK: flex/grid on parent doesn't seem to work with auto-sizing. */
    margin: 0 auto;
    position: relative;
    top: 50%;
    translate: 0 -50%;
  }
</style>
