import Head from 'next/head';
import Markdown from 'react-markdown';
import React, { useRef, RefObject } from 'react';
import { useToggle } from 'react-use';
import styled from 'styled-components';

import useMostVisibleElement from 'src/use-most-visible-element';
import Mark from 'components/mark';
import Nav from 'components/nav';
import Social from 'components/social';
import { SectionName, SectionRefs } from 'src/sections';
import media from 'style/media';

export default () => {
  const sections: SectionRefs = {
    [SectionName.Splash]: useRef<HTMLElement>(null),
    [SectionName.Bio]: useRef<HTMLElement>(null),
    [SectionName.History]: useRef<HTMLElement>(null),
  };
  function sectionFromRef(ref: RefObject<HTMLElement>): SectionName | null {
    const key = Object.keys(sections).find(s => sections[s as SectionName] === ref);
    return key as SectionName || null;
  }

  const currentSection = useMostVisibleElement(Object.values(sections));
  const sectionName = (currentSection && sectionFromRef(currentSection)) ?? SectionName.Splash;
  const [socialMenuOpen, setSocialMenuOpen] = useToggle(false);

  function scrollIntoView(section: SectionName): void {
    sections[section].current?.scrollIntoView({behavior: 'smooth'});
  }

  function clickMark() {
    setSocialMenuOpen(false);
    scrollIntoView(SectionName.Splash);
  }

  return (
    <main>
      <Head>
        <title>Zak Johnson &middot; zakj.net</title>
      </Head>

      <Splash id="splash" ref={sections[SectionName.Splash]}>
        <h1>Whiskey ginger&nbsp;&amp; a&nbsp;dash&nbsp;of bitters.</h1>
      </Splash>

      <Section id="bio" ref={sections[SectionName.Bio]}
        style={{ minHeight: '200vh' }}  // XXX
      >
        <h2>Bio</h2>
        <Markdown
          source={`
Hello! I’m Zak Johnson, a design-minded full-stack developer with a
background in information security. I’ve been building and breaking things on
the web since the nineties at companies like [Etsy][], [GOOD][], and
[Cabin][]. I currently lead a team of product engineers at [Mixpanel][].

I’m passionate about simplicity, [text editors][vimrc], [significant
whitespace][python], and [grammar][common-errors].

[Etsy]: https://www.etsy.com/
[GOOD]: https://www.good.is/
[Cabin]: https://madebycabin.com/ 
[Mixpanel]: https://mixpanel.com/
[Grammarly]: https://www.grammarly.com/
[vimrc]: https://github.com/zakj/dotfiles/blob/master/vimrc
[python]: https://www.python.org/
[common-errors]: https://brians.wsu.edu/common-errors-in-english-usage/
      `}
        />
      </Section>

      <Section id="history" ref={sections[SectionName.History]}>
        history TODO
      </Section>

      <Nav sectionName={sectionName} onClick={scrollIntoView} />
      <Social open={socialMenuOpen} onClick={setSocialMenuOpen} />
      <Mark expanded={socialMenuOpen} onClick={clickMark} />
    </main>
  );
};


const paddingSmall = '24px';  // XXX move to theme?

const Section = styled.section`
  min-height: 100vh;
  padding: var(--padding);
`;

const Splash = styled(Section)`
  background: #eee;  /* XXX */
  display: flex;
  flex-direction: column;
  justify-content: center;

  h1 {
    font-size: 12vw;
    line-height: 0.9;
    /* max-width: calc(100vw - ${p => p.theme.padding.small} * 4); */
    max-width: calc(100vw - var(--padding) * 4);
    text-transform: uppercase;
    ${media.large} {
      font-size: 10vw;
    }
  }
`;
