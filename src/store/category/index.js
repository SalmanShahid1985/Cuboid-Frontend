import JwtService from "../jwt";
import { apiCall } from "../request";
const axios = require("axios");

export default {
  state: {
    category: null,
    singlecategory: null,
    categoryTotal: null,
  },
  getters: {
    getcategoryList(state) {

      return state.category;
    },
    getcategoryListTotal(state) {

      return state.categoryTotal;
    },
    getcategoryById(state) {
      return state.singlecategory;
    },
  },
  actions: {
    async getcategorysList({ commit }, payload) {
      if (payload.pagination) {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/catagories?pagination=false`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data.success) {
              commit("setcategoryList", response.data.allCatagory);
              commit("setcategoryListTotal", response.data.totalRecord);
            }
            return response.data.allCatagory;
          })
          .catch(function (error) {
            commit("setcategoryList", null);
            if (error.response) {
              return error.response.data
            }
          });
      }
      else {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/catagories?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data.success) {
              commit("setcategoryList", response.data.allCatagory);
              commit("setcategoryListTotal", response.data.totalRecord);
            }
            return response.data.allCatagory;
          })
          .catch(function (error) {
            commit("setcategoryList", null);
            if (error.response) {
              return error.response.data
            }
          });
      }
    },
    async getcategoryById({ commit }, data) {
      commit("setSinglecategory", data);
    },
    async addcategory({ commit }, payload) {
      var formData = new FormData();
      formData.append("catagories_name", payload.catagories_name);
      formData.append("catagories_status", payload.catagories_status);
      formData.append("catagories_image", payload.category_image);
      return await axios
        .post(`${process.env.VUE_APP_API_URL}api/v1/catagories`, formData, {
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
    async updatecategory({ commit }, payload) {
      var formData = new FormData();
      formData.append("catagories_name", payload.catagories_name);
      formData.append("catagories_status", payload.catagories_status);
      formData.append("catagories_image", payload.category_image);
      return await axios.put(
        `${process.env.VUE_APP_API_URL}api/v1/catagories/${payload._id}`,
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

    async removecategory({ commit }, categoryId) {

      return await axios
        .delete(
          `${process.env.VUE_APP_API_URL}api/v1/catagories/${categoryId}`,
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

    resetcategoryState({ commit }) {
      commit("setSinglecategory", null);
    },
  },
  mutations: {
    setcategory(state, payload) {
      state.category.unshift(payload);
    },
    setcategoryList(state, payload) {

      state.category = payload;
    },
    setcategoryListTotal(state, payload) {

      state.categoryTotal = payload;
    },
    setSinglecategory(state, payload) {
      state.singlecategory = payload;
    },
  },
};
