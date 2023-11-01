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
          <h2>Promotion </h2>
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
              >Add Promotion
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
                  >Add Promotion
                </span>
                <span v-else>Edit Promotion </span>
                <span @click="closeModel" class="crossPossition">
                  <img src="../../../assets/logos/Icon metro-cross.svg" />
                </span>
              </v-toolbar>
              <v-card-text v-if="isEdit == false">
                <add-canteen />
                <addPromotion @closeIt="closeModel"></addPromotion>
                <!-- <addCanteen @closeIt="closeModel" :isEdit='isEdit'></addCanteen> -->
              </v-card-text>
              <v-card-text v-else>
                <addPromotion @closeIt="closeModel"></addPromotion>
                <!-- <editUser @closeIt="closeModel"></editUser> -->
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
        <!------------------csv download ------------>
        <vue-blob-json-csv file-type="csv" file-name="Promotion" :data="json_data">
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
                <span
                  class="text-center justify-center"
                  style="font-size: 26px !important"
                  >View Promotion
                </span>

                <span @click="closeModel" class="crossPossition">
                  <img src="../../../assets/logos/Icon metro-cross.svg" />
                </span>
              </v-toolbar>
              <v-card-text>
                <viewPromotion @closeIt="closeModel"></viewPromotion>
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
            <th class="name">Name</th>
            <th class="email">Code</th>
            <th class="email">Start Date</th>
            <th class="email">End Date</th>
            <th class="email">Type</th>
            <th class="email">Value</th>
            <th class="status">Status</th>
            <th class="action">Action</th>
          </tr>
        </thead>
         <div v-if="table_loader" class="py-7">
      <v-progress-linear color="orange darken-1" indeterminate></v-progress-linear>
      </div>
        <tbody class="px-0" v-if="!table_loader">
          <tr
            class="px-0 tabledata"
            v-for="(data, index) in items"
            :key="index"
          >
            <td class="namedata" @click="viewItem(data)">{{ data.promo_name }}</td>
            <td class="emaildata" @click="viewItem(data)">{{ data.promo_code }}</td>
            <td class="emaildata" @click="viewItem(data)">{{ dateConvert(data.promo_start_date) }}</td>
            <td class="emaildata" @click="viewItem(data)">{{ dateConvert(data.promo_end_date) }}</td>
            <td class="emaildata" @click="viewItem(data)">{{ data.promo_type }}</td>
            <td class="emaildata" @click="viewItem(data)">{{ data.promo_value }}</td>
            <td class="statusdata" @click="viewItem(data)">
              <button
                :class="
                  data.promo_status == 'Active'
                    ? 'btnActive green'
                    : 'btnActive grey'
                "
              >
                {{ data.promo_status == "Active" ? "Active" : "DeActive" }}
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
      <p v-if="getpromotionList">
        Showing {{ currentPage }}-{{ getpromotionList.length }} of
        {{ getpromotionListTotal }} results
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
import addPromotion from "../../../components/promotion/addPromotion.vue";
import viewPromotion from "../../../components/promotion/viewPromotion.vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";

export default {
  components: {
    addPromotion,
    viewPromotion,
  },
  data() {
    return {
       json_data: [],
      isEdit: false,
      dialog: false,
      deletedialog: false,
      currentPage:1,
      viewdialog: false,
      delDialog: false,
      allowDel: false,
      itemId: "",
      table_loader: true,
      isfetching: false,
      search: "",
      items: [],
      permissions: [],
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
    getpromotionList: {
      handler: function () {
        this.items = this.getpromotionList;
      },
    },
  },
  methods: {
    async downloadCsv() {
      var vm = this;
      await this.$store.dispatch("promotionsList", { pagination: true }).then((x) =>{
        x.forEach((e) => {
        vm.json_data.push({
          Name: e.promo_name,
          Code: e.promo_code,
          Start_date: e.promo_start_date,
          End_date: e.promo_end_date,
          Type : e.promo_type,
          Value : e.promo_value,
        });
      });
      })
      
    },
      updateCurrentPage(obj) {
      if (obj >= 1) {
        this.currentPage = obj;
      }
    },
    async YesModel() {
      this.delDialog = false;
      await this.deleteItem();
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
      this.table_loader = true;
      this.search = this.search == null ? "" : this.search;
      await this.$store.dispatch("promotionsList", {
        resultPerPage: 10,filter :this.search,
        currentPage: this.currentPage,
      })
        .then((response) => {
          if (response.status) {
            this.table_loader = false;
            this.items = this.getuserList;
          }
        })
        .catch((ex) => {
          this.table_loader = false;
        });
    },

    editItem(obj) {
      this.$store.dispatch("getpromotionById", obj);
      this.dialog = true;
      this.isEdit = true;
    },
    viewItem(obj) {
      this.$store.dispatch("getpromotionById", obj);
      this.viewdialog = true;
      this.isEdit = true;
    },

    async closeModel() {
      await this.fetchData();
      this.dialog = false;
      this.viewdialog = false;
      this.delDialog = false;
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
      this.$store.dispatch("removepromotion", this.itemId).then((r) => {
        if (r.success) {
          this.fetchData();
          Swal.fire({
            title: "",
            text: r.message,
            icon: "success",
          });
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
      "getpromotionList",
      "getpromotionListTotal",
      "getroleList",
      "userDetails",
    ]),
    maxPages() {
      return Math.ceil(this.getpromotionListTotal/10)
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


   