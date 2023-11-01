import JwtService from "../jwt";
const axios = require("axios");

export default {
  state: {
    promotion: null,
    promotionTotal: null,
    singlepromotion: null,
  },
  getters: {
    getpromotionList(state) {

      return state.promotion;
    },
    getpromotionListTotal(state) {

      return state.promotionTotal;
    },
    getpromotionById(state) {
      return state.singlepromotion;
    },
  },

  actions: {
    async promotionsList({ commit }, payload) {
      if (payload.pagination) {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/promotion?pagination=false`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data) {
              commit("setpromotionList", response.data.allPromotions);
              commit("setpromotionListTotal", response.data.totalRecord);
              return response.data.allPromotions
            }
          })
          .catch(function (error) {
            commit("setpromotionList", null);
          });
      }
      else {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/promotion?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data) {
              commit("setpromotionList", response.data.allPromotions);
              commit("setpromotionListTotal", response.data.totalRecord);
            }
          })
          .catch(function (error) {
            commit("setpromotionList", null);
          });
      }
    },

    async getpromotionById({ commit }, data) {

      commit("setSinglepromotion", data);
    },

    async addpromotion({ commit }, payload) {

      return await axios
        .post(`${process.env.VUE_APP_API_URL}api/v1/promotion`, payload, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          if (error.response) {
            return error.response.data
          }
        });
    },

    async updatepromotion({ commit }, payload) {
      return await axios
        .put(
          `${process.env.VUE_APP_API_URL}api/v1/promotion/${payload._id}`,
          {
            promo_name: payload.promo_name,
            promo_code: payload.promo_code,
            promo_description: payload.promo_description,
            promo_start_date: new Date(payload.promo_start_date),
            promo_end_date: new Date(payload.promo_end_date),
            promo_type: payload.promo_type,
            promo_value: payload.promo_value,
            promo_productid: payload.promo_productid,
            promo_status: payload.promo_status,
          },
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {
          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },

    async removepromotion({ commit }, promotionId) {
      return await axios
        .delete(
          `${process.env.VUE_APP_API_URL}api/v1/promotion/${promotionId}`,
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {
          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },

    resetpromotionState({ commit }) {
      commit("setSinglepromotion", null);
    },
    resetpromotionListState({ commit }) {
      commit("emptypromotionList", null);
    },
  },
  mutations: {
    setpromotion(state, payload) {
      state.promotion.unshift(payload);
    },
    setpromotionList(state, payload) {

      state.promotion = payload;
    },
    setpromotionListTotal(state, payload) {

      state.promotionTotal = payload;
    },
    setSinglepromotion(state, payload) {
      state.singlepromotion = payload;
    },
    emptypromotionList(state, payload) {
      state.promotion = payload;
    },
  },
};
