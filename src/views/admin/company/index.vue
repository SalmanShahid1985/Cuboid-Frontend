
<template>
  <div>
    <div class="view-header mb-2 mt-3">
      <v-card-text class="pl-0">
        <div class="pageHeadingIcon">
          <div>
            <img
              src="../../../assets/logos/user.svg"
              style="margin-top: -10px"
            />
          </div>
          <h2>Company Management</h2>
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

      <v-card-actions class="pa-5 pr-1">
        <v-dialog
          v-model="bulkdialog"
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
              class="pl-5 pr-5 mr-3"
              ><i class="mr-2"
                ><img
                  src="../../../assets/logos/Icon-metro-user-plus.svg"
                  height="18px" /></i
              >Add Bulk Companies</v-btn
            >
          </template>

          <v-card>
            <v-toolbar
              class="mb-2 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <button
                class="
                  modal-btn
                  v-btn v-btn--is-elevated v-btn--has-bg
                  theme--dark
                  v-size--default
                  mx-7
                  main_bg_color
                "
                style="position: absolute; left: 0em; top: 0.75em"
                @click="csvSample"
              >
                Download Sample CSV
              </button>
              <span
                class="text-center justify-center"
                style="font-size: 30px !important; font-weight: 800 !important"
              >
                <strong>Add Bulk Companies </strong>
              </span>

              <span @click="closeModel" class="crossPossition">
                <img src="../../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>
            <v-card-text>
              <bulk-user type="company" @closeIt="closeModel"></bulk-user>
            </v-card-text>
          </v-card>
        </v-dialog>
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
              class="pl-5 pr-5"
              ><i class="mr-2"
                ><img
                  src="../../../assets/logos/Icon-metro-user-plus.svg"
                  height="18px" /></i
              >Add Company</v-btn
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
                  style="
                    font-size: 30px !important;
                    font-weight: 800 !important;
                  "
                >
                  <strong>Add Company </strong>
                </span>
                <span
                  v-else
                  class="text-center justify-center"
                  style="
                    font-size: 30px !important;
                    font-weight: 800 !important;
                  "
                  >Edit Company</span
                >
                <span @click="closeModel" class="crossPossition">
                  <img src="../../../assets/logos/Icon metro-cross.svg" />
                </span>
              </v-toolbar>
              <v-card-text v-if="isEdit == false">
                <addUser type="company" @closeIt="closeModel"></addUser>
              </v-card-text>
              <v-card-text v-else>
                <addUser type="company" @closeIt="closeModel"></addUser>
                <!-- <editUser @closeIt="closeModel"></editUser> -->
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
        <!------------------csv download ------------>
        <vue-blob-json-csv file-type="csv" file-name="Users" :data="json_data">
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
      <v-card-actions class="pa-5 pr-1">
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
                <span
                  class="text-center justify-center"
                  style="font-size: 26px !important"
                  >View Company
                </span>
                <span @click="closeModel" class="crossPossition">
                  <img src="../../../assets/logos/Icon metro-cross.svg" />
                </span>
              </v-toolbar>

              <v-card-text>
                <editUser type="company" @closeIt="closeModel"></editUser>
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
            <th class="name">Id</th>
            <th class="name">Name</th>
            <th class="email">Canteens</th>
            <th class="email">Email</th>
            <th class="phone">Phone</th>
            <th class="status">Status</th>
            <th class="action">Action</th>
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
              class="px-0 tabledata"
              v-for="(data, index) in items"
              :key="index"
            >
              <td class="namedata" @click="viewItem(data)">
                {{ data._id }}
              </td>
              <td class="namedata" @click="viewItem(data)">
                {{ data.user_name }}
              </td>
              <td class="namedata" @click="viewItem(data)">
                {{ canteenName(data.canteen)}}
              </td>
              <td class="emaildata" @click="viewItem(data)">
                {{ data.user_email }}
              </td>
              <td class="phonedata" @click="viewItem(data)">
                {{ enforcePhoneFormat(data, 'user_phone') }}
              </td>
              <td class="statusdata" @click="viewItem(data)">
                <button
                  :class="
                    data.user_status == 'Active'
                      ? 'btnActive green'
                      : 'btnActive grey'
                  "
                >
                  {{ data.user_status == "Active" ? "Active" : "DeActive" }}
                </button>
              </td>
              <td class="actiondata actionIcons">
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
      <p v-if="getCompanyList">
        Showing {{ currentPage }}-{{ getCompanyList.length }} of
        {{ getCompanyListTotal }} results
      </p>
      <p v-else>Showing 0-0 of 0 results</p>

      <!-- Pagination Bar -->

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
              <span @click="closeWarningModel" class="crossPossition">
                <img src="../../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>

            <v-card-text class="pt-10 text-h6">
              <p>Do you want to delete this User?</p>
              <v-col class="col-12 d-flex justify-space-around">
                <v-btn
                  class="mr-4 modal-btn"
                  dark
                  color="main_bg_color"
                  style="min-width: 100px !important"
                  @click="YesModel"
                >
                  Yes
                </v-btn>
                <v-btn
                  class="modal-btn"
                  style="min-width: 100px !important"
                  @click="closeWarningModel"
                >
                  No
                </v-btn>
              </v-col>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
    <v-card-actions style="width: 700px" class="pa-5">
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
                <img
                  src="../../../assets/logos/Icon metro-cross.svg"
                  @click="closeSuccessModel"
                />
              </span>
            </v-toolbar>

            <v-card-text style="width: 500px" class="pt-10 text-h6">
              <center>
                <span>User is deleted Successfully</span><br /><br />
                <i
                  ><img
                    src="../../../assets/logos/Path 10980.svg"
                    height="100px"
                /></i>
              </center>
              <br />
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
import addUser from "../../../components/users/addUser.vue";
import editUser from "../../../components/users/editUser.vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
import BulkUser from "../../../components/users/bulkUser.vue";
export default {
  components: {
    addUser,
    editUser,
    BulkUser,
  },
  data() {
    return {
      totalresults: this.getCompanyListTotal,
      json_data: [],
      bulkdialog: false,
      table_loader: true,
      page: 1,
      pageCount: 10,
      currentPage: 1,
      itemsPerPage: 10,
      isEdit: false,
      dialog: false,
      viewDialog: false,
      deletedialog: false,
      delDialog: false,
      successDialog: false,
      allowDel: false,
      itemId: "",
      isfetching: false,
      search: "",
      permissions: [],
      items: [],
      isApprovedOptions: [
        { text: "Approved", value: true },
        { text: "Not Approved", value: false },
      ],
    };
  },
  watch: {
    currentPage: {
      handler: function () {
        this.fetchData();
      },
    },
    getCompanyList: {
      handler: function () {
        this.items = this.getCompanyList;
      },
    },
    search: {
      handler: function () {
        this.currentPage = 1;
        this.fetchData(); 
      },
    },
  },
  methods: {
    canteenName(obj) {  
      if(obj){ 
  var names = obj.map((x) => x.canteen_name);
      return names.toString();
      }
    
    },
    downloadCsv() {
      var vm = this;
      this.$store.dispatch("getCompanyList", { pagination: true }).then((x) => {
        x.forEach((e) => {
          vm.json_data.push({
            Name: e.user_name,
            Email: e.user_email,
            Phone: e.user_phone,
          });
        });
      });
    },
    csvSample() {
      const csv = [
        "user_name",
        "user_email",
        "user_password",
        "user_phone",
        "user_status",
      ];
      var a = document.createElement("a");
      const blob = new Blob([csv.join(",")], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      a.setAttribute("href", url);
      a.setAttribute("download", "User Sample.csv");
      a.style.display = "none";
      a.click();
    },
    updateCurrentPage(obj) {
      var a = this.currentPage;
      if (obj >= 1) {
        this.currentPage = obj;
      }
    },
    closeSuccessModel() {
      this.successDialog = false;
    },
    async YesModel() {
      this.delDialog = false;
      await this.deleteItem();
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

      this.search = this.search == null ? "" : this.search;
      await this.$store.dispatch("getRoleList", { pagination: true });

      await this.$store.dispatch("getCompanyList", {
        resultPerPage: 10,
        currentPage: this.currentPage,
        filter: this.search,
      });
      this.table_loader = false;
    },

    editItem(obj) {
      this.$store.dispatch("getUserById", obj);
      this.dialog = true;
      this.isEdit = true;
    },
    viewItem(obj) {
      this.$store.dispatch("getUserById", obj);
      this.viewDialog = true;
      // this.isEdit = true;
    },
    clear() {
      this.bulkdialog = false;
    },
    closeModel() {
      this.fetchData();
      this.bulkdialog = false;
      this.dialog = false;
      this.viewDialog = false;
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

    deleteItem() {
      var vm = this;
      this.$store.dispatch("removeUser", this.itemId).then((r) => {
        if (r.success) {
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
    this.fetchData();
    this.permissions = this.userDetails.permissions;
  },
  computed: {
    ...mapGetters([
      "getCompanyList",
      "getCompanyListTotal",
      "getroleList",
      "userDetails",
    ]),
    maxPages() {
      return Math.ceil(this.getCompanyListTotal / 10);
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
  padding: 0 30px;
}

.theme--light.v-data-table thead {
  background-color: #747474 !important;
}
.b-border {
  border-bottom: 1px solid #f8932d;
}
.v-btn {
  text-transform: none;
  font-size: 17px;
  font-weight: 300;
  letter-spacing: 1.1px;
}
</style>
