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
          <h2>Dashboard</h2>
        </div>
      </v-card-text>

      <div class="d-flex pb-0">
        <div class="right-inner-addon input-container pb-0 mr-3">
          <i style="padding: 8px"
            ><img src="../../../assets/logos/bxs-down-arrow.svg" height="7px"
          /></i>
          <select v-model="month" class="form-control login-field">
            <option v-for="(item, index) in monthList" :key="index">
              {{ item }}, {{ new Date().getFullYear() }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <p class="disclaimer-container">
      *The total price is inclusive of all taxes (discount/promotions/subsidy
      may also have been included if applied).
    </p>
    <template>
      <div class="dashboard-grid">
        <v-card
          style="overflow-x: auto; overflow-y: hidden"
          class="line-chart mainCard pa-0 pb-0 pl-0 ml-0 m-3"
        >
          <v-card-header>
            <h6
              class="
                d-flex
                justify-space-between
                pl-3
                pb-1
                pt-1
                align-center
                b-bottom
                cardHeading
              "
            >
              <strong>Sales </strong>
              <div class="d-flex justify-end py-1">
                <v-btn
                  @click="linePropType = 'revenue'"
                  class="cardHeading mr-3"
                  >Revenue</v-btn
                >
                <v-btn @click="linePropType = 'count'" class="cardHeading"
                  >Count</v-btn
                >
              </div>
            </h6>
          </v-card-header>

          <v-card-content v-if="lineChartData">
            <div
              class="d-flex align-center notranslate"
              style="min-width: 450px"
            >
              <div
                style="
                  transform: rotate(-90deg);
                  white-space: nowrap;
                  font-size: 18px;
                  position: absolute;
                "
              >
                <p style="letter-spacing: 2px" v-if="linePropType == 'revenue'">
                  Sales NOK
                </p>
                <p style="letter-spacing: 2px" v-else>Sale Count</p>
              </div>
              <div style="margin: auto; flex-basis: 95%">
                <line-chart
                  style="min-height: 20em"
                  :lineData="lineChartData"
                  :propType="linePropType"
                  :dateFilter="month"
                />
              </div>
            </div>
          </v-card-content>
          <v-card-content
            v-else
            class="d-flex justify-center align-center"
            style="min-height: 150px"
            ><v-progress-circular color="orange darken-1" indeterminate />
          </v-card-content>
        </v-card>
        <!-- <v-card
          style="overflow-x: auto; overflow-y: hidden"
          class="bar-chart mainCard pa-0 pb-0 pl-0 ml-0 m-3"
        >
          <v-card-header>
            <h6
              class="
                d-flex
                justify-space-between
                align-center
                pb-1
                pt-1
                pl-3
                b-bottom
                cardHeading
                mb-0
              "
            >
              <strong>Products</strong>
              <div
                class="mt-1"
                style="display: flex; justify-content: flex-end"
              >
                <v-btn
                  @click="barPropType = 'revenue'"
                  class="pa-3 b-bottom cardHeading mb-0 mr-3"
                  >Revenue</v-btn
                >
                <v-btn
                  @click="barPropType = 'count'"
                  class="pa-3 b-bottom cardHeading mb-0 mr-3"
                  >Count</v-btn
                >
              </div>
            </h6>
          </v-card-header>
          <v-card-content v-if="gettopproduct">
            <div style="min-width: 350px">
              <bar-chart
                style="min-height: 20em"
                :barData="gettopproduct"
                :propType="barPropType"
              />
            </div>
          </v-card-content>
          <v-card-content
            v-else
            class="d-flex justify-center align-center"
            style="min-height: 150px"
            ><v-progress-circular color="orange darken-1" indeterminate />
          </v-card-content>
        </v-card> -->
        <v-card class="total-sales mainCard pa-0 pl-0 ml-0 m-3">
          <v-card-header>
            <h6 class="pa-3 b-bottom cardHeading mb-0">
              <strong>Total Sales and Revenue </strong>
            </h6>
          </v-card-header>
          <v-card-content v-if="getsalerevenue">
            <v-card-text class="p-2 pt-3 pb-1">
              <div class="d-flex text-center justify-start mt-1">
                <img
                  src="../../../assets/logos/revenue.svg"
                  class="pl-2 pr-3"
                  height="45px"
                />
                <div class="d-flex flex-column align-items-start pl-2 pr-3">
                  <span class="subHeading"><strong>REVENUE</strong></span>
                  <h5>
                    <strong v-if="getsalerevenue.data[0]"
                      >NOK {{ getsalerevenue.data[0].revenue }}</strong
                    >
                    <strong v-else>0</strong>
                  </h5>
                </div>
              </div>
              <div class="d-flex mt-5 text-center justify-start">
                <img
                  src="../../../assets/logos/saless.svg"
                  class="pl-2 pr-3"
                  height="45px"
                />
                <div class="d-flex flex-column align-items-start pl-2 pr-3">
                  <span class="subHeading"><strong>SALES</strong></span>
                  <h5>
                    <strong v-if="getsalerevenue.data[0]">{{
                      getsalerevenue.data[0].sales
                    }}</strong>
                    <strong v-else>0</strong>
                  </h5>
                </div>
              </div>
            </v-card-text>
          </v-card-content>
          <v-card-content
            v-else
            class="d-flex justify-center align-center"
            style="min-height: 150px"
            ><v-progress-circular color="orange darken-1" indeterminate />
          </v-card-content>
        </v-card>
        <v-card class="top-machines mainCard pa-0 pl-0 ml-0 m-3">
          <v-card-header>
            <h6 class="pa-3 b-bottom cardHeading mb-0">
              <strong>Top Machines </strong>
            </h6>
          </v-card-header>
          <v-card-content v-if="gettopmachine">
            <table class="table machine-table mb-0">
              <thead>
                <tr>
                  <th style="width: 32%">Name</th>
                  <th style="width: 14%">Sales</th>
                  <th style="width: 31%">Revenue</th>
                </tr>
              </thead>
              <tbody v-if="gettopmachine.data">
                <tr v-for="(data, index) in gettopmachine.data" :key="index">
                  <td class="name">{{ data.machine }}</td>
                  <td>{{ data.count }}</td>
                  <td>NOK {{ data.revenue }}</td>
                </tr>
              </tbody>
            </table>
          </v-card-content>
          <v-card-content
            v-else
            class="d-flex justify-center align-center"
            style="min-height: 150px"
            ><v-progress-circular color="orange darken-1" indeterminate />
          </v-card-content>
        </v-card>
        <v-card class="top-events mainCard pa-0 pl-0 ml-0 m-3">
          <v-card-header>
            <h6 class="pa-3 b-bottom cardHeading mb-0">
              <strong>Top 10 Events</strong>
            </h6>
          </v-card-header>
          <v-card-content v-if="gettopevent">
            <table class="table machine-table mb-0">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Frequency</th>
                </tr>
              </thead>
              <tbody v-if="gettopevent.data">
                <tr v-for="(item, index) in gettopevent.data" :key="index">
                  <td>{{ item.description }}</td>
                  <td>{{ item.frequency }}</td>
                </tr>
              </tbody>
            </table>
          </v-card-content>
          <v-card-content
            v-else
            class="d-flex justify-center align-center"
            style="min-height: 150px"
            ><v-progress-circular color="orange darken-1" indeterminate />
          </v-card-content>
        </v-card>
      </div>
    </template>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
import lineChart from "../../../components/reports/lineChart.vue";
import BarChart from "../../../components/reports/barChart.vue";

export default {
  components: { lineChart, BarChart, },

  data() {
    return {
      month: "",
      totalsaleAndrevenue: "2022-06-01",
      topproduct: "2022-06-01",
      topevent: "2022-06-01",
      machine_name: "",
      linePropType: "revenue",
      barPropType: "revenue",
      lineChartData: []
    };
  },
  watch: {
    month: {
      handler: function () {
        this.fetchData();
      },
    },
    getsaledashboard:{
      handler: function (data) {
        this.lineChartData = data;
      },
    },
    
  },
  methods: {
    async fetchData() {
      await this.$store.dispatch("SaleRevenue", {
        salemonth: this.month,
      }),
        await this.$store.dispatch("SaleDashboard", {
          month: this.month,
        }),
        // await this.$store.dispatch("TopProducts", {
        //   Tproduct: this.month,
        // }),
        await this.$store.dispatch("TopMachine", {
          Tmachine: this.month,
        }),
        await this.$store.dispatch("TopEvents", {
          Tevent: this.month,
        });
    },
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
      var month = monthNames[new Date().getMonth()];
      var year = new Date().getFullYear()
this.month = month + ',' + ' ' + year
    },
  },
  mounted() {
    this.changeMonth();
    this.fetchData();
  
  },
  computed: {
    ...mapGetters([
      "getsalerevenue",
      "getsaledashboard",
      "gettopproduct",
      "gettopmachine",
      "gettopevent",
    ]),
    monthList() {
      var months = [
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
      var currentMonth = new Date().getMonth();
      months.length = currentMonth + 1;
      return months;
    },
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
.dashboard-grid {
  display: grid;
  /* grid-template-areas: "line line" "bar totalSales" "bar topMachines" "topEvents topMachines" "topEvents ." */
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
.line-chart {
  grid-column-start: 1;
  grid-column-end: 4;
}
.bar-chart {
  grid-column-start: 1;
  grid-column-end: 4;
}
.total-sales {
}
.top-events {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 2;
}
.top-machines {
  grid-column-start: 3;
  grid-column-end: 5;
  grid-row-start: 2;
}
</style>
