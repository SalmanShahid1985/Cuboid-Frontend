import JwtService from "../jwt";
const axios = require("axios");

export default {
  state: {
    discount: null,
    discountTotal: null,
    subsidyTotal: null,
    subsidy: null,
    singlediscount: null,
    singlesubsidy: null,
  },
  getters: {
    getdiscountList(state) {
      return state.discount;
    },
    getdiscountListTotal(state) {
      return state.discountTotal;
    },
    getsubsidyList(state) {
      return state.subsidy;
    },
    getsubsidyListTotal(state) {
      return state.subsidyTotal;
    },
    getdiscountById(state) {
      return state.singlediscount;
    },
    getsubsidyById(state) {
      return state.singlesubsidy;
    },
  },
  actions: {
    async discountsList({ commit }, payload) {
      if (payload.pagination) {
        return await axios.get(`${process.env.VUE_APP_API_URL}api/v1/discount?pagination=false`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data) {
              commit("setdiscountList", response.data.data);
              commit("setdiscountListTotal", response.data.totalRecord);
            }
            return response.data.data;
          })
          .catch(function (error) {
            commit("setdiscountList", null);
            if (error.response) {
              return error.response.data
            }
          });
      } else {
        return await axios.get(`${process.env.VUE_APP_API_URL}api/v1/discount?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data) {
              commit("setdiscountList", response.data.data);
              commit("setdiscountListTotal", response.data.totalRecord);
            }
            return response;
          })
          .catch(function (error) {
            commit("setdiscountList", null);
            if (error.response) {
              return error.response.data
            }
          });
      }
    },
    async subsidyList({ commit }, payload) {
      if (payload.pagination) {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/subsidy?pagination=false`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data) {
              commit("setsubsidyList", response.data.data);
              commit("setsubsidyListTotal", response.data.totalRecord);
              return response.data.data
            }
            return response;
          })
          .catch(function (error) {
            commit("setsubsidyList", null);
            if (error.response) {
              return error.response.data
            }
          });
      } else {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/subsidy?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data) {
              commit("setsubsidyList", response.data.data);
              commit("setsubsidyListTotal", response.data.totalRecord);
            }
            return response;
          })
          .catch(function (error) {
            commit("setsubsidyList", null);
            if (error.response) {
              return error.response.data
            }
          });
      }
    },

    async getdiscountById({ commit }, data) {

      commit("setSinglediscount", data);
    },
    async getSubsidyById({ commit }, data) {

      commit("setSinglesubsidy", data);
    },

    async adddiscount({ commit }, payload) {

      return await axios
        .post(`${process.env.VUE_APP_API_URL}api/v1/discount`, payload, {
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
    async addsubsidy({ commit }, payload) {

      return await axios
        .post(`${process.env.VUE_APP_API_URL}api/v1/subsidy`, payload, {
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

    async updatediscount({ commit }, payload) {

      return await axios
        .patch(
          `${process.env.VUE_APP_API_URL}api/v1/discount/${payload._id}`,
          {
            discount_name: payload.discount_name,
            discount_startdate: payload.discount_startdate,
            discount_enddate: payload.discount_enddate,
            discount_type: payload.discount_type,
            discount_value: parseInt(payload.discount_value),
            discount_productId: payload.discount_productId,
            discount_canteen_id: payload.discount_canteen_id,
            discount_status: payload.discount_status,
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
    async updatesubsidy({ commit }, payload) {

      return await axios
        .patch(
          `${process.env.VUE_APP_API_URL}api/v1/subsidy/${payload._id}`,
          {
            start_date: payload.start_date,
            end_date: payload.end_date,
            renew_period: payload.renew_period, 
            subsidy_type: payload.subsidy_type,
            subsidy: payload.subsidy,
            canteen_id: payload.canteen_id,
            company_id: payload.company_id,
            status: payload.status,
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

    async removediscount({ commit }, discountId) {

      return await axios
        .delete(`${process.env.VUE_APP_API_URL}api/v1/discount/${discountId}`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then((response) => {
          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },
    async removeSubsidy({ commit }, subsidyId) {

      return await axios
        .delete(`${process.env.VUE_APP_API_URL}api/v1/subsidy/${subsidyId}`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then((response) => {
          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },

    resetdiscountState({ commit }) {
      commit("setSinglediscount", null);
    },
    resetdiscountListState({ commit }) {
      commit("emptydiscountList", null);
    },
  },
  mutations: {
    setdiscount(state, payload) {
      state.discount.unshift(payload);
    },
    setdiscountList(state, payload) {

      state.discount = payload;
    },
    setdiscountListTotal(state, payload) {

      state.discountTotal = payload;
    },
    setsubsidyListTotal(state, payload) {

      state.subsidyTotal = payload;
    },
    setsubsidyList(state, payload) {

      state.subsidy = payload;
    },
    setSinglediscount(state, payload) {
      state.singlediscount = payload;
    },
    setSinglesubsidy(state, payload) {
      state.singlesubsidy = payload;
    },
    emptydiscountList(state, payload) {
      state.discount = payload;
    },
  },
};
