const DEFAULT_SECTION = 'splash';

const SECTION_DATA = {
  splash: {
    lightBackground: false,
    style: {
      backgroundColor: 'hsl(209, 18%, 34%)',
      backgroundImage: `url(${require('~/assets/splash-bg.jpg')}`,
    },
  },
  bio: {
    lightBackground: false,
    style: {
      backgroundColor: 'hsl(39, 46%, 74%)',
    },
  },
  history: {
    lightBackground: false,
    style: {
      backgroundColor: 'hsl(186, 65%, 32%)',
    },
  },
  code: {
    lightBackground: true,
    style: {
      backgroundColor: 'hsl(0, 0%, 100%)',
    },
  },
  qa: {
    lightBackground: false,
    style: {
      backgroundColor: 'hsl(0, 0%, 29%)',
    },
  },
};

function currentSection(state) {
  return SECTION_DATA[state.currentSection] || SECTION_DATA[DEFAULT_SECTION];
}

export const state = () => ({
  currentSection: DEFAULT_SECTION,
});

export const getters = {
  backgroundStyle: state => currentSection(state).style,
  lightBackground: state => currentSection(state).lightBackground,
};

export const mutations = {
  setCurrentSection(state, section) {
    state.currentSection = section;
  },
};
