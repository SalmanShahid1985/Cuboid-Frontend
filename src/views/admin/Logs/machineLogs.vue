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
          <h2>System Logs</h2>
        </div>
      </v-card-text>
    </div>
    <div class="tableWrapper">
      <table class="row mx-0" id="myTable">
        <thead class="px-0">
          <tr class="tableHead">
            <th class="name" style="width: 20%">Date</th>
            <th class="name" style="width: 30%">Events</th>
            <th class="name" style="width: 50%; border: none">Message</th>
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
            v-for="(data, index) in getLogList"
            :key="index"
            class="px-0 tabledata"
          >
            <td class="namedata" style="width: 20%">
              <span v-if="data.createdAt">
                {{ dateFormat(data.createdAt) }}</span
              >
            </td>
            <td class="namedata" style="width: 30%">
              {{ data.event }}
            </td>
            <td class="namedata" style="width: 50%">
              {{ data.message }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagiNationWrapper notranslate">
      <p v-if="getLogListTotal">
        Showing {{ currentPage }}-{{ getLogList.length }} of
        {{ getLogListTotal }} results
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
</template>
<script>
import addUser from "../../../components/users/addUser.vue";
import addCanteen from "../../../components/canteen/addCanteen.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    addUser,
    addCanteen,
  },
  data() {
    return {
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
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
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
      this.table_loader = true;
      this.search = this.search == null ? "" : this.search;
      await this.$store.dispatch("getRoleList", { pagination: true });
      await this.$store.dispatch("getLogList", {
        resultPerPage: 10,
        filter: this.search,
        currentPage: this.currentPage,
      });
      this.table_loader = false;
    },

    async closeModel() {
      // await this.fetchData();
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
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    ...mapGetters(["getLogList", "getLogListTotal"]),
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
