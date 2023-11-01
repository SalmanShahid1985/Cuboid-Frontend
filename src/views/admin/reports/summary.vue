<template>
  <div>
    <div class="d-flex justify-space-around align-center mb-2 mt-3">
      <v-card-text class="pl-3">
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
    <div class="col-12 d-flex pt-0">
      <div :class="showFilter ? 'col-md-9' : 'col-md-12'" class="p-0">
        <v-card-text class="pl-0 pt-0">
          <div class="pageHeadingIcon">
            <div class="pageName">
              <svg class="pageNameSvg userManagmentIcon">
                <use xlink:href="#report"></use>
              </svg>
            </div>
            <h2>Summary</h2>
          </div>
        </v-card-text>
        <v-card class="mainCard pa-0 pl-0 ml-0 mt-0 m-3">
          <v-card-content>
            <table class="table attention machine-table mb-0">
              <thead class="tarnsactionHead">
                <tr>
                  <th style="width: 40%">Products</th>
                  <th>Article</th>
                  <th style="width: 15%">Quantity</th>
                  <th style="width: 15%">VAT%</th>
                  <th>With VAT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="width: 40%">Cheese Sub</td>
                  <td>A1088</td>
                  <td style="width: 15%">1</td>
                  <td style="width: 15%">15%</td>
                  <td>43.00</td>
                </tr>
                <tr>
                  <td style="width: 40%">Cheese Sub</td>
                  <td>A1088</td>
                  <td style="width: 15%">1</td>
                  <td style="width: 15%">15%</td>
                  <td>43.00</td>
                </tr>
              </tbody>
            </table>
            <v-card-content>
              <table class="orderModal mr-0 ma-auto ma-0">
                <thead class="summary">
                  <tr>
                    <th style="width: 65%"></th>
                    <th style="width: 15%">Quantity</th>
                    <th style="width: 15%">VAT</th>
                    <th style="width: 10%">Revenue</th>
                  </tr>
                </thead>
                <tbody class="summary">
                  <tr>
                    <td
                      class="pt-3 pb-2 pl-5 pr-5 text-right"
                      style="width: 64%"
                    ></td>
                    <td class="pt-3 pb-2 pl-2 pr-5" style="width: 15%">195</td>
                    <td class="pt-3 pb-2 pl-2 pr-5" style="width: 15%">
                      <strong> 15% </strong>
                    </td>
                    <td
                      class="pt-3 pb-2 pl-2 pr-5"
                      style="width: 10%; color: #000000"
                    >
                      9620.20
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="pt-3 pb-2 pl-5 pr-5 text-right"
                      style="width: 64%"
                    >
                      <strong> Total </strong>
                    </td>
                    <td class="pt-3 pb-2 pl-2 pr-5" style="width: 15%">195</td>
                    <td class="pt-3 pb-2 pl-2 pr-5" style="width: 15%"></td>
                    <td
                      class="pt-3 pb-2 pl-2 pr-5"
                      style="width: 10%; color: #000000"
                    >
                      9620.20
                    </td>
                  </tr>
                </tbody>
              </table>
            </v-card-content>
          </v-card-content>
        </v-card>
        <v-card-text class="pl-0">
          <div class="pageHeadingIcon">
            <div class="pageName">
              <svg class="pageNameSvg userManagmentIcon">
                <use xlink:href="#report"></use>
              </svg>
            </div>
            <h2>ABB</h2>
          </div>
        </v-card-text>
        <v-card class="mainCard pa-0 pl-0 ml-0 mt-0 m-3">
          <v-card-content>
            <table class="table attention machine-table mb-0">
              <thead class="tarnsactionHead">
                <tr>
                  <th style="width: 40%">Products</th>
                  <th>Article</th>
                  <th style="width: 15%">Quantity</th>
                  <th style="width: 15%">VAT%</th>
                  <th>With VAT</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="width: 40%">Cheese Sub</td>
                  <td>A1088</td>
                  <td style="width: 15%">1</td>
                  <td style="width: 15%">15%</td>
                  <td>43.00</td>
                </tr>
                <tr>
                  <td style="width: 40%">Cheese Sub</td>
                  <td>A1088</td>
                  <td style="width: 15%">1</td>
                  <td style="width: 15%">15%</td>
                  <td>43.00</td>
                </tr>
              </tbody>
            </table>
            <v-card-content>
              <table class="orderModal mr-0 ma-auto ma-0">
                <thead class="summary">
                  <tr>
                    <th style="width: 65%"></th>
                    <th style="width: 15%">Quantity</th>
                    <th style="width: 15%">VAT</th>
                    <th style="width: 10%">Revenue</th>
                  </tr>
                </thead>
                <tbody class="summary">
                  <tr>
                    <td
                      class="pt-3 pb-2 pl-5 pr-5 text-right"
                      style="width: 64%"
                    ></td>
                    <td class="pt-3 pb-2 pl-2 pr-5" style="width: 15%">195</td>
                    <td class="pt-3 pb-2 pl-2 pr-5" style="width: 15%">
                      <strong> 15% </strong>
                    </td>
                    <td
                      class="pt-3 pb-2 pl-2 pr-5"
                      style="width: 10%; color: #000000"
                    >
                      9620.20
                    </td>
                  </tr>
                  <tr>
                    <td
                      class="pt-3 pb-2 pl-5 pr-5 text-right"
                      style="width: 64%"
                    >
                      <strong> Total </strong>
                    </td>
                    <td class="pt-3 pb-2 pl-2 pr-5" style="width: 15%">195</td>
                    <td class="pt-3 pb-2 pl-2 pr-5" style="width: 15%"></td>
                    <td
                      class="pt-3 pb-2 pl-2 pr-5"
                      style="width: 10%; color: #000000"
                    >
                      9620.20
                    </td>
                  </tr>
                </tbody>
              </table>
            </v-card-content>
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
                show-week-numbers="false"
                v-model="dateRange"
              >
              </date-range-picker>
            </div>
            <input
              type="checkbox"
              id="vehicle1"
              name="vehicle1"
              value="Bike"
              class="ml-2"
            />
            <label class="ml-2 chckbox" for="vehicle1"> Group by days</label>
            <br />
            <input
              type="checkbox"
              id="vehicle1"
              name="vehicle1"
              value="Bike"
              class="ml-2"
            />
            <label class="ml-2 chckbox" for="vehicle1">
              Show sales by stock</label
            >
            <br />
            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Payment type</label
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
              >
                <option value="data" selected="selected">All sales</option>
              </select>
            </div>
            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Type</label
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
              >
                <option value="With VAT" selected="selected">With VAT</option>
                <option value="Without VAT">Without VAT</option>
              </select>
            </div>
            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Machines</label
            >
            <div class="filterScroll">
              <table class="orderModal selectMachine w-94 ml-2 mr-2">
                <tr style="border-bottom: 1px solid #e3dede">
                  <td class="pt-1 pb-1 pl-0 pr-0" style="width: 64%">
                    <input
                      type="checkbox"
                      id="vehicle1"
                      name="vehicle1"
                      value="Bike"
                      class="ml-2 mt-2"
                    />
                    <label class="ml-2 mb-0 chckbox" for="vehicle1">ABB</label>
                    <br />
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #e3dede">
                  <td class="pt-1 pb-1 pl-0 pr-0" style="width: 64%">
                    <input
                      type="checkbox"
                      id="vehicle1"
                      name="vehicle1"
                      value="Bike"
                      class="ml-2 mt-2"
                    />
                    <label class="ml-2 mb-0 chckbox" for="vehicle1">ABB</label>
                    <br />
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #e3dede">
                  <td class="pt-1 pb-1 pl-0 pr-0" style="width: 64%">
                    <input
                      type="checkbox"
                      id="vehicle1"
                      name="vehicle1"
                      value="Bike"
                      class="ml-2 mt-2"
                    />
                    <label class="ml-2 mb-0 chckbox" for="vehicle1">NRG</label>
                    <br />
                  </td>
                </tr>
              </table>
            </div>
            <div class="mt-2 d-flex text-center justify-center">
              <div class="filterLink">Select all</div>
              |
              <div class="filterLink">Deselect all</div>
            </div>
            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Product Tags</label
            >
            <div class="filterScroll">
              <table class="orderModal selectMachine w-94 ml-2 mr-2">
                <tr style="border-bottom: 1px solid #e3dede">
                  <td class="pt-1 pb-1 pl-0 pr-0" style="width: 64%">
                    <input
                      type="checkbox"
                      id="vehicle1"
                      name="vehicle1"
                      value="Bike"
                      class="ml-2 mt-2"
                    />
                    <label class="ml-2 mb-0 chckbox" for="vehicle1"
                      >Burger</label
                    >
                    <br />
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #e3dede">
                  <td class="pt-1 pb-1 pl-0 pr-0" style="width: 64%">
                    <input
                      type="checkbox"
                      id="vehicle1"
                      name="vehicle1"
                      value="Bike"
                      class="ml-2 mt-2"
                    />
                    <label class="ml-2 mb-0 chckbox" for="vehicle1"
                      >Pizza</label
                    >
                    <br />
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #e3dede">
                  <td class="pt-1 pb-1 pl-0 pr-0" style="width: 64%">
                    <input
                      type="checkbox"
                      id="vehicle1"
                      name="vehicle1"
                      value="Bike"
                      class="ml-2 mt-2"
                    />
                    <label class="ml-2 mb-0 chckbox" for="vehicle1"
                      >Snack</label
                    >
                    <br />
                  </td>
                </tr>
              </table>
            </div>
            <div class="mt-2 d-flex text-center justify-center">
              <div class="filterLink">Select all</div>
              |
              <div class="filterLink">Deselect all</div>
            </div>
            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Locations</label
            >
            <div class="filterScroll">
              <table class="orderModal selectMachine w-94 ml-2 mr-2">
                <tr style="border-bottom: 1px solid #e3dede">
                  <td class="pt-1 pb-1 pl-0 pr-0" style="width: 64%">
                    <input
                      type="checkbox"
                      id="vehicle1"
                      name="vehicle1"
                      value="Bike"
                      class="ml-2 mt-2"
                    />
                    <label class="ml-2 mb-0 chckbox" for="vehicle1">ABB</label>
                    <br />
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #e3dede">
                  <td class="pt-1 pb-1 pl-0 pr-0" style="width: 64%">
                    <input
                      type="checkbox"
                      id="vehicle1"
                      name="vehicle1"
                      value="Bike"
                      class="ml-2 mt-2"
                    />
                    <label class="ml-2 mb-0 chckbox" for="vehicle1">OHG</label>
                    <br />
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #e3dede">
                  <td class="pt-1 pb-1 pl-0 pr-0" style="width: 64%">
                    <input
                      type="checkbox"
                      id="vehicle1"
                      name="vehicle1"
                      value="Bike"
                      class="ml-2 mt-2"
                    />
                    <label class="ml-2 mb-0 chckbox" for="vehicle1"
                      >Topro</label
                    >
                    <br />
                  </td>
                </tr>
              </table>
            </div>
            <div class="mt-2 d-flex text-center justify-center">
              <div class="filterLink">Select all</div>
              |
              <div class="filterLink">Deselect all</div>
            </div>
            <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Clients</label
            >
            <div class="filterScroll">
              <table class="orderModal selectMachine w-94 ml-2 mr-2">
                <tr style="border-bottom: 1px solid #e3dede">
                  <td class="pt-1 pb-1 pl-0 pr-0" style="width: 64%">
                    <input
                      type="checkbox"
                      id="vehicle1"
                      name="vehicle1"
                      value="Bike"
                      class="ml-2 mt-2"
                    />
                    <label class="ml-2 mb-0 chckbox" for="vehicle1">ABB</label>
                    <br />
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #e3dede">
                  <td class="pt-1 pb-1 pl-0 pr-0" style="width: 64%">
                    <input
                      type="checkbox"
                      id="vehicle1"
                      name="vehicle1"
                      value="Bike"
                      class="ml-2 mt-2"
                    />
                    <label class="ml-2 mb-0 chckbox" for="vehicle1">OHG</label>
                    <br />
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid #e3dede">
                  <td class="pt-1 pb-1 pl-0 pr-0" style="width: 64%">
                    <input
                      type="checkbox"
                      id="vehicle1"
                      name="vehicle1"
                      value="Bike"
                      class="ml-2 mt-2"
                    />
                    <label class="ml-2 mb-0 chckbox" for="vehicle1"
                      >Topro</label
                    >
                    <br />
                  </td>
                </tr>
              </table>
            </div>
            <div class="mt-2 mb-3 d-flex text-center justify-center">
              <div class="filterLink">Select all</div>
              |
              <div class="filterLink">Deselect all</div>
            </div>
            <div class="mb-5 ml-2 mr-2 filterBtn">
              <v-btn class="mr-4" style="background-color: #ecf5f7"
                >Select</v-btn
              >
              <v-btn class="mr-4" style="background-color: #ecf5f7"
                >Excel</v-btn
              >
              <v-btn class="mr-4" style="background-color: #ecf5f7">PDF</v-btn>
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

export default {
  components: {
    DateRangePicker,
  },
  data() {
    return {
      showFilter: false,
      minDate: "",
      maxDate: "",
      dateRange: { from: new Date(), to: new Date() },
    };
  },
  watch: {},
  methods: {
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
  },
  mounted() { 
    var start_date = new Date(this.dateRange.startDate); 
  },
  computed: {},
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
