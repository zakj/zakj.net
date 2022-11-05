import type { Action } from 'svelte/action';

const clickOutside: Action<HTMLElement, () => void> = (
  node: Element,
  onClick
) => {
  function handleClick({ target }) {
    if (!node.contains(target)) onClick();
  }

  document.addEventListener('click', handleClick, {
    passive: true,
    capture: true,
  });
  return {
    destroy() {
      document.removeEventListener('click', handleClick);
    },
  };
};

export default clickOutside;
