import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import React from 'react';
import { useWindowSize } from 'react-use';
import PropTypes from 'prop-types';

import css from './nav.styl';

const MARKER_OFFSET = 1;
const MARKER_LEFT = 4;

const Nav = ({ sectionName, onClick }) => {
  const [markerPosition, setMarkerPosition] = useState();
  const { width, height } = useWindowSize();
  const sections = {
    bio: useRef(),
    history: useRef(),
  };

  useEffect(() => {
    const topSection = sections.bio.current.getBoundingClientRect();
    const position = {
      y: topSection.top,
      scaleY: 0,
      left: topSection.left - MARKER_LEFT,
    };
    if (sectionName in sections) {
      const rect = sections[sectionName].current.getBoundingClientRect();
      position.y = rect.top + MARKER_OFFSET;
      position.scaleY = rect.height - MARKER_OFFSET;
    }
    setMarkerPosition(position);
  }, [width, height, sectionName]);

  return (
    <nav className={css.nav}>
      <motion.div
        initial={{ y: 0, scaleY: 0 }}
        animate={markerPosition}
        className={css.marker}
      />
      <ul>
        <li>
          <a onClick={() => onClick('bio')}>
            <span ref={sections.bio}>Bio</span>
          </a>
        </li>
        <li>
          <a onClick={() => onClick('history')}>
            <span ref={sections.history}>History</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

Nav.propTypes = {
  onClick: PropTypes.func.isRequired,
  sectionName: PropTypes.string,
};

export default Nav;
