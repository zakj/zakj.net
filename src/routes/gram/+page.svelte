<script lang="ts">
  import { browser } from '$app/environment';
  import ImageGrid from './ImageGrid.svelte';
  const sizes = [
    { w: 4032, h: 3024 },
    { w: 3024, h: 4032 },
    { w: 3264, h: 4896 },
    { w: 6000, h: 4000 },
    { w: 4000, h: 6000 },
    { w: 5194, h: 3464 },
    { w: 5760, h: 3840 },
    { w: 3000, h: 3000 },
  ];
  const images = [
    { src: '/img/brick.jpg', alt: 'headshot on brick wall' },
    {
      src: '/img/scarf.jpg',
      alt: '3/4 body portrait against grey wall',
      description: 'here is a description of my image',
    },
    {
      src: '/img/sitting.jpg',
      alt: 'full body portrait sitting on bench',
      description: 'here is a description of my image',
    },
    {
      src: '/img/snow.jpg',
      alt: 'portrait squatting in the snow on a sunny day',
      description: 'here is a description of my image',
    },
  ];
  for (let i = 0; i < 50; ++i) {
    images.push({
      src: fakeImg(sizes[Math.floor(Math.random() * sizes.length)]),
      alt: '',
    });
  }
  for (let i = 0; i < 10; ++i) {
    images.unshift({
      src: fakeImg(sizes[Math.floor(Math.random() * sizes.length)]),
      alt: '',
    });
  }

  function fakeImg({ w, h }, shrinkFactor = 10) {
    if (!browser) return '';
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = w / shrinkFactor;
    canvas.height = h / shrinkFactor;
    ctx.fillStyle = '#ddd';
    ctx.fillRect(0, 0, w / shrinkFactor, h / shrinkFactor);
    return canvas.toDataURL();
    // return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${w} ${h}' width='${w}' height='${h}'><rect width='${w}' height='${h}' fill='green'/></svg>`
    //   .replace(/%/g, '%25')
    //   .replace(/</g, '%3C')
    //   .replace(/>/g, '%3E');
  }
</script>

<div>
  <ImageGrid {images} />
</div>

<a href="gram/sometag">go to some tag</a>

<style>
  div {
    margin: 0 auto;
    /* max-width: 900px; */
    padding-bottom: 3em;
    padding-left: 5em;
    padding-right: 5em;
  }
</style>
