export const state = () => ({
  currentSection: 'splash',
  historyBackgroundImage: null,
  socialMenuOpen: false,
  windowHeight: null,
  windowWidth: null,
});

export const getters = {
  isLightBackground: state => {
    return state.socialMenuOpen;
    // return !state.socialMenuOpen && !['splash', 'bio'].includes(state.currentSection);
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
