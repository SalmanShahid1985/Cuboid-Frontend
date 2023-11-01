import JwtService from "../jwt";
const axios = require("axios");

export default {
  state: {
    roles: [],
    singleRole: null,
  },
  getters: {
    getRoles(state) {
      return state.roles;
    },
    getRolebyId(state) {
      return state.singleRole;
    },
  },
  actions: {
    async getRoles({ commit }) {
      await axios
        .get(`${process.env.VUE_APP_API_URL}GetRoles`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then(function (response) {
          if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
            window.location.href = '/login'
          }
          if (response.status == 200) {
            commit("setRolesList", response.data.data);
          }
        })
        .catch(function (error) {
          commit("setRolesList", null);
          if (error.response) {
            return error.response.data
          }
        })
    },

    async getRolebyId({ commit }, data) {
      commit("setSingleRole", data);
    },

    async addRoleWithPermissions({ commit }, payload) {



      var paramsvalue = payload.permissions.reduce((a, v) => ({ ...a, [v]: v }), {})
      paramsvalue['roleName'] = payload.roleName;


      paramsvalue.map(function (item) {

        return { [item]: 'permissions' }
      });


      return await axios
        .post(`${process.env.VUE_APP_API_URL}AddRoleWithPermissions`, null, {
          params: paramsvalue,
        })
        .then(function (response) {
          if (response.status == 200) {
            commit("setRoles", payload.data.data);
          }
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },

    resetRoleState({ commit }) {
      commit("setSingleRole", null);
    },
  },
  mutations: {
    setRoles(state, payload) {
      state.roles.unshift(payload);
    },
    setRolesList(state, payload) {
      state.roles = payload;
    },
    setSingleRole(state, payload) {
      state.singleRole = payload;
    },
  },
};
