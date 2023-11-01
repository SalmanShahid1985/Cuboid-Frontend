import JwtService from "../jwt";
import { apiCall } from "../request";
const axios = require("axios");

export default {
  state: {
    waste: null,
    wasteTotal: null,
    singlewaste: null,
  },
  getters: {
    getwasteList(state) {

      return state.waste;
    },
    getwasteListTotal(state) {
      return state.wasteTotal;
    },
    getwasteById(state) {
      return state.singlewaste;
    },
  },
  actions: {

    async wasteList({ commit }, payload) {
      if (payload.pagination) {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/wastage/all?pagination=false`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data.success) {
              commit("setwasteList", response.data.data);
              commit("setwasteListTotal", response.data.totalRecord);
            }
          })
          .catch(function (error) {
            commit("setwasteList", null);
            if (error.response) {
              return error.response.data
            }
          });
      }
      else {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/wastage/all?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data.success) {
              commit("setwasteList", response.data.data);
              commit("setwasteListTotal", response.data.totalRecord);
            }
          })
          .catch(function (error) {
            commit("setwasteList", null);
            if (error.response) {
              return error.response.data
            }
          });
      }

    },

    async getwasteById({ commit }, data) {

      commit("setSinglewaste", data);
    },

    async addwaste({ commit }, payload) {

      await axios.post(`${process.env.VUE_APP_API_URL}api/v1/wastage`,
        payload,
        {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        }
      )
        .then((response) => {

          if (response.status) {
            commit("setwaste", payload.data);
          }
        })
        .catch((error) => {
          if (error.response) {
            return error.response.data
          }
        });
    },

    async updatewaste({ commit }, payload) {
      return await axios
        .put(
          `${process.env.VUE_APP_API_URL}api/v1/wastage/${payload._id}`,
          {
            name: payload.name,
            location: payload.location,
            status: payload.status,
          },
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then(function (response) {
          return response;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },

    async removewaste({ commit }, wasteId) {

      return await axios.delete(`${process.env.VUE_APP_API_URL}api/v1/waste/${wasteId}`, {
        headers: { Authorization: `Bearer ${JwtService.getToken()}` },
      })
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },

    resetwasteState({ commit }) {
      commit("setSinglewaste", null);
    },
    resetwasteListState({ commit }) {
      commit("emptywasteList", null);
    },
  },
  mutations: {
    setwaste(state, payload) {
      state.data.unshift(payload);
    },
    setwasteList(state, payload) {

      state.waste = payload;
    },
    setwasteListTotal(state, payload) {

      state.wasteTotal = payload;
    },
    setSinglewaste(state, payload) {
      state.singlewaste = payload;
    },
    emptywasteList(state, payload) {
      state.data = payload;
    },
  },
};


