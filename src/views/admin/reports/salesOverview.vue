<template>
  <div>
    <div class="d-flex justify-space-around align-center mb-2 mt-3">
      <v-card-text>
        <div class="pageHeadingIcon">
          <div class="pageName">
            <svg class="pageNameSvg userManagmentIcon">
              <use xlink:href="#report"></use>
            </svg>
          </div>
          <h2>Sales Overview</h2>
        </div>
      </v-card-text>

      <div class="d-flex pb-0">
        <v-btn
          class="mr-4"
          @click="showFilter = !showFilter"
          style="background-color: #ecf5f7"
          ><i class="mr-2"
            ><img
              src="../../../assets/logos/setting-icon.svg"
              style="margin-top: -4px; width: 18px; height: 18px"
            /> </i
          >{{ showFilter ? "Hide" : "Show" }} Filters</v-btn
        >
      </div>
    </div>
    <p class="disclaimer-container">
      *The total price is inclusive of all taxes (discount/promotions/subsidy
      may also have been included if applied).
    </p>
    <div class="col-12 d-flex">
      <div :class="showFilter ? 'col-md-9' : 'col-md-12'" class="p-0">
        <v-card class="mainCard pa-0 pb-0 pl-0 ml-0 m-3 mt-0">
          <v-card-header>
            <h6 class="pa-3 b-bottom cardHeading mb-0">
              <strong>Overview</strong>
            </h6>
          </v-card-header>
          <v-card-content>
            <line-chart
              v-if="!table_loader"
              style="min-height: 30vh"
              :lineData="gettotalSalesOverview"
              :dateFilter="dateFilter"
              :vatFilter="vat"
              :paymentMethodFilter="paymentMethodFilter"
            />
          </v-card-content>
        </v-card>
        <v-card
          style="overflow-x: hidden"
          class="mainCard pa-0 pl-0 ml-0 mt-0 m-3"
        >
          <v-card-header>
            <div class="d-flex justify-between">
              <h6 class="pa-3 b-bottom cardHeading mb-0">
                <strong>Data</strong>
              </h6>
              <div class="d-flex">
                <div
                  class="
                    d-flex
                    align-center
                    right-inner-addon
                    input-container
                    mt-2
                    mb-2
                    pb-0
                    mr-3
                  "
                >
                  <b-icon class="export-svg" icon="download"></b-icon>
                  <button
                    class="form-control login-field pl-40"
                    @click="exportExcelFile()"
                  >
                    Export Excel
                  </button>
                </div>
              </div>
            </div>
          </v-card-header>
          <v-card-content>
            <div class="py-7" v-if="table_loader">
              <v-progress-linear color="orange darken-1" indeterminate />
            </div>

            <div style="overflow-x: auto; width: 100%">
              <table width="100%" class="table sales machine-table mb-0">
                <thead class="tarnsactionHead2">
                  <tr class="overview_table table_row">
                    <th class="pl-3">Machine name</th>
                    <th
                      class="table-box p-0"
                      v-for="index in dateList"
                      :key="index"
                    >
                      {{ index }}
                    </th>
                    <th class="machine-total">Total</th>
                  </tr>
                </thead>
                <tbody v-if="!table_loader">
                  <tr
                    v-for="(itemData, indexData) in getSalesOverview.data"
                    :key="indexData"
                    class="overview_table table_row"
                  >
                    <td class="name pl-3">{{ itemData.machine }}</td>
                    <td class="table-box" v-for="dateIndex in dateList">
                      {{ checkDate(itemData.days, dateIndex) }}
                    </td>
                    <td class="text-box text-black">
                      <strong>{{ vat === 'with' ? itemData.totalwithVAT.toFixed(2): itemData.totalwithoutVAT.toFixed(2) }}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="mt-3 mb-3 text-center d-flex justify-center">
              <!-- Pagination For Tables -->
              <ul class="pagiNation notranslate px-5">
                <li
                  v-if="currentPage > 1"
                  @click="updateCurrentPage(currentPage - 1)"
                  class="pagiNation-item"
                >
                  <a class="page-link">
                    <svg class="svgIconLeft">
                      <use xlink:href="#leftIcon"></use>
                    </svg>
                  </a>
                </li>

                <li
                  v-if="
                    currentPage == getSalesOverview.totalPage && currentPage > 2
                  "
                  @click="updateCurrentPage(currentPage - 2)"
                  class="pagiNation-item"
                >
                  <span class="page-link"> {{ currentPage - 2 }}</span>
                </li>
                <li
                  v-if="currentPage > 1"
                  @click="updateCurrentPage(currentPage - 1)"
                  class="pagiNation-item"
                >
                  <span class="page-link"> {{ currentPage - 1 }}</span>
                </li>

                <li
                  @click="updateCurrentPage(currentPage)"
                  class="pagiNation-item"
                >
                  <span class="page-link activepage"> {{ currentPage }}</span>
                </li>
                <li
                  v-if="currentPage + 1 <= getSalesOverview.totalPage"
                  @click="updateCurrentPage(currentPage + 1)"
                  class="pagiNation-item"
                >
                  <span class="page-link"> {{ currentPage + 1 }}</span>
                </li>
                <li
                  v-if="currentPage == 1 && getSalesOverview.totalPage > 2"
                  @click="updateCurrentPage(currentPage + 2)"
                  class="pagiNation-item"
                >
                  <span class="page-link"> {{ currentPage + 2 }}</span>
                </li>

                <li
                  v-if="
                    currentPage != getSalesOverview.totalPage &&
                    getSalesOverview.totalPage != 0
                  "
                  @click="updateCurrentPage(currentPage + 1)"
                  class="pagiNation-item"
                >
                  <a class="page-link">
                    <svg class="svgIconNext">
                      <use xlink:href="#rightIcon"></use>
                    </svg>
                  </a>
                </li>
              </ul>

              <div class="right-inner-addon input-container pb-0 mr-3">
                <i style="padding: 13.5px 8px"
                  ><img
                    src="../../../assets/logos/bxs-down-arrow.svg"
                    height="6px"
                /></i>
                <select
                  class="form-control mt-2 p-2 pt-1 pb-1 pr-5"
                  v-model="resultPerPage"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="75">75</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div class="mt-4">
                <strong>
                  Total Record: {{ getSalesOverview.totalRecord }}
                </strong>
              </div>
            </div>
          </v-card-content>
        </v-card>
        <v-card
          style="overflow-x: auto"
          class="mainCard pa-0 pl-0 ml-0 mt-0 m-3"
        >
          <v-card-header>
            <h6 class="pa-3 b-bottom cardHeading mb-0">
              <strong>All Canteens</strong>
            </h6>
          </v-card-header>
          <v-card-content>
            <table class="orderModal salesTotal machine-table w-100">
              <thead class="tarnsactionHead2">
                <tr class="total_table">
                  <th class="table-box" v-for="index in dateList">
                    {{ index }}
                  </th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody v-if="!table_loader">
                <tr class="total_table">
                  <td
                    class="table-box"
                    v-for="dateIndex in dateList"
                    :key="dateIndex"
                  >
                    {{ checkDateTotal(gettotalSalesOverview.data, dateIndex) }}
                  </td>
                  <td class="text-black">
                    <strong>{{
                      gettotalSalesOverview.allTotalwithVAT.toFixed(2)
                    }}</strong>
                  </td>
                </tr>
              </tbody>
            </table>
          </v-card-content>
        </v-card>
      </div>
      <div v-show="showFilter" class="col-md-3 p-0">
        <v-card class="mainCard pa-0 pl-0 ml-0">
          <v-card-header>
            <h6 class="pa-3 b-bottom cardHeading mb-0">
              <strong>Filters</strong>
            </h6>
          </v-card-header>
          <v-card-content>
            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Month</label
            >
            <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
              <i style="padding: 8.2px 12px"
                ><img
                  src="../../../assets/logos/bxs-down-arrow.svg"
                  height="7px"
              /></i>
              <select
                class="form-control"
                style="padding: 0.375rem 0.5rem !important"
                v-model="dateFilter"
              >
                <option v-for="month in monthList">
                  {{ month }}, {{ new Date().getFullYear() }}
                </option>
              </select>
            </div>

            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Companies</label
            >
            <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
              <i style="padding: 8.2px 12px"
                ><img
                  src="../../../assets/logos/bxs-down-arrow.svg"
                  height="7px"
              /></i>
              <select
                v-model="companyFilter"
                class="form-control"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="all" selected="selected">All</option>
                <option v-for="(name, i) in companies" v-bind="i">
                  {{ name.companyName }}
                </option>
              </select>
            </div>
            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Machines</label
            >
            <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
              <i style="padding: 8.2px 12px"
                ><img
                  src="../../../assets/logos/bxs-down-arrow.svg"
                  height="7px"
              /></i>
              <select
                v-model="machineFilter"
                class="form-control"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="all" selected="selected">All</option>
                <option v-for="name in getMachineSearchList.machine_name">
                  {{ name }}
                </option>
              </select>
            </div>
            <label
              class="regularFont login-font filterLabels mb-0 m-2 mb-0"
              style=""
              >Locations</label
            >
            <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
              <i style="padding: 8.2px 12px"
                ><img
                  src="../../../assets/logos/bxs-down-arrow.svg"
                  height="7px"
              /></i>
              <select
                v-model="locationFilter"
                class="form-control"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="all" selected="selected">All</option>
                <option
                  v-for="location in getMachineSearchList.machine_location"
                >
                  {{ location }}
                </option>
              </select>
            </div>
            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >VAT</label
            >
            <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
              <i style="padding: 8.2px 12px"
                ><img
                  src="../../../assets/logos/bxs-down-arrow.svg"
                  height="7px"
              /></i>
              <select
                v-model="vat"
                class="form-control"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="with">With VAT</option>
                <option value="without">Without VAT</option>
              </select>
            </div>

            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Payment Method</label
            >
            <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
              <i style="padding: 8.2px 12px"
                ><img
                  src="../../../assets/logos/bxs-down-arrow.svg"
                  height="7px"
              /></i>
              <select
                v-model="paymentMethodFilter"
                class="form-control"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="all" selected="selected">All</option>
                <option value="vipps">Vipps</option>
                <option value="stripe">Stripe</option>
                <option value="subsidy">Subsidy Only</option>
              </select>
            </div>
            <hr />
            <div class="mt-3 mb-3 text-center m-2">
              <v-btn
                @click="fetchData(); currentPage = 1;"
                class="pl-5 pr-5 w-100"
                dark
                color="main_bg_color"
              >
                Show Results
              </v-btn>
            </div>
            <div class="mt-3 mb-3 text-center m-2">
              <v-btn
                class="pl-5 pr-5 w-100"
                dark
                color="main_bg_color"
                @click="clearFilter()"
              >
                Clear
              </v-btn>
            </div>
          </v-card-content>
        </v-card>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
import lineChart from "../../../components/reports/lineChart.vue";
import {getTableData, exportToExcelFile} from '../../../utils/index';

export default {
  components: {
    lineChart,
  },
  data() {
    return {
      dateFilter: "",
      machineFilter: "all",
      companyFilter: "all",
      paymentMethodFilter: "all",
      table_loader: true,
      vat: "with",
      locationFilter: "all",
      showFilter: false,
      currentPage: 1,
      resultPerPage: 10,
      companies: [],
      dateList: []
    };
  },
  watch: {
    currentPage: {
      handler: function () {
        this.fetchData();
      },
    },
    resultPerPage: {
      handler: function () {
        this.currentPage = 1;
        this.fetchData();
      },
    },
  },
  methods: {
    getTableData,
    exportToExcelFile,
    changeMonth() {
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let month = monthNames[new Date().getMonth()];
      let year = new Date().getFullYear();
      this.dateFilter = month + "," + " " + year;
    },

    checkDate(a, b) {
      let val = 0;
      let valuefilter = a.filter((x) => new Date(x.date).getUTCDate() == b)[0];
      if (valuefilter) {
        val = this.vat === 'with' ? valuefilter.withVAT.toFixed(2) : valuefilter.withoutVAT.toFixed(2);
      }
      return val;
    },
    exportExcelFile() { 
      let tableClass = "table_row";
      let items = document.getElementsByClassName(tableClass);
      const tableData = getTableData(items);
      const headerColumns = tableData[0];
      const rows = tableData[1];
      exportToExcelFile('Inventory Management', headerColumns, rows);
    },
    checkDateTotal(a, b) {
      let val = 0;
      let valuefilter = a.filter((x) => new Date(x._id).getUTCDate() == b)[0];
      if (valuefilter) {
        val = this.vat === 'with' ? valuefilter.totalwithVAT.toFixed(2) : valuefilter.totalwithoutVAT.toFixed(2);
      }
      return val;
    },
    async fetchData() {
      this.table_loader = true;
      let company = null;
      let companyId = 'all';
      if(this.companies && this.companies.length) {
        company = this.companies.find(company => company.companyName === this.companyFilter);
        if(company) {
          companyId = company.id;
        } 
      } 
      await this.$store.dispatch("salesOverviewList", {
        dateFilter: this.dateFilter,
        locationFilter: this.locationFilter,
        machineFilter: this.machineFilter,
        currentPage: this.currentPage,
        resultPerPage: this.resultPerPage,
        companyFilter: companyId,
        paymentMethodFilter: this.paymentMethodFilter,
      });
      await this.$store.dispatch("salesOverviewTotalList", {
        dateFilter: this.dateFilter,
        locationFilter: this.locationFilter,
        machineFilter: this.machineFilter,
        currentPage: this.currentPage,
        resultPerPage: this.resultPerPage,
        companyFilter: companyId,
        paymentMethodFilter: this.paymentMethodFilter,
      });
      this.table_loader = false;
      let year = new Date(this.dateFilter).getFullYear();
      let month = new Date(this.dateFilter).getMonth() + 1;
      let dateList = new Date(year, month, 0).getDate();
      this.dateList = dateList;

    },
    updateCurrentPage(obj) {
      if (obj > 0) {
        this.currentPage = obj;
      }
    },
    clearFilter() {
      (this.dateFilter = ""),
        (this.machineFilter = "all"),
        (this.vat = "with"),
        (this.companyFilter = "all"),
        (this.locationFilter = "all");
      this.changeMonth();
      this.fetchData();
    },
  },
  mounted() {
    this.changeMonth();
    this.$store.dispatch("machineSearchList");
    this.$store.dispatch("companiesSearchList");
    this.companies = this.getCompaniesSearchList.data.map(company => { return {id: company._id, companyName: company.user_name};});
    this.fetchData();
  },
  computed: {
    ...mapGetters([
      "getSalesOverview",
      "gettotalSalesOverview",
      "getMachineSearchList",
      "getCompaniesSearchList"
    ]),
    monthList() {
      let months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      let newIndex = new Date().getMonth();
      months.length = newIndex + 1;
      return months;
    },
  },
};
</script>

<style scoped>
.v-card__actions > .v-btn.v-btn {
  padding: 0 20px;
}

.table-box {
  min-width: 30px;
  max-width: 100px;
  text-align: center;
}

.login-field {
  border-radius: 8px;
  background-color: #ecf5f7;
  border: none;
  width: 140px;
}
</style>
