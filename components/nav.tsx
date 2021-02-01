import { motion } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { useWindowSize } from 'react-use';
import { SectionName, SectionRefs } from 'src/sections';
import media from 'style/media';
import styled from 'styled-components';

interface Position {
  top: number;
  x: number;
  scaleX: number;
}

interface Props {
  sectionName: SectionName;
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
    const topSection = sections[
      SectionName.Bio
    ].current?.getBoundingClientRect();
    if (!topSection) return;
    const position = {
      x: topSection.top,
      scaleX: 0,
      top: topSection.width + itemPadding,
    };
    const rect = sections[
      sectionName as keyof NavSectionRefs
    ]?.current?.getBoundingClientRect();
    if (rect) {
      position.x = rect.top;
      position.scaleX = rect.height;
    }
    setMarkerPosition(position);
  }, [width, height, sectionName]);

  return (
    <Nav>
      <Marker initial={{ x: 0, scaleX: 0 }} animate={markerPosition} />
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

const Nav = styled.nav`
  font-family: var(--font-header);
  left: 100%;
  position: fixed;
  text-transform: uppercase;
  top: 0;
  transform-origin: left top;
  transform: rotate(90deg);
  width: 100vh;

  ul {
    display: flex;
    justify-content: center;
    list-style: none;
    margin: 0;
  }

  a {
    color: var(--color-text);
    cursor: pointer;
    display: inline-block;
    padding: ${itemPadding}px;
    position: relative;
    text-decoration: none;
  }

  ${media.hover} {
    a::after {
      background-color: var(--color-text);
      content: '';
      height: ${markerSize}px;
      left: ${itemPadding}px;
      opacity: 0.4;
      position: absolute;
      top: calc(100% - ${itemPadding}px);
      transform-origin: left center;
      transform: scaleX(0);
      transition: transform 150ms ease-in;
      width: calc(100% - ${itemPadding * 2}px);
    }

    a:hover::after {
      transform: scaleX(1);
    }
  }
`;

const Marker = styled(motion.div)`
  background: var(--color-text);
  height: ${markerSize}px;
  position: fixed;
  top: 0;
  transform-origin: left center;
  width: 1px;
`;

export default Wrapper;
