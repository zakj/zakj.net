<script lang="ts">
  import { springEasing } from '$lib/spring-easing';
  import { sections } from '$lib/store';
  import { scrollTo } from '$lib/util';

  export let current: string;

  interface RectLike {
    top: number;
    height: number;
  }

  const itemPadding = 16;
  const easing = springEasing();
  let container: HTMLElement;
  let firstLinkElement: HTMLElement;
  let linkElements: Record<string, HTMLElement> = {};
  let previousRect: RectLike;
  $: firstLinkElement = Object.values(linkElements).shift();

  function scrollToElement(el: HTMLElement): void {
    scrollTo(el.getBoundingClientRect().top + window.scrollY);
  }

  function flip(
    prevRect: RectLike,
    rect: RectLike
  ): SvelteTransitionReturnType {
    const topDelta = prevRect.top - rect.top;
    const heightRatio = rect.height > 0 ? prevRect.height / rect.height : 0;
    return {
      duration: 400,
      css(t: number, u: number): string {
        u = 1 - easing(t);
        return `transform:
          translateX(${topDelta * u}px)
          scaleX(${1 + u * (heightRatio - 1)})
        `;
      },
    };
  }

  // NOTE: Setting previousRect relies on `out` transition happening before `in`.
  function flipOut(node: HTMLElement, params: any): SvelteTransitionReturnType {
    previousRect = node.getBoundingClientRect();
    if (current in linkElements) {
      return { duration: 0 };
    } else {
      const rv = flip(previousRect, { top: previousRect.top, height: 0 });
      previousRect = null;
      return rv;
    }
  }

  function flipIn(node: HTMLElement, params: any): SvelteTransitionReturnType {
    const rect = node.getBoundingClientRect();
    if (!previousRect) {
      previousRect = {
        height: 0,
        top: (firstLinkElement?.getBoundingClientRect().top || 0) + itemPadding,
      };
    }
    return flip(previousRect, rect);
  }
</script>

<nav bind:this={container}>
  <ul>
    {#each Object.entries($sections) as [name, element]}
      <li>
        <a
          bind:this={linkElements[name]}
          href="#{name.toLowerCase()}"
          on:click|preventDefault={() => scrollToElement(element)}
        >
          {name}
          {#if name === current}
            <mark in:flipIn out:flipOut />
          {/if}
        </a>
      </li>
    {/each}
  </ul>
</nav>

<style>
  nav {
    --item-padding: 16px;
    --marker-size: 3px;
    font-family: var(--font-header);
    left: calc(100% - var(--padding) + var(--item-padding) + 2px);
    position: fixed;
    text-transform: uppercase;
    transform-origin: left top;
    transform: rotate(90deg);
    width: 100vh;
  }

  ul {
    display: flex;
    justify-content: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  a {
    color: var(--color-text);
    cursor: pointer;
    display: inline-block;
    padding: var(--item-padding);
    position: relative;
    text-decoration: none;
  }

  mark,
  a::after {
    background-color: var(--color-text);
    height: var(--marker-size);
    left: var(--item-padding);
    position: absolute;
    transform-origin: left center;
    top: calc(100% - var(--item-padding));
    width: calc(100% - var(--item-padding) * 2);
  }

  @media (hover: hover) {
    a::after {
      content: '';
      opacity: 0.4;
      transform: scaleX(0);
      transition: transform 150ms ease-in;
    }

    a:hover::after {
      transform: scaleX(1);
    }
  }
</style>
