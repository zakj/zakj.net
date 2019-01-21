const SPLASH_BACKGROUND = require('~/assets/splash-bg.jpg');

export const state = () => ({
  currentSection: 'splash',
  historyBackgroundImage: null,
  socialMenuOpen: false,
  windowHeight: null,
  windowWidth: null,
});

export const getters = {
  backgroundImage: state => {
    return state.currentSection === 'history' ? state.historyBackgroundImage : SPLASH_BACKGROUND;
  },

  isLightBackground: state => {
    return !state.socialMenuOpen && ['code'].includes(state.currentSection);
  },

  isLandscape: state => state.windowWidth > state.windowHeight,
  isMobile: state => state.windowWidth < 750,
};

export const mutations = {
  setHistoryBackgroundImage(state, img) {
    if (img) {
      state.historyBackgroundImage = img;
    }
  },

  setCurrentSection(state, section) {
    state.currentSection = section;
  },

  toggleSocialMenu(state, open=undefined) {
    state.socialMenuOpen = typeof open === 'boolean' ? open : !state.socialMenuOpen;
  },

  setWindowSize(state, {width, height}) {
    state.windowWidth = width;
    state.windowHeight = height;
  },
};
