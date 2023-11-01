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
          <h2>Waste Management Report</h2>
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
    <div class="col-12 d-flex">
      <div :class="showFilter ? 'col-md-9' : 'col-md-12'" class="p-0">
        <v-card class="mainCard pa-0 pl-0 ml-0 mt-0 m-3">
          <v-card-header>
            <div
              class="
                d-flex
                float-right
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
                @click="exportExcelFile()"
                class="form-control login-field pl-40"
              >
                Export Excel
              </button>
            </div>
          </v-card-header>

          <v-card-content>
            <div v-if="table_loader">
              <v-progress-linear
                indeterminate
                color="orange darken-1"
              ></v-progress-linear>
            </div>
            <table class="table attention machine-table mb-0">
              <thead class="tarnsactionHead">
                <tr class="table_row">
                  <th>Product Name</th>
                  <th>Product Category</th>
                  <th>Machine Name</th>
                  <th>Canteen Name</th>
                  <th>Company Name</th>
                  <th>Quantity Wasted</th>
                  <th style="width: 23%">Date &amp; Time</th>
                </tr>
              </thead>
              <tbody v-if="wastageReport && !table_loader">
                <tr
                  class="table_row"
                  v-for="(data, index) in wastageReport"
                  :key="index"
                >
                  <td>{{ data && data.product && data.product.product_name || '' }}</td>
                  <td>{{ data && data.product_category && data.product_category.catagories_name || '' }}</td>
                  <td>{{ data && data.machine && data.machine.machine_name || '' }}</td>
                  <td>{{ data && data.canteen && data.canteen.canteen_name || '' }}</td>
                  <td>{{ data && data.company && data.company.user_name || ''}}</td>
                  <td>{{ data && data.numProducts || 0 }}</td>
                  <td>
                    {{ data.updatedAt }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="mt-3 mb-3 text-center d-flex justify-center">
              <ul v-if="wastageReport" class="pagiNation px-3 notranslate">
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
                    currentPage == wastageReport.totalPage &&
                    currentPage > 2
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
                  v-if="currentPage + 1 <= totalPage"
                  @click="updateCurrentPage(currentPage + 1)"
                  class="pagiNation-item"
                >
                  <span class="page-link"> {{ currentPage + 1 }}</span>
                </li>
                <li
                  v-if="currentPage == 1 && totalPage > 2"
                  @click="updateCurrentPage(currentPage + 2)"
                  class="pagiNation-item"
                >
                  <span class="page-link"> {{ currentPage + 2 }}</span>
                </li>

                <li
                  v-if="
                    (currentPage != totalPage) &
                    (totalPage != 0)
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
                  class="form-control mt-2 pt-1 pb-1 px-5"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="75">75</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div class="mt-4">
                <strong v-if="wastageReport">
                  Total Record: {{ totalRecord }}
                </strong>
              </div>
            </div>
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
            <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
              <i style="padding: 8.2px 12px">
                <img
                  src="../../../assets/logos/bxs-down-arrow.svg"
                  height="7px" alt="Down Arrow"
              /></i>
              <select
                class="form-control"
                v-model="periodValue"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="month">Month</option>
                <option value="week">Week</option>
                <option value="today">Today</option>
                <option value="custom">Custom</option>
              </select>
            </div>


          <div v-if="showCustomDate">
            <label class="regularFont login-font filterLabels mb-0 m-2"
              >Custom Date Range</label
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
          </div>

            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Companies</label
            >
            <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
              <i style="padding: 8.2px 12px">
                <img
                  src="../../../assets/logos/bxs-down-arrow.svg"
                  height="7px" alt="Down Arrow"
              /></i>
              <select
                class="form-control"
                v-model="companyValue"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="all">All</option>
                <option
                  v-for="(
                    company, index
                  ) in companies"
                  :key="index"
                  :value="company"
                >
                  {{ company }}
                </option>
              </select>
            </div>

            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Canteens</label
            >
            <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
              <i style="padding: 8.2px 12px">
                <img src="../../../assets/logos/bxs-down-arrow.svg"
                  height="7px" alt="Down Arrow"
              /></i>
              <select
                class="form-control"
                v-model="canteenValue"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="all">All</option>
                <option
                  v-for="(
                    canteen, index
                  ) in canteens"
                  :key="index"
                  :value="canteen"
                >
                  {{ canteen }}
                </option>
              </select>
            </div>

            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Machines</label
            >
            <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
              <i style="padding: 8.2px 12px">
                <img
                  src="../../../assets/logos/bxs-down-arrow.svg"
                  height="7px" alt="Down Arrow"
              /></i>
              <select
                v-model="machineValue"
                class="form-control"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="all">All</option>
                <option
                  v-for="(name, index) in getMachineSearchList.machine_name"
                  :key="index"
                >
                  {{ name }}
                </option>
              </select>
            </div>

            <div v-if="productCategories">
              <label class="regularFont login-font filterLabels mb-0 m-2" style=""
                >Product Categories</label
              >
              <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
                <i style="padding: 8.2px 12px"
                  ><img
                    src="../../../assets/logos/bxs-down-arrow.svg"
                    height="7px" alt="Down Arrow"
                /></i>
                <select
                  class="form-control"
                  v-model="categoryValue"
                  style="padding: 0.375rem 0.5rem !important"
                >
                  <option value="all">All</option>
                  <option
                    v-for="(
                      category, index
                    ) in productCategories"
                    :key="index"
                    :value="category"
                  >
                    {{ category }}
                  </option>
                </select>
              </div>
            </div>

            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Products</label
            >
            <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
              <i style="padding: 8.2px 12px"
                ><img
                  src="../../../assets/logos/bxs-down-arrow.svg"
                  height="7px" alt="Down Arrow"
              /></i>
              <select
                v-model="productValue"
                class="form-control"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="all">All</option>
                <option
                  v-for="(product, index) in getMachineSearchList.product_name"
                  :key="index"
                >
                  {{ product }}
                </option>
              </select>
            </div>

            <hr />
            <div class="mt-3 mb-3 text-center m-2">
              <v-btn
                class="pl-5 pr-5 w-100"
                dark
                color="main_bg_color"
                @click="
                  currentPage = 1;
                  fetchData();
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
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import {getTableData, exportToExcelFile} from '../../../utils/index';
export default {
  components: {
    DateRangePicker,
  },
  data() {
    return {
      showFilter: false,
      summary_event: [],
      table_loader: true,
      machine_number: [],
      resultPerPage: 10,
      currentPage: 1,
      dateRange: { startDate: "2020-01-01", endDate: new Date() },
      minDate: "2020-01-01",
      maxDate: new Date(),
      periodValue: "month",
      companyValue: "all",
      canteenValue: "all",
      machineValue: "all",
      categoryValue: "all",
      productValue: "all",
      companies: null,
      canteens: null,
      productCategories: null,
      wastageReport: null,
      showCustomDate: false,
      startDate: null,
      endDate: null,
      totalRecords: 0,
      totalPage: 0

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
    periodValue:{
      handler: function(val) {
        if(val === 'custom'){
          let last12Months = new Date();
          last12Months.setMonth(last12Months.getMonth()-12);
          this.startDate = last12Months;
          this.endDate = new Date();
          this.showCustomDate = true;
        } else {
          if(val === 'month') {
            let lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth()-1);
            this.startDate = lastMonth;
            this.endDate = new Date();
          } else if(val === 'week'){
            let lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate()-7);
            this.startDate = lastWeek;
            this.endDate = new Date();
          } else {
            this.startDate = new Date();
            this.endDate = new Date();
          }
          this.showCustomDate = false;
        }
     }
    },
    dateRange: {
      handler: function (val) {
        this.startDate = val.startDate;
        this.endDate = val.endDate;
      },
    }
  },
  methods: {
    getTableData,
    exportToExcelFile,
    updateCurrentPage(obj) {
      if (obj >= 1) {
        this.currentPage = obj;
      }
    },
    async exportExcelFile() {
      let tableClass = "table_row";
      let items = document.getElementsByClassName(tableClass);
      const tableData = getTableData(items);
      const headerColumns = tableData[0];
      const rows = tableData[1];
      exportToExcelFile('Waste Management', headerColumns, rows);

    },
    dateConvert(obj) {
      let date = new Date(obj);
      let mS = [
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
      await this.$store.dispatch("wasteManagementReportList", {
        resultPerPage: this.resultPerPage,
        currentPage: this.currentPage,
        companyValue: this.companyValue,
        canteenValue: this.canteenValue,
        machineValue: this.machineValue,
        productCategoryValue: this.categoryValue,
        productValue: this.productValue,
        startDate: this.startDate,
        endDate: this.endDate,
      });
      this.table_loader = false;
      if(this.getWastageReport) {
        this.wastageReport = this.getWastageReport.data;
        this.totalRecord = this.getWastageReport.totalRecord;
        this.totalPage = this.getWastageReport.totalPage;
        console.log('wastageReport', this.wastageReport);
      }
    },
    clearFilter() {
      this.periodValue = "monthly";
      this.companiesValue = "all";
      this.canteenValue = "all";
      this.machineValue = "all";
      this.productCategoryValue = "all";
      this.productValue = "all";
      let lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth()-1);
      this.startDate = lastMonth;
      this.endDate = new Date();
      this.fetchData();
    },
  },
  mounted() {
    let lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth()-1);
    this.startDate = lastMonth;
    this.endDate = new Date();
    this.$store.dispatch("machineSearchList");
    this.$store.dispatch("companiesSearchList");
    this.$store.dispatch("canteensSearchList");
    this.$store.dispatch("productCategoriesSearchList");
    if(this.getCompaniesSearchList && this.getCompaniesSearchList.data && this.getCompaniesSearchList.data.length > 0){
      this.companies = this.getCompaniesSearchList.data.map((company) => { return company.user_name});
    }
    if(this.getCanteensSearchList && this.getCanteensSearchList.data && this.getCanteensSearchList.data.length > 0){
      this.canteens = this.getCanteensSearchList.data.map((canteen) => { return canteen});
    }
    if(this.getProductCategoriesSearchList && this.getProductCategoriesSearchList.data && this.getProductCategoriesSearchList.data.length > 0) {
      this.productCategories = this.getProductCategoriesSearchList.data.map((category) => { return category});
    }
    this.fetchData();
  },
  computed: {
    ...mapGetters(["getWastageReport", "getMachineSearchList","getCompaniesSearchList","getCanteensSearchList","getProductCategoriesSearchList"]),
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

.inventoryReportBottom {
  border-bottom: 1px solid #ccc;
}
</style>
