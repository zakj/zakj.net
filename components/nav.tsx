import { motion } from 'framer-motion';
import { useEffect, useRef, useState, RefObject } from 'react';
import React from 'react';
import { useWindowSize } from 'react-use';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import media from 'style/media';
import { SectionName, SectionRefs } from 'src/sections';

const MARKER_OFFSET = 1;
const MARKER_LEFT = 4;

interface Position {
  left: number,
  y: number,
  scaleY: number,
}

interface Props {
  sectionName: SectionName,
  onClick: (sectionName: SectionName) => void;
}

type NavSectionRefs = Omit<SectionRefs, SectionName.Splash>;

function Wrapper({ sectionName, onClick }: Props) {
  const [markerPosition, setMarkerPosition] = useState<Position>();
  const { width, height } = useWindowSize();
  const sections: NavSectionRefs = {
    [SectionName.Bio]: useRef<HTMLSpanElement>(null),
    [SectionName.History]: useRef<HTMLSpanElement>(null),
  };

  useEffect(() => {
    const topSection = sections[SectionName.Bio].current?.getBoundingClientRect();
    if (!topSection) return;
    const position = {
      y: topSection.top,
      scaleY: 0,
      left: topSection.left - MARKER_LEFT,
    };
    const rect = sections[sectionName as keyof NavSectionRefs]?.current?.getBoundingClientRect();
    if (rect) {
      position.y = rect.top + MARKER_OFFSET;
      position.scaleY = rect.height - MARKER_OFFSET;
    }
    setMarkerPosition(position);
  }, [width, height, sectionName]);

  return (
    <Nav>
      <Marker
        initial={{ y: 0, scaleY: 0 }}
        animate={markerPosition}
      />
      <ul>
        <li>
          <a onClick={() => onClick(SectionName.Bio)}>
            <span ref={sections.bio}>Bio</span>
          </a>
        </li>
        <li>
          <a onClick={() => onClick(SectionName.History)}>
            <span ref={sections.history}>History</span>
          </a>
        </li>
      </ul>
    </Nav>
  );
}


const itemPadding = 16;
const markerSize = 3;
const markerOffset = 1;
const markerLeft = 4;

const Nav = styled.nav`
  bottom: 0;
  font-family: var(--font-header);
  position: fixed;
  right: 20px;
  text-transform: uppercase;
  top: 0;
  writing-mode: vertical-rl;

  ul {
    display: flex;
    justify-content: center;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  a {
    color: var(--color-text);
    cursor: pointer;
    padding: ${itemPadding}px;
    position: relative;
    text-decoration: none;
  }

  ${media.hover} {
    a::after {
      background-color: var(--color-text);
      content: '';
      height: calc(100% - ${itemPadding * 2 + markerOffset}px);
      left: ${itemPadding - markerLeft}px;
      opacity: 0.4;
      position: absolute;
      top: ${itemPadding + markerOffset}px;
      transform: scaleY(0);
      transform-origin: top center;
      transition: transform 150ms ease-in;
      width: ${markerSize}px;
    }

    a:hover::after {
      transform: scaleY(1);
    }
  }
`;

const Marker = styled(motion.div)`
  background: var(--color-text);
  height: 1px;
  position: fixed;
  top: 0;
  transform-origin: top;
  width: ${markerSize}px;
`;


export default Wrapper;
