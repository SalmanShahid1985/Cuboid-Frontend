import JwtService from "../jwt";
import { apiCall } from "../request";
const axios = require("axios");

export default {
  state: {
    order: null,
    orderTotal: null,
    singleOrder: null,
    event: null,
    eventTotal: null,
    priority: null,
    priorityTotal: null,
    refund: null,
    refundTotal: null,
    logList: null,
    logListTotal: 0,
  },
  getters: {
    getLogList(state) {
      return state.logList
    },
    getLogListTotal(state) {
      return state.logListTotal
    },
    getOrderList(state) {
      return state.order;
    },
    getOrderListTotal(state) {
      return state.orderTotal;
    },
    getRefundList(state) {
      return state.refund;
    },
    getRefundListTotal(state) {
      return state.refundTotal;
    },
    getOrderById(state) {
      return state.singleOrder;
    },
    geteventList(state) {
      return state.event;
    },
    geteventListTotal(state) {
      return state.eventTotal;
    },
    getpriorityList(state) {
      return state.priority;
    },
    getpriorityListTotal(state) {
      return state.priorityTotal;
    },
  },
  actions: {
    async getOrdersList({ commit }, payload) {
      if (payload.pagination) {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/order?pagination=false`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then(function (response) {
            // handle success

            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.status) {
              commit("setOrderList", response.data.data);
              commit("setOrderListTotal", response.data.totalRecord);
            }
          })
          .catch(function (error) {
            if (error.response) {
              return error.response.data;
            }
          });
      } else {
        return await axios
          .get(
            `${process.env.VUE_APP_API_URL}api/v1/order?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}`,
            {
              headers: { Authorization: `Bearer ${JwtService.getToken()}` },
            }
          )
          .then(function (response) {
            // handle success

            if (response.data.message == "jwt malformed") {
              window.location.href = "/login";
            }
            if (response.status) {
              commit("setOrderList", response.data.data);
              commit("setOrderListTotal", response.data.totalRecord);
            }
          })
          .catch(function (error) {
            if (error.response) {
              return error.response.data;
            }
          });
      }
    },
    async getRefundList({ commit }, payload) {
      if (payload.pagination) {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/order/refundOrders`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then(function (response) {
            // handle success

            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.status) {
              commit("setRefundList", response.data.data);
              commit("setRefundListTotal", response.data.totalRecord);
            }
          })
          .catch(function (error) {
            if (error.response) {
              return error.response.data;
            }
          });
      } else {
        return await axios
          .get(
            `${process.env.VUE_APP_API_URL}api/v1/order/refundOrders?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}`,
            {
              headers: { Authorization: `Bearer ${JwtService.getToken()}` },
            }
          )
          .then(function (response) {
            // handle success

            if (response.data.message == "jwt malformed") {
              window.location.href = "/login";
            }
            if (response.status) {
              commit("setRefundList", response.data.data);
              commit("setRefundListTotal", response.data.totalRecord);
            }
          })
          .catch(function (error) {
            if (error.response) {
              return error.response.data;
            }
          });
      }
    },
    async getEventsList({ commit }, payload) {
      if (payload.pagination) {
        return await axios.get(`${process.env.VUE_APP_API_URL}api/v1/event?pagination=true&start_date=${payload.startDate}&end_date=${payload.endDate}&canteen=${payload.canteenValue}&machine=${payload.machineValue}`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        }).then(function (response) {
          if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
            window.location.href = '/login'
          }
          if (response.status) {
            commit("setEventList", response.data.data);
            commit("setEventListTotal", response.data.totalRecord);
          }
        }).catch(function (error) {
            console.log('error',error);
            if (error.response) {
              return error.response.data;
            }
          });
      } else {
        console.log('getEventsList else');
        console.log(`${process.env.VUE_APP_API_URL}api/v1/event?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}&start_date=${payload.startDate}&end_date=${payload.endDate}&canteen=${payload.canteenValue}&machine=${payload.machineValue}`);
        return await axios.get(`${process.env.VUE_APP_API_URL}api/v1/event?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}&start_date=${payload.startDate}&end_date=${payload.endDate}&canteen=${payload.canteenValue}&machine=${payload.machineValue}`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        }).then(function (response) {
          if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
            window.location.href = '/login'
          }
          console.log('event responese', response);
          if (response.status) {
            commit("setEventList", response.data.data);
            commit("setEventListTotal", response.data.totalRecord);
          }
        }).catch(function (error) {
            console.log('error',error);
            if (error.response) {
              return error.response.data;
            }
        });
      }
    },
    async getAllPriority({ commit }, payload) {

      return await axios.get(`${process.env.VUE_APP_API_URL}api/v1/priority?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true`, {
        headers: { Authorization: `Bearer ${JwtService.getToken()}` },
      }).then(function (response) {
        if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
          window.location.href = '/login'
        }
        if (response.status) {
          commit("setpriorityList", response.data.allPages);
          commit("setpriorityListTotal", response.data.totalRecord);
        }
      })
        .catch(function (error) {
          if (error.response) {
            return error.response.data;
          }
        });

    },
    async addPriority({ commit }, payload) {
      return await axios
        .post(`${process.env.VUE_APP_API_URL}api/v1/priority`, payload, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          if (error.response) {
            return error.response.data;
          }
        });
    },
    async editPriority({ commit }, payload) {
      return await axios
        .put(
          `${process.env.VUE_APP_API_URL}api/v1/priority/${payload._id}`,
          {
            title: payload.title,
            priority: payload.priority,
            status: payload.status,
          },
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data;
          }
        });
    },

    async removePriority({ commit }, payload) {
      return await axios
        .delete(`${process.env.VUE_APP_API_URL}api/v1/priority/${payload}`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data;
          }
        });
    },
    async getLogList({ commit }, payload) {
      if (payload.pagination) {
        return await axios.get(`${process.env.VUE_APP_API_URL}api/v1/logs?pagination=true`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        }).then(function (response) {
          if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
            window.location.href = '/login'
          }
          if (response.status) {
            commit("setLogList", response.data.data);
            commit("setLogListTotal", response.data.totalRecord);
          }
        })
          .catch(function (error) {
            if (error.response) {
              return error.response.data;
            }
          });
      } else {
        return await axios.get(`${process.env.VUE_APP_API_URL}api/v1/logs?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        }).then(function (response) {
          if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
            window.location.href = '/login'
          }
          if (response.status) {
            commit("setLogList", response.data.data);
            commit("setLogListTotal", response.data.totalRecord);
          }
        })
          .catch(function (error) {
            if (error.response) {
              return error.response.data;
            }
          });
      }
    },
    setOrder({ commit }, payload) {
      commit("setSingleOrder", payload);
    },
    getOrderById({ commit }, data) {
      commit("setSingleOrder", data);
    },

    async addOrder({ commit }, payload) {
      // return await apiCall("post", "api/Order/AddOrder", JSON.stringify(payload), '')

      await axios
        .post(
          `${process.env.VUE_APP_API_URL}api/Order/AddOrder`,
          payload,

          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then(function (response) {
          if (response.status) {
            commit("setOrder", payload.data.data);
          }
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data;
          }
        });
    },
    async addrefund({ commit }, payload) {
      var errorResponse;
      await axios
        .post(`${process.env.VUE_APP_API_URL}api/v1/order/refund`, payload, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          errorResponse = error.response.data;
        });
      return errorResponse;
    },

    async updateOrder({ commit }, payload) {
      return await axios
        .put(`${process.env.VUE_APP_API_URL}api/Order/UpdateOrder`, payload, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then(function (response) { })
        .catch(function (error) {
          if (error.response) {
            return error.response.data;
          }
        });
    },

    async removeOrder({ commit }, orderId) {
      return await axios
        .post(
          `https://localhost:44341/api/Order/RemoveOrder?Id=${orderId}`,
          {},
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then(function (response) { })
        .catch(function (error) {
          if (error.response) {
            return error.response.data;
          }
        });
    },

    resetOrderState({ commit }) {
      commit("setSingleOrder", null);
    },
  },
  mutations: {
    setOrder(state, payload) {
      state.order.unshift(payload);
    },
    setOrderList(state, payload) {
      state.order = payload;
    },
    setOrderListTotal(state, payload) {
      state.orderTotal = payload;
    },
    setRefundList(state, payload) {
      state.refund = payload;
    },
    setRefundListTotal(state, payload) {
      state.refundTotal = payload;
    },
    setEventList(state, payload) {
      state.event = payload;
    },
    setpriorityList(state, payload) {
      state.priority = payload;
    },
    setLogList(state, payload) {
      state.logList = payload
    },
    setLogListTotal(state, payload) {
      state.logListTotal = payload
    },
    setEventListTotal(state, payload) {
      state.eventTotal = payload;
    },
    setpriorityListTotal(state, payload) {
      state.priorityTotal = payload;
    },
    setSingleOrder(state, payload) {
      state.singleOrder = payload;
    },
  },
};
