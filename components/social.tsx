import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLockBodyScroll } from 'react-use';
import styled from 'styled-components';

const BG_TRANSITION = { duration: 0.3, ease: 'easeOut' };

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

interface Props {
  onClick: () => void,
  open: boolean,
}

export default ({ onClick, open }: Props) => {
  useLockBodyScroll(open);

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <Background exit="closed" animate="open" />
            <Menu
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
            </Menu>
          </>
        )}
      </AnimatePresence>
      <SocialButton
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
      </SocialButton>
    </>
  );
};

const Background = styled(motion.svg)`
  bottom: 0;
  height: 100%;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  width: 100%;
`;

const Menu = styled(motion.ul)`
  background-color: var(--color-green);
  bottom: 0;
  display: flex;
  flex-direction: column;
  font-family: var(--font-header);
  font-size: 56px;
  font-weight: bold;
  justify-content: center;
  left: 0;
  list-style: none;
  margin: 0;
  padding: var(--padding);
  position: fixed;
  right: 0;
  text-transform: uppercase;
  top: 0;

  a {
    color: var(--color-text);
    text-decoration: none;
  }
`;

const SocialButton = styled.svg`
  box-sizing: content-box;
  cursor: pointer;
  height: 16px;
  padding: calc(var(--padding) / 2);
  position: fixed;
  right: calc(var(--padding) / 2);
  top: calc(var(--padding) / 2);
  width: 16px;
`;
