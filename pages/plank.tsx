import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';
import { Machine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

import RadialProgress from 'components/radial-progress'

class Exercise {
  constructor(
    public name: string,
    public duration: number,
    public description?: string
  ) {}
}

const EXERCISES: Exercise[] = [
  new Exercise('Basic Plank', 60),
  new Exercise('Forearm Plank', 30),
  new Exercise('Forearm Plank (one leg raised)', 30),
  new Exercise('Forearm Plank (other leg raised)', 30),
  new Exercise('Side Plank (right hand base)', 30),
  new Exercise('Side Plank (left hand base)', 30),
  new Exercise('Basic Plank', 30),
  new Exercise('Forearm Plank', 60),
]

interface PlankContext {
  elapsed: number,
  exerciseIndex: number,
  finalExerciseIndex: number,
}

interface PlankStateSchema {
  states: {
    idle: {},
    exercise: {},
    break: {},
    done: {},
  }
}

type PlankEvent = 
  | { type: 'START' }
  | { type: 'TICK', value: number }

function timer(callback: (event: PlankEvent) => void) {
  let running = true;
  const startTime = Date.now();
  function tick() {
    callback({ type: 'TICK', value: Date.now() - startTime });
    if (running) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  return () => (running = false);
}

const plankMachine = Machine<PlankContext, PlankStateSchema, PlankEvent>(
  {
    id: 'plank',
    initial: 'idle',
    context: {
      elapsed: 0,
      exerciseIndex: 0,
      finalExerciseIndex: EXERCISES.length - 1,
    },
    states: {
      idle: {
        on: {
          START: 'break',
        },
      },
      exercise: {
        invoke: {
          id: 'timer',
          src: () => timer,
        },
        after: {
          EXERCISE_TIME: [
            {
              target: 'break',
              actions: 'nextExercise',
              cond: 'hasMoreExercises',
            },
            { target: 'done' },
          ],
        },
        on: {
          TICK: { actions: assign({ elapsed: (context, { value }) => value }) },
        },
      },
      break: {
        after: { BREAK_TIME: 'exercise' },
      },
      done: {
        type: 'final',
      },
    },
  },
  {
    actions: {
      nextExercise: assign({
        exerciseIndex: (context) => context.exerciseIndex + 1,
      }),
    },
    delays: {
      BREAK_TIME: 2000,
      EXERCISE_TIME: (context) =>
        EXERCISES[context.exerciseIndex].duration * 1000,
    },
    guards: {
      hasMoreExercises: (context) =>
        context.exerciseIndex < context.finalExerciseIndex,
    },
  }
);

export default () => {
  const [machine, send] = useMachine(plankMachine);
  const exercise = EXERCISES[machine.context.exerciseIndex];
  // TODO noSleep.js
  // TODO web clip stuff https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html
  // TODO PWA/offline mode

  return (
    <>
      <Head>
        <title>Plank! &middot; zakj.net</title>
      </Head>
      <Main>
        <Title>Plank!</Title>
        {machine.matches('idle') ? (
          <>
            <div>{EXERCISES.reduce((acc, {duration}) => acc + duration / 60, 0)}-minute plank</div>
            <button onClick={() => send('START')}>Start</button>
          </>
        ) : machine.matches('exercise') ? (
          <>
            <RadialProgress current={machine.context.elapsed / 1000} max={exercise.duration} down />
            <div>{exercise.name}</div>
          </>
        ) : machine.matches('break') ? (
          <>
            {/* R .. RR .. RRR ... GGG  */}
            <RadialProgress current={0} max={exercise.duration} down />
            <div>get ready for {exercise.name}!</div>
          </>
        ) : machine.matches('done') ? (
          <div>You did it!</div>
        ) : null}
      </Main>
    </>
  );
};

const Main = styled.main`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  min-height: 100vh;  /* TODO: react-div-100vh */
`;

const Title = styled.h1`
  text-transform: uppercase;
`;
