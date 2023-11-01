<template>
  <div>
    <div class="d-flex justify-space-around align-center mb-2 mt-3">
      <v-card-text>
        <div class="pageHeadingIcon">
          <div class="pageName">
            <svg class="pageNameSvg userManagmentIcon">
              <use xlink:href="#pageBuilder"></use>
            </svg>
          </div>
          <h2>Page Builder</h2>
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
              ><i class="mr-2"
                ><svg class="pageNameSvg userManagmentIcon">
                  <use xlink:href="#pageBuilder"></use></svg></i
              >Add CMS</v-btn
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
                  >Add CMS
                </span>
                <span v-else>Edit CMS</span>
                <span @click="closeModel" class="crossPossition">
                  <img src="../../../assets/logos/Icon metro-cross.svg" />
                </span>
              </v-toolbar>
              <v-card-text v-if="isEdit == false">
                <addCMS @closeIt="closeModel"></addCMS>
                <!-- <addCanteen @closeIt="closeModel" :isEdit='isEdit'></addCanteen> -->
              </v-card-text>
              <v-card-text v-else>
                <addCMS @closeIt="closeModel"></addCMS>
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
                  >View CMS
                </span>
                <span @click="closeModel" class="crossPossition">
                  <img src="../../../assets/logos/Icon metro-cross.svg" />
                </span>
              </v-toolbar>

              <v-card-text>
                <viewCMS @closeIt="closeModel"></viewCMS>
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
            <th class="name" style="width: 35%">Title</th>
            <th class="status" style="width: 40%">Status</th>
            <th class="action" style="width: 25%">Action</th>
          </tr>
        </thead>
        <div class="py-7" v-if="table_loader">
          <v-progress-linear indeterminate color="orange darken-1"></v-progress-linear>
        </div>
        <tbody class="px-0" v-if="table_loader == false">
          <tr
            v-for="(data, index) in items"
            :key="index"
            class="px-0 tabledata"
          >
            <td class="namedata" style="width: 35%" @click="viewItem(data)">{{ data.title }}</td>
            <td class="statusdata" style="width: 40%" @click="viewItem(data)">
              <button
                :class="
                  data.status == 'Active' ? 'btnActive green' : 'btnActive grey'
                "
              >
                {{ data.status == "Active" ? "Active" : "DeActive" }}
              </button>
            </td>
            <td class="actiondata actionIcons" style="width: 25%">
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
      <p v-if="getcmsList">
        Showing {{ currentPage }}-{{ getcmsList.length }} of
        {{ getcmsListTotal }} results
      </p>
      <p v-else>Showing 0-0 of0 results</p>
      

<!-- Page Bar at bottom of table -->

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
              Do you want to delete this Machine?

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
import addCMS from "../../../components/cms/addCMS.vue";
import viewCMS from "../../../components/cms/viewCms.vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
export default {
  components: {
    addCMS,
    viewCMS,
  },
  data() {
    return {
      currentPage: 1,
      isEdit: false,
      dialog: false,
      delDialog: false,
      allowDel: false,
      viewdialog: false,
      itemId: "",
      permissions: [],
      table_loader: false,
      isfetching: false,
      search: "",
      headers: [
        {
          text: "Title",
          align: "start",
          sortable: true,
          value: "title",
        },
        {
          text: "Status",
          align: "start",
          sortable: true,
          value: "status",
        },
        {
          value: "actions",
          text: "Action",
          sortable: false,
        },
      ],
      items: [],
    };
  },
  methods: {
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
      this.table_loader = true
      await this.$store.dispatch("getcmssList", {
        resultPerPage: 10,filter :this.search,
        currentPage: this.currentPage,
      });
      this.table_loader = false
    },

    editItem(obj) {
      this.$store.dispatch("getcmsById", obj);
      this.dialog = true;
      this.isEdit = true;
    },
    viewItem(obj) {
      this.$store.dispatch("getcmsById", obj);
      this.viewdialog = true;
      this.isEdit = true;
    },

    async closeModel() {
      await this.fetchData();
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
      await this.$store.dispatch("removecms", this.itemId).then((response) => {
        Swal.fire({
          title: "",
          text: "success",
          icon: "success",
        });
      });
      await this.fetchData();
      this.delDialog = false;
      this.itemId = "";

      this.fetchData();
    },
  },
  watch: {
    currentPage: {
      handler: function () {
        this.fetchData();
      },
    },
    getcmsList: {
      handler: function () {
        this.items = this.getcmsList;
      },
    },
    search: {
      handler: function () {
        this.currentPage = 1;
        this.fetchData();
      },
    },
  },
  mounted() {
    this.fetchData();
    this.permissions = this.userDetails.permissions;
  },
  computed: {
    ...mapGetters(["getcmsList", "getcmsListTotal", "userDetails"]),
    maxPages() {
      return Math.ceil(this.getcmsListTotal / 10)
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


   