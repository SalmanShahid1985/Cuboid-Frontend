<template>
  <div>
    <div class="view-header justify-space-between ml-5 mb-2 mt-3">
      <v-card-text class="mb-0" style="max-width: 400px">
        <div class="pageHeadingIcon">
          <div class="pageName">
            <svg class="pageNameSvg userManagmentIcon">
              <use xlink:href="#productManagment"></use>
            </svg>
          </div>
          <h2>Product Management</h2>
        </div>
      </v-card-text>
      <div></div>
      <div class="d-flex align-center">
        <v-card-actions class="pa-5">
          <!------------------------------------------------------------------->
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
                class="pr-5 pl-3 mr-3"
              >
                <i class="mr-2">
                  <svg class="pageNameSvg productIcon">
                    <use xlink:href="#role-per-icon"></use></svg></i
                >Add Bulk Products</v-btn
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
                  style="font-size: 26px !important"
                  >Add Bulk Products
                </span>
                <span @click="closeModel" class="crossPossition">
                  <img src="../../../assets/logos/Icon metro-cross.svg" />
                </span>
              </v-toolbar>
              <v-card-text>
                <bulkproduct @closeIt="closeModel"></bulkproduct>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!------------------------------------------------------------------->
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
                class="pr-5 pl-3"
                @click="isEdit = false"
              >
                <i class="mr-2">
                  <svg class="pageNameSvg productIcon">
                    <use xlink:href="#role-per-icon"></use></svg></i
                >Add Product</v-btn
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
                    >Add Product
                  </span>
                  <span v-else>Edit Product</span>
                  <span @click="closeModel" class="crossPossition">
                    <img src="../../../assets/logos/Icon metro-cross.svg" />
                  </span>
                </v-toolbar>
                <v-card-text>
                  <addProduct
                    :editMode="isEdit"
                    @closeIt="closeModel"
                  ></addProduct>
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
          <!------------------csv download ------------>
          <vue-blob-json-csv
            file-type="csv"
            file-name="Product"
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
                  <span>View Product</span>
                  <span @click="closeModel" class="crossPossition">
                    <img src="../../../assets/logos/Icon metro-cross.svg" />
                  </span>
                </v-toolbar>

                <v-card-text>
                  <viewProduct @closeIt="closeModel"></viewProduct>
                  <!-- <editUser @closeIt="closeModel"></editUser> -->
                </v-card-text>
              </v-card>
            </template>
          </v-dialog>
        </v-card-actions>
        <v-card-actions class="pa-5">
          <!------------------------------------------------------------------->
          <v-dialog
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
                class="pr-5 pl-3 mr-3"
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
                style="grid-template-columns: 1fr 1fr"
              >
                <div class="pr-10 pb-7">
                  <div>
                    <label class="regularFont login-font pb-2" style=""
                      >Select Categories
                      <small style="color: red">*</small></label
                    >
                    <div class="right-inner-addon input-container pb-0">
                      <i
                        ><img
                          src="../../../assets/logos/bxs-down-arrow.svg"
                          height="7px"
                      /></i>
                      <select
                        @change="fetchData()"
                        v-model="category_id"
                        class="form-control login-field"
                      >
                        <option value="">All</option>
                        <option
                          v-for="(d, i) in getcategoryList"
                          :key="i"
                          :value="d._id"
                        >
                          {{ d.catagories_name }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="right-inner-addon2 input-container pb-0">
                  <i
                    ><img
                      src="../../../assets/logos/Icon ionic-ios-search.svg"
                      height="15px"
                  /></i>

                  <input
                    class="left normal border-radius bg-clr mt-1 searchfield"
                    style="max-width: 100%; min-width: 100%"
                    type="text"
                    placeholder="Search Here..."
                    v-model="search"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </div>
    </div>

    <div class="tableWrapper">
      <table class="row mx-0" id="myTable">
        <thead class="px-0">
          <tr class="tableHead">
            <th class="name" style="width: 20%">Name</th>
            <th class="email" style="width: 20%">Price</th>
            <th class="email" style="width: 20%">VAT</th>
            <th class="status" style="width: 20%">Status</th>
            <th class="action" style="width: 20%">Action</th>
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
              v-for="(data, index) in items"
              :key="index"
              class="px-0 tabledata"
            >
              <td class="namedata" style="width: 20%" @click="viewItem(data)">
                {{ data.product_name }}
              </td>

              <td class="emaildata" style="width: 20%" @click="viewItem(data)">
                {{ data.product_price }} NOK
              </td>
              <td class="emaildata" style="width: 20%" @click="viewItem(data)">
                {{ data.product_VAT }}
              </td>
              <td class="statusdata" style="width: 20%" @click="viewItem(data)">
                <button
                  :class="
                    data.product_status == 'Active'
                      ? 'btnActive green'
                      : 'btnActive grey'
                  "
                >
                  {{ data.product_status == "Active" ? "Active" : "DeActive" }}
                </button>
              </td>
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
            </tr>
          </div>
        </tbody>
      </table>
    </div>
    <div class="pagiNationWrapper notranslate">
      <p v-if="getproductList">
        Showing {{ currentPage }}-{{ getproductList.length }} of
        {{ getproductListTotal }} results
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
                <span>Product is deleted Successfully</span><br /><br />
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
import addProduct from "../../../components/product/addProduct.vue";
import viewProduct from "../../../components/product/viewProduct.vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
import Bulkproduct from "../../../components/product/bulkproduct.vue";
export default {
  components: {
    addProduct,
    viewProduct,
    Bulkproduct,
  },
  data() {
    return {
      nok: " NOK",
      filterDialog: false,
      table_loader: true,
      category_id: "",
      json_data: [],
      bulkdialog: false,
      isEdit: false,
      bulkdialog: false,
      dialog: false,
      deletedialog: false,
      viewdialog: false,
      currentPage: 1,
      delDialog: false,
      allowDel: false,
      successDialog: false,
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
    getproductList: {
      handler: function () {
        this.items = this.getproductList;
      },
    },
  },
  methods: {
    async downloadCsv() {
      var vm = this;
      await this.$store
        .dispatch("productsList", { pagination: true })
        .then((x) => {
          x.forEach((e) => {
            vm.json_data.push({
              Name: e.product_name,
              Price: e.product_price + " " + "NOK",
              VAT: e.product_VAT,
            });
          });
        });
    },
    csvSample() {
      const csv = [
        "Product Name",
        "Product Price",
        "Product Description",
        "VAT",
        "Expiry Date",
        "Status",
        "Ingredients",
        "Image",
        "Categories Name",
        "Dispensing Speed",
        "Recipe",
        "Allergies",
        "Product Number",
        "Product Max Limit",
        "Extraction Time"
      ];
      var a = document.createElement("a");
      const blob = new Blob([csv.join(",")], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      a.setAttribute("href", url);
      a.setAttribute("download", "Product Sample.csv");
      a.style.display = "none";
      a.click();
    },

    imgProduct(obj) {
      if (obj.startsWith("http")) {
        return obj.replace("/public", "");
      }
    },
    async YesModel() {
      this.delDialog = false;
      await this.deleteItem();
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
    updateCurrentPage(obj) {
      if (obj >= 1) {
        this.currentPage = obj;
      }
    },
    async fetchData() {
      this.isfetching = true;
      this.search = this.search == null ? "" : this.search;
      await this.$store.dispatch("getcategorysList", {
        pagination: true,
      });
      await this.$store.dispatch("getRoleList", { pagination: true });
      await this.$store.dispatch("productsList", {
        resultPerPage: 10,
        filter: this.search,
        currentPage: this.currentPage,
        category_id: this.category_id,
      });
      this.table_loader = false;
    },
    closeSuccessModel() {
      this.successDialog = false;
    },
    editItem(obj) {
      this.$store.dispatch("getproductById", obj);
      this.dialog = true;
      this.isEdit = true;
    },

    viewItem(obj) {
      this.$store.dispatch("getproductById", obj);
      this.viewdialog = true;
    },

    async closeModel() {
      await this.fetchData();
      this.dialog = false;
      this.bulkdialog = false;
      this.viewdialog = false;
      this.filterDialog = false;
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
      this.$store.dispatch("removeproduct", this.itemId).then((r) => {
        if (r.success) {
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
    clear() {
      this.bulkdialog = false;
    },
  },
  mounted() {
    this.fetchData();
    this.permissions = this.userDetails.permissions;
  },
  computed: {
    ...mapGetters([
      "getcategoryList",
      "getproductList",
      "getproductListTotal",
      "getroleList",
      "userDetails",
    ]),
    maxPages() {
      return Math.ceil(this.getproductListTotal / 10);
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
.searchfield {
  max-width: 250px;
}
.b-border {
  border-bottom: 1px solid #f8932d;
}
</style>
