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
          <h2>Logs</h2>
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
    <div class="col-12 d-flex row">
      <div  :class="showFilter ? 'col-md-9' : 'col-md-12'" class="tableWrapper">
        <table class="row mx-0" id="myTable">
          <thead class="px-0">
            <tr class="tableHead">
              <th class="name" style="width: 20%">Canteen</th>
              <th class="name" style="width: 20%">Machine Number</th>
              <th class="name" style="width: 20%">Machine Name</th>
              <th class="name" style="width: 20%">Date</th>
              <th class="name" style="width: 25%">Status</th>
              <th class="name" style="width: 35%; border: none">Events</th>
            </tr>
          </thead>
          <div class="my-7" v-if="table_loader">
            <v-progress-linear
              color="orange darken-1"
              indeterminate
            ></v-progress-linear>
          </div>
          <tbody class="px-0" v-if="!table_loader">
            <tr
              v-for="(data, index) in geteventList"
              :key="index"
              class="px-0 tabledata"
            >
              <td class="namedata" style="width: 20%">
                {{ data.canteen_name }}
              </td>
              <td class="namedata" style="width: 20%">
                {{ data.machine_number }}
              </td>
              <td class="namedata" style="width: 20%">
                {{ data.machine_name }}
              </td>
              <td class="namedata" style="width: 20%">
                  {{ dateFormat(data.date) }}
              </td>
              <td class="namedata" style="width: 25%">
                {{ data.status_of_event }}
              </td>
              <td
                class="namedata pr-3"
                style="width: 35%; word-break: break-word"
              >
                {{ data.event }}
              </td>
            </tr>
          </tbody>
        </table>
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
            >Period</label>
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
              <i style="padding: 8.2px 12px"
                ><img
                  src="../../../assets/logos/bxs-down-arrow.svg"
                  height="7px"
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
      <div  :class="showFilter ? 'col-md-9' : 'col-md-12'" class="pagiNationWrapper notranslate">
        <p v-if="geteventListTotal">
          Showing {{ currentPage }}-{{ geteventList.length }} of
          {{ geteventListTotal }} results
        </p>
        <p v-else>Showing 0-0 of 0 results</p>

        <ul class="pagiNation notranslate">
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
            v-if="currentPage == maxPages && currentPage > 2"
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

          <li @click="updateCurrentPage(currentPage)" class="pagiNation-item">
            <span class="page-link activepage"> {{ currentPage }}</span>
          </li>
          <li
            v-if="currentPage + 1 <= maxPages"
            @click="updateCurrentPage(currentPage + 1)"
            class="pagiNation-item"
          >
            <span class="page-link"> {{ currentPage + 1 }}</span>
          </li>
          <li
            v-if="currentPage == 1 && maxPages > 2"
            @click="updateCurrentPage(currentPage + 2)"
            class="pagiNation-item"
          >
            <span class="page-link"> {{ currentPage + 2 }}</span>
          </li>

          <li
            v-if="currentPage != maxPages"
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
      </div>
      
    </div>
  </div>
</template>
<script>
import addUser from "../../../components/users/addUser.vue";
import addCanteen from "../../../components/canteen/addCanteen.vue";
import DateRangePicker from "vue2-daterange-picker";
import "vue2-daterange-picker/dist/vue2-daterange-picker.css";
import { mapGetters } from "vuex";
export default {
  components: {
    addUser,
    addCanteen,
    DateRangePicker
  },
  data() {
    return {
      showFilter: false,
      isEdit: false,
      currentPage: 1,
      dialog: false,
      table_loader: true,
      deletedialog: false,
      delDialog: false,
      allowDel: false,
      itemId: "",
      isfetching: false,
      search: "",
      permissions: [],
      items: [],
      fields: [
        {
          value: "user_name",
          text: "Name",
        },
        {
          value: "user_email",
          text: "Email",
        },
        {
          value: "user_phone",
          text: "PHONE.",
        },
        {
          value: "user_role",
          text: "Role",
        },
        {
          value: "user_status",
          text: "Status",
        },
        {
          value: "actions",
          text: "Action",
          sortable: false,
        },
      ],
      canteenValue: "all",
      machineValue: "all",
      canteens: null,
      dateRange: { startDate: "2020-01-01", endDate: new Date() },
      minDate: "2020-01-01",
      maxDate: new Date(),
      periodValue: "month",
      showCustomDate: false,
      startDate: null,
      endDate: null,
    };
  },
  watch: {
    currentPage: {
      handler: function () {
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
    dateFormat(obj) {
      var item = new Date(obj);
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
      var month = monthNames[item.getMonth()];
      var date = item.getDate();
      var year = item.getFullYear();

      var hours = item.getHours();
      var minutes = item.getMinutes();
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return `${date} ${month}, ${year} ${strTime}`;
    },
    hasPermission(obj) {
      // if (
      //   this.userDetails &&
      //   this.userDetails.user &&
      //   this.userDetails.user.user_role == "super_admin"
      // ) {
      return true;
      // } else {
      //   return this.userDetails.permissions.permission_name.includes(obj);
      // }
    },
    roleName(obj) {
      if (obj) {
        let name = this.getroleList.filter((x) => x._id == obj);
        if (name.length > 0) {
          return name[0].name;
        }
      } else {
        return;
      }
    },
    updateCurrentPage(obj) {
      if (obj >= 1) {
        this.currentPage = obj;
      }
    },
    async fetchData() {
      console.log(this.geteventList);
      this.table_loader = true;
      this.search = this.search == null ? "" : this.search;
      await this.$store.dispatch("getRoleList", { pagination: true });
      await this.$store.dispatch("getEventsList", {
        resultPerPage: 10,
        filter: this.search,
        currentPage: this.currentPage,
        startDate: this.startDate,
        endDate: this.endDate,
        canteenValue: this.canteenValue,
        machineValue: this.machineValue,
      });
      this.table_loader = false;
    },

    async closeModel() {
      await this.fetchData();
      this.dialog = false;
      this.isEdit = false;
    },

    warningModel(id) {
      this.delDialog = true;
      this.itemId = id;
    },

    closeWarningModel() {
      this.delDialog = false;
      this.itemId = "";
    },
    clearFilter() {
      this.canteenValue = "all";
      this.machineValue = "all";
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
    this.$store.dispatch("canteensSearchList");
    if(this.getCanteensSearchList && this.getCanteensSearchList.data && this.getCanteensSearchList.data.length > 0){
      this.canteens = this.getCanteensSearchList.data.map((canteen) => { return canteen});
    }
    this.fetchData();
  },
  computed: {
    ...mapGetters(["geteventList", "geteventListTotal", "getMachineSearchList", "getCanteensSearchList"]),
    maxPages() {
      return Math.ceil(this.geteventListTotal / 10);
    },
  },
};
</script>

<style scoped>
.bg-clr {
  background-color: #ecf5f7;
}
.v-input__slot:before {
  border: none;
}
.v-card__actions > .v-btn.v-btn {
  padding: 0 20px;
}
.theme--light.v-data-table thead {
  background-color: #747474 !important;
}
.b-border {
  border-bottom: 1px solid #f8932d;
}
</style>
