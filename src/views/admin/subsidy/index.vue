<template>
  <div>
    <div class="view-header mb-2 mt-3">
      <v-card-text>
        <div class="pageHeadingIcon">
          <div class="pageName">
            <svg class="pageNameSvg userManagmentIcon">
              <use xlink:href="#promotion"></use>
            </svg>
          </div>
          <h2>Subsidy</h2>
        </div>
      </v-card-text>
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
              @click="addsubsidy"
              ><i class="mr-2" style="margin-top: -5px"
                ><svg class="pageNameSvg userManagmentIcon">
                  <use xlink:href="#promotion"></use></svg></i
              >Add Subsidy
            </v-btn>
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
                  >Add Subsidy
                </span>
                <span v-else>Edit Subsidy </span>
                <span @click="closeModel" class="crossPossition">
                  <img src="../../../assets/logos/Icon metro-cross.svg" />
                </span>
              </v-toolbar>
              <v-card-text v-if="isEdit == false">
                <addSubsidy :isEdit="isEdit" @closeIt="closeModel"></addSubsidy>
                <!-- <addCanteen @closeIt="closeModel" :isEdit='isEdit'></addCanteen> -->
              </v-card-text>
              <v-card-text v-else>
                <addSubsidy :isEdit="isEdit" @closeIt="closeModel"></addSubsidy>
                <!-- <editUser @closeIt="closeModel"></editUser> -->
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
        <!------------------csv download ------------>
        <vue-blob-json-csv
          file-type="csv"
          file-name="Subsidy"
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
    </div>
    <div class="tableWrapper">
      <table class="row mx-0" id="myTable">
        <thead class="px-0">
          <tr class="tableHead">
            <th class="name">Company</th>
            <th class="name">Canteen</th>
            <th class="email">Subsidy / Credit Points</th>
            <th class="email">Type</th>
            <th class="status">Status</th>
            <th class="action">Action</th>
          </tr>
        </thead>
        <div class="py-7" v-if="table_loader">
        <v-progress-linear color="orange darken-1" indeterminate></v-progress-linear>
        </div>
        <tbody v-if="!table_loader" class="px-0">

          <tr
            v-for="(data, index) in getsubsidyList"
            :key="index"
            class="px-0 tabledata"
          >
            <td class="namedata" @click="viewItem(data)">
              {{ data.company_id.user_name }}
            </td>
            <td class="namedata" @click="viewItem(data)">
              {{ getCanteenName(data.canteen_id) }}
            </td>
            <td class="emaildata" @click="viewItem(data)">
              {{ data.subsidy }}
            </td>
            <td class="namedata" @click="viewItem(data)">
              {{ data.subsidy_type }}
            </td>

            <td class="statusdata" @click="viewItem(data)">
              <button
                :class="
                  data.status == 'Active' ? 'btnActive green' : 'btnActive grey'
                "
              >
                {{ data.status == "Active" ? "Active" : "DeActive" }}
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
        </tbody>
      </table>
    </div>
    <div class="pagiNationWrapper notranslate">
      <p v-if="getsubsidyList">
        Showing {{ currentPage }}-{{ getsubsidyList.length }} of
        {{ getsubsidyListTotal }} results
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
              <span>Warning</span>
              <span @click="closeModel" class="crossPossition">
                <img src="../../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>

            <v-card-text class="pt-10 text-h6">
              Do you want to delete this Entry ?

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
    <v-card-actions class="pa-5">
      <v-dialog
        v-model="viewdialog"
        transition="dialog-top-transition"
        scrollable
      >
        <template v-if="viewdialog" v-slot:default="viewdialog">
          <v-card>
            <v-toolbar
              class="mb-2 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <span>View Subsidy</span>
              <span @click="closeModel" class="crossPossition">
                <img src="../../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>

            <v-card-text class="pt-10 text-h6">
              <viewSubsidy @closeIt="closeModel"></viewSubsidy>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
  </div>
</template>
<script>
import addSubsidy from "../../../components/Subsidy/addSubsidy.vue";
import viewSubsidy from "../../../components/Subsidy/viewSubsidy.vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
export default {
  components: {
    addSubsidy,
    viewSubsidy,
  },
  data() {
    return {
      json_data: [],
      isEdit: false,
      table_loader: true,
      dialog: false,
      viewdialog: false,
      delDialog: false,
      allowDel: false,
      itemId: "",
      isfetching: false,
      search: "",
      permissions: [],
      currentPage: 1,
    };
  },

  watch: {
    currentPage: {
      handler: function () {
        this.fetchData();
      },
    },
    getsubsidyList: {
      handler: function () {
        this.items = this.getsubsidyList;
      },
    },
  },
  methods: {
    getCanteenName(obj) {
      var names = obj.map((x) => x.canteen_name);
      return names.toString();
    },
    async downloadCsv() {
      var vm = this;
      await this.$store
        .dispatch("subsidyList", { pagination: true })
        .then((x) => {
          x.forEach((e) => {
            vm.json_data.push({
              Canteen: e.canteen_id.canteen_name,
              Subsidy: e.subsidy,
            });
          });
        });
    },
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
    hasPermission(obj) {
      if (
        this.userDetails &&
        this.userDetails.user &&
        this.userDetails.user.user_role == "super_admin"
      ) {
        return true;
      } else {
        return this.userDetails.permissions.permission_name.includes(obj);
      }
    },
    async fetchData() {
      this.table_loader = true
      this.$store.dispatch("getCompanyList");
      this.$store.dispatch("getcanteensList", { pagination: true });
      this.$store
        .dispatch("subsidyList", {
          resultPerPage: 10,
          filter: this.search,
          currentPage: this.currentPage,
        })
        .then((response) => {
          this.table_loader = false;
          // this.items = this.getSubsidyList;
        })
        .catch((ex) => {
          this.table_loader = false;
        });
        
    },

    editItem(obj) {
      this.$store.dispatch("getSubsidyById", obj);
      this.dialog = true;
      this.isEdit = true;
    },
    addsubsidy() {
      this.$store.dispatch("getSubsidyById", null);
      this.dialog = true;
      this.isEdit = false;
    },
    viewItem(obj) {
      this.$store.dispatch("getSubsidyById", obj);
      this.viewdialog = true;
      this.isEdit = true;
    },

    closeModel() {
      this.fetchData();
      this.dialog = false;
      this.viewdialog = false;
      this.isEdit = false;
      this.delDialog = false;
    },

    warningModel(id) {
      this.delDialog = true;
      this.itemId = id;
    },

    closeWarningModel() {
      this.delDialog = false;
      this.itemId = "";
    },

    updateCurrentPage(obj) {
      if (obj >= 1) {
        this.currentPage = obj;
      }
    },
    async deleteItem() {
      await this.$store
        .dispatch("removeSubsidy", this.itemId)
        .then((response) => {
          Swal.fire({
            title: "",
            text: response.message,
            icon: "success",
          });
        });
      this.delDialog = false;
      this.itemId = "";

      this.fetchData();
    },
  },

  mounted() {
    this.fetchData();
    this.permissions = this.userDetails.permissions;
  },
  computed: {
    ...mapGetters(["getsubsidyList", "getsubsidyListTotal", "userDetails"]),
    maxPages() {
      return Math.ceil(this.getsubsidyListTotal / 10);
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


   