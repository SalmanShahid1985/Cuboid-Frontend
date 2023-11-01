import JwtService from "../jwt";
const axios = require("axios");


export default {
    state: {
        saleRevenue: null,
        saleDashboard: null,
        topProduct: null,
        topmachine: null,
        topevent: null,
    },
    getters: {
        getsalerevenue(state) {
            return state.saleRevenue;
        },
        getsaledashboard(state) {
            return state.saleDashboard;
        },
        gettopproduct(state) {
            return state.topProduct;
        },
        gettopmachine(state) {
            return state.topmachine;
        },
        gettopevent(state) {
            return state.topevent;
        }
    },
    actions: {
        async SaleRevenue({ commit }, payload) {
            return await axios
                .get(`${process.env.VUE_APP_API_URL}api/v1/reports/total-sale-revenue?month=${payload.salemonth}`,
                    {
                        headers: { Authorization: `Bearer ${JwtService.getToken()}` },
                    }
                ).then((response) => {
                    if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
                        window.location.href = '/login'
                    }
                    if (response.data.success) {
                        commit("setSaleRevenue", response.data);
                        return response.data;
                    }
                })
                .catch(function (error) {
                    commit("setSaleRevenue", null);
                })

        },
        async SaleDashboard({ commit }, payload) {
            return await axios
                .get(`${process.env.VUE_APP_API_URL}api/v1/reports/sales-dashboard?month=${payload.month}`,
                    {
                        headers: { Authorization: `Bearer ${JwtService.getToken()}` },
                    }
                ).then((response) => {
                    if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
                        window.location.href = '/login'
                    }
                    if (response.data.success) {
                        commit("setSaleDashboard", response.data);
                        return response.data;
                    }
                })
                .catch(function (error) {
                    commit("setSaleDashboard", null);
                })

        },
        async TopProducts({ commit }, payload) {
            return await axios
                .get(`${process.env.VUE_APP_API_URL}api/v1/reports/top-products?month=${payload.Tproduct}`,
                    {
                        headers: { Authorization: `Bearer ${JwtService.getToken()}` },
                    }
                ).then((response) => {
                    if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
                        window.location.href = '/login'
                    }
                    if (response.data.success) {
                        commit("setTopProduct", response.data);
                        return response.data
                    }
                })
                .catch(function (error) {
                    commit("setTopProduct", null);
                })
        },
        async TopMachine({ commit }, payload) {
            return await axios
                .get(`${process.env.VUE_APP_API_URL}api/v1/reports/top-machines?month=${payload.Tmachine}`,
                    {
                        headers: { Authorization: `Bearer ${JwtService.getToken()}` },
                    }
                ).then((response) => {
                    if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
                        window.location.href = '/login'
                    }
                    if (response.data.success) {
                        commit("setTopMachine", response.data);
                        return response.data
                    }
                })
                .catch(function (error) {
                    commit("setTopMachine", null);
                })
        },
        async TopEvents({ commit }, payload) {
            return await axios
                .get(`${process.env.VUE_APP_API_URL}api/v1/reports/top-ten-events?month=${payload.Tevent}`,
                    {
                        headers: { Authorization: `Bearer ${JwtService.getToken()}` },
                    }
                ).then((response) => {
                    if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
                        window.location.href = '/login'
                    }
                    if (response.data.success) {
                        commit("setTopEvent", response.data);
                        return response.data
                    }
                })
                .catch(function (error) {
                    commit("setEvents", null);
                })
        },
    },
    mutations: {
        setSaleRevenue(state, payload) {
            state.saleRevenue = payload;
        },
        setSaleDashboard(state, payload) {
            state.saleDashboard = payload;
        },
        setTopProduct(state, payload) {
            state.topProduct = payload;
        },
        setTopMachine(state, payload) {
            state.topmachine = payload
        },
        setTopEvent(state, payload) {
            state.topevent = payload
        }
    }

}