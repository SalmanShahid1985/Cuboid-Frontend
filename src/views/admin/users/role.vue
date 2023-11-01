
<template>
  <div>
    <div class="d-flex justify-space-around align-center mb-2 mt-3">
      <v-card-text class="pl-0">
        <div class="pageHeadingIcon">
          <div>
            <img
              src="../../../assets/logos/role-bg.svg"
              style="margin-top: -10px"
            />
          </div>

          <h2>Role List </h2>
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

      <v-card-actions class="pa-5 pr-1">
        <v-dialog
          v-model="dialog"
          transition="dialog-top-transition"
          scrollable
          width="1024px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              dark
              color="main_bg_color"
              v-bind="attrs"
              v-on="on"
              @click="rolePermission()"
              ><i class="mr-2"
                ><img
                  src="../../../assets/logos/Icon-metro-user-plus.svg"
                  height="18px" /></i
              >Add Role</v-btn
            >
          </template>
        </v-dialog>
        <!------------------csv download ------------>
        <vue-blob-json-csv
          file-type="csv"
          file-name="Role List"
          :data="json_data"
        >
          <b-button
            title="download file"
            style="background-color: transparent; color: orange"
            class="ml-3 d-flex"
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
      <table class="row mx-0 roleTable" id="myTable">
        <thead class="px-0">
          <tr class="tableHead">
            <th class="name" style="width: 20%">Name</th>
            <th class="email" style="width: 40%">Permissions</th>
            <th class="status" style="width: 20%">Status</th>
            <th class="action" style="border: none; width: 20%">Action</th>
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

            <tr class="px-0 tabledata" v-for="(data, i) in items" :key="i">
              <td class="namedata" style="width: 20%" @click="viewItem(data)">{{ data.role_name }}</td>
              <td class="emaildata" style="width: 40%" @click="viewItem(data)">
                {{ data.permission_name.toString().replaceAll("_", " ") }}
              </td>
              <td class="statusdata" style="width: 20%" @click="viewItem(data)">
                <button
                  :class="
                    data.role_status == 'Active'
                      ? 'btnActive green'
                      : 'btnActive grey'
                  "
                >
                  {{ data.role_status == "Active" ? "Active" : "DeActive" }}
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
      <p v-if="getroleList">
        Showing {{ currentPage }}-{{ getroleList.length }} of
        {{ getroleListTotal }} results
      </p>
      <p v-else>Showing 0-0 of0 results</p>
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
    <!-- <v-card v-if="hasPermission('user_view')">

      <v-data-table :headers="fields" :items="items" :search="search">
        <template v-slot:[`item.image`]="{ item }">
          <v-avatar v-if="item.image == null || item.image == ''" class="pa-7">
            <img
              src="https://cdn.vuetifyjs.com/images/john.jpg"
              alt="Symphony"
            />
          </v-avatar>
          <v-avatar v-else>
            <img :src="item.image" :alt="item.firstName + item.lastName" />
          </v-avatar>
          {{ item.image }}
        </template>

        <template v-slot:[`item.user_role_id`]="{ item }">
          {{ roleName(item.user_role_id) }}
        </template>
        <template v-slot:[`item.IsApproved`]="{ item }">
          <v-select
            :color="getColor(item.isActive)"
            :items="isApprovedOptions"
            item-text="text"
            item-value="value"
            v-model="item.isActive"
          ></v-select>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            v-if="hasPermission('user_edit')"
            class="mr-2 edit_btn"
            @click.stop="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            v-if="hasPermission('user_delete')"
            @click="warningModel(item._id)"
            class="del_btn"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card> -->

    <!-- <template>
      <v-dialog v-model="delDialog" max-width="400">
        <v-card>
          <v-card-title class="text-h5 align-center orange lighten-1 text-white">
            Warning
          </v-card-title>

          <v-card-text class="pt-10 text-h6">
           <p> Do you want to delete this User? </p>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="green darken-1" text @click="closeWarningModel()">
              Disagree
            </v-btn>

            <v-btn color="deep-orange darken-4" text @click="deleteItem()">
              Agree
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template> -->

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
              Do you want to delete this Role?

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
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
export default {
  components: {},
  data() {
    return {
      table_loader : true,
      json_data: [],
      currentPage: 1,
      isEdit: false,
      dialog: false,
      deletedialog: false,
      delDialog: false,
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
    getroleList: {
      handler: function () {
        this.items = this.getroleList;
      },
    },
  },
  methods: {
    async downloadCsv() {
      var vm = this;
      await this.$store
        .dispatch("getRoleList", { pagination: true })
        .then((x) => {
          x.forEach((e) => {
            vm.json_data.push({
              Name: e.role_name,
              Permissions: e.permission_name.toString().replaceAll("_", " "),
            });
          });
        });
    },
    rolePermission() {
      this.$store.dispatch("getRoleById", null);
      this.$router.push({ name: "rolePermission" });
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
    updateCurrentPage(obj) {
      if (obj >= 1) {
        this.currentPage = obj;
      }
    },
    async fetchData() {
      this.isfetching = true;
      this.search = this.search == null ? "" : this.search;
      await this.$store.dispatch("getRoleList", {
        resultPerPage: 10,filter :this.search,
        currentPage: this.currentPage,
      });
      await this.$store.dispatch("getUserList", { pagination: true });
      this.table_loader = false;
    },

    editItem(obj) {
      this.$store.dispatch("getRoleById", obj);
      this.$router.push({ name: "rolePermission" });
    },
    viewItem(obj) {
      this.$store.dispatch("getRoleById", obj);
      this.$router.push({ name: "viewRolePermisson" });
    },

    async closeModel() {
      // await this.fetchData();
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
      this.$store.dispatch("removeRole", this.itemId).then((r) => {
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
      this.fetchData();
      this.itemId = "";
    },

    getColor(value) {
      if (value == true) return "green";
      else return "orange";
    },
  },
  mounted() {
    this.fetchData();
    window.scrollTo({ top: 0, behavior: 'auto' });
    this.permissions = this.userDetails.permissions;
  },
  computed: {
    ...mapGetters([
      "getuserList",
      "getroleList",
      "getroleListTotal",
      "userDetails",
    ]),
    maxPages() {
      return Math.ceil(this.getroleListTotal/10)
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