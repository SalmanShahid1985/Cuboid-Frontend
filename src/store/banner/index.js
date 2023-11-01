import JwtService from "../jwt";
import { apiCall } from "../request";
const axios = require("axios");

export default {
  state: {
    banner: null,
    singlebanner: null,
    bannertotal: null,
  },
  getters: {
    getbannerList(state) {
      return state.banner;
    },
    getbannerTotal(state) {
      return state.bannertotal;
    },
    bannerById(state) {
      return state.singlebanner;
    },
  },
  actions: {
    async bannersList({ commit }, payload) {
      if (payload.pagination) {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/banner?pagination=false`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data.success) {
              commit("setbannerList", response.data.banner);
              commit("setbannertotalRecord", response.data.totalRecord);
            }
            return response.data.banner;
          })
          .catch(function (error) {
            commit("setbannerList", null);
            if (error.response) {
              return error.response.data
            }
          });
      } else {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/banner?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data.success) {
              commit("setbannerList", response.data.banner);
              commit("setbannertotalRecord", response.data.totalRecord);
            }
            return response.data.banner;
          })
          .catch(function (error) {
            commit("setbannerList", null);
            if (error.response) {
              return error.response.data
            }
          });
      }

    },

    getbannerById({ commit }, data) {

      commit("setSinglebanner", data);
    },

    async addbanner({ commit }, payload) {
      var formData = new FormData();
      formData.append("banner_title", payload.banner_title);
      if (payload.banner_canteen_ids) {
        payload.banner_canteen_ids.forEach((x) => {
          formData.append("banner_canteen_ids", x);
        });
      }
      // formData.append("machine_id", payload.machine_id)
      formData.append("banner_description", payload.banner_description);
      formData.append("banner_status", payload.banner_status);
      formData.append("banner_end_date", payload.banner_end_date);
      formData.append("banner_start_date", payload.banner_start_date);
      formData.append("banner_image", payload.image);
      return await axios.post(`${process.env.VUE_APP_API_URL}api/v1/banner`, formData, { headers: { Authorization: `Bearer ${JwtService.getToken()}` } })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          if (error.response) {
            return error.response.data
          }
        });
    },

    async updatebanner({ commit }, payload) {
      var formData = new FormData();
      formData.append("banner_title", payload.banner_title);
      if (payload.banner_canteen_ids) {
        payload.banner_canteen_ids.forEach((x) => {
          formData.append("banner_canteen_ids", x);
        });
      }
      // formData.append("machine_id", payload.machine_id)
      formData.append("banner_description", payload.banner_description);
      formData.append("banner_status", payload.banner_status);
      formData.append("banner_end_date", payload.banner_end_date);
      formData.append("banner_start_date", payload.banner_start_date);
      formData.append("banner_image", payload.image);
      return await axios
        .put(
          `${process.env.VUE_APP_API_URL}api/v1/banner/${payload._id}`,
          formData,
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

    async removebanner({ commit }, bannerId) {

      return await axios
        .delete(`${process.env.VUE_APP_API_URL}api/v1/banner/${bannerId}`, {
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

    resetbannerState({ commit }) {
      commit("setSinglebanner", null);
    },
  },
  mutations: {
    setbanner(state, payload) {
      state.banner.unshift(payload);
    },
    setbannerList(state, payload) {
      state.banner = payload;
    },
    setbannertotalRecord(state, payload) {
      state.bannertotal = payload;
    },
    setSinglebanner(state, payload) {

      state.singlebanner = payload;
    },
  },
};
