export const state = () => (
  {
    user: null
  }
);

export const mutations = {
  setUser (state, payload) {
    state.user = payload
  }
}

export const actions = {
  async login({ commit }, uid) {
    try {
      await this.$axios.$post('/api/auth/login', { uid });
      commit('setUser', uid);
    } catch (ex) {
      console.log(ex);
    }
  },
  async logout({ commit }, uid) {
    try {
      await this.$axios.$get('/api/auth/logout');
      commit('setUser', null);
    } catch (ex) {
      console.log(ex);
    }
  }
}

