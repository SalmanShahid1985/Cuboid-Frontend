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
          <h2>Discount</h2>
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
          placeholder="Search Here..."
          v-model="search"
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
              ><i class="mr-2" style="margin-top: -5px"
                ><svg class="pageNameSvg userManagmentIcon">
                  <use xlink:href="#promotion"></use></svg></i
              >Add Discount
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
                  >Add Discount
                </span>
                <span v-else>Edit Discount </span>
                <span @click="closeModel" class="crossPossition">
                  <img src="../../../assets/logos/Icon metro-cross.svg" />
                </span>
              </v-toolbar>
              <v-card-text v-if="isEdit == false">
                <addDiscount @closeIt="closeModel"></addDiscount>
                <!-- <addCanteen @closeIt="closeModel" :isEdit='isEdit'></addCanteen> -->
              </v-card-text>
              <v-card-text v-else>
                <addDiscount @closeIt="closeModel"></addDiscount>
                <!-- <editUser @closeIt="closeModel"></editUser> -->
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
        <!------------------csv download ------------>
        <vue-blob-json-csv file-type="csv" file-name="Discount" :data="json_data">
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
            <th class="name">Name</th>
            <th class="email">Start Date</th>
            <th class="email">End Date</th>
            <th class="email">Type</th>
            <th class="email">Value</th>
            <th class="status">Status</th>
            <th class="action">Action</th>
          </tr>
        </thead>
        <div class="py-7" v-if="table_loader">
        <v-progress-linear color="orange darken-1" indeterminate></v-progress-linear>
        </div>
        <tbody class="px-0" v-if="!table_loader">
          <tr
            v-for="(data, index) in items"
            :key="index"
            class="px-0 tabledata"
          >
            <td class="namedata" @click="viewItem(data)">{{ data.discount_name }}</td>
            <td class="emaildata" @click="viewItem(data)">
              {{ dateConvert(data.discount_start_date) }}
            </td>
            <td class="emaildata" @click="viewItem(data)">{{ dateConvert(data.discount_end_date) }}</td>
            <td class="emaildata" @click="viewItem(data)">{{ data.discount_type }}</td>
            <td class="emaildata" @click="viewItem(data)">{{ data.discount_value }}</td>

            <td class="statusdata" @click="viewItem(data)">
              <button
                :class="
                  data.discount_status == 'Active'
                    ? 'btnActive green'
                    : 'btnActive grey'
                "
              >
                {{ data.discount_status == "Active" ? "Active" : "DeActive" }}
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
      <p v-if="getdiscountList">
        Showing {{ currentPage }}-{{ getdiscountList.length }} of
        {{ getdiscountListTotal }} results
      </p>
      <p v-else>Showing 0-0 of0 results</p>
     
<!-- Page Bar at bottom of table -->

<ul class="pagiNation notranslate" >
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
              <span>View Discount</span>
              <span @click="closeModel" class="crossPossition">
                <img src="../../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>

            <v-card-text class="pt-10 text-h6">
              <viewDiscount @closeIt="closeModel"></viewDiscount>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
  </div>
</template>
<script>
import addDiscount from "../../../components/discount/addDiscount.vue";
import viewDiscount from "../../../components/discount/viewDiscount.vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
export default {
  components: {
    addDiscount,
    viewDiscount,
  },
  data() {
    return {
      json_data: [],
      isEdit: false,
      table_loader: true,
      currentPage: 1,
      dialog: false,
      viewdialog: false,
      delDialog: false,
      allowDel: false,
      itemId: "",
      isfetching: false,
      search: "",
      permissions: [],
    };
  },

  watch: {
    currentPage: {
      handler: function () {
        this.fetchData();
      },
    },
    getdiscountList: {
      handler: function () {
        this.items = this.getdiscountList;
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
     async downloadCsv() {
       var vm = this;
       await this.$store.dispatch("discountsList", {pagination: true}).then((x) => {
         x.forEach((e) => {
        vm.json_data.push({
          Name: e.discount_name,
          Start_date: e.discount_start_date,
          End_date: e.discount_end_date,
          Type: e.discount_type,
          Value : e.discount_value,
        });
      });
       })
      
    },
    updateCurrentPage(obj) {
      if (obj >= 1) {
        this.currentPage = obj;
      }
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
      await this.$store.dispatch("machinesList", { pagination: true });
      await this.$store.dispatch("getcanteensList", { pagination: true });
      await this.$store.dispatch("productsList", { pagination: true });
      this.isfetching = true;
      await this.$store
        .dispatch("discountsList", {
          resultPerPage: 10,filter :this.search,
          currentPage: this.currentPage,
        })
        .then((response) => {
          this.table_loader = false;
          this.items = this.getdiscountList;
        })
        .catch((ex) => {
          this.table_loader = false;
        });
    },

    editItem(obj) {
      this.$store.dispatch("getdiscountById", obj);
      this.dialog = true;
      this.isEdit = true;
    },
    viewItem(obj) {
      this.$store.dispatch("getdiscountById", obj);
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

    async deleteItem() {
      await this.$store
        .dispatch("removediscount", this.itemId)
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
  destroyed() {
    this.$store.dispatch("resetdiscountListState");
  },
  mounted() {
    this.fetchData();
    this.permissions = this.userDetails.permissions;
  },
  computed: {
    ...mapGetters(["userDetails", "getdiscountList", "getdiscountListTotal"]),
    maxPages () {
      return Math.ceil(this.getdiscountListTotal / 10)
    }
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


   