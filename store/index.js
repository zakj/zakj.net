export const state = () => ({
  currentSection: 'splash',
  socialMenuOpen: false,
});

export const getters = {
  lightBackground: state => {
    return !state.socialMenuOpen && ['code'].includes(state.currentSection);
  },
};

export const mutations = {
  setCurrentSection(state, section) {
    state.currentSection = section;
  },

  toggleSocialMenu(state, open=undefined) {
    state.socialMenuOpen = typeof open === 'boolean' ? open : !state.socialMenuOpen;
  },
};
