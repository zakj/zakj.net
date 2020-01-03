import Head from 'next/head';
import Markdown from 'react-markdown';
import React, { useRef } from 'react';

import useMostVisibleElement from '../src/use-most-visible-element';
import Mark from '../components/mark';
import Nav from '../components/nav';

import '../base.styl';
import css from './index.styl';

const Index = () => {
  const sections = {
    splash: useRef(),
    bio: useRef(),
    history: useRef(),
  };
  const currentSection = useMostVisibleElement(Object.values(sections));
  const sectionName =
    currentSection && currentSection.current && currentSection.current.id;

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
