// TODO: is this defined somewhere for me?
type ActionReturn = { destroy?: () => void };

function pageHeight(): number {
  if (typeof document === 'undefined') return window.innerHeight;
  return document.documentElement?.clientHeight || window.innerHeight;
}

export default function mobile100vh(node: HTMLElement): ActionReturn {
  const onResize = () => (node.style.height = `${pageHeight()}px`);
  onResize();
  window.addEventListener('resize', onResize);
  return {
    destroy() {
      window.removeEventListener('resize', onResize);
    },
  };
}
