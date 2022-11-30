<script lang="ts">
  import { dev } from '$app/environment';
  import Triptych from '$lib/Triptych.svelte';
</script>

<svelte:head>
  <link rel="me" href="https://mastodon.social/@zakj" />
</svelte:head>

<p>
  Hello! I&rsquo;m Zak, a design-minded engineer in Oakland, CA. I currently
  lead a team responsible for building UX across all our client platforms at
  <a rel="external" href="https://www.grammarly.com">Grammarly</a>. I have been
  building/breaking things on the web since the mid-nineties, previously with
  companies like
  <a rel="external" href="https://mixpanel.com">Mixpanel</a>
  and
  <a rel="external" href="https://www.etsy.com">Etsy</a>.
</p>

<p>
  I have various interests, including but not limited to: motorcycling, yoga, <a
    rel="external"
    href="https://www.instagram.com/p/BkwS992lCsW/">hammock camping</a
  >, text editors, significant whitespace, making lists,
  <a
    rel="external"
    href="https://brians.wsu.edu/common-errors-in-english-usage/">grammar</a
  >, and sitting quietly.
</p>

<p>
  Find me on
  <a rel="external" href="https://github.com/zakj">GitHub</a>,
  <a rel="external" href="https://twitter.com/zakj">Twitter</a>,
  <a rel="external" href="https://www.instagram.com/zakj/">Instagram</a>,
  <a rel="external" href="https://www.linkedin.com/in/zakjohnson">LinkedIn</a>,
  or
  <a href="mailto:me@zakj.net">via email</a>.
</p>

{#if !dev}
  <img class="headshot" src="/img/headshot.jpg" alt="Zak Johnson" />
{:else}
  <Triptych
    bg="/img/bg.jpg"
    images={['/img/snow.jpg', '/img/sitting.jpg', '/img/scarf.jpg']}
  />
{/if}

<style>
  /* TODO: Factor into app.css? */
  a {
    color: var(--color-text);
    text-decoration-color: var(--color-underline);
    text-underline-position: from-font;
    text-decoration-thickness: 0.07em;
    transition: text-decoration-color 150ms;
  }
  a:hover {
    text-decoration-color: var(--color-text);
  }

  /* XXX remove me when we have final triptych images */
  .headshot {
    border-radius: 50%;
    display: block;
    margin: var(--padding) auto;
    max-width: calc(var(--mark-size) * 2);
  }
</style>
