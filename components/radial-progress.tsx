import React from 'react';
import styled from 'styled-components';

interface Props {
  current: number,
  max: number,
  down?: boolean,
};

export default ({ current, max, down = false}: Props) => {
  const size = 200;
  const r = 75;
  const c = r * 2 * Math.PI;

  const transforms = {
    up: `rotate(-90, ${size / 2}, ${size / 2})`,
    down: `rotate(90, ${size / 2}, ${size / 2}) scale(-1, 1) translate(-${size}, 0)`,
  }
  const transform = transforms[down ? 'down' : 'up'];
  const progress = down ? (1 - current / max) : current / max;

  return (
    <Svg
      width={`${size}px`}
      height={`${size}px`}
      viewBox={`0 0 ${size} ${size}`}
    >
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central">
        {Math.ceil(max - current)}
      </text>
      <circle cx="50%" cy="50%" r={r} strokeOpacity="0.05"></circle>
      <circle
        cx="50%"
        cy="50%"
        r={r}
        strokeDasharray={c}
        strokeDashoffset={c - progress * c}
        transform={transform}
      />
    </Svg>
  );
};

const Svg = styled.svg`
  circle {
    fill: none;
    stroke-linecap: round;
    stroke-width: 10;
    stroke: var(--color-text);
  }

  text {
    font-family: var(--font-header);
    font-size: 64px;
    font-variant-numeric: tabular-nums;
    font-weight: bold;
  }
`;
