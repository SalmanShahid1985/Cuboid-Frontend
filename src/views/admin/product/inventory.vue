<template>
  <div>
    <div class="d-flex justify-space-around align-center mb-2 mt-3">
      <v-card-text>
        <div class="pageHeadingIcon">
          <div class="pageName">
            <svg class="pageNameSvg userManagmentIcon">
              <use xlink:href="#productManagment"></use>
            </svg>
          </div>
          <h2>Inventory List </h2>
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
          @change="fetchData()"
        />
      </div>
     </div>
    <div class="tableWrapper">
      <table class="row mx-0" id="myTable">
        <thead class="px-0">
          <tr class="tableHead">
            <th class="status" style="width: 30%">Image</th>
            <th class="name" style="width: 40%">Name</th>
            <th class="email" style="width: 30%;border: none">Quantity</th>
          </tr>
        </thead>
        <tbody class="px-0">
          <div class="my-7" v-show="table_loader">
            <v-progress-linear
              indeterminate
              color="orange darken-1"
            ></v-progress-linear>
          </div>
           
          <div  v-if="table_loader == false">

            <tr
              v-for="(data, index) in getinventoryList"
              :key="index"
              class="px-0 tabledata"
            >
              <td
                 class="statusdata"
                style="width: 30%"
              >
                <img
                  height="50"
                  width="50"
                  style="border-radius:50%"
                  :src="imgProduct(data.product_image)"
                  alt=""
                />
              </td>
              
              <td class="namedata" style="width: 40%">{{ data.product_name }}</td>
              <td class="emaildata" style="width: 30%">{{ data.TotalQuantity }}</td>
            </tr>
          </div>
        </tbody>
      </table>
    </div>
    <div class="pagiNationWrapper notranslate">
      <p v-if="getinventoryList">
        Showing {{ currentPage }}-{{ getinventoryList.length }}
        of
        {{ getinventoryListTotal }} results
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


      <!-- <ul class="pagiNation">
        <li @click="updateCurrentPage(currentPage - 1)" class="pagiNation-item">
          <a class="page-link">
            <svg class="svgIconLeft">
              <use xlink:href="#leftIcon"></use>
            </svg>
          </a>
        </li>
        <li @click="updateCurrentPage(currentPage)" class="pagiNation-item">
          <span class="page-link activepage"> {{ currentPage }}</span>
        </li>
        <li @click="updateCurrentPage(currentPage + 1)" class="pagiNation-item">
          <span class="page-link"> {{ currentPage + 1 }}</span>
        </li>
        <li @click="updateCurrentPage(currentPage + 2)" class="pagiNation-item">
          <span class="page-link"> {{ currentPage + 2 }}</span>
        </li>
        <li @click="updateCurrentPage(currentPage + 1)" class="pagiNation-item">
          <a class="page-link">
            <svg class="svgIconNext">
              <use xlink:href="#rightIcon"></use>
            </svg>
          </a>
        </li>
      </ul> -->
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
import addInventory from "../../../components/product/addInventory.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    addInventory,
  },
  data() {
    return {
      currentPage: 1,
      table_loader : true,
      machine_id: "",
      product_id: "",
      canteen_id: "",
      isEdit: false,
      dialog: false,
      permissions: [],
      delDialog: false,
      allowDel: false,
      itemId: "",
      isfetching: false,
      search: "",
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: true,
          value: "product_name",
        },
        {
          text: "Quantity",
          align: "start",
          sortable: true,
          value: "TotalQuantity",
        },
      ],
      items: [],
    };
  },
   watch: {
    currentPage: {
      handler: function () {
        this.fetchData();
      },
    },
    search:{
       handler: function () {
        this.currentPage = 1;
        this.fetchData();
      },
    }
  
  },
  methods: {
    imgProduct(obj) {
      if (obj && obj.startsWith("http")) {
        return obj.replace("/public", "");
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
    async fetchData() {
      this.search = this.search == null ? "" : this.search;
      await this.$store.dispatch("getcanteensList", { pagination: true });
      await this.$store.dispatch("productsList", { pagination: true });
      await this.$store.dispatch("machinesList", { pagination: true });
      await this.$store.dispatch("inventoryList", {
        resultPerPage: 10,
        currentPage: this.currentPage,
        filter: this.search,
        pagination: true,
      });
      this.isfetching = true;
      this.table_loader = false;
    },
    async onChangeCanteen(obj) {
      if (obj) {
        await this.$store.dispatch("machinesList", obj).then((response) => {
          this.getmachineList;
        });
        await this.$store
          .dispatch("inventoryList", {
            machine_id: this.machine_id,
            product_id: this.product_id,
            canteen_id: obj,
          })
          .then((res) => {});
      } else {
        await this.fetchData();
      }
    },
    updateCurrentPage(obj) {
      if (obj >= 1) {
        this.currentPage = obj;
      }
    },
    async onChangeMachine(obj) {
      await this.$store
        .dispatch("inventoryList", {
          machine_id: obj,
          product_id: this.product_id,
          canteen_id: this.canteen_id,
        })
        .then((res) => {});
    },
    async onChangeProduct(obj) {
      await this.$store
        .dispatch("inventoryList", {
          machine_id: this.machine_id,
          product_id: obj,
          canteen_id: this.canteen_id,
        })
        .then((res) => {});
    },
    editItem(obj) {
      this.$store.dispatch("getinventoryById", obj);
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
    this.$store.dispatch("resetinventoryListState");
  },
  mounted() {
    this.fetchData();
    this.permissions = this.userDetails.permissions;
  },
  computed: {
    ...mapGetters([
      "getinventoryList",
      "getmachineList",
      "getproductList",
      "getinventoryListTotal",
      "getcanteenList",
      "userDetails",
    ]),
    maxPages() {
      return Math.ceil(this.getinventoryListTotal/10)
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


   