<template>
  <div>
    <div class="d-flex justify-space-around align-center mb-2 mt-3">
      <v-card-text>
        <div class="pageHeadingIcon">
          <div class="pageName">
            <svg class="pageNameSvg userManagmentIcon">
              <use xlink:href="#promotion"></use>
            </svg>
          </div>
          <h2>Vend Limit</h2>
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
              @click="addvend"
              ><i class="mr-2" style="margin-top: -5px"
                ><svg class="pageNameSvg userManagmentIcon">
                  <use xlink:href="#promotion"></use></svg></i
              >Update Vend Limit
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
                  >Update Vend Limit
                </span>
                <span v-else>Edit Vend Limit </span>
                <span @click="closeModel" class="crossPossition">
                  <img src="../../../assets/logos/Icon metro-cross.svg" />
                </span>
              </v-toolbar>
              <v-card-text>
                <addVendLimit @closeIt="closeModel"></addVendLimit>
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
            <th class="name" style="width: 50%">Canteen</th>
            <th class="action" style="width: 50%">Limit</th>
            <!-- <th class="action">Action</th> -->
          </tr>
        </thead>
        <tbody class="px-0">
          <div class="my-7" v-show="table_loader">
            <v-progress-linear
              indeterminate
              color="orange darken-1"
            ></v-progress-linear>
          </div>
          <div v-if="table_loader == false">
            <tr
              v-for="(data, index) in getvendList"
              :key="index"
              class="px-0 tabledata"
            >
              <td class="namedata" style="width: 50%">
                {{ data.canteen_name }}
              </td>
              <td class="emaildata" style="width: 50%">
                {{ data.product_vend_limit }}
              </td>
            </tr>
          </div>
        </tbody>
      </table>
    </div>

    <div class="pagiNationWrapper notranslate">
      <p v-if="getvendList">
        Showing {{ currentPage }}-{{ getvendListTotal }} of
        {{ getvendList.length }} results
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
  </div>
</template>
<script>
import addVendLimit from "../../../components/product/addProductVendLimit.vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
export default {
  components: {
    addVendLimit,
  },
  data() {
    return {
      isEdit: false,
      dialog: false,
      table_loader: true,
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
    getvendList: {
      handler: function () {
        this.items = this.getvendList;
      },
    },
  },
  methods: {
    Upload() {
      var fileUpload = document.getElementById("fileUpload");
      var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
      if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof FileReader != "undefined") {
          var reader = new FileReader();
          reader.onload = function (e) {
            var table = document.createElement("table");
            var rows = e.target.result.split("\n");
            for (var i = 0; i < rows.length; i++) {
              var cells = rows[i].split(",");
              if (cells.length > 1) {
                var row = table.insertRow(-1);
                for (var j = 0; j < cells.length; j++) {
                  var cell = row.insertCell(-1);
                  cell.innerHTML = cells[j];
                }
              }
            }
            var dvCSV = document.getElementById("dvCSV");
            dvCSV.innerHTML = "";
            dvCSV.appendChild(table);
          };
          reader.readAsText(fileUpload.files[0]);
        } else {
          alert("This browser does not support HTML5.");
        }
      } else {
        alert("Please upload a valid CSV file.");
      }
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
      await this.$store.dispatch("getcanteensList", { pagination: true });
      this.isfetching = true;
      await this.$store
        .dispatch("getvendList")
        .then((response) => {
          this.isfetching = false;
          // this.items = this.getSubsidyList;
        })
        .catch((ex) => {
          this.isfetching = false;
        });
      this.table_loader = false;
    },

    addvend() {
      // this.$store.dispatch("getSubsidyById", null);
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
  },

  mounted() {
    this.fetchData();
    this.permissions = this.userDetails.permissions;
  },
  computed: {
    ...mapGetters(["getvendList", "getvendListTotal", "userDetails"]),
    maxPages() {
      return Math.ceil(this.getvendList.length / 10);
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
