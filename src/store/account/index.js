import JwtService from "../jwt";
const axios = require("axios");

export default {
  state: {
    user: [],
    jwtToken: null,
    permissions: [],
    role: null,
    email: null,
    name: null,
    route: null,
    userId: null,
    exp: 0,
    isAuthenticated: !!JwtService.getToken(),
  },
  getters: {
    userDetails(state) {
      return state.user;
    },
    getExpTime(state) {
      return state.exp;
    },
    getRoutes(state) {
      return state.route;
    },
    isUserAuthenticated(state) {
      return state.isAuthenticated;
    },
  },
  actions: {
    async signUpUser({ commit }, data) {
      return await axios
        .post(`${process.env.VUE_APP_API_URL}api/v1/registration/signup`, data)
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          return error;
        });
    },

    async signInUser({ commit, getters, dispatch }, data) {
      return await axios
        .post(`${process.env.VUE_APP_API_URL}api/v1/registration/login`, data)
        .then((response) => {
          dispatch('logOutAfterHour');
          commit("setSignInUsers", response.data);
          return response.data;
        })
        .catch((error) => {
          if (error.response) {
            return error.response.data
          }
        });
    },
    async forgotUser({ commit }, data) { 
      return await axios
        .post(`${process.env.VUE_APP_API_URL}api/v1/registration/forgot`, data)
        .then((response) => {
          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },
    async resetPassword({ commit }, data) {
      return await axios
        .post(
          `${process.env.VUE_APP_API_URL}api/v1/registration/resetPassword`,
          data,
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {
          return response.data;
        })
        .catch(function (error) { 
        });
    },
    async logOut({ commit }) {

      await commit("resetStateOnLogOut");
    },
    routes({ commit }, payload) {
      commit("setroutes", payload);
    },
    logOutAfterHour({ commit }) {

      setTimeout(() => {
        commit("resetStateOnLogOut");
      }, 7 * 24 * 60 * 60 * 1000)
      setTimeout(() => { 
      }, 7 * 24 *60 * 60 * 1000)
    },
  },
  mutations: {
    setSignInUsers(state, payload) {
      state.user = payload;
      JwtService.saveToken(payload.token);
      state.isAuthenticated = true;
    },
    setroutes(state, payload) {

      state.route = payload;
    },

    resetStateOnLogOut(state) {

      JwtService.destroyToken();
      state.jwtToken = null;
      state.permissions = [];
      state.role = null;
      state.email = null;
      state.name = null;
      state.userId = null;
      state.exp = 0;
      state.isAuthenticated = false;
    },
  },
};
