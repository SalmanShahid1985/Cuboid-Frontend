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
          <h2>Product Sales</h2>
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
                  class="d-flex float-right align-center  right-inner-addon input-container mt-2 mb-2 pb-0 mr-3"
                >
                  <b-icon class="export-svg" icon="download"></b-icon>
              <button
                class="form-control login-field pl-40"
                @click="exportCsv()"
                style="width: 110px !important"
              >
                Export CSV
              </button>
            </div>
          </v-card-header>
          <v-card-content>
            <div v-if="table_loader">
              <v-progress-linear
                color="orange darken-1"
                indeterminate
              ></v-progress-linear>
            </div>
            <table class="table attention machine-table mb-0">
              <thead class="tarnsactionHead">
                <tr class="table_row">
                  <th>Machine</th>
                  <th>Lines</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>With VAT</th>
                  <th>without VAT</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody v-if="!table_loader">
                <tr
                  v-for="(result, index) in getproductsales.result"
                  class="table_row"
                  :key="index"
                >
                  <td>{{ result.machine }}</td>
                  <td>
                    <v-chip v-for="item in result.channels" class="mr-3">{{
                      item
                    }}</v-chip>
                  </td>
                  <td>{{ result.product }}</td>
                  <td>{{ result.Quantity }}</td>
                  <td>{{ result.withVat.toFixed(2) }}</td>
                  <td>{{ result.WithoutVat.toFixed(2) }}</td>
                  <td>{{ result.type }}</td>
                </tr>
              </tbody>
            </table>
            <div class="mt-3 mb-3 text-center d-flex justify-center">
              <!--  -->
              <ul class="pagiNation px-5 notranslate">
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
                    currentPage == getproductsales.totalPage && currentPage > 2
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
                  v-if="currentPage + 1 <= getproductsales.totalPage"
                  @click="updateCurrentPage(currentPage + 1)"
                  class="pagiNation-item"
                >
                  <span class="page-link"> {{ currentPage + 1 }}</span>
                </li>
                <li
                  v-if="currentPage == 1 && getproductsales.totalPage > 2"
                  @click="updateCurrentPage(currentPage + 2)"
                  class="pagiNation-item"
                >
                  <span class="page-link"> {{ currentPage + 2 }}</span>
                </li>

                <li
                  v-if="
                    currentPage != getproductsales.totalPage &&
                    getproductsales.totalPage != 0
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
                <strong>
                  Total Record: {{ getproductsales.totalrecords }}
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
            <input
              type="text"
              class="formControl mt-4"
              placeholder="Search"
              style="
                background-color: #fff;
                min-width: 95%;
                border-radius: 5px;
                margin: auto;
              "
              id=""
            />

            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Select Date</label
            >
            <div class="input-container pb-0 m-2 mb-0 mt-1">
              <date-range-picker
                style="width: 100%"
                opens="left"
                :locale-data="{ firstDay: 1, format: 'dd-mm-yyyy' }"
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
                v-model="machine"
                class="form-control"
                style="padding: 0.375rem 0.5rem !important"
              >
                <option value="all">All</option>
                <option v-for="machine in getMachineSearchList.machine_name">
                  {{ machine }}
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
                <option
                  v-for="productName in getMachineSearchList.product_name"
                >
                  {{ productName }}
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

export default {
  components: { DateRangePicker },
  data() {
    return {
      showFilter: false,
      resultPerPage: 10,
      table_loader: true,
      currentPage: 1,
      machine: "all",
      location: "all",
      product: "all",
      dateRange: { startDate: "2022-05-01", endDate: "2022-06-30" },
    };
  },
  watch: {},
  methods: {
    async fetchData() {
      this.table_loader = true;
      await this.$store.dispatch("productsales", {
        resultPerPage: 10,
        currentPage: 1,
        from: this.dateRange.startDate,
        to: this.dateRange.endDate,
        location: this.location,
        product: this.product,
        machine: this.machine,
      });
      this.table_loader = false;
    },
    exportCsv() {
      var tableClass;
      tableClass = "table_row";
      var rows = [];
      var item = document.getElementsByClassName(tableClass);
      for (var i = 0; i < item.length; i++) {
        var contentRow = [];
        for (var j = 0; j < item[i].querySelectorAll("td, th").length; j++) {
          if (j == 1) {
            var datareplace = item[i].querySelectorAll("td, th")[j].innerText.toString();
           contentRow.push(datareplace.replaceAll('\n',' '));
          }
          else {
            contentRow.push(item[i].querySelectorAll("td, th")[j].innerText);
          }
        }
        rows.push(contentRow);
      }
      this.downloadCsv(rows.join("\n"));
    },
    downloadCsv(data) {
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", "Product Report.csv");
      a.click();
    },
  },
  mounted() {
    this.fetchData();
    this.$store.dispatch("machineSearchList");
  },
  computed: {
    ...mapGetters(["getproductsales", "getMachineSearchList"]),
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
