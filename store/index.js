export const state = () => ({
  currentSection: 'splash',
});

export const getters = {
  lightBackground: state => ['code'].includes(state.currentSection),
};

export const mutations = {
  setCurrentSection(state, section) {
    state.currentSection = section;
  },
};
