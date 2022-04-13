// TODO: is this defined somewhere for me?
type ActionReturn = { destroy?: () => void };

function pageHeight(): number {
  return Math.max(
    document.documentElement?.clientHeight || 0,
    window.innerHeight
  );
}

function debounce(fn: CallableFunction, timeout = 300) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: unknown[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), timeout);
  };
}

export default function mobile100vh(node: HTMLElement): ActionReturn {
  // TODO: do I actually want this to resize in realtime? can I use svh/lvh instead now?
  const onResize = () => (node.style.height = `${pageHeight()}px`);
  const debouncedOnResize = debounce(onResize);
  if (pageHeight() != node.getBoundingClientRect().height) {
    onResize();
    window.addEventListener('resize', debouncedOnResize);
  }
  return {
    destroy() {
      window.removeEventListener('resize', debouncedOnResize);
    },
  };
}
