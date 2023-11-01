import JwtService from "../jwt";
const axios = require("axios");

export default {
  state: {
    singlePermission: null,
  },
  getters: {
    getPermission(state) {
      return state.permissions;
    },
  },
  actions: {
    async getPermission({ commit }) {
      await axios
        .get(`${process.env.VUE_APP_API_URL}GetPermissions`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then(function (response) {
          if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
            window.location.href = '/login'
          }
          if (response.status == 200) {
            commit("setPermissions", response.data.data);
          }
        })
        .catch(function (error) {
          commit("setPermissions", null);
          if (error.response) {
            return error.response.data
          }
        })
    },

    async getPermissionById({ commit }, data) {
      commit("setSinglePermission", data);
    },
    async getRolebyId({ commit }, data) {
      commit("setSingleRole", data);
    },

  },
  mutations: {
    setPermissions(state, payload) {
      state.permissions = payload;
    },


    setSinglePermission(state, payload) {
      state.singlePermission = payload;
    },



  },
};
