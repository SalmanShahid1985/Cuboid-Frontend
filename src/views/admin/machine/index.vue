<template>
  <div>
    <div class="view-header mb-2 mt-3">
      <v-card-text>
        <div class="pageHeadingIcon">
          <div class="pageName">
            <svg class="pageNameSvg userManagmentIcon">
              <use xlink:href="#machineWhite"></use>
            </svg>
          </div>
          <h2>Machine Management</h2>
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
          placeholder="Search by Machine..."
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
            dark
            color="main_bg_color"
            @click="getMachinesStatusEvent()"
            class="mr-2"
            ><i class="mr-2">
              <img
                src="../../../assets/logos/Icon-awesome-arrow-alt-circle-right.svg"
                style="margin-top: -4px; width: 18px; height: 18px"
                alt=""
              /> </i>
            Get Latest Status
            </v-btn>
            <v-btn
              v-if="hasPermission('user_create')"
              dark
              color="main_bg_color"
              v-bind="attrs"
              v-on="on"
              ><i class="mr-2" style="margin-top: -3px"
                ><svg class="pageNameSvg userManagmentIcon">
                  <use xlink:href="#machineWhite"></use></svg></i
              >Add Machine</v-btn>
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
                  >Add Machine
                </span>
                <span v-else>Edit Machine</span>
                <span @click="closeModel" class="crossPossition">
                  <img src="../../../assets/logos/Icon metro-cross.svg" alt="" />
                </span>
              </v-toolbar>
              <v-card-text v-if="isEdit == false">
                <addMachine @closeIt="closeModel"></addMachine>
              </v-card-text>
              <v-card-text v-else>
                <addMachine @closeIt="closeModel"></addMachine>
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
        <vue-blob-json-csv
          file-type="csv"
          file-name="Machine"
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
      <div class="role_dropdown_user pr-10 pb-7">
        <div>
          <label class="regularFont login-font" style=""
            >Select Canteen <small style="color: red">*</small></label
          >
          <div class="right-inner-addon input-container pb-0">
            <i
              ><img src="../../../assets/logos/bxs-down-arrow.svg" height="7px"
            /></i>
            <select
              @change="fetchData()"
              v-model="canteen_id"
              class="form-control login-field"
            >
              <option value="">All</option>
              <option v-for="(d, i) in getcanteenList" :key="i" :value="d._id">
                {{ d.canteen_name }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="tableWrapper">
      <table class="row mx-0" id="myTable">
        <thead class="px-0">
          <tr class="tableHead">
            <th class="name" style="width: 30%">Name</th>
            <th class="name" style="width: 30%">Canteen Name</th>
            <th class="name" style="width: 30%">Requested Temperature</th>
            <th class="name" style="width: 30%">Current Active Machine Temperature</th>
            <th class="name" style="width: 30%">Machine Status</th>
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
              style="cursor: pointer"
            >
              <td class="namedata" style="width: 30%" @click="viewItem(data)">
                {{ data.machine_name }}
              </td>
              <td class="namedata" style="width: 30%" @click="viewItem(data)">
                {{ data.canteen_id.canteen_name }}
              </td>

              <td
                class="namedata keep"
                style="width: 30%"
                @click="viewItem(data)"
              >
                <p v-if="data.requested_machine_temperature">
                  {{ data.requested_machine_temperature }}&#8451;
                </p>
              </td>
              <td
              class="namedata keep"
              style="width: 30%"
              @click="viewItem(data)"
            >
              <p v-if="data.machine_temperature">
                {{ data.machine_temperature }}&#8451;
              </p>
            </td>
              <td
                class="namedata"
                style="width: 30%; word-break: normal"
                @click="viewItem(data)"
              >
                <ul>
                  <li>{{ data.machine_service_status }}</li>
                  <li>{{ data.machine_communication_status }}</li>
                  <li>{{ data.machine_dispense_status }}</li>
                  <li>{{ data.door_status }}</li>
                  <li>{{ data.light_status }}</li>
                </ul>
              </td>
              <td class="statusdata" style="width: 20%" @click="viewItem(data)">
                <button
                  :class="
                    data.machine_status == 'Active'
                      ? 'btnActive green'
                      : 'btnActive grey'
                  "
                >
                  {{ data.machine_status == "Active" ? "Active" : "DeActive" }}
                </button>
              </td>
              <td class="actiondata actionIcons" style="width: 20%">
                <span
                  style="
                    display: flex;
                    flex-direction: column;
                    justify-content: space-around;
                  "
                >
                  <span
                    style="
                      display: flex;
                      flex-direction: row;
                      justify-content: space-around;
                    "
                  >
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
                  </span>
                  <br />

                  <span>
                    <v-btn
                      @click="viewItem(data)"
                      color="error"
                      elevation="2"
                      x-small
                      >Manage Channels
                    </v-btn>
                  </span>
                  
                  <span>
                    <v-btn
                      @click="turnLightOnOffOfMachine(data)"
                      color="primary"
                      elevation="2"
                      x-small
                      :loading="
                        lightLoaders.find((ll) => ll.machineId === data._id && ll.loading === true)
                          ? true
                          : false
                      "
                    >
                      <template
                        v-if="data.light_status.toLowerCase() === 'light on'"
                        >Turn Off Light</template
                      >
                      <template v-else>Turn On Light</template>
                    </v-btn>
                  </span>
                </span>
              </td>
            </tr>
          </div>
        </tbody>
      </table>
    </div>
    <div class="pagiNationWrapper notranslate">
      <p v-if="getmachineList">
        Showing {{ currentPage }}-{{ getmachineList.length }} of
        {{ getmachineListTotal }} results
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
                <img src="../../../assets/logos/Icon metro-cross.svg" alt=""/>
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
import addMachine from "../../../components/machine/addMachine.vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
export default {
  components: {
    addMachine,
  },
  data() {
    return {
      canteen_id: "",
      json_data: [],
      currentPage: 1,
      table_loader: true,
      deletedialog: false,
      canteenId: "",
      machinename: false,
      isEdit: false,
      dialog: false,
      delDialog: false,
      allowDel: false,
      permissions: [],
      itemId: "",
      isfetching: false,
      search: "",
      lightLoaders: [],
      intervalStoreMachineListId: 0,
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: true,
          value: "machine_name",
        },
        {
          text: " Status",
          align: "start",
          sortable: true,
          value: "machine_status",
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

  watch: {
    currentPage: {
      handler: function () {
        this.fetchData();
      },
    },
    getmachineList: {
      handler: function () {
        this.items = this.getmachineList;
        this.lightLoaders = [];
        console.log('this.items', this.items);
        this.lightLoaders = this.items.map((item) => {
          return {
            machineId: item._id,
            lightStatus: item.light_status,
            loading: false
          };
        });
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
      await this.$store
        .dispatch("machinesList", { pagination: true })
        .then((x) => {
          x.forEach((e) => {
            vm.json_data.push({
              Name: e.machine_name,
              Temperature: e.machine_temperature,
            });
          });
        });
    },
    hasPermission(obj) {
      // if (
      //   this.userDetails &&
      //   this.userDetails.user &&
      //   this.userDetails.user.user_role == "super_admin"
      // ) {
      return true;
      // } else {
      //
      //   return this.userDetails.permissions.permission_name.includes(obj);
      // }
    },
    addmachine() {
      this.$bvModal.show("createMachine");
    },
    async getcanteenmachine(obj) {
      console.log('getcanteenmachine obj', obj);
      if (obj) {
        await this.$store
          .dispatch("machinesList", obj)
          .then((response) => {
            this.isfetching = false;
            this.items = this.getmachineList;
          })
          .catch((ex) => {
            this.isfetching = false;
          });
      } else {
        await this.fetchData();
        await this.$store.dispatch("getcanteenById", null);
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
      await this.$store.dispatch("productsList", { pagination: true });
      await this.$store.dispatch("getcanteensList", {
        pagination: true,
      });
      await this.$store.dispatch("machinesList", {
        resultPerPage: 10,
        filter: this.search,
        currentPage: this.currentPage,
        canteen_id: this.canteen_id,
      });
      this.table_loader = false;
    },

    async viewItem(obj) {
      this.machinename = obj.machine_name;
      await this.$store.dispatch("getmachinechannels", {
        _id: obj._id,
        canteen_name: obj.canteen_id.canteen_name,
        machine: obj
      });
      this.$router.push({ name: "channelView" });
    },
    async editItem(obj) {
      await this.$store.dispatch("getChannelsOfMachine", obj);
      (this.isEdit = true), (this.dialog = true);
    },

    closeModel() {
      this.fetchData();
      this.dialog = false;
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
        .dispatch("removemachine", this.itemId)
        .then((response) => {
          Swal.fire({
            title: "",
            text: response.data.message,
            icon: "success",
          });
        });
      this.delDialog = false;
      this.itemId = "";

      this.fetchData();
    },
    getMachinesStatusEvent() {
      const instance = this;
      if(instance.getmachineList){
        const machines = instance.getmachineList.map(machine => { return {machine_id: machine._id, canteen_id: machine.canteen_id._id};});
        instance.$store.dispatch("requestMachineStatus", { machines });
      }
    },
    getLatestMachineStatusFromStore(instance) {
      console.log('instance.getcanteenById', instance.getcanteenById); 
      this.fetchData();
      if (instance.getcanteenById) {
        instance.canteenId = instance.getcanteenById._id;
        instance.getcanteenmachine(instance.canteenId);
        instance.canteen_id = instance.canteenId;
      }
    },
    turnLightOnOffOfMachine(data) {
      console.log('data',data);
      const machineId = data._id;
      console.log('machineId', machineId);
      const lightStatus =
        data.light_status.toLowerCase() === "light on" ? "off" : "on";
      const canteenId = data.canteen_id._id;
      this.$store.dispatch("turnOnOffLightOfMachine", {
        machineId,
        lightStatus,
        canteenId,
      });
      console.log('this.lightLoaders',this.lightLoaders);
      const loader = this.lightLoaders.find((ll) => ll.machineId === machineId);
      console.log('loader', loader);
      if (loader) {
        loader.loading = true;
        setTimeout(() => {
          loader.loading = false;
        }, 4000);
      } else {
        this.lightLoaders.push({ machineId, loading: true });
      }

      setTimeout(() => {
        console.log('intervalStoreMachineListId');
        instance.getLatestMachineStatusFromStore(instance);
      }, 4000);
      
    }
  },
  destroyed() {
    clearInterval(this.intervalStoreMachineListId);
    this.$store.dispatch("resetmachineListState");
  },
  mounted() {
    const instance = this;
    this.permissions = this.userDetails.permissions;
    instance.fetchData();
    instance.getLatestMachineStatusFromStore(instance);
    //getting the status from the store     
    this.intervalStoreMachineListId = setInterval(() => {
      console.log('intervalStoreMachineListId');
      instance.getLatestMachineStatusFromStore(instance);
    }, 15000);

    if(this.$route && this.$route.query && this.$route.query.action && this.$route.query.action === "addNewMachine") {
      this.addmachine();
      this.dialog = true;
      this.delDialog = false;
    }

  },
  computed: {
    ...mapGetters([
      "getcanteenList",
      "getmachineList",
      "getmachineListTotal",
      "getcanteenListActive",
      "userDetails",
      "getcanteenById",
    ]),
    maxPages() {
      return Math.ceil(this.getmachineListTotal / 10);
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
.view-header {
  grid-template-columns: 1fr 1fr 1fr;
}
.role_dropdown_user {
  grid-column-start: 1;
  grid-column-end: 1;
  justify-content: flex-start;
  padding-left: 40px;
}
</style>
   