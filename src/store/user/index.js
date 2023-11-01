import JwtService from "../jwt";
const axios = require("axios");

export default {
  state: {
    users: [],
    usersTotal: 0,
    foodSupplier: [],
    canteenAdmin: [],
    machineFiller: [],
    roles: [],
    whitelist: [],
    permissions: [],
    singleUser: null,
    singleRole: null,
    totalRecordWhiteList: 0,
    singlePermission: null,
    companyList: null,
    companyListTotal: null,
    gdprFullName: '',
    gdprEmail: '',
    gdprAcceptance: false
  },
  getters: {
    getCompanyList(state) {
      return state.companyList;
    },
    getCompanyListTotal(state) {
      return state.companyListTotal;
    },
    getuserList(state) {
      return state.users;
    },
    getuserListTotal(state) {
      return state.usersTotal;
    },
    getwhiteList(state) {
      return state.whitelist;
    },
    getfoodSupplierList(state) {
      return state.foodSupplier;
    },
    getmachinefillerList(state) {
      return state.machineFiller;
    },
    getcanteenAdminList(state) {
      return state.canteenAdmin;
    },
    gettotalRecordWhiteList(state) {
      return state.totalRecordWhiteList;
    },
    getroleList(state) {
      return state.roles;
    },
    getroleListTotal(state) {
      return state.rolesTotal;
    },
    getActiveroleList(state) {
      return state.roles.filter((x) => {
        return x.role_status == "Active";
      });
    },
    permissionList(state) {
      return state.permissions;
    },
    getUserById(state) {
      return state.singleUser;
    },
    getRoleById(state) {
      return state.singleRole;
    },
    getPermissionById(state) {
      return state.singlePermission;
    },
    getGdprFullName(state) {
      return state.gdprFullName;
    },
    getGdprEmail(state) {
      return state.gdprEmail;
    }
  },
  actions: {
    async bulkwhiteuser({ commit }, payload) {
      return await axios
        .post(
          `${process.env.VUE_APP_API_URL}api/v1/white_list/bulk_user`,
          payload,
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {
          return response;
        })
        .catch((error) => {
          if (error.response) {
            return error.response.data;
          }
        });
    },
    async bulkUser({ commit }, payload) {
      return await axios
        .post(`${process.env.VUE_APP_API_URL}api/v1/users/bulk`, payload, {
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
    async getCompanyList({ commit }, payload) {
      if (payload.pagination) {
        return await axios
          .get(
            `${process.env.VUE_APP_API_URL}api/v1/users/company_admin?pagination=false`,
            {
              headers: { Authorization: `Bearer ${JwtService.getToken()}` },
            }
          )
          .then(function (response) {
            if (
              response.data.message == "jwt malformed" ||
              response.data.message == "jwt expired"
            ) {
              window.location.href = "/login";
            }
            if (response.status) {
              commit("setCompanyList", response.data.data);
              commit("setCompanyListTotal", response.data.data.length);
            }
            return response.data.data;
          })
          .catch(function (error) {
            commit("setCompanyList", null);
            if (error.response) {
              return error.response.data;
            }
          });
      } else {
        return await axios
          .get(
            `${process.env.VUE_APP_API_URL}api/v1/users/company_admin?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}`,
            {
              headers: { Authorization: `Bearer ${JwtService.getToken()}` },
            }
          )
          .then(function (response) {
            if (
              response.data.message == "jwt malformed" ||
              response.data.message == "jwt expired"
            ) {
              window.location.href = "/login";
            }
            if (response.data.success) {
              commit("setCompanyList", response.data.data);
              commit("setCompanyListTotal", response.data.data.length);
            }
          })
          .catch(function (error) {
            commit("setCompanyList", null);
            if (error.response) {
              return error.response.data;
            }
          });
      }
    },
    async getUserList({ commit }, payload) {
      if (payload.pagination) {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/users?pagination=false`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then(function (response) {
            if (
              response.data.message == "jwt malformed" ||
              response.data.message == "jwt expired"
            ) {
              window.location.href = "/login";
            }
            if (response.status) {
              commit("setUserList", response.data.allUser);
              commit("setUserListTotal", response.data.totalRecord);
            }
            return response.data.allUser;
          })
          .catch(function (error) {
            commit("setUserList", null);
            if (error.response) {
              return error.response.data;
            }
          });
      } else {
        return await axios
          .get(
            `${process.env.VUE_APP_API_URL}api/v1/users?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}&user_role=${payload.user_role}`,
            {
              headers: { Authorization: `Bearer ${JwtService.getToken()}` },
            }
          )
          .then(function (response) {
            if (
              response.data.message == "jwt malformed" ||
              response.data.message == "jwt expired"
            ) {
              window.location.href = "/login";
            }
            if (response.data.success) {
              commit("setUserList", response.data.allUser);
              commit("setUserListTotal", response.data.totalRecord);
            }
          })
          .catch(function (error) {
            commit("setUserList", null);
            if (error.response) {
              return error.response.data;
            }
          });
      }
    },

    async getWhiteListUserList({ commit }, payload) {
      if (payload.pagination) {
        return await axios
          .get(
            `${process.env.VUE_APP_API_URL}api/v1/white_list?pagination=false`,
            {
              headers: { Authorization: `Bearer ${JwtService.getToken()}` },
            }
          )
          .then(function (response) {
            if (
              response.data.message == "jwt malformed" ||
              response.data.message == "jwt expired"
            ) {
              window.location.href = "/login";
            }
            if (response.data.success) {
              commit("setwhiteUserList", response.data.data);
              commit("setwhiteUserTotal", response.data.totalRecord);
            }
            return response.data.data;
          })
          .catch(function (error) {
            commit("setwhiteUserList", null);
            if (error.response) {
              return error.response.data;
            }
          });
      } else {
        return await axios
          .get(
            `${process.env.VUE_APP_API_URL}api/v1/white_list?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}&company_id=${payload.company_id}&canteen_id=${payload.canteen_id}`,
            {
              headers: { Authorization: `Bearer ${JwtService.getToken()}` },
            }
          )
          .then(function (response) {
            if (
              response.data.message == "jwt malformed" ||
              response.data.message == "jwt expired"
            ) {
              window.location.href = "/login";
            }
            if (response.data.success) {
              commit("setwhiteUserList", response.data.data);
              commit("setwhiteUserTotal", response.data.totalRecord);
            }
            return response.data.data;
          })
          .catch(function (error) {
            commit("setwhiteUserList", null);
            if (error.response) {
              return error.response.data;
            }
          });
      }
    },
    async getmachineFillerList({ commit }) {
      return await axios
        .get(`${process.env.VUE_APP_API_URL}api/v1/users/machine_filler`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then(function (response) {
          if (
            response.data.message == "jwt malformed" ||
            response.data.message == "jwt expired"
          ) {
            window.location.href = "/login";
          }
          if (response.data.success) {
            commit("setmachineFiller", response.data.data);
          }
          return response.data.data;
        })
        .catch(function (error) {
          commit("setmachineFiller", null);
          if (error.response) {
            return error.response.data;
          }
        });
    },
    async getRoleList({ commit }, payload) {
      if (payload.pagination) {
        return await axios
          .get(
            `${process.env.VUE_APP_API_URL}api/v1/role_permissions?pagination=false`,
            {
              headers: { Authorization: `Bearer ${JwtService.getToken()}` },
            }
          )
          .then(function (response) {
            if (
              response.data.message == "jwt malformed" ||
              response.data.message == "jwt expired"
            ) {
              window.location.href = "/login";
            }
            if (response.data.success) {
              commit("setRoleList", response.data.Data);
              commit("setRoleListTotal", response.data.totalRecord);
            }
            return response.data.Data;
          })
          .catch(function (error) {
            if (error.response) {
              return error.response.data;
            }
          });
      } else {
        return await axios
          .get(
            `${process.env.VUE_APP_API_URL}api/v1/role_permissions?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}`,
            {
              headers: { Authorization: `Bearer ${JwtService.getToken()}` },
            }
          )
          .then(function (response) {
            if (
              response.data.message == "jwt malformed" ||
              response.data.message == "jwt expired"
            ) {
              window.location.href = "/login";
            }
            if (response.data.success) {
              commit("setRoleList", response.data.Data);
              commit("setRoleListTotal", response.data.totalRecord);
            }
            return response.data;
          })
          .catch(function (error) {
            if (error.response) {
              return error.response.data;
            }
          });
      }
    },
    async getPermissionList({ commit }) {
      return await axios
        .post(
          `${process.env.VUE_APP_API_URL}api/v1/permissions/`,
          {},
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then(async (response) => {
          if (response.data.success) {
            commit("setPermissionList", response.data.permissions.permissions);
          } else if (!response.data.success) {
            await axios
              .get(`${process.env.VUE_APP_API_URL}api/v1/permissions/`, {
                headers: { Authorization: `Bearer ${JwtService.getToken()}` },
              })
              .then(function (response) {
                if (
                  response.data.message == "jwt malformed" ||
                  response.data.message == "jwt expired"
                ) {
                  window.location.href = "/login";
                }
                if (response.data.success) {
                  commit(
                    "setPermissionList",
                    response.data.Data[0].permissions
                  );
                }
              })
              .catch(function (error) {
                if (error.response) {
                  return error.response.data;
                }
              });
          }
          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data;
          }
        });
    },

    async getUserById({ commit }, data) {
      commit("setSingleUser", data);
    },
    async getRoleById({ commit }, data) {
      commit("setSingleRole", data);
    },
    async getPermissionById({ commit }, data) {
      commit("setSinglePermission", data);
    },

    async addUser({ commit }, payload) {
      return await axios
        .post(`${process.env.VUE_APP_API_URL}api/v1/users/`, payload, {
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
    async addWhiteUser({ commit }, payload) {
      return await axios
        .post(`${process.env.VUE_APP_API_URL}api/v1/white_list/`, payload, {
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
    async addRole({ commit }, payload) {
      return await axios
        .post(
          `${process.env.VUE_APP_API_URL}api/v1/role_permissions`,
          payload,
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
    async addPermission({ commit }, payload) {
      return await axios
        .post(`${process.env.VUE_APP_API_URL}api/v1/permissions/`, payload, {
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

    async updateUser({ commit }, payload) {
      return await axios
        .put(
          `${process.env.VUE_APP_API_URL}api/v1/users/${payload._id}`,
          {
            user_name: payload.user_name,
            user_role_id: payload.user_role_id,
            user_phone: payload.user_phone,
            user_status: payload.user_status,
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
    async updateWhiteUser({ commit }, payload) {
      return await axios
        .put(
          `${process.env.VUE_APP_API_URL}api/v1/white_list/user_id/${payload._id}`,
          {
            user_name: payload.user_name,
            user_canteen_id: payload.user_canteen_id,
            user_phone: payload.user_phone,
            user_status: payload.user_status,
            company_id: payload.company_id

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
    async updateRole({ commit }, payload) {
      return await axios
        .patch(
          `${process.env.VUE_APP_API_URL}api/v1/role_permissions/${payload._id}`,
          {
            role_name: payload.role_name,
            role_status: payload.role_permission_status,
            permission_name: payload.permission_name,
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
    async updatePermission({ commit }, payload) {
      return await axios
        .put(
          `${process.env.VUE_APP_API_URL}api/v1/permissions/${payload._id}`,
          {
            permission_name: payload.permission_name,
            permission_status: payload.permission_status,
          },
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then(function (response) {
          return response.Data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data;
          }
        });
    },
    async removeUser({ commit }, userId) {
      return await axios
        .delete(`${process.env.VUE_APP_API_URL}api/v1/users/${userId}`, {
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
    async removeRole({ commit }, userId) {
      return await axios
        .delete(
          `${process.env.VUE_APP_API_URL}api/v1/role_permissions/${userId}`,
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
    async removePermission({ commit }, userId) {
      return await axios
        .delete(`${process.env.VUE_APP_API_URL}api/v1/permissions/${userId}`, {
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
    resetUserState({ commit }) {
      commit("setSingleUser", null);
    },
    resetRoleState({ commit }) {
      commit("setSingleRole", null);
    },
    resetPermissionState({ commit }) {
      commit("setSinglePermission", null);
    },
    async removeProductFromChannel({ commit }, data) {
      return await axios.delete(`${process.env.VUE_APP_API_URL}api/v1/channel/remove-product/${data.channel_id}`, {
        headers: { Authorization: `Bearer ${JwtService.getToken()}`},
      })
      .then(function(response) {
        return response.data;
      })
      .catch(function(error){
        if(error.response) {
          return error.response.data;
        }
      });
    },
    async getUserDetailsById({ commit, dispatch }, data) {
      return await axios
        .get(`${process.env.VUE_APP_API_URL}api/v1/users/get-user-details-by-id/${data.userId}/${data.gdprToken}`,
        {
          headers: {
            Authorization: `Bearer ${JwtService.getToken()}`,
          },
        })
        .then((response) => {
          if (response.data.success) {
            const fullName = response.data.data.fullName;
            const email = response.data.data.email;
            commit("setGdprFullName", fullName);
            commit("setGdprEmail", email);
          }
          return response.data;
        })
        .catch((error) => {
        });
    },
    async gdprAcceptance({ commit }, data) {
      return await axios
        .post(
          `${process.env.VUE_APP_API_URL}api/v1/users/gdpr-acceptance`,
          data 
        )
        .then((response) => {
          commit("setGdprAcceptance", response.data);
          return response.data;
        })
        .catch(function (error) {
        });
    },
    async sendGDPREmail({ commit }, data) {
      return await axios
        .post(
          `${process.env.VUE_APP_API_URL}api/v1/users/send-gdpr-email`,
          data 
        );
    },

  },
  mutations: {
    setUsers(state, payload) {
      state.user.unshift(payload);
    },
    setmachineFiller(state, payload) {
      state.machineFiller = payload;
    },
    setCompanyList(state, payload) {
      state.companyList = payload;
    },
    setCompanyListTotal(state, payload) {
      state.companyListTotal = payload;
    },
    setUserList(state, payload) {
      state.users = payload;

      if (payload) {
        state.foodSupplier = payload.filter((x) => {
          return x.user_role == "food_supplier" && x.user_status == "Active";
        });
        state.canteenAdmin = payload.filter((x) => {
          return x.user_role == "canteen_admin" && x.user_status == "Active";
        });
      } else {
        state.foodSupplier = [];
        state.canteenAdmin = [];
      }
    },
    setUserListTotal(state, payload) {
      state.usersTotal = payload;
    },
    setwhiteUserList(state, payload) {
      state.whitelist = payload;
    },
    setwhiteUserTotal(state, payload) {
      state.totalRecordWhiteList = payload;
    },
    setRoleList(state, payload) {
      state.roles = payload;
    },
    setRoleListTotal(state, payload) {
      state.rolesTotal = payload;
    },
    setPermissionList(state, payload) {
      state.permissions = payload;
    },
    setSingleUser(state, payload) {
      state.singleUser = payload;
    },
    setSingleRole(state, payload) {
      state.singleRole = payload;
    },
    setSinglePermission(state, payload) {
      state.permissions = payload;
    },
    setGdprFullName(state) {
      state.gdprFullName = state.fullName;
    },
    setGdprEmail(state) {
      state.gdprEmail = state.email;
    },
    setGdprAcceptance(state) {
      state.gdprAcceptance = true;
    }
  },
};
