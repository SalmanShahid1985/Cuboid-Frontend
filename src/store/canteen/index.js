import JwtService from "../jwt";
import { apiCall } from "../request";
const axios = require("axios");

export default {
  state: {
    canteen: [],
    // company: [],
    singlecanteen: null,
    toalcanteen: null,
  },
  getters: {
    getcanteenList(state) {
      return state.canteen;
    },
    // getCompanyDropdown(state) {
    //   return state.company;
    // },
    getcanteenListTotal(state) {
      return state.toalcanteen;
    },
    getcanteenListActive(state) {
      if (state.canteen) {
        return state.canteen.filter((x) => x.canteen_status == "Active");
      }
      else {
        return state.canteen;
      }

    },
    getcanteenById(state) {
      return state.singlecanteen;
    },
  },
  actions: {
    async getcanteensList({ commit }, payload) {
      if (payload.pagination) {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/canteen?pagination=false`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data.success) {
              commit("setcanteenList", response.data.allCanteen);
              commit("setcanteenListTotal", response.data.totalRecord);
            }
            else {
              commit("setcanteenList", null);
            }
            return response.data.allCanteen;
          })
          .catch((error) => {

            commit("setcanteenList", null);
            if (error.response) {
              return error.response.data
            }
          });
      }
      else {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/canteen?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data.success) {
              commit("setcanteenList", response.data.allCanteen);
              commit("setcanteenListTotal", response.data.totalRecord);
            }
            else {
              commit("setcanteenList", null);
            }
            return response.data.allCanteen;
          })
          .catch((error) => {

            commit("setcanteenList", null);
            if (error.response) {
              return error.response.data
            }
          });
      }
    },
    // async getCompanyDropdown({ commit }, payload) {

    //   return await axios
    //     .get(`${process.env.VUE_APP_API_URL}api/v1/company`, {
    //       headers: { Authorization: `Bearer ${JwtService.getToken()}` },
    //     })
    //     .then((response) => {
    //       if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
    //         window.location.href = '/login'
    //       }
    //       if (response.data.success) {
    //         commit("setCompanyDropdown", response.data.data);
    //         // commit("setcanteenListTotal", response.data.totalRecord);
    //       }
    //       else {
    //         commit("setCompanyDropdown", null);
    //       }
    //       return response.data.allCanteen;
    //     })
    //     .catch((error) => {

    //       // commit("setcanteenList", null);
    //       if (error.response) {
    //         return error.response.data
    //       }
    //     });

    // },

    async getcanteenById({ commit }, data) {
      
      commit("setSinglecanteen", data);
    },

    async addcanteen({ commit }, payload) {
      return await axios.post(`${process.env.VUE_APP_API_URL}api/v1/canteen?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}`, payload,
        {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        }
      )
        .then((response) => {
          if (response.data.success) {
            commit("setcanteen", response.data.canteen);
          }
          return response.data;
        })
        .catch((error) => {
          if (error.response) {
            return error.response.data
          }
        });
    },

    async updateCanteen({ commit }, payload) {
      return await axios
        .put(
          `${process.env.VUE_APP_API_URL}api/v1/canteen/${payload._id}`,
          {
            canteen_name: payload.canteen_name,
            canteen_location: payload.canteen_location,
            canteen_status: payload.canteen_status,
            payment_method: payload.payment_method,
            canteen_admin_id: payload.canteen_admin_id,
            machine_filler_id: payload.machine_filler_id,
            canteen_company_ids: payload.canteen_company_ids,
            guest_use: payload.guest_use
          },
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then(function (response) {
          return response
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },

    async removecanteen({ commit }, canteenId) {

      return await axios.delete(`${process.env.VUE_APP_API_URL}api/v1/canteen/${canteenId}`, {
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

    resetcanteenState({ commit }) {
      commit("setSinglecanteen", null);
    },
  },
  mutations: {
    setcanteen(state, payload) {
      state.canteen.unshift(payload);
    },
    setcanteenList(state, payload) {

      state.canteen = payload;
    },
    // setCompanyDropdown(state, payload) {

    //   state.company = payload;
    // },
    setcanteenListTotal(state, payload) {

      state.toalcanteen = payload;
    },
    setSinglecanteen(state, payload) {
      state.singlecanteen = payload;
    },
  },
};
