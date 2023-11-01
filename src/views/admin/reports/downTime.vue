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
          <h2>Down Time Report</h2>
        </div>
      </v-card-text>
      <div class="d-flex pb-0">
        <v-btn
          class="mr-4"
          style="background-color: #ecf5f7"
          @click="showFilter = !showFilter"
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
          <v-card-header>
            <div
              class="
                d-flex
                align-center
                float-right
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
          </v-card-header>
          <div v-if="table_loader">
            <v-progress-linear indeterminate color="orange darken-1" />
          </div>
          <v-card-content>
            <table class="table attention machine-table mb-0">
              <thead class="tarnsactionHead">
                <tr class="table_row">
                  <th>Machine</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th style="width: 23%">Duration</th>

                  <th>Current Status</th>
                </tr>
              </thead>

              <tbody v-if="!table_loader">
                <tr
                  class="table_row"
                  v-for="(data, index) in getdowntime.data"
                  :key="index"
                >
                  <td class="name">{{ data.machine_name }}</td>
                  <td>{{ dateConvert(data.created_at) }}</td>
                  <td>
                    <p v-if="data.ended_at">
                      {{ dateConvert(data.ended_at) }}
                    </p>
                  </td>
                  <td>{{ data.duration_text }}</td>
                  <td class="d-flex justify-center">
                    <button
                      class="device-status"
                      :class="
                        data.status == 'Device OK'
                          ? 'device-ok'
                          : 'device-not-ok'
                      "
                    >
                      {{ data.status }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="mt-3 mb-3 text-center d-flex justify-center">
              <!--  -->
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
                  v-if="currentPage == getdowntime.totalPage && currentPage > 2"
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
                  v-if="currentPage + 1 <= getdowntime.totalPage"
                  @click="updateCurrentPage(currentPage + 1)"
                  class="pagiNation-item"
                >
                  <span class="page-link"> {{ currentPage + 1 }}</span>
                </li>
                <li
                  v-if="currentPage == 1 && getdowntime.totalPage > 2"
                  @click="updateCurrentPage(currentPage + 2)"
                  class="pagiNation-item"
                >
                  <span class="page-link"> {{ currentPage + 2 }}</span>
                </li>

                <li
                  v-if="
                    (currentPage != getdowntime.totalPage) &
                    (getdowntime.totalPage != 0)
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
              <!--  -->
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
                <strong> Total Record: {{ getdowntime.totalRecord }} </strong>
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
                <tr class="table_total">
                  <th style="width: 60%" class="text-right">Type</th>
                  <th style="width: 12%">Duration</th>
                </tr>
              </thead>
              <tbody v-if="!table_loader">
                <tr
                  class="table_total"
                  style="background-color: #f9f7f7 !important"
                  v-for="(summary_event, i) in summary_event"
                  :key="i"
                >
                  <td class="pt-3 pb-2 pl-5 pr-5 text-right" style="width: 60%">
                    {{ summary_event.event }}
                  </td>
                  <td class="pt-3 pb-2 pl-2 pr-5" style="width: 12%">
                    {{ summary_event.duration_text }}
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
                class="form-control"
                v-model="machineFilter"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="all">All</option>
                <option
                  v-for="(option, index) in getMachineSearchList.machine_name"
                  :key="index"
                  selected="selected"
                >
                  {{ option }}
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
                v-model="locationFilter"
                class="form-control"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="all">All</option>
                <option
                  v-for="(
                    location, index
                  ) in getMachineSearchList.machine_location"
                  :key="index"
                >
                  {{ location }}
                </option>
              </select>
            </div>
            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Transaction Type</label
            >
            <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
              <i style="padding: 8.2px 12px"
                ><img
                  src="../../../assets/logos/bxs-down-arrow.svg"
                  height="7px"
              /></i>
              <select
                v-model="transaction_type"
                class="form-control"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="all">All</option>
                <option value="vipps">Vipps</option>
                <option value="stripe">Stripe</option>
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
                <option value="all">All</option>
                <option value="with">With VAT</option>
                <option value="without">Without VAT</option>
              </select>
            </div>
            <hr />
            <div class="mt-3 mb-3 text-center m-2">
              <v-btn
                @click="applyFilters(); currentPage = 1;"
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
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import { mapGetters } from "vuex";
import {getTableData, exportToExcelFile} from '../../../utils/index';
import dateFormat from "dateformat";

export default {
  components: { DateRangePicker },
  data() {
    return {
      showFilter: false,
      summary_event: [],
      table_loader: true,
      machine_number: [],
      minDate: "",
      maxDate: "",
      dateRange: {
        startDate: "2022-01-01T19:00:00.000Z",
        endDate: new Date(),
      },
      test: "",
      locationFilter: "all",
      machineFilter: "all",
      resultPerPage: 10,
      currentPage: 1,
      transaction_type: "all",
      vat: "all",
    };
  },
  watch: {},
  methods: {
    getTableData,
    exportToExcelFile,
    dateConvert(obj) {
      let date = new Date(obj);
      return dateFormat(date, "dd mmmm yyyy h:MM:ss TT")
    },

    exportExcelFile() {
      let tableClass = "table_row";
      let items = document.getElementsByClassName(tableClass);
      const tableData = getTableData(items);
      const headerColumns = tableData[0];
      const rows = tableData[1];
      exportToExcelFile('Downtime Report', headerColumns, rows);
    },
    applyFilters() {
      this.currentPage = 1;
      this.fetchData();
    },
    async fetchData() {
      this.table_loader = true;
      await this.$store.dispatch("downtimeList", {
        resultPerPage: this.resultPerPage,
        pagination: true,
        currentPage: this.currentPage,
        from: this.dateRange.startDate,
        to: this.dateRange.endDate,
        location: this.locationFilter,
        machine: this.machineFilter,
        vat: this.vat,
        transaction_type: this.transaction_type,
      });
      this.summary_event = this.getdowntime.summary;
      this.table_loader = false;
    },
    fetchSearchData() {
      this.$store.dispatch("machineSearchList");
    },
    clearFilter() {
      (this.dateRange = {
        startDate: "2022-05-01T19:00:00.000Z",
        endDate: "2022-05-30T19:00:00.000Z",
      }),
        (this.machineFilter = "all"),
        (this.locationFilter = "all"),
        (this.transaction_type = "all"),
        (this.vat = "all"),
        this.fetchData();
    },
  },
  mounted() {
    this.fetchData();
    this.fetchSearchData();
  },
  computed: {
    ...mapGetters(["getdowntime", "getMachineSearchList"]),
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
.device-ok {
  background-color: #559d2e;
}
.device-not-ok {
  background-color: #aaaaaa;
}
.device-status {
  padding: 0.5em 2em;
  border-radius: 10px;
  color: white;
}
</style>
