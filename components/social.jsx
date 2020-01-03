import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLockBodyScroll } from 'react-use';
import PropTypes from 'prop-types';

import css from './social.styl';

const BG_TRANSITION = { duration: 0.5, ease: 'easeOut' };

const variantsBg = {
  closed: {
    clipPath: 'polygon(100% 0%, 100% 0%, 100% 0%)',
    transition: BG_TRANSITION,
  },
  open: {
    clipPath: 'polygon(-100% 0%, 100% 0%, 100% 200%)',
    transition: BG_TRANSITION,
  },
};

const variantsButtonGroup = {
  closed: { rotate: 0 },
  open: { rotate: -45 },
};
const variantsButtonR1 = {
  closed: { x: 0, width: 32, height: 8 },
  open: { x: 12, width: 8, height: 9 },
};
const variantsButtonR2 = {
  closed: { x: 0, width: 20 },
  open: { x: -12, width: 32 },
};
const variantsButtonR3 = {
  closed: { x: 0, y: 0, width: 28, height: 8 },
  open: { x: 8, y: -1, width: 8, height: 9 },
};

const LINKS = [
  ['@zakj', 'https://twitter.com/zakj'],
  ['GitHub', 'https://github.com/zakj'],
  ['LinkedIn', 'https://www.linkedin.com/in/zakjohnson'],
  ['Email', 'mailto:me@zakj.net'],
];

const Social = ({ onClick, open }) => {
  useLockBodyScroll(open);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.ul
            className={css.menu}
            variants={variantsBg}
            initial="closed"
            animate="open"
            exit="closed"
            key="menu"
          >
            {LINKS.map(([text, url], i) => (
              <li key={i}>
                <a href={url}>{text}</a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <svg
        className={css.socialButton}
        width="32px"
        height="32px"
        viewBox="0 0 32 32"
        onClick={onClick}
      >
        <motion.g
          animate={open ? 'open' : 'closed'}
          variants={variantsButtonGroup}
        >
          <motion.rect
            x="0"
            y="0"
            width="32"
            height="8"
            variants={variantsButtonR1}
          />
          <motion.rect
            x="12"
            y="12"
            width="20"
            height="8"
            variants={variantsButtonR2}
          />
          <motion.rect
            x="4"
            y="24"
            width="28"
            height="8"
            variants={variantsButtonR3}
          />
        </motion.g>
      </svg>
    </>
  );
};

Social.propTypes = {
  onClick: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default Social;
