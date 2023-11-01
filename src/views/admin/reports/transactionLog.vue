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
          <h2>Transaction Log</h2>
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
        <v-card class="mainCard pa-0 pl-0 ml-0 mt-0 m-3" style="overflow: auto">
          <v-card-header>
            <div
              class="
                d-flex
                align-center
                right-inner-addon
                input-container
                float-right
                mt-2
                mb-2
                pb-0
                mr-3
              "
            >
              <b-icon class="export-svg" icon="download"></b-icon>
              <button
                @click="exportExcelFile()"
                class="form-control login-field pl-40"
              >
                Export Excel
              </button>
            </div>
          </v-card-header>
          <v-card-content>
            <div v-if="table_loader" class="py-7">
              <v-progress-linear
                indeterminate
                color="orange darken-1"
              ></v-progress-linear>
            </div>
            <table class="table attention machine-table mb-0">
              <thead class="tarnsactionHead">
                <tr class="table_row">
                  <th style="width: 12%">Date</th>
                  <th style="width: 17%">Machine</th>
                  <th style="width: 10%">Name</th>
                  <th>Quantity</th>
                  <th>Product Status</th>
                  <th style="width: 10%">Without VAT Price</th>
                  <th>VAT%</th>
                  <th style="width: 7%">With VAT Price</th>
                  <th style="width: 9%">Discount Type</th>
                  <th>Discount</th>
                  <th>Type</th>
                  <th>Gross Amount</th>
                  <th>Payment Status</th>
                  <th>Order Delivery Status</th>
                </tr>
              </thead>
              <tbody
                v-if="
                  !table_loader && gettransactionLog && gettransactionLog.data
                "
              >
                <tr class="table_row"
                  v-for="(data, index) in gettransactionLog.data"
                  :key="index"
                >
                  <td style="width: 12%">{{ dateConvert(data.created_at) }}</td>
                  <td class="name" style="width: 17%">
                    {{ data.machine_name }}
                  </td>
                  <td style="width: 10%">{{ data.product_name }}</td>
                  <td>{{ data.quantity }}</td>
                  <td
                    style="width: 10%; max-width: 60px"
                    class="text-capitalize"
                  ><span v-if="data && data.product_delivery_status">
                    {{ data.product_delivery_status.join(", ").toLowerCase() }}

                  </span>
                  </td>
                  <td style="width: 10%"> <span  v-if="data.price"> NOK {{ data.price.toFixed(2) }}</span></td>
                  <td v-if="data.vat_percent">
                    {{
                      data.vat_percent == "N/A"
                        ? ""
                        : data.vat_percent.toFixed(2) + "%"
                    }}
                  </td>
                  <td style="width: 7%">
                  NOK  {{  (data.price + data.product_vat).toFixed(2) }}
                  </td>
                  <td style="width: 9%">
                    <p v-show="data.discount_type && data.discount_type != ''">
                      {{ data.discount_type }}
                    </p>
                  </td>
                  <td>
                     {{ data.discount.toFixed(2) }}
                  </td>
                  <td>{{ data.type }}</td>
                  <td>{{ data.chargeable_payment.toFixed(2) }}</td>
                  <td>{{ data.payment_status }}</td>
                  <td>{{ data.order_status }}</td>
                </tr>
              </tbody>
            </table>
            <div class="mt-3 mb-3 text-center d-flex justify-center">
              <ul class="pagiNation notranslate mr-2">
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
                    currentPage == gettransactionLog.totalPage &&
                    currentPage > 2
                  "
                  @click="updateCurrentPage(currentPage - 2)"
                  class="pagiNation-item"
                >
                  <span class="page-link">
                    {{ currentPage - 2 }}
                  </span>
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
                  <span class="page-link activepage"> {{ currentPage }} </span>
                </li>

                <li
                  v-if="currentPage + 1 <= gettransactionLog.totalPage"
                  @click="updateCurrentPage(currentPage + 1)"
                  class="pagiNation-item"
                >
                  <span class="page-link"> {{ currentPage + 1 }} </span>
                </li>
                <li
                  v-if="currentPage == 1 && gettransactionLog.totalPage > 2"
                  @click="updateCurrentPage(currentPage + 2)"
                  class="pagiNation-item"
                >
                  <span class="page-link"> {{ currentPage + 2 }} </span>
                </li>
                <li
                  v-if="
                    currentPage != gettransactionLog.totalPage &&
                    gettransactionLog.totalPage != 0
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
                  v-model="resultPerPage"
                  @change="
                    currentPage = 1;
                    fetchData();
                  "
                  class="form-control mt-2 p-2 pt-1 pb-1 pr-5"
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
                  Total Record: {{ gettransactionLog.totalRecord }}
                </strong>
              </div>
            </div>
          </v-card-content>
        </v-card>
        <v-card class="mainCard pa-0 pl-0 ml-0 mt-0 m-3">
          <v-card-header>
            <h6 class="pa-3 b-bottom cardHeading mb-0">
              <strong>Totals</strong>
            </h6>
          </v-card-header>
          <v-card-content>
            <table
              width="100%"
              class="orderModal machine-table mr-0 ma-auto ma-0"
            >
              <thead class="tarnsactionHead">
                <tr>
                  <th style="width: 60%"></th>
                  <th style="width: 12%">Quantity</th>
                  <th style="width: 22%">With VAT</th>
                </tr>
              </thead>
              <tbody v-if="!table_loader">
                <tr
                  style="background-color: #f9f7f7 !important"
                  v-for="(d, i) in gettransactionLog.summary"
                  :key="i"
                >
                  <td
                    class="pt-3 pb-2 pl-5 pr-5 text-right"
                    style="width: 64%; text-transform: capitalize"
                  >
                    {{ d.type }}
                  </td>
                  <td
                    class="pt-3 pb-2 pl-2 pr-5"
                    style="width: 12%; text-transform: capitalize"
                  >
                    {{ d.quantity }}
                  </td>
                  <td class="pt-3 pb-2 pl-2 pr-5" style="width: 22%">
                    NOK {{ d.amount.toFixed(2) }}
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
                show-week-numbers="false"
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
                v-model="machine_name"
                class="form-control"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="all">All</option>
                <option
                  v-for="(
                    machine_item, index
                  ) in getMachineSearchList.machine_name"
                  :key="index"
                >
                  {{ machine_item }}
                </option>
              </select>
            </div>

            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Locations</label
            >
            <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
              <i style="padding: 8.2px 12px"
                ><img
                  src="../../../assets/logos/bxs-down-arrow.svg"
                  height="7px"
              /></i>
              <select
                v-model="location"
                class="form-control"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="all">All</option>
                <option
                  v-for="(
                    machine_location, index
                  ) in getMachineSearchList.machine_location"
                  :key="index"
                >
                  {{ machine_location }}
                </option>
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
                v-model="payment_method"
                class="form-control"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="all">All</option>
                <option value="vipps">Vipps</option>
                <option value="stripe">Stripe</option>
                <option value="subsidy">Subsidy</option>
              </select>
            </div>
            <!-- <label class="regularFont login-font filterLabels mb-0 m-2" style=""
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
                <option value="all">All</option>
                <option value="with">With VAT</option>
                <option value="without">Without VAT</option>
              </select>
            </div> -->
            <hr />
            <div class="mt-3 mb-3 text-center m-2">
              <v-btn
                class="pl-5 pr-5 w-100"
                dark
                color="main_bg_color"
                @click="
                  fetchData();
                  currentPage = 1;
                "
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
// import vuejsDatepicker from 'vuejs-datepicker'
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import {getTableData, exportToExcelFile} from '../../../utils/index';

export default {
  components: {
    // vuejsDatepicker
    DateRangePicker,
  },
  data() {
    return {
      showFilter: false,
      currentPage: 1,
      resultPerPage: 10,
      minDate: "",
      maxDate: "",
      table_loader: false,
      dateRange: {
        startDate: "2022-01-18 00:00:00",
        endDate: new Date(),
      },
      // from: new Date(),
      // to: new Date(),
      // disabledDatesFrom: {
      //   to: new Date(),
      //   from: null
      // },
      // disabledDatesTo: {
      //   to: new Date(),
      // },
      machine_name: "all",
      canteen_name: "all",
      payment_method: "all",
      location: "all",
      sort: "asc",
      vat: "all",
      start_date: "2022-01-18 00:00:00",
      end_date: new Date(),
    };
  },
  watch: {
    currentPage: {
      handler: function () {
        this.fetchData();
      },
    },
  },
  methods: {
    getTableData,
    exportToExcelFile,
    async fetchData() {
      this.table_loader = true;
      var vm = this;
      await this.$store.dispatch("transactionLogList", {
        resultPerPage: this.resultPerPage,
        pagination: true,
        currentPage: this.currentPage,
        canteen_name: this.canteen_name,
        payment_method: this.payment_method,
        machine_name: this.machine_name,
        from: this.dateRange.startDate,
        to: this.dateRange.endDate,
        location: this.location,
        sort: "asc",
        vat: this.vat,
      });

      this.table_loader = false;
    },
    clearFilter() {
      this.machine_name = "all";
      this.payment_method = "all";
      (this.dateRange = {
        startDate: "2022-01-18 00:00:00",
        endDate: new Date(),
      }),
      this.location = "all";
      this.payment_method = "all";
      // this.vat = "all";
      this.fetchData();
    },
    updateCurrentPage(obj) {
      if (obj >= 1) {
        this.currentPage = obj;
      }
    },
    updateDDT(selected) {
      this.disabledDatesTo.to = selected;
      if (this.to < this.disabledDatesTo.to) {
        this.to = this.disabledDatesTo.to;
      }
    },
    updateDDF(selected) {
      this.disabledDatesFrom.from = selected;
      if (this.from < this.disabledDatesTo.from) {
        this.from = this.disabledDatesTo.from;
      }
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
    async fetchSearchData() {
      await this.$store.dispatch("machineSearchList");
    },
    downloadCsv(data) {
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", "Transaction Log.csv");

      a.click();
    },
    exportExcelFile() {
      let tableClass = "table_row";
      let items = document.getElementsByClassName(tableClass);
      const tableData = getTableData(items);
      const headerColumns = tableData[0];
      const rows = tableData[1];
      exportToExcelFile('Transaction Logs', headerColumns, rows);
    },
  },
  mounted() {
    this.fetchData();
    this.fetchSearchData();
    var start_date = new Date(this.dateRange.startDate);
  },
  computed: {
    ...mapGetters([
      "gettransactionLog",
      "getMachineSearchList",
      "getcanteenName",
      "getcanteenLocation",
      "getmachineName",
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
/* table {
  overflow-x: scroll;
}
table tbody {
  display: table;
  width: 100%;
} */
</style>
