import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useToggle } from 'react-use';

import css from './mark.styl';

const EXPAND_DURATION = 0.2;

const variantsContainer = {
  collapsed: {
    transition: { staggerChildren: EXPAND_DURATION / 2, staggerDirection: -1 },
  },
  expanded: { transition: { staggerChildren: EXPAND_DURATION / 2 } },
};

const variantsTop = {
  collapsed: { x: 135 },
  expanded: { x: 0 },
};

const variantsBottom = {
  collapsed: { x: -135 },
  expanded: { x: 0 },
};

const Mark = ({ onClick, expanded }) => {
  const [recentlyClicked, setRecentlyClicked] = useToggle(false);
  const [hovered, setHovered] = useToggle(false);
  let recentlyClickedTimeout = null;

  function clickHandler() {
    onClick();
    setRecentlyClicked(true);
    clearTimeout(recentlyClickedTimeout);
    recentlyClickedTimeout = setTimeout(() => setRecentlyClicked(false), 2000);
  }

  return (
    <motion.svg
      className={css.mark}
      width="200px"
      height="217px"
      viewBox="0 0 200 217"
      onClick={clickHandler}
      // whileHover doesn't respect transition properties, see framer/motion#306
      onMouseOver={() => setHovered(true)}
      onMouseOut={() => setHovered(false)}
      initial="collapsed"
      animate={expanded || hovered || recentlyClicked ? 'expanded' : 'collapsed'}
      variants={variantsContainer}
    >
      <text>{JSON.stringify(recentlyClicked)}</text>
      <clipPath id="mark-top-clip" variants={variantsContainer}>
        <motion.rect
          width="200"
          height="100"
          variants={variantsTop}
          transition={{ duration: EXPAND_DURATION, ease: 'easeOut' }}
        />
      </clipPath>
      <clipPath id="mark-bottom-clip">
        <motion.rect
          x="0"
          y="117"
          width="200"
          height="100"
          variants={variantsBottom}
          transition={{ duration: EXPAND_DURATION, ease: 'easeOut' }}
        />
      </clipPath>

      <g>
        <polygon points="131.176133 0 200 0.123337662 69.4492611 216.503305 0 216.503305"></polygon>
        <polygon
          clipPath="url(#mark-top-clip)"
          points="15 0 121 0.024017238 89.4976424 52.5 15 52.5"
        ></polygon>
        <polygon
          clipPath="url(#mark-bottom-clip)"
          points="111.419456 164 191.1 164 191.1 216.5 80 216.5"
        ></polygon>
      </g>
    </motion.svg>
  );
};

Mark.propTypes = {
  expanded: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Mark;
