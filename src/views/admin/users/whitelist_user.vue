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
            <h2>White List User</h2>
          </div>
        </v-card-text>

        <v-card-actions class="pa-5 pr-1">
          <!------------------------------------------------------------------>
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
                class="mr-3"
                ><i class="mr-2"
                  ><img
                    src="../../../assets/logos/Icon-metro-user-plus.svg"
                    height="18px" /></i
                >Add Bulk Users</v-btn
              >
            </template>
            <template>
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
                    style="font-size: 26px !important"
                    >Add Bulk Users
                  </span>

                  <span @click="closeModel" class="crossPossition">
                    <img src="../../../assets/logos/Icon metro-cross.svg" />
                  </span>
                </v-toolbar>
                <v-card-text>
                  <bulk-white-user @closeIt="closeModel"></bulk-white-user>
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
          <!------------------------------------------------------------------>
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
                ><i class="mr-2"
                  ><img
                    src="../../../assets/logos/Icon-metro-user-plus.svg"
                    height="18px" /></i
                >User</v-btn
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
                    >Add User
                  </span>
                  <span v-else>Edit User</span>
                  <span @click="closeModel" class="crossPossition">
                    <img src="../../../assets/logos/Icon metro-cross.svg" />
                  </span>
                </v-toolbar>
                <v-card-text v-if="isEdit == false">
                  <addWhiteUser @closeIt="closeModel"></addWhiteUser>
                </v-card-text>
                <v-card-text v-else>
                  <addWhiteUser @closeIt="closeModel"></addWhiteUser>
                  <!-- <editUser @closeIt="closeModel"></editUser> -->
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
           <v-dialog class=""
            v-model="filterDialog"
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
                class="pr-5 pl-3 mx-3 "
              >
                <i class="mr-2">
                  <svg class="pageNameSvg productIcon">
                    <use xlink:href="#role-per-icon"></use></svg></i
                >Filters</v-btn
              >
            </template>

            <v-card>
              <v-toolbar
                class="mb-2 text-center justify-center b-border m-2"
                style="box-shadow: none"
              >
                <span
                  class="text-center justify-center"
                  style="font-size: 26px !important"
                  >Filters
                </span>

                <span @click="closeModel" class="crossPossition">
                  <img src="../../../assets/logos/Icon metro-cross.svg" />
                </span>
              </v-toolbar>
              <v-card-text
                class="d-grid align-center"
                style="grid-template-columns: 1fr 1fr; gap: 20px;"
              >
                <div class="right-inner-addon2 input-container pb-0" >
          <i
            ><img
              src="../../../assets/logos/Icon ionic-ios-search.svg"
              height="15px"
          /></i>

          <input
          style="max-width: 100%; min-width: 100%"
            class="left normal border-radius bg-clr mt-1 searchfield"
            type="text"
            placeholder="Search Here..."
            v-model="search"
          />
        </div>
        <div class=" pr-10 pb-7">
          <div>
            <label class="regularFont login-font pb-2" style=""
              >Select Canteen <small style="color: red">*</small></label
            >
            <div class="right-inner-addon input-container pb-0">
              <i
                ><img
                  src="../../../assets/logos/bxs-down-arrow.svg"
                  height="7px"
              /></i>
              <select
                @change="fetchData()"
                v-model="canteen_id"
                class="form-control login-field"
              >
                <option
                  v-for="(d, i) in getcanteenList"
                  :key="i"
                  :value="d._id"
                >
                  {{ d.canteen_name }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <div class=" pr-10 pb-7">
          <div>
            <label class="regularFont login-font" style=""
              >Select Company <small style="color: red">*</small></label
            >
            <div class="right-inner-addon input-container pb-0">
              <i
                ><img
                  src="../../../assets/logos/bxs-down-arrow.svg"
                  height="7px"
              /></i>
              <select
                @change="fetchData()"
                v-model="company_selected_id"
                class="form-control login-field"
              >
                <option
                  v-for="(d, i) in getCompanyList"
                  :key="i"
                  :value="d._id"
                >
                  {{ d.user_name }}
                </option>
              </select>
            </div>
          </div>
        </div>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!------------------csv download icon------------>
          <vue-blob-json-csv
            file-type="csv"
            file-name="White List User"
            :data="json_data"
          >
            <b-button
              title="download file"
              class="ml-3 d-flex"
              style="background-color: transparent; color: orange"
              @click="downloadCsv()"
            >
              <b-icon icon="download" class="mx-2"></b-icon>
              <span>CSV</span>
            </b-button>
          </vue-blob-json-csv>
          <!------------------csv download icon------------>
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
                    >View User
                  </span>
                  <span @click="closeModel" class="crossPossition">
                    <img src="../../../assets/logos/Icon metro-cross.svg" />
                  </span>
                </v-toolbar>

                <v-card-text>
                  <editWhiteUser @closeIt="closeModel"></editWhiteUser>
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
            <th class="email">Email</th>
            <th class="phone">Points</th>
            <th class="phone">Company</th>
            <th class="canteen">Canteen</th>
            <th class="status">Status</th>
            <th class="status">GDPR Accepted Status</th>
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
              <td class="emaildata" @click="viewItem(data)">
                {{ data.user_email }}
              </td>

              <td class="phonedata" @click="viewItem(data)">
                {{ data.subsidy_points }}
              </td>
              <td class="canteendata" @click="viewItem(data)">
                {{ company(data.user_parent_id) }}
              </td>
              <td class="canteendata" @click="viewItem(data)">
                {{ canteen(data.user_canteen_id) }}
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
            <td class="statusdata" @click="viewItem(data)">
                <button
                  :class="
                    data.gdpr_accepted
                      ? 'btnActive green'
                      : 'btnActive grey'
                  "
                >
                  {{ data.gdpr_accepted ? "Accepted" : "Pending" }}
                </button>
              </td>
            
            <td class="actiondata">
              <div class="actionIcons">
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
              </div>
              <br />
              <span 
              v-if="!data.gdpr_accepted" 
              >
                <v-btn
                  @click="sendGDPREmail(data)"
                  color="primary"
                  elevation="2"
                  x-small
                  style="font-size:small"
                  >
                  Send GDPR Email
                </v-btn>
              </span>
              <span>
                <v-btn
                  color="primary"
                  elevation="2"
                  x-small
                  style="font-size:small;visibility:hidden"
                  >
                  Send GDPR Email
                </v-btn>
              </span>
            </td>
            </tr>
          </div>
        </tbody>
      </table>
    </div>

    <div v-if="getwhiteList" class="pagiNationWrapper notranslate">
      <p v-if="gettotalRecordWhiteList">
        Showing {{ currentPage }}-{{ getwhiteList.length }} of
        {{ gettotalRecordWhiteList }} results
      </p>
      <p v-else>Showing 0-0 of 0 results</p>

      <!-- Pagination Bar at table bottom  -->
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
                  @click="deleteItem()"
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
                <span>User is deleted Successfully</span><br /><br />
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
import addWhiteUser from "../../../components/users/addWhiteUser.vue";
import editWhiteUser from "../../../components/users/editWhiteUser.vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
import BulkWhiteUser from "../../../components/users/bulkWhiteUser.vue";
export default {
  components: {
    addWhiteUser,
    editWhiteUser,
    BulkWhiteUser,
  },
  data() {
    return {
      json_data: [],
      filterDialog: false,
      canteen_id: [],
      company_id: "",
      company_selected_id: "",
      table_loader: true,
      bulkdialog: false,
      currentPage: 1,
      page: 1,
      pageCount: 10,
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
    getwhiteList: {
      handler: function () {
        this.items = this.getwhiteList;
      },
    },
  },
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
    sendGDPREmail(obj) {
      console.log(obj);
      this.$store.dispatch("sendGDPREmail", {user_id: obj._id, type:'whitelistuser'});
      Swal.fire({
            title: "Email Sent",
            text: "Email has been sent to the user.",
            icon: "success",
            confirmButtonText: "OK"
          });
    },
    async downloadCsv() {
      var vm = this;
      await this.$store
        .dispatch("getWhiteListUserList", { pagination: true })
        .then((x) => {
          x.forEach((e) => {
            vm.json_data.push({
              Name: e.user_name,
              Email: e.user_email,
              Phone: e.user_phone,
              Canteen: e.user_canteen_id.canteen_name,
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
        "user_canteen_id",
        "subsidy_points",
        "user_parent_id"
      ];
      var a = document.createElement("a");
      const blob = new Blob([csv.join(",")], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      a.setAttribute("href", url);
      a.setAttribute("download", "WhiteList User Sample.csv");
      a.style.display = "none";
      a.click();
    },
    updateCurrentPage(obj) {
      if (obj >= 1) {
        this.currentPage = obj;
      }
    },
    canteen(obj) {
      if (obj) {
        return obj.map(can => can.canteen_name).join(',');
      }
    },
    company(obj) {
      if (obj) {
        return obj.user_name.replaceAll("_", " ");
      }
    },
    closeSuccessModel() {
      this.successDialog = false;
    },

    hasPermission(obj) {
      return true;   
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
        pagination: true,
      });
      await this.$store.dispatch("getcanteensList", { pagination: true });
      console.log('fetchdata', {
        resultPerPage: 10,
        filter: this.search,
        currentPage: this.currentPage,
        company_id: this.company_id,
        canteen_id: this.canteen_id,
      });
      await this.$store.dispatch("getWhiteListUserList", {
        resultPerPage: 10,
        filter: this.search,
        currentPage: this.currentPage,
        company_id: this.company_id,
        canteen_id: this.canteen_id,
      });
      this.table_loader = false;
    },

    editItem(obj) {
      console.log('getUserById',obj);
      this.$store.dispatch("getUserById", obj);
      this.company_selected_id = obj.user_parent_id._id;
      this.dialog = true;
      this.isEdit = true;
    },
    viewItem(obj) {
      this.$store.dispatch("getUserById", obj);
      this.viewDialog = true;
      // this.isEdit = true;
    },

    async closeModel() {
      this.isEdit = false;
      this.filterDialog = false;
      this.dialog = false;
      this.viewDialog = false;
      await this.fetchData();
      this.bulkdialog = false;
      this.delDialog = false;
      this.successDialog = false;
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
          this.fetchData();
          vm.delDialog = false;
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
      "getcanteenList",
      "getwhiteList",
      "gettotalRecordWhiteList",
      "getroleList",
      "userDetails",
    ]),
    maxPages() {
      return Math.ceil(this.gettotalRecordWhiteList / 10);
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
.canteendata {
  word-break: normal;
}
.action {
  width:16.5% !important;

}
.actionIcons {
  width: 100%;
  display: flex;
  justify-content: center;
}
.actionData{
  width:16.5% !important;
}
</style>