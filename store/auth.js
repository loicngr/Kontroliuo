export const state = () => ({
    authenticated: false,
});

export const mutations = {
    isAuthenticated(state, value) {
      state.authenticated = value;
    },
}

export const getters = {
  accessToken: (state) => {}
}