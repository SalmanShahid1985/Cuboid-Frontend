import JwtService from "../jwt";
const axios = require("axios");

export default {
  state: {
    downtime: null,
    transactionLog: null,
    canteenName: null,
    canteenLocation: null,
    machineName: null,
    inventoryReport: null,
    salesOverview: null,
    machineSearchList: null,
    summarysalesReport: null,
    summaryreportsReport: null,
    totalSalesOverview: null,
    productsales: null,
    companiesSearchList: null,
    canteensSearchList: null,
    productCategoriesSearchList: null,
    wastageReport: null,
    salesReportV2: null

  },
  getters: {
    getdowntime(state) {
      return state.downtime;
    },
    gettransactionLog(state) {
      return state.transactionLog;
    },
    getcanteenName(state) {
      return state.canteenName;
    },
    getcanteenLocation(state) {
      return state.canteenLocation;
    },
    getmachineName(state) {
      return state.machineName;
    },
    getInventoryReport(state) {
      return state.inventoryReport;
    },
    getSalesOverview(state) {
      return state.salesOverview;
    },
    getMachineSearchList(state) {
      return state.machineSearchList;
    },
    getsummarysalesReport(state) {
      return state.summarysalesReport;
    },
    getsummaryreportsReport(state) {
      return state.summaryreportsReport;
    },
    gettotalSalesOverview(state) {
      return state.totalSalesOverview;
    },
    getproductsales(state) {
      return state.productsales;
    },
    getCompaniesSearchList(state) {
      return state.companiesSearchList;
    },
    getCanteensSearchList(state) {
      return state.canteensSearchList;
    },
    getProductCategoriesSearchList(state) {
      return state.productCategoriesSearchList;
    },
    getWastageReport(state) {
      return state.wastageReport;
    },
    getSalesReportV2(state) {
      return state.salesReportV2;
    }
   
  },

  actions: {
    downtimeList({ commit }, payload) {
      return axios
        .get(
          `${process.env.VUE_APP_API_URL}api/v1/reports/downtimes?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=${payload.pagination}&from=${payload.from}&to=${payload.to}&location=${payload.location}&machine=${payload.machine}&transaction_type=${payload.transaction_type}&vat=${payload.vat}"`,
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {
          if (response.data.message == "jwt malformed" || response.data.message == 'jwt expired') {
            window.location.href = "/login";
          }
          if (response.data.success) {
            commit("setdownTime", response.data);
            return response.data;
          }
        })
        .catch(function (error) {
          commit("setdownTime", null);
        });
    },
    productsales({ commit }, payload) {
      return axios
        .get(
          `${process.env.VUE_APP_API_URL}api/v1/reports/product-sales?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&from=${payload.from}&to=${payload.to}&location=${payload.location}&machine=${payload.machine}&product=${payload.product}`,
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {
          if (response.data.message == "jwt malformed" || response.data.message == 'jwt expired') {
            window.location.href = "/login";
          }
          if (response.data.success) {
            commit("setproductsales", response.data);
            return response.data;
          }
        })
        .catch(function (error) {
          commit("setproductsales", null);
        });
    },
    summarySalesList({ commit }, payload) {
      return axios
        .get(
          `${process.env.VUE_APP_API_URL}api/v1/reports/sales-reports?product=${payload.product}&machine=${payload.machine}&from=${payload.from}&to=${payload.to}&location=${payload.location}`,
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {
          if (response.data.message == "jwt malformed" || response.data.message == 'jwt expired') {
            window.location.href = "/login";
          }
          if (response.data.success) {
            commit("setsummarysalesreport", response.data);
            return response.data;
          }
        })
        .catch(function (error) {
          commit("setdownTime", null);
        });
    },
    summaryReportList({ commit }, payload) {
      return axios
        .get(
          `${process.env.VUE_APP_API_URL}api/v1/reports/sales-reports-Machine?machine=${payload.machine}&product=${payload.product}&to=${payload.to}&location=${payload.location}&resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&from=${payload.from}`,
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {
          if (response.data.message == "jwt malformed" || response.data.message == 'jwt expired') {
            window.location.href = "/login";
          }
          if (response.data.success) {
            commit("setsummaryreportsreport", response.data);
            return response.data;
          }
        })
        .catch(function (error) {
          commit("setdownTime", null);
        });
    },
    machineSearchList({ commit }) {
      return axios
        .get(`${process.env.VUE_APP_API_URL}api/v1/reports/list-machines`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then((response) => {
          if (response.data.message == "jwt malformed" || response.data.message == 'jwt expired') {
            window.location.href = "/login";
          }
          if (response.data.success) {
            commit("setMachineSearchList", response.data);
            return response.data;
          }
        })
        .catch(function (error) {
          commit("setMachineSearchList", null);
        });
    },
    inventoryReportList({ commit }, payload) {
      return axios
        .get(
          `${process.env.VUE_APP_API_URL}api/v1/reports/inventory-reports?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&machine=${payload.machineValue}&product=${payload.productValue}&locations=${payload.locations}&category=${payload.categoryValue}&company=${payload.companyValue}&canteen=${payload.canteenValue}&start_date=${payload.startDate}&end_date=${payload.endDate}`,
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {
          if (response.data.success == "jwt malformed" || response.data.message == 'jwt expired') {
            window.location.href = "/login";
          }
          if (response.data.success) {
            commit("setInventoryReport", response.data);
            return response.data;
          }
        })
        .catch(function (error) {
          commit("setInventoryReport", null);
        });
    },
    salesOverviewList({ commit }, payload) {
      return axios
        .get(
          `${process.env.VUE_APP_API_URL}api/v1/reports/monthly-machine-report?date=${payload.dateFilter}&machine=${payload.machineFilter}&location=${payload.locationFilter}&currentPage=${payload.currentPage}&resultPerPage=${payload.resultPerPage}&company=${payload.companyFilter}&payment_method=${payload.paymentMethodFilter}`,
          { headers: { Authorization: `Bearer ${JwtService.getToken()}` } }
        )
        .then((response) => {
          if (response.data.message == "jwt malformed" || response.data.message == 'jwt expired') {
            window.location.href = "./login";
          }
          if (response.data.success) {
            commit("setSalesOverview", response.data);
            return response.data;
          }
        })
        .catch(function (error) {
          commit("setSalesOverview", null);
        });
    },
    salesOverviewTotalList({ commit }, payload) {
      return  axios
        .get(
          `${process.env.VUE_APP_API_URL}api/v1/reports/monthly-report?date=${payload.dateFilter}&locations=${payload.locationFilter}&company=${payload.companyFilter}&payment_method=${payload.paymentMethodFilter}`,
          { headers: { Authorization: `Bearer ${JwtService.getToken()}` } }
        )
        .then((response) => {
          if (response.data.message == "jwt malformed" || response.data.message == 'jwt expired') {
            window.location.href = "./login";
          }
          if (response.data.success) {
            console.log('sales report', response.data);
            commit("setTotalSalesOverview", response.data);
            return response.data;
          }
        })
        .catch(function (error) {
          commit("setTotalSalesOverview", null);
        });

    },
    transactionLogList({ commit }, payload) {
      return axios
        .get(
          `${process.env.VUE_APP_API_URL}api/v1/reports/transaction-log?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=${payload.pagination}&payment_method=${payload.payment_method}&canteen_name=${payload.canteen_name}&from=${payload.from}&to=${payload.to}&location=${payload.location}&machine=${payload.machine_name}&sort=${payload.sort}&vat=${payload.vat}`,
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {
          if (response.data.message == "jwt malformed" || response.data.message == 'jwt expired') {
            window.location.href = "/login";
          }
          if (response.data.success) {
            commit("settransaction", response.data);
            return response.data;
          }
        })
        .catch(function (error) {
          commit("settransaction", null);
        });
    },
    canteenNameList({ commit }, payload) {
      return axios
        .get(`${process.env.VUE_APP_API_URL}api/v1/reports/list-canteen-names`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then((response) => {
          if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
            window.location.href = '/login'
          }
          if (response.data.success) {
            commit("setcanteenNames", response.data);
            return response.data
          }
        })
        .catch(function (error) {
          commit("setcanteenNames", null);
        });
    },
    canteenLocationsList({ commit }, payload) {
      return axios
        .get(`${process.env.VUE_APP_API_URL}api/v1/reports/list-canteen-locations`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then((response) => {
          if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
            window.location.href = '/login'
          }
          if (response.data.success) {
            commit("setcanteenLocations", response.data);
            return response.data
          }
        })
        .catch(function (error) {
          commit("setcanteenLocations", null);
        });
    },
    machineNameList({ commit }, payload) {
      return axios
        .get(`${process.env.VUE_APP_API_URL}api/v1/reports/list-canteen-locations`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then((response) => {
          if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
            window.location.href = '/login'
          }
          if (response.data.success) {
            commit("setmachineName", response.data);
            return response.data
          }
        })
        .catch(function (error) {
          commit("setmachineName", null);
        });
    },
    companiesSearchList({ commit }) {
      return axios
        .get(`${process.env.VUE_APP_API_URL}api/v1/reports/list-companies`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then((response) => {
          if (response.data.message == "jwt malformed" || response.data.message == 'jwt expired') {
            window.location.href = "/login";
          }
          if (response.data.success) {
            commit("setCompaniesSearchList", response.data);
            return response.data;
          }
        })
        .catch(function (error) {
          commit("setCompaniesSearchList", null);
        });
    }, 
    canteensSearchList({ commit }) {
      return axios
        .get(`${process.env.VUE_APP_API_URL}api/v1/reports/list-canteen-names`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then((response) => {
          if (response.data.message == "jwt malformed" || response.data.message == 'jwt expired') {
            window.location.href = "/login";
          }
          if (response.data.success) {
            commit("setCanteensSearchList", response.data);
            return response.data;
          }
        })
        .catch(function (error) {
          commit("setCanteensSearchList", null);
        });
    },
    productCategoriesSearchList({ commit }) {
      return axios
        .get(`${process.env.VUE_APP_API_URL}api/v1/reports/list-product-categories`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then((response) => {
          if (response.data.message == "jwt malformed" || response.data.message == 'jwt expired') {
            window.location.href = "/login";
          }
          if (response.data.success) {
            commit("setProductCategoriesSearchList", response.data);
            return response.data;
          }
        })
        .catch(function (error) {
          commit("setProductCategoriesSearchList", null);
        });
    },
    wasteManagementReportList({ commit }, payload) {
      console.log('payload', payload);
      return axios
        .get(
          `${process.env.VUE_APP_API_URL}api/v1/reports/wastage-reports?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&company=${payload.companyValue}&canteen=${payload.canteenValue}&machine=${payload.machineValue}&product_category=${payload.productCategoryValue}&product=${payload.productValue}&start_date=${payload.startDate}&end_date=${payload.endDate}`,
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {
          if (response.data.success == "jwt malformed" || response.data.message == 'jwt expired') {
            window.location.href = "/login";
          }
          if (response.data.success) {
            console.log('response',response.data);
            commit("setWastageReport", response.data);
            return response.data;
          }
        })
        .catch(function (error) {
          commit("setWastageReport", null);
        });
    },
    salesReportListV2({ commit }, payload) {
      let queryParam = Object.keys(payload).map(x => x + '=' + payload[x]).join('&')
      return axios
      .get(
        `${process.env.VUE_APP_API_URL}api/v1/reports/sales-report-v2?${queryParam}`,
        {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        }
      )
      .then((response) => {
        if (response.data.message == "jwt malformed" || response.data.message == 'jwt expired') {
          window.location.href = "/login";
        }
        if (response.data.success) {
          commit("setSalesReportV2", response.data);
          return response.data;
        }
      })
      .catch(function (error) {
        commit("setSalesReportV2", null);
      });
    }

  },
  mutations: {
    setdownTime(state, payload) {
      state.downtime = payload;
    },
    setMachineSearchList(state, payload) {
      state.machineSearchList = payload;
    },
    settransaction(state, payload) {
      state.transactionLog = payload;
    },
    setSalesOverview(state, payload) {
      state.salesOverview = payload;
    },
    setcanteenNames(state, payload) {
      state.canteenName = payload;
    },
    setcanteenLocations(state, payload) {
      state.canteenLocation = payload;
    },
    setmachineName(state, payload) {
      state.machineName = payload;
    },
    setInventoryReport(state, payload) {
      state.inventoryReport = payload;
    },
    setsummarysalesreport(state, payload) {
      state.summarysalesReport = payload;
    },
    setsummaryreportsreport(state, payload) {
      state.summaryreportsReport = payload;
    },
    setTotalSalesOverview(state, payload) {
      state.totalSalesOverview = payload;
    },
    setproductsales(state, payload) {
      state.productsales = payload;
    },
    setCompaniesSearchList(state, payload) {
      state.companiesSearchList = payload;
    },
    setCanteensSearchList(state, payload) {
      state.canteensSearchList = payload;
    },
    setProductCategoriesSearchList(state, payload) {
      state.productCategoriesSearchList = payload;
    },
    setWastageReport(state, payload) {
      state.wastageReport = payload;
    },
    setSalesReportV2(state, payload) {
      state.salesReportV2 = payload;
    }
  },
};
