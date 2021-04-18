<script lang="ts">
  import { sections } from '$lib/store';
  import { scrollTo } from '$lib/util';

  export let current: string;

  interface RectLike {
    top: number;
    height: number;
  }

  let container: HTMLElement;
  let firstLinkElement: HTMLElement;
  let linkElements: Record<string, HTMLElement> = {};
  let previousRect: RectLike = { height: 0, top: 0 }; // XXX firstlinkelement top?

  function scrollToElement(el: HTMLElement): void {
    scrollTo(el.getBoundingClientRect().top + window.scrollY);
  }

  function flipOut(node: HTMLElement, params: any): SvelteTransitionReturnType {
    previousRect = node.getBoundingClientRect();
    return { duration: 0 };
  }

  function flipIn(node: HTMLElement, params: any): SvelteTransitionReturnType {
    const rect = node.getBoundingClientRect();
    const delta = {
      top: previousRect.top - rect.top,
      height: previousRect.height / rect.height,
    };
    previousRect = rect;
    return {
      duration: 150,
      css(t: number, u: number): string {
        return `transform:
          translateX(${delta.top * u}px)
          scaleX(${1 + u * (delta.height - 1)})
        `;
      },
    };
  }

  $: if (!(current in linkElements)) previousRect = { height: 0, top: 0 };
  $: firstLinkElement = Object.values(linkElements).shift();
</script>

<nav bind:this={container}>
  <ul>
    {#each Object.entries($sections) as [name, element]}
      <li>
        <a
          href="#{name}"
          bind:this={linkElements[name]}
          on:click={() => scrollToElement(element)}
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
    left: 100%;
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
