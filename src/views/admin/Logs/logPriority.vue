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
      <v-dialog
        v-model="dialog"
        transition="dialog-top-transition"
        scrollable
        width="1024px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            dark
            color="main_bg_color"
            v-bind="attrs"
            v-on="on"
            class="pr-5 pl-3"
            @click="
              isEdit = false;
              itemEdit = null;
            "
          >
            <i class="mr-2">
              <svg class="pageNameSvg productIcon">
                <use xlink:href="#role-per-icon"></use></svg></i
            >Priority</v-btn
          >
        </template>
        <template v-if="dialog" v-slot:default="dialog">
          <v-card>
            <v-toolbar
              class="mb-2 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <span
                v-if="isEdit == false"
                class="text-center justify-center"
                style="font-size: 26px !important"
                >Add Priority
              </span>
              <span v-else>Edit Priority</span>
              <span @click="closeModel" class="crossPossition">
                <img src="../../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>
            <v-card-text>
              <addPriority
                :isEdit="isEdit"
                :item="itemEdit"
                @closeIt="closeModel"
              ></addPriority>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
      <v-dialog
        v-model="viewDialog"
        transition="dialog-top-transition"
        scrollable
        width="1024px"
      >
        <template v-if="viewDialog" v-slot:default="viewDialog">
          <v-card>
            <v-toolbar
              class="mb-2 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <span>View Priority</span>
              <span @click="closeModel" class="crossPossition">
                <img src="../../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>
            <v-card-text>
              <viewPriority
                :item="itemEdit"
                @closeIt="closeModel"
              ></viewPriority>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </div>
    <div class="tableWrapper">
      <table class="row mx-0" id="myTable">
        <thead class="px-0">
          <tr class="tableHead">
            <th class="name" style="width: 30%">Alert Event</th>
            <th class="name" style="width: 30%">Priority</th>
            <th class="name" style="width: 30%; border: none;">Action</th>
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
            v-for="(data, index) in getpriorityList"
            :key="index"
            class="px-0 tabledata"
          >
            <td class="namedata" style="width: 30%" @click="viewItem(data)">
              {{ data.title ? data.title : "" }}
            </td>
            <td class="namedata" style="width: 30%" @click="viewItem(data)">
              {{ data.priority }}
            </td>
            <td class="namedata" style="width: 30%">
              <span>
                <td class="actiondata actionIcons" style="width: 20%">
                  <a @click="editItem(data)" class="actionIcon">
                    <svg class="svgIcon">
                      <use xlink:href="#editIcon"></use>
                    </svg>
                  </a>
                  <a @click="viewItem(data)" class="actionIcon">
                    <svg class="svgIcon">
                      <use xlink:href="#openeyeIcon"></use>
                    </svg>
                  </a>
                  <a @click="warningModel(data._id)" class="actionIcon">
                    <svg class="svgIcon">
                      <use xlink:href="#deleteIcon"></use>
                    </svg>
                  </a>
                </td>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagiNationWrapper notranslate">
      <p v-if="getpriorityListTotal">
        Showing {{ currentPage }}-{{ getpriorityList.length }} of
        {{ getpriorityListTotal }} results
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
    <v-card-actions class="pa-5">
      <v-dialog
        v-model="delDialog"
        transition="dialog-top-transition"
        scrollable
      >
        <template v-if="delDialog" v-slot:default="delDialog">
          <v-card>
            <v-toolbar
              class="mb-2 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <span
                style="font-size: 30px !important; font-weight: 800 !important"
                >Warning</span
              >
              <span @click="closeModel" class="crossPossition">
                <img src="../../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>

            <v-card-text class="pt-10 text-h6">
              Do you want to delete this Product?

              <v-col class="col-12 d-flex justify-space-around">
                <v-btn
                  class="mr-4 modal-btn"
                  dark
                  color="main_bg_color"
                  @click="YesModel"
                >
                  Yes
                </v-btn>
                <v-btn class="modal-btn" @click="closeWarningModel"> No </v-btn>
              </v-col>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
  </div>
</template>
<script>
import addPriority from "../../../components/priorities/addPriority.vue";
import viewPriority from "../../../components/priorities/viewPriority.vue";
import Swal from "sweetalert2";
import { mapGetters } from "vuex";
export default {
  components: {
    addPriority,
    viewPriority,
  },
  data() {
    return {
      isEdit: false,
      itemEdit: null,
      viewDialog: false,
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
    viewItem(obj) {
      this.itemEdit = obj;
      this.viewDialog = true;
    },
    editItem(obj) {
      this.isEdit = true;
      this.itemEdit = obj;
      this.dialog = true;
    },
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
      this.table_loader = true;
      this.search = this.search == null ? "" : this.search;
      await this.$store.dispatch("getRoleList", { pagination: true });
      await this.$store.dispatch("getAllPriority", {
        resultPerPage: 10,
        filter: this.search,
        currentPage: this.currentPage,
      });
      this.table_loader = false;
    },

    async closeModel() {
      // await this.fetchData();
      this.itemEdit = null;
      this.dialog = false;
      this.viewDialog = false;
      this.isEdit = false;
      this.fetchData();
    },

    warningModel(id) {
      this.delDialog = true;
      this.deleteId = id;
    },

    closeWarningModel() {
      this.delDialog = false;
      this.deleteId = "";
    },
    YesModel() {
      this.delDialog = false;
      this.$store.dispatch("removePriority", this.deleteId).then((res) => {
        if (res.success) {
          Swal.fire({
            icon: "success",
            text: res.message,
            title: "Success!",
          });
        } else {
          Swal.fire({
            icon: "error",
            title: "Error!",
            text: res.message ? res.message : "There was an issue",
          });
        }
        this.fetchData();
      });
    },
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    ...mapGetters(["getpriorityList", "getpriorityListTotal"]),
    maxPages() {
      return Math.ceil(this.getpriorityListTotal / 10);
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
