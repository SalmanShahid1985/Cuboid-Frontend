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
          <h2>Sales Report</h2>
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
        <v-card class="mainCard pa-0 pl-0 ml-0 mt-0 m-3">
          <ul class="nav nav-tabs nav-justified pl-0">
            <li class="nav-item">
              <button
                class="nav-link"
                @click="setActive('home')"
                :class="{ active: isActive('home') }"
                href="#home"
              >
                <strong> Summary </strong>
              </button>
            </li>
            <li class="nav-item">
              <button
                class="nav-link"
                @click="setActive('profile')"
                :class="{ active: isActive('profile') }"
                href="#profile"
              >
                <strong>Report</strong>
              </button>
            </li>
          </ul>
          <div class="py-7" v-if="table_loader">
            <v-progress-linear color="orange darken-1" indeterminate />
          </div>
          <div v-if="!table_loader" class="tab-content pt-0" id="myTabContent">
            <div
              class="tab-pane fade"
              :class="{ 'active show': isActive('home') }"
              id="home"
            >
              <v-card-header>
                <div class="d-flex float-right">
                  <a class="mr-3 mt-3 mb-3"> </a>
                  <div
                    class="
                      right-inner-addon
                      input-container
                      mt-3
                      ml-3
                      mb-3
                      pb-0
                      mr-3
                      d-flex
                      align-center
                    "
                  >
                    <b-icon
                      class="export-svg"
                      style="color: black"
                      icon="download"
                    ></b-icon>
                    <button
                      class="form-control login-field pl-40"
                      @click="exportExcelFile()"
                    >
                      Export Excel
                    </button>
                  </div>
                </div>
              </v-card-header>
              <v-card-content>
                <table class="table attention machine-table mb-0">
                  <thead class="tarnsactionHead">
                    <tr class="summary_table table_row">
                      <th style="width: 40%">Products</th>
                      <th style="width: 15%">Quantity</th>
                      <th style="width: 15%">VAT%</th>
                      <th>With VAT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      class="summary_table table_row"
                      v-if="getsummarysalesReport"
                      v-for="data in getsummarysalesReport.data"
                    >
                      <td style="width: 40%">{{ data.product }}</td>

                      <td style="width: 15%">{{ data.product_quantity }}</td>
                      <td style="width: 15%">{{ data.VAT.toFixed(2) }}%</td>
                      <td>NOK {{ data.price_with_VAT.toFixed(2) }}</td>
                    </tr>
                  </tbody>
                </table>
                <v-card-content>
                  <table
                    style="min-width: 100%"
                    class="orderModal mr-0 ma-auto ma-0"
                  >
                    <thead class="salesTab">
                      <tr
                        class="summary_total"
                        style="background-color: #f9f7f7 !important"
                      >
                        <th class="pt-3 pb-2" style="width: 65%"></th>
                        <th class="pt-3 pb-2" style="width: 15%">Quantity</th>
                        <th class="pt-3 pb-2" style="width: 10%">With VAT</th>
                      </tr>
                    </thead>
                    <tbody class="salesTab">
                      <tr
                        class="summary_total"
                        style="background-color: #f9f7f7 !important"
                      >
                        <td
                          class="pt-3 pb-2 pl-5 pr-5 text-right"
                          style="width: 64%"
                        >
                          <strong> Total </strong>
                        </td>
                        <td class="pt-3 pb-2 pl-2 pr-5" style="width: 15%">
                          {{ getsummarysalesReport.totalQuantity }}
                        </td>

                        <td
                          class="pt-3 pb-2 pl-2 pr-5"
                          style="width: 10%; color: #000000"
                        >
                          NOK {{ getsummarysalesReport.totalVAT.toFixed(2) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </v-card-content>
              </v-card-content>
            </div>
            <div
              class="tab-pane fade"
              :class="{ 'active show': isActive('profile') }"
              id="profile"
              v-if="getsummaryreportsReport"
            >
              <span v-for="data in getsummaryreportsReport.data">
                <v-card-header>
                  <div class="d-flex">
                    <a class="mr-3 mt-3 mb-3"> </a>
                    <div
                      class="mr-3 mt-3 mb-3 d-flex text-center justify-center"
                    >
                      <div class="filterLink mt-2">
                        <strong> {{ data.machine }} </strong>
                      </div>
                    </div>
                  </div>
                </v-card-header>
                <v-card-content>
                  <table class="table attention machine-table mb-0">
                    <thead class="tarnsactionHead">
                      <tr class="report_table">
                        <th style="width: 40%">Products</th>
                        <th style="width: 15%">Quantity</th>
                        <th style="width: 15%">VAT%</th>
                        <th>With VAT</th>
                        <th>Without VAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="obj in data.data">
                        <td style="width: 40%">{{ obj.product }}</td>

                        <td style="width: 15%">{{ obj.product_quantity }}</td>
                        <td style="width: 15%">{{ obj.VAT.toFixed(2) }}%</td>
                        <td>NOK {{ obj.price_with_VAT.toFixed(2) }}</td>
                        <td>NOK {{ obj.price_without_VAT.toFixed(2) }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <v-card-content>
                    <table class="orderModal mr-0 ma-auto ma-0" width="100%">
                      <thead class="salesTab">
                        <tr
                          class="report_total"
                          style="background-color: #f9f7f7 !important"
                        >
                          <th class="pt-3 pb-2" style="width: 65%"></th>
                          <th class="pt-3 pb-2" style="width: 15%">Quantity</th>
                          <th class="pt-3 pb-2" style="width: 10%">
                            Without VAT
                          </th>
                          <th class="pt-3 pb-2" style="width: 10%">With VAT</th>
                        </tr>
                      </thead>
                      <tbody class="salesTab">
                        <tr style="background-color: #f9f7f7 !important">
                          <td
                            class="pt-3 pb-2 pl-5 pr-5 text-right"
                            style="width: 64%"
                          >
                            <strong> Total </strong>
                          </td>
                          <td class="pt-3 pb-2 pl-2 pr-5" style="width: 15%">
                            {{ data.totalQuantity }}
                          </td>

                          <td
                            class="pt-3 pb-2 pl-2 pr-5"
                            style="width: 10%; color: #000000"
                          >
                            NOK {{ data.totalPriceWithoutVAT.toFixed(2) }}
                          </td>
                          <td
                            class="pt-3 pb-2 pl-2 pr-5"
                            style="width: 10%; color: #000000"
                          >
                            NOK {{ data.totalPriceWithVAT.toFixed(2) }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </v-card-content>
                </v-card-content>
              </span>
            </div>
          </div>
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
            <label class="regularFont login-font filterLabels mb-0 m-2"
              >Period</label
            >
            <div class="input-container pb-0 m-2 mb-0 mt-1">
              <date-range-picker
                style="width: 100%"
                opens="left"
                :locale-data="{ firstDay: 1, format: 'dd-mm-yyyy' }"
                :minDate="minDate"
                :maxDate="maxDate"
                :ranges="false"
                :show-week-numbers="false"
                v-model="dateRange"
              >
              </date-range-picker>
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
                class="form-control"
                style="padding: 0.375rem 0.5rem !important"
                v-model="machine"
              >
                <option value="all">All</option>
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
                class="form-control"
                style="padding: 0.375rem 0.5rem !important"
                v-model="location"
              >
                <option value="all">All</option>
                <option
                  v-for="location in getMachineSearchList.machine_location"
                >
                  {{ location }}
                </option>
              </select>
            </div>

            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Products</label
            >
            <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
              <i style="padding: 8.2px 12px"
                ><img
                  src="../../../assets/logos/bxs-down-arrow.svg"
                  height="7px"
              /></i>
              <select
                v-model="product"
                class="form-control"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="all">All</option>
                <option v-for="product in getMachineSearchList.product_name">
                  {{ product }}
                </option>
              </select>
            </div>

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
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import {getTableData, exportToExcelFile} from '../../../utils/index';
export default {
  components: {
    DateRangePicker,
  },
  data() {
    return {
      activeItem: "home",
      showFilter: false,
      dateRange: { startDate: "2022-05-03", endDate: new Date() },
      machine: "all",
      product: "all",
      location: "all",
      resultPerPage: 10,
      table_loader: true,
      currentPage: 1,
      minDate: "2022-05-03",
      maxDate:  new Date(),

    };
  },
  watch: {},
  methods: {
    getTableData,
    exportToExcelFile,
    isActive(menuItem) {
      return this.activeItem === menuItem;
    },
    exportExcelFile() {
      let tableClass = "table_row";
      let items = document.getElementsByClassName(tableClass);
      const tableData = getTableData(items);
      const headerColumns = tableData[0];
      const rows = tableData[1];
      exportToExcelFile('Sales Report Summary', headerColumns, rows);
    },
    setActive(menuItem) {
      this.activeItem = menuItem;
      this.fetchData();
    },
    dateConvert(obj) {
      var date = new Date(obj);
      var mS = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];

      return (
        date.getDate() + "-" + mS[date.getMonth()] + "-" + date.getFullYear()
      );
    },

    async fetchData() {
      this.table_loader = true;
      if (this.activeItem == "home") {
        await this.$store.dispatch("summarySalesList", {
          from: this.dateRange.startDate,
          to: this.dateRange.endDate,
          location: this.location,
          product: this.product,
          machine: this.machine,
        });
      } else {
        await this.$store.dispatch("summaryReportList", {
          location: this.location,
          resultPerPage: this.resultsPerPage,
          currentPage: this.resultsPerPage,
          product: this.product,
          machine: this.machine,
          from: this.dateRange.startDate,
          to: this.dateRange.endDate,
        });
      }

      this.table_loader = false;
    },
    fetchSearchData() {
      this.$store.dispatch("machineSearchList");
    },
    clearFilter() {
      (this.dateRange = { startDate: "2022-05-03", endDate:  new Date() }),
        (this.machine = "all"),
        (this.product = "all"),
        (this.location = "all"),
        this.fetchData();
    },
  },
  mounted() {
    this.fetchData();
    this.fetchSearchData();
  },
  computed: {
    ...mapGetters([
      "getsummarysalesReport",
      "getsummaryreportsReport",
      "getMachineSearchList",
    ]),
  },
};
</script>

<style scoped>
.v-card__actions > .v-btn.v-btn {
  padding: 0 20px;
}
.login-field {
  border-radius: 8px;
  background-color: #ecf5f7;
  border: none;
  width: 140px;
}
</style>
