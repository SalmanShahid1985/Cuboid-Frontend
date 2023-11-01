<template>
  <div>
    <div class="view-header mb-2 mt-3">
      <v-card-text>
        <div class="pageHeadingIcon">
          <div class="pageName">
            <i>
              <img
                src="../../../assets/logos/Group 1332.svg"
                height="35px"
                style="margin-top: -8px"
              />
            </i>
          </div>

          <h5 style="font-size: 22px; font-weight: 400">Canteen Management</h5>
        </div>
      </v-card-text>

      <div class="right-inner-addon2 input-container pb-0">
        <i
          ><img
            src="../../../assets/logos/Icon ionic-ios-search.svg"
            height="15px"
        /></i>

        <input
          class="left normal border-radius bg-clr mt-1 searchfield"
          type="text"
          v-model="search"
          placeholder="Search Here..."
        />
      </div>

      <v-card-actions class="pa-5">
        <v-dialog
          v-model="dialog"
          transition="dialog-top-transition"
          scrollable
          width="1024px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-if="hasPermission('user_create')"
              dark
              color="main_bg_color"
              v-bind="attrs"
              v-on="on"
              ><i class="mr-2">
                <img
                  src="../../../assets/logos/canteen-transparent.svg"
                  alt="icon"
                  style="margin-top: -5px" /></i
              >Add Canteen</v-btn
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
                  >Add Canteen
                </span>
                <span v-else>Edit Canteen</span>
                <span @click="closeModel" class="crossPossition">
                  <img src="../../../assets/logos/Icon metro-cross.svg" />
                </span>
              </v-toolbar>
              <v-card-text v-if="isEdit == false">
                <addCanteen @closeIt="closeModel" :isEdit="isEdit"></addCanteen>
              </v-card-text>
              <v-card-text v-else>
                <addCanteen @closeIt="closeModel" :isEdit="isEdit"></addCanteen>
                <!-- <editUser @closeIt="closeModel"></editUser> -->
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
        <!------------------csv download ------------>
        <vue-blob-json-csv
          file-type="csv"
          file-name="Canteen"
          :data="json_data"
        >
          <b-button
            title="download file"
            class="ml-3 d-flex"
            style="background-color: transparent; color: orange"
            @click="downloadCsv()"
          >
            <b-icon icon="download"></b-icon>
            <span class="mx-2">CSV</span>
          </b-button>
        </vue-blob-json-csv>
        <!------------------csv download ------------>
      </v-card-actions>
      <v-card-actions class="pa-5">
        <v-dialog
          v-model="viewdialog"
          transition="dialog-top-transition"
          scrollable
          width="1024px"
        >
          <template v-if="viewdialog" v-slot:default="viewdialog">
            <v-card>
              <v-toolbar
                class="mb-2 text-center justify-center b-border m-2"
                style="box-shadow: none"
              >
                <span>View Canteen</span>
                <span @click="closeModel" class="crossPossition">
                  <img src="../../../assets/logos/Icon metro-cross.svg" />
                </span>
              </v-toolbar>

              <v-card-text>
                <viewCanteen @closeIt="closeModel"></viewCanteen>
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
      </v-card-actions>
    </div>
    <div class="tableWrapper">
      <table class="row mx-0" id="myTable">
        <thead class="px-0">
          <tr class="tableHead">
            <th class="name" style="width: 20%">Id</th>
            <th class="name" style="width: 20%">Name</th>
            <th class="name" style="width: 20%">Companies</th>
            <th class="email" style="width: 35%">Canteen QR</th>
            <th class="email" style="width: 35%">Payment Method</th>
            <th class="email" style="width: 35%">Location</th>
            <th class="status" style="width: 20%">Status</th>
            <th class="status" style="width: 20%">Connected Status</th>            
            <th class="action" style="width: 25%">Action</th>
          </tr>
        </thead>
        <tbody class="px-0">
          <div class="my-7" v-show="table_loader">
            <v-progress-linear
              indeterminate
              color="orange darken-1"
            ></v-progress-linear>
          </div>
          <div>
            <tr
              v-for="(data, index) in canteens"
              :key="index"
              class="px-0 tabledata"
            >
              <td class="namedata" style="width: 20%" @click="viewItem(data)">
                {{ data._id || ''}}
              </td>
              <td class="namedata" style="width: 20%" @click="viewItem(data)">
                {{ data.canteen_name || ''}}
              </td>
              <td class="namedata" style="width: 20%; word-break: normal;" @click="viewItem(data)">
                <span v-show="data.canteen_company_ids">
                  {{ getCompanyName(data.canteen_company_ids) }}</span
                >
              </td>
              <td class="emaildata" style="width: 35%" @click="viewItem(data)">
                <qr-code :text="urluser + data._id" :size="100"></qr-code>
              </td>
              <td class="emaildata" style="width: 35%" @click="viewItem(data)">
                {{ data.payment_method && data.payment_method.toString() || ''}}
              </td>
              <td class="emaildata" style="width: 35%" @click="viewItem(data)">
                {{ data.canteen_location && data.canteen_location || ''}}
              </td>
              <td class="statusdata" style="width: 20%" @click="viewItem(data)">
                <button
                  :class="
                    data.canteen_status && data.canteen_status == 'Active'
                      ? 'btnActive green'
                      : 'btnActive grey'
                  "
                >
                  {{ data.canteen_status && data.canteen_status == "Active" ? "Active" : "DeActive" }}
                </button>
              </td>
              <td class="statusdata" style="width: 20%" @click="viewItem(data)">
                <button
                  :class="
                    data.connectedCanteen
                      ? 'btnActive green'
                      : 'btnActive grey'
                  "
                >
                  {{ data.connectedCanteen ? "Online" : "Offline" }}
                </button>
              </td>
              <td class="actiondata actionIcons" style="width: 25%">
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
            </tr>
          </div>
        </tbody>
      </table>
    </div>
    <div class="pagiNationWrapper notranslate">
      <p v-if="getcanteenList">
        Showing {{ currentPage }}-{{ getcanteenList.length }} of
        {{ getcanteenListTotal }} results
      </p>
      <p v-else>Showing 0-0 of 0 results</p>

      <!-- Page Bar at bottom of table -->

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
              <span>Warning</span>
              <span @click="closeModel" class="crossPossition">
                <img src="../../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>

            <v-card-text class="pt-10 text-h6">
              Do you want to delete this Canteen?

              <v-col class="col-12 d-flex justify-space-around">
                <v-btn
                  class="mr-4 modal-btn"
                  dark
                  color="main_bg_color"
                  @click="deleteItem"
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
    <v-card-actions style="width: 500px" class="pa-5">
      <v-dialog
        v-model="successDialog"
        transition="dialog-top-transition"
        scrollable
      >
        <template v-if="successDialog" v-slot:default="successDialog">
          <v-card>
            <v-toolbar
              class="mb-2 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <span style="font-weight: bolder">Successful</span>
              <span @click="closeModel" class="crossPossition">
                <img src="../../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>

            <v-card-text class="pt-10 text-h6">
              <center>
                <span>Canteen is Deleted Successfully</span><br /><br />
                <i
                  ><img
                    src="../../../assets/logos/Path 10980.svg"
                    height="100px"
                /></i>
              </center>
              <br /><br />
              <v-col class="col-12 d-flex justify-space-around">
                <v-btn
                  class="modal-btn"
                  style="min-width: 100px !important"
                  @click="closeSuccessModel"
                >
                  Close
                </v-btn>
              </v-col>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
  </div>
</template>
<script>
import addCanteen from "../../../components/canteen/addCanteen.vue";
import viewCanteen from "../../../components/canteen/viewCanteen.vue";

import { mapGetters } from "vuex";
import Swal from "sweetalert2";
export default {
  components: {
    addCanteen,
    viewCanteen,
  },
  data() {
    return {
      json_data: [],
      table_loader: true,
      urluser: process.env.VUE_APP_QR_URL,
      urlmachine: process.env.VUE_APP_QR_MachineFiller_URL,
      isEdit: false,
      dialog: false,
      currentPage: 1,
      viewdialog: false,
      delDialog: false,
      allowDel: false,
      itemId: "",
      isfetching: false,
      successDialog: false,
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
      isApprovedOptions: [
        { text: "Approved", value: true },
        { text: "Not Approved", value: false },
      ],
      canteens: []
    };
  },
  watch: {
    currentPage: {
      handler: function () {
        this.fetchData();
      },
    },
    search: {
      handler: function () {
        this.currentPage = 1;
        this.fetchData();
      },
    },
    getcanteenList: {
      handler: function () {
        this.items = this.getcanteenList;

        if(this.getcanteenList && this.getcanteenList.length > 0) {
          this.canteens = this.getcanteenList.map((canteen) => {
          let connectedCanteen = false;
          const now = new Date();
          if(canteen && canteen.lastHeartBeat) {
            const lastHeartbeatOn = new Date(canteen.lastHeartBeat);
            const difference = (((now - lastHeartbeatOn)/1000)/60);
            connectedCanteen = difference <= 5 ? true: false;
          }
          return {
            ...canteen,
            connectedCanteen
          }
        });
      }
      console.log('canteens',this.canteens);
      },
    },
  },
  methods: {
    getCompanyName(obj) {
      var dataArr = [];
      obj.forEach((x) => {
        dataArr.push(x.user_name);
      });
      return dataArr.join(", ");
    },
    async downloadCsv() {
      var vm = this;
      await this.$store
        .dispatch("getcanteensList", { pagination: true })
        .then((x) => {
          x.forEach((e) => {
            vm.json_data.push({
              ID: e._id,
              Name: e.canteen_name,
              Location: e.canteen_location,
            });
          });
        });
    },
    updateCurrentPage(obj) {
      if (obj >= 1) {
        this.currentPage = obj;
      }
    },
    canteenurl(a, b) {
      return parseInt(a) + parseInt(b);
    },
    closeSuccessModel() {
      this.successDialog = false;
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
    async fetchData() {
      this.isfetching = true;
      await this.$store.dispatch("getCompanyList", { pagination: true });
      await this.$store.dispatch("getRoleList", { pagination: true });
      await this.$store.dispatch("getUserList", { pagination: true });
      await this.$store.dispatch("getmachineFillerList", { pagination: true });
      await this.$store.dispatch("getcanteensList", {
        resultPerPage: 10,
        filter: this.search,
        currentPage: this.currentPage,
      });
      this.table_loader = false;

      
    },

    editItem(obj) {
      this.$store.dispatch("getcanteenById", obj);
      this.dialog = true;
      this.isEdit = true;
    },
    viewItem(obj) {
      this.$store.dispatch("getcanteenById", obj);
      this.viewdialog = true;
    },
    async closeModel() {
      this.dialog = false;
      this.delDialog = false;
      this.successDialog = false;
      this.viewdialog = false;
      this.isEdit = false;
      await this.fetchData();
    },

    warningModel(id) {
      this.delDialog = true;
      this.itemId = id;
    },

    closeWarningModel() {
      this.delDialog = false;
      this.itemId = "";
    },

    deleteItem() {
      var vm = this;
      this.$store.dispatch("removecanteen", this.itemId).then((r) => {
        if (r.data.success) {
          this.fetchData();
          vm.successDialog = true;
          vm.itemId = "";
        } else {
          Swal.fire({
            title: "Error!",
            text: r.message,
            icon: "error",
          });
        }
      });
      this.delDialog = false;
      this.itemId = "";
    },

    getColor(value) {
      if (value == true) return "green";
      else return "orange";
    },
  },
  mounted() {
    console.log('getcanteenList',this.getcanteenList);
    this.fetchData();
    this.permissions = this.userDetails.permissions;
  },
  computed: {
    ...mapGetters([
      "getCompanyList",
      "getcanteenList",
      "getcanteenListTotal",
      "getroleList",
      "userDetails",
    ]),
    maxPages() {
      return Math.ceil(this.getcanteenListTotal / 10);
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
