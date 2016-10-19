import { createProjector, h } from 'maquette';
import { TweenLite } from 'gsap';

import style from './style.sass';

const LADDER = [
  {rung: 16, bend: 14, sitUp: 10, legLift: 12, pushUp: 9, steps: 340},
];

const EXERCISES = [
  {
    name: 'bend',
    title: 'Bend and bounce',
  },
  {
    name: 'sitUp',
    title: 'Sit up',
  },
  {
    name: 'legLift',
    title: 'Prone lift',
  },
  {
    name: 'pushUp',
    title: 'Push up',
  },
  {
    name: 'steps',
    title: 'Run and jump',
  },
];

const RUNG_NUMBER = 16;
const RUNG = LADDER.find(r => r.rung === RUNG_NUMBER);

let exerciseIndex = 0;

function nextExercise() {
  if (exerciseIndex < EXERCISES.length - 1) {
    exerciseIndex++;
  }
}

function enterTitle(node) {
  TweenLite.from(node, .35, {
    autoAlpha: 0,
    xPercent: 30,
  });
}

function exitTitle(node, remove) {
  TweenLite.to(node, .25, {
    autoAlpha: 0,
    xPercent: -30,
    scale: .5,
    onComplete: remove,
  });
}

function enterCount(node) {
  TweenLite.from(node, .35, {
    autoAlpha: 0,
    xPercent: 30,
  });
}

function exitCount(node, remove) {
  TweenLite.to(node, .25, {
    autoAlpha: 0,
    xPercent: -30,
    scale: .5,
    onComplete: remove,
  });
}

function render() {
  const exercise = EXERCISES[exerciseIndex];
  return h('div.ladder', {onclick: nextExercise}, [
    h('div.header', [
      h('h1', {
        key: exercise.title,
        enterAnimation: enterTitle,
        exitAnimation: exitTitle,
      }, exercise.title),
    ]),
    h('div.count', [
      h('div', {
        key: exercise.title,
        enterAnimation: enterCount,
        exitAnimation: exitCount,
      }, RUNG[exercise.name]),
    ]),
  ]);
}

createProjector({}).append(document.body, render);
