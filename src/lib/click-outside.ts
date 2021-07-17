// TODO: is this defined somewhere for me?
type ActionReturn = { destroy?: () => void };

export default function clickOutside(
  node: Element,
  onClick: () => void
): ActionReturn {
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
}
