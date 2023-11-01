import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate';
import users from "./user";
import account from "./account"; 
import order from "./order"; 
import role from "./role";
import canteen from "./canteen";
import machine from "./machine";
import product from "./product";
import category from "./category";
import inventory from "./inventory";
import promotion from "./promotion";
import discount from "./discount";
import rolePermission from "./rolePermission";
import banner from "./banner";
import cms from "./cms";
import waste from './waste' 
import reports from './reports' 
import dashboard from './dashboard'


Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    dashboard,
    users,
    account, 
    order, 
    role,
    canteen,
    machine,
    product,
    category,
    inventory,
    rolePermission, 
    banner,
    promotion,
    discount,
    cms,
    waste,
    reports
  },
  plugins: [createPersistedState("account")],
});
