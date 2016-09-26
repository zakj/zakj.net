import { createProjector, h } from 'maquette';

import alphabet from './alphabet';
import style from './style.sass';


let input = '';

function handleInput(e) {
  input = e.target.value;
}

function mapInput(c) {
  c = c.toLowerCase();
  if (c in alphabet) return alphabet[c];
  if (c.match(/\s/)) return ' ';
  return c;
}

function render() {
  return h('div.nato', [
    h('input', {oninput: handleInput}),
    h('div.result', input.split('').map((c, i) => h('div', {key: i}, [mapInput(c)]))),
    h('ul.alphabet', Object.keys(alphabet).map(k => h('li', [alphabet[k]]))),
  ]);
}

createProjector({}).append(document.body, render);
