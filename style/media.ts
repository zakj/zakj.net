const BREAKPOINT = 750;

const small = `@media screen and (max-width: ${BREAKPOINT - 0.1}px)`;
const large = `@media screen and (min-width: ${BREAKPOINT}px)`;
const hover = `@media screen and (hover: hover)`;

export default { small, large, hover };
