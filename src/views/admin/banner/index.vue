<template>
  <div>
    <div class="d-flex justify-space-around align-center mb-2 mt-3">
      <v-card-text>
        <div class="pageHeadingIcon">
          <div class="pageName">
            <svg class="pageNameSvg userManagmentIcon">
              <use xlink:href="#bannerIcon"></use>
            </svg>
          </div>
          <h2>Banner</h2>
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
              @click="isEdit = false"
              ><i class="mr-2"
                ><svg class="pageNameSvg userManagmentIcon">
                  <use xlink:href="#bannerIcon"></use></svg></i
              >Add Banner</v-btn
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
                  >Add Banner
                </span>

                <span v-else>Edit Banner</span>
                <span @click="closeModel" class="crossPossition">
                  <img src="../../../assets/logos/Icon metro-cross.svg" />
                </span>
              </v-toolbar>
              <v-card-text v-if="isEdit == false">
                <addBanner :editMode="isEdit" @closeIt="closeModel"></addBanner>
                <!-- <addCanteen @closeIt="closeModel" :isEdit='isEdit'></addCanteen> -->
              </v-card-text>
              <v-card-text v-else>
                <addBanner :editMode="isEdit" @closeIt="closeModel"></addBanner>
                <!-- <editUser @closeIt="closeModel"></editUser> -->
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
                  >View Banner
                </span>

                <span @click="closeModel" class="crossPossition">
                  <img src="../../../assets/logos/Icon metro-cross.svg" />
                </span>
              </v-toolbar>
              <v-card-text>
                <viewBanner @closeIt="closeModel"></viewBanner>
                <!-- <editUser @closeIt="closeModel"></editUser> -->
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
            <th class="name" style="width: 20%">Title</th>
            <th class="email" style="width: 20%">Start Date</th>
            <th class="status" style="width: 20%">End Date</th>
            <th class="status" style="width: 20%">Status</th>
            <th class="action" style="width: 20%">Action</th>
          </tr>
        </thead>
        <div class="my-7" v-show="table_loader">
          <v-progress-linear
            indeterminate
            color="orange darken-1"
          ></v-progress-linear>
        </div>
        <tbody class="px-0">
          <div>
            <tr
              v-for="(data, index) in items"
              :key="index"
              class="px-0 tabledata"
            >
              <td class="namedata" style="width: 20%" @click="viewItem(data)">
                {{ data.banner_title }}
              </td>
              <td class="emaildata" style="width: 20%" @click="viewItem(data)">
                {{ dateConvert(data.banner_start_date) }}
              </td>
              <td class="emaildata" style="width: 20%" @click="viewItem(data)">
                {{ dateConvert(data.banner_end_date) }}
              </td>
              <td class="statusdata" style="width: 20%" @click="viewItem(data)">
                <button
                  :class="
                    data.banner_status == 'Active'
                      ? 'btnActive green'
                      : 'btnActive grey'
                  "
                >
                  {{ data.banner_status == "Active" ? "Active" : "DeActive" }}
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
      <p v-if="getbannerTotal">
        Showing {{ currentPage }}-{{ getbannerList.length }} of
        {{ getbannerTotal }} results
      </p>
      <p v-else>Showing 0-0 of 0 results</p>

      <!-- Page bar at bottom of table -->

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
              <h2>Warning</h2>
              <span @click="closeModel" class="crossPossition">
                <img src="../../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>

            <v-card-text class="pt-10 text-h6">
              Do you want to delete this Banner?

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
  </div>
</template>
<script>
import addBanner from "../../../components/banners/addBanners.vue";
import viewBanner from "../../../components/banners/viewBanner.vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";

export default {
  components: {
    addBanner,
    viewBanner,
  },
  data() {
    return {
      currentPage: 1,
      table_loader: true,
      items: [],
      isEdit: false,
      dialog: false,
      viewdialog: false,
      delDialog: false,
      allowDel: false,
      itemId: "",
      permissions: [],
      isfetching: false,
      search: "",
    };
  },

  watch: {
    currentPage: {
      handler: function () {
        this.fetchData();
      },
    },
    getbannerList: {
      handler: function () {
        this.items = this.getbannerList;
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
    updateCurrentPage(obj) {
      if (obj >= 1) {
        this.currentPage = obj;
      }
    },
    async fetchData() {
      this.table_loader = true;
      await this.$store.dispatch("getcanteensList", { pagination: true });
      await this.$store.dispatch("machinesList", { pagination: true });
      await this.$store.dispatch("bannersList", {
        resultPerPage: 10,
        filter: this.search,
        currentPage: this.currentPage,
      });
      this.table_loader = false;
    },
    machineName(obj) {
      return obj.machine
        .map((e) => {
          return e.machines.machine_name;
        })
        .toString();
    },
    editItem(obj) {
      this.$store.dispatch("getbannerById", obj);
      this.dialog = true;
      this.isEdit = true;
    },
    viewItem(obj) {
      this.$store.dispatch("getbannerById", obj);
      this.viewdialog = true;
      this.isEdit = true;
    },

    async closeModel() {
      await this.fetchData();
      this.dialog = false;
      this.isEdit = false;
      this.viewdialog = false;
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
      this.$store.dispatch("removebanner", this.itemId).then((response) => {
        Swal.fire({
          title: "",
          text: "success",
          icon: "success",
        });
        this.fetchData();
      });
      await this.fetchData();
      this.delDialog = false;
      this.itemId = "";
    },
  },
  destroyed() {
    this.$store.dispatch("resetbannerListState");
  },
  mounted() {
    this.fetchData();
    this.permissions = this.userDetails.permissions;
  },
  computed: {
    ...mapGetters(["getbannerList", "getbannerTotal", "userDetails"]),
    maxPages() {
      return Math.ceil(this.getbannerTotal / 10);
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


   