import { useMachine } from '@xstate/react';
import Head from 'next/head';
import React, { useRef, useEffect } from 'react';
import Div100vh from 'react-div-100vh';
import media from 'style/media';
import styled from 'styled-components';
import { assign, Machine } from 'xstate';

class Exercise {
  constructor(
    public name: string,
    public duration: number,
    public description?: string
  ) {}
}

const EXERCISES: Exercise[] = [
  new Exercise('Basic plank', 60),
  new Exercise('Forearm plank', 30),
  new Exercise('Forearm plank (right leg lifted)', 30),
  new Exercise('Forearm plank (left leg lifted)', 30),
  new Exercise('Side plank (left hand base)', 30),
  new Exercise('Side plank (right hand base)', 30),
  new Exercise('Basic plank', 30),
  new Exercise('Forearm plank', 60),
].map((e) => new Exercise(e.name, e.duration, e.description));
// ].map((e) => new Exercise(e.name, e.duration / 10, e.description)); // XXX

const BREAK_TIME = 2000;

interface PlankContext {
  elapsed: number;
  exerciseIndex: number;
  finalExerciseIndex: number;
}

interface PlankStateSchema {
  states: {
    idle: {};
    exercise: {};
    break: {};
    done: {};
  };
}

type PlankEvent =
  | { type: 'START' }
  | { type: 'TICK'; elapsed: number };

function timer(send: (event: PlankEvent) => void) {
  let running = true;
  const startTime = Date.now();
  function tick() {
    send({ type: 'TICK', elapsed: Date.now() - startTime });
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
          id: 'exercise-timer',
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
        on: { TICK: { actions: 'updateElapsed' } },
      },
      break: {
        invoke: {
          id: 'break-timer',
          src: () => timer,
        },
        after: { BREAK_TIME: 'exercise' },
        on: { TICK: { actions: 'updateElapsed' } },
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
      updateElapsed: assign({
        elapsed: (context, event) =>
          event.type === 'TICK' ? event.elapsed : context.elapsed,
      }),
    },
    delays: {
      BREAK_TIME,
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
  // TODO prevent sleep on iOS
  // TODO PWA/offline mode

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const c = canvas.width / 2;
    const r = canvas.width;
    const startAngle = 1.5;
    const percentComplete = (machine.context.elapsed / 1000 / exercise.duration);
    const endAngle = (percentComplete * 2 + startAngle) % 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(c, c)
    ctx.arc(c, c, r, Math.PI * startAngle, Math.PI * endAngle);
    ctx.lineTo(c, c);
    ctx.fillStyle = '#ffffff33';
    ctx.fill();
  }, [machine.context.elapsed, exercise.duration])

  return (
    <>
      <Head>
        <title>Plank! &middot; zakj.net</title>
        <meta name="apple-mobile-web-app-capable" content="yes"></meta>
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"></meta>
        <meta name="apple-mobile-web-app-title" content="Plank!"></meta>
        <link rel="apple-touch-icon" href="/plank-touch-icon.png"></link>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover"></meta>
      </Head>
      <Main>
        <Center>
          <Background>
            {machine.matches('exercise') && (
              <canvas width="1000" height="1000" ref={canvasRef}></canvas>
            )}
          </Background>
          {machine.matches('idle') ? (
            <Circle className="clickable" onClick={() => send('START')}>
              <svg fill="#000000" viewBox="0 0 100 100">
                <path d="M78.627,47.203L24.873,16.167c-1.082-0.625-2.227-0.625-3.311,0C20.478,16.793,20,17.948,20,19.199V81.27 c0,1.25,0.478,2.406,1.561,3.031c0.542,0.313,1.051,0.469,1.656,0.469c0.604,0,1.161-0.156,1.703-0.469l53.731-31.035 c1.083-0.625,1.738-1.781,1.738-3.031C80.389,48.984,79.71,47.829,78.627,47.203z" />
              </svg>
            </Circle>
          ) : machine.matches('exercise') ? (
            <Circle>
              {Math.ceil(exercise.duration - machine.context.elapsed / 1000)}
            </Circle>
          ) : machine.matches('break') ? (
            <Circle>{exercise.duration}</Circle>
          ) : machine.matches('done') ? (
            <Circle>👍</Circle>
          ) : null}
        </Center>
        <Footer>
          {machine.matches('idle') ? (
            <Title>Plank!</Title>
          ) : machine.matches('exercise') ? (
            <ExerciseName>{exercise.name}</ExerciseName>
          ) : machine.matches('break') ? (
            <ExerciseName className="next">{exercise.name}</ExerciseName>
          ) : machine.matches('done') ? (
            <Title>Nice work!</Title>
          ) : null}
        </Footer>
      </Main>
    </>
  );
};

const Main = styled(Div100vh)`
  display: flex;
  flex-direction: column;

  /* Account for viewport-fit=cover. */
  padding-top: env(safe-area-inset-top);
  box-sizing: content-box;
`;

const Title = styled.h1`
  text-transform: uppercase;
`;

const Circle = styled.div`
  --size: 200px;
  align-items: center;
  background-color: var(--color-bg);
  border-radius: calc(var(--size) / 2);
  display: flex;
  font-family: var(--font-header);
  font-size: 84px;
  font-variant-numeric: tabular-nums;
  font-weight: bold;
  height: var(--size);
  justify-content: center;
  width: var(--size);

  &.clickable {
    cursor: pointer;
  }

  svg {
    height: calc(var(--size) / 2);
    width: calc(var(--size) / 2);
    margin-left: 5%;
  }

  ${media.large} {
    --size: 350px;
    font-size: 128px;
  }
`;

const Center = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
  position: relative;

  /* Account for viewport-fit=cover. */
  margin-top: calc(-1 * env(safe-area-inset-top));
`;

const Background = styled.div`
  background-color: var(--color-green);
  height: 100%;
  position: absolute;
  width: 100%;
  z-index: -1;
  canvas {
    height: 100%;
    width: 100%;
  }
`;

const Footer = styled.footer`
  line-height: 24px;
  padding: var(--padding);
  text-align: center;

  /* Account for viewport-fit=cover. */
  padding-bottom: max(var(--padding), env(safe-area-inset-bottom));
  ${media.large} {
    text-align: left;
  }
`;

const ExerciseName = styled.div`
  font-family: var(--font-header);
  font-size: 18px;
  font-weight: bold;
  &.next {
    opacity: 0.6;
  }
  ${media.large} {
    font-size: 30px;
  }
`;
