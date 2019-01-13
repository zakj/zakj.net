const bindings = new Map();
const noop = () => null;

function computeOverlap(r1, r2) {
  const top = Math.max(r1.top, r2.top);
  const bottom = Math.min(r1.bottom, r2.bottom);
  return Math.max(0, bottom - top);
}

function updateOverlaps() {
  const viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  const viewportRect = {top: 0, bottom: viewportHeight};
  for (const [el, binding] of bindings.entries()) {
    binding(el, computeOverlap(el.getBoundingClientRect(), viewportRect));
  }
}

function throttle(fn, timeout = 0) {
  let waiting = false;
  return function() {
    if (waiting) return;
    waiting = true; 
    setTimeout(function() {
      waiting = false;
      fn();
    }, timeout);
  };
}

const throttledUpdate = throttle(updateOverlaps, 50);

const VueViewportOverlap = {
  bind(el, binding) {
    if (bindings.size === 0) {
      window.addEventListener('scroll', throttledUpdate);
      window.addEventListener('resize', throttledUpdate);
      setTimeout(updateOverlaps, 0);
    }
    bindings.set(el, binding.value || noop);
  },

  unbind(el) {
    bindings.delete(el);
    if (bindings.size === 0) {
      window.removeEventListener('scroll', throttledUpdate);
      window.removeEventListener('resize', throttledUpdate);
    }
  },
};

VueViewportOverlap.install = function(Vue) {
  Vue.directive('viewport-overlap', VueViewportOverlap);
};

export default VueViewportOverlap;


// TODO: extract the above into its own library.
import Vue from 'vue';
Vue.use(VueViewportOverlap);
