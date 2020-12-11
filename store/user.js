export const state = () => ({
    user: {}
});

export const mutations = {
  setUser(state, value) {
    state.user = value;
  }
}

export const getters = {
  user(state) {
    return state.user;
  }
}