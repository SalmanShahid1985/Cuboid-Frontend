import JwtService from "../jwt";
const axios = require("axios");

export default {
  state: {
    cms: null,
    cmsTotal: null,
    singlecms: null,
  },
  getters: {
    getcmsList(state) {
      return state.cms;
    },
    getcmsListTotal(state) {
      return state.cmsTotal;
    },
    getcmsById(state) {
      return state.singlecms;
    },
  },
  actions: {
    async getcmssList({ commit }, payload) {
      if (payload.pagination) {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/page?pagination=false`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data.success) {
              commit("setcmsList", response.data.allPages);
              commit("setcmsListTotal", response.data.totalRecord);
            }
            return response.data.cmsData;
          })
          .catch(function (error) {
            commit("setcmsList", null);
            if (error.response) {
              return error.response.data
            }
          });
      } else {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/page?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data.success) {
              commit("setcmsList", response.data.allPages);
              commit("setcmsListTotal", response.data.totalRecord);
            }
            return response.data.cmsData;
          })
          .catch(function (error) {
            commit("setcmsList", null);
            if (error.response) {
              return error.response.data
            }
          });
      }

    },

    async getcmsById({ commit }, data) {
      commit("setSinglecms", data);
    },

    async addcms({ commit }, payload) {


      return await axios
        .post(`${process.env.VUE_APP_API_URL}api/v1/page`, payload, {
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

    async updatecms({ commit }, payload) {
      return await axios
        .put(
          `${process.env.VUE_APP_API_URL}api/v1/page/${payload._id}`,
          {
            title: payload.title,
            description: payload.description,
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

    async removecms({ commit }, cmsId) {
      return await axios.delete(`${process.env.VUE_APP_API_URL}api/v1/page/${cmsId}`, {
        headers: { Authorization: `Bearer ${JwtService.getToken()}` },
      })
        .then(function (response) {
          return response;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },

    resetcmsState({ commit }) {
      commit("setSinglecms", null);
    },
  },
  mutations: {
    setcms(state, payload) {
      state.cms.unshift(payload);
    },
    setcmsList(state, payload) {

      state.cms = payload;
    },
    setcmsListTotal(state, payload) {

      state.cmsTotal = payload;
    },
    setSinglecms(state, payload) {
      state.singlecms = payload;
    },
  },
};
