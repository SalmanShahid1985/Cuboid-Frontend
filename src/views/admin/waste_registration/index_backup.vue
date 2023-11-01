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
          <h2>Waste Management</h2>
        </div>
      </v-card-text>
      <div></div>
      <div class="d-flex align-center">
        <v-card-actions class="pa-5">
          <!------------------csv download ------------>
          <vue-blob-json-csv
            file-type="csv"
            file-name="Wastage"
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
    </div>
    <div class="tableWrapper">
      <table class="row mx-0" id="myTable">
        <thead class="px-0">
          <tr class="tableHead">
            <th class="status" style="width: 20%">Image</th>
            <th class="name" style="width: 30%">Canteen</th>
            <th class="name" style="width: 30%">Product</th>
            <th class="email" style="width: 20%; border: none">Quantity</th>
          </tr>
        </thead>
        <div v-if="table_loader" class="py-7">
          <v-progress-linear
            indeterminate
            color="orange darken-1"
          ></v-progress-linear>
        </div>

        <tbody class="px-0" v-if="!table_loader">
          <tr
            v-for="(data, index) in getwasteList"
            :key="index"
            class="px-0 tabledata"
          >
            <td class="statusdata" style="width: 20%">
              <img
                :src="imgProduct(data.wastage_product_id.product_image)"
                height="60px"
              />
            </td>
            <td class="namedata" style="width: 30%">
              {{ data.wastage_canteen_id.canteen_name }}
            </td>

            <td class="emaildata" style="width: 30%">
              {{ data.wastage_product_id.product_name }}
            </td>
            <td class="emaildata" style="width: 20%">
              {{ data.wastage_product_quantity }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagiNationWrapper notranslate">
      <p v-if="getwasteList">
        Showing {{ currentPage }}-{{ getwasteList.length }} of
        {{ getwasteListTotal }} results
      </p>
      <p v-else>Showing 0-0 of0 results</p>
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
              Do you want to delete this Inventory?

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
import addWasteRegistration from "../../../components/product/addWasteRegistration.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    addWasteRegistration,
  },
  data() {
    return {
      currentPage: 1,
      machine_id: "",
      product_id: "",
      table_loader: true,
      canteen_id: "",
      isEdit: false,
      dialog: false,
      delDialog: false,
      allowDel: false,
      isfetching: false,
      search: "",
      permissions: [],
      itemId: "",
      json_data: [],
      headers: [
        {
          text: "Canteen",
          align: "start",
          sortable: true,
          value: "wastage_canteen_Name",
        },
        {
          text: "Machine",
          align: "start",
          sortable: true,
          value: "wastage_machine_Name",
        },
        {
          text: "Product",
          align: "start",
          sortable: true,
          value: "wastage_product_Name",
        },

        {
          text: "Quantity",
          align: "start",
          sortable: true,
          value: "wastage_product_quantity",
        },
      ],
      items: [],
    };
  },
  watch:{
    getwasteList: function(res){
      if(res){
        // this.table_loader = false;
        this.json_data = res.map(w => {
          return {
            canteen_name: w?.wastage_canteen_id.canteen_name,
            canteen_location: w?.wastage_canteen_id?.canteen_location || '',
            channel_name: w?.wastage_channel_id?.channel_name || '',
            machine_name: w?.wastage_machine_id?.machine_name || '',
            product_name: w?.wastage_product_id?.product_name || '',
            product_quantity: w?.wastage_product_quantity || '',
          }
        });
      }
    }
  },

  methods: {
     async downloadCsv() {
      var vm = this;
    },
    imgProduct(obj) {
      if (obj?.startsWith("http")) {
        return obj?.replace("/public", "");
      }
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
    getName(obj) {
      return obj.wastage_product_id.product_name;
    },
    getCanteneName(obj) {
      return obj.wastage_canteen_id.canteen_name;
    },
    getMachineName(obj) {
      return obj.wastage_machine_id.machine_name;
    },
    updateCurrentPage(obj) {
      if (obj >= 1) {
        this.currentPage = obj;
      }
    },
    async fetchData() {
      this.table_loader = true;
      await this.$store.dispatch("wasteList", {
        resultPerPage: 10,
        filter: this.search,
        currentPage: this.currentPage,
      });
      this.table_loader = false;
    },
    editItem(obj) {
      this.$store.dispatch("getwasteById", obj);
      this.dialog = true;
      this.isEdit = true;
    },

    closeModel() {
      this.fetchData();
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

    deleteItem() {
      this.$store.dispatch("removeinventory", this.itemId).then((response) => {
        Swal.fire({
          title: "",
          text: "success",
          icon: "success",
        });
      });
      this.delDialog = false;
      this.itemId = "";

      this.fetchData();
    },
  },
  destroyed() {
    this.$store.dispatch("resetwasteListState");
  },
  mounted() {
    this.fetchData();
  },
  computed: {
    ...mapGetters([
      "getwasteList",
      "getwasteListTotal",
      "getmachineList",
      "getproductList",
      "getcanteenList",
      "userDetails",
    ]),
    maxPages() {
      return Math.ceil(this.getwasteListTotal / 10);
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


   