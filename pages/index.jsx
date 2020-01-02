import Head from 'next/head';
import Markdown from 'react-markdown';
import React, { useRef, useEffect, useState } from 'react';
import { useThrottle, useWindowScroll, useWindowSize } from 'react-use';

import Mark from '../components/mark';
import Nav from '../components/nav';

import '../base.styl';
import css from './index.styl';

function computeOverlap(r1, r2) {
  const top = Math.max(r1.top, r2.top);
  const bottom = Math.min(r1.bottom, r2.bottom);
  return Math.max(0, bottom - top);
}

function maxBy(fn, arr) {
  // TODO: memoize fn results
  return arr.reduce((best, cur) => {
    if (!best) return cur;
    return fn(best) > fn(cur) ? best : cur;
  });
}

const Index = () => {
  const [sectionName, setSectionName] = useState();
  const sections = {
    splash: useRef(),
    bio: useRef(),
    history: useRef(),
  };

  // Maintain sectionName based on scroll position.
  const { width: viewportWidth, height: viewportHeight } = useWindowSize();
  const { y: scrollY } = useWindowScroll();
  const throttledScrollY = useThrottle(scrollY, 100);
  useEffect(() => {
    const viewportRect = { top: 0, bottom: viewportHeight };
    const section = maxBy(
      ({ ref }) =>
        computeOverlap(viewportRect, ref.current.getBoundingClientRect()),
      Object.entries(sections).map(([name, ref]) => ({ name, ref }))
    );
    setSectionName(section.name);
  }, [throttledScrollY, viewportWidth, viewportHeight]);

  function scrollIntoView(section) {
    if (!(section in sections && sections[section].current)) return;
    sections[section].current.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main>
      <Head>
        <title>Zak Johnson</title>
      </Head>

      <Mark onClick={() => scrollIntoView('splash')} />

      <section className={css.splash} id="splash" ref={sections.splash}>
        <h1>Whiskey ginger&nbsp;&amp; a&nbsp;dash&nbsp;of bitters.</h1>
      </section>

      <section
        className="bio"
        id="bio"
        ref={sections.bio}
        style={{ minHeight: '200vh' }}
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
      </section>

      <section id="history" ref={sections.history}>
        history TODO
      </section>

      <Nav sectionName={sectionName} onClick={scrollIntoView} />
    </main>
  );
};

export default Index;
