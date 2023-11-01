<template>
  <div>
    <v-card class="d-flex justify-space-around align-center mb-10">
      <v-card-text>
        <p class="text-h4 text--primary mb-0">
          <i class="fas fa-stream Orders mr-2 main_color"></i>
          Machine
        </p>
      </v-card-text>
      <v-card-actions class="pa-5">
        <v-btn
          v-if="
            hasPermission('machine_create') && this.getcanteenListActive
          "
          dark
          color="main_bg_color"
          @click="addmachine"
        >
          <i class="fas fa-plus mr-2"></i>Add Machine</v-btn
        >
      </v-card-actions>
    </v-card>
    <b-modal
      size="xl"
      id="createMachine"
      hide-footer
      centered
      style="height: 500px"
      no-close-on-backdrop
    >
      <template color="main_bg_color" dark class="mb-2" slot="modal-title">
        <span v-if="isEdit == false"
          ><i class="fas fa-stream Orders mr-2"></i>Add Machine</span
        >
        <span v-else
          ><i class="fas fa-stream Orders mr-2"></i>View Machine</span
        >
      </template>
      <addMachine @closeIt="closeModel"></addMachine>
    </b-modal>
    <b-modal
      size="xl"
      id="updateMachine"
      hide-footer
      centered
      style="height: 500px"
      no-close-on-backdrop
    >
      <template color="main_bg_color" dark class="mb-2" slot="modal-title">
        <span v-if="isEdit == false"
          ><i class="fas fa-stream Orders mr-2"></i>{{ machinename }}</span
        >
        <span v-else
          ><i class="fas fa-stream Orders mr-2"></i> View Machine</span
        >
      </template>
      <updateMachine @closeIt="closeModel"></updateMachine>
    </b-modal>

    <v-card v-if="hasPermission('machine_view')">
      <v-card-title>
        Machine List
        <v-spacer></v-spacer>

        <v-select
          :items="getcanteenListActive" 
          item-value="_id"
          item-text="canteen_name"
          v-model="canteenId"
          @change="getcanteenmachine"
          :clearable="true"
          label="Canteen"
          color="blue darken-3"
        ></v-select>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          color="blue darken-3"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table :headers="headers" :items="items" :search="search">
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            v-if="hasPermission('machine_edit')"
            class="mr-2 edit_btn"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            v-if="hasPermission('channel_view')"
            class="mr-2 edit_btn"
            @click="viewItem(item)"
          >
            mdi-eye
          </v-icon>
          <v-icon
            v-if="hasPermission('machine_delete')"
            @click="warningModel(item._id)"
            class="del_btn"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
    <template>
      <v-dialog v-model="delDialog" max-width="400">
        <v-card>
          <v-card-title class="text-h5 orange lighten-1 text-white">
            Warning
          </v-card-title>
          <v-card-text class="pt-10 text-h6">
            Do you want to delete entry?
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
    </template>
  </div>
</template>
<script>
import addMachine from "../../../components/machine/addMachine.vue";
import updateMachine from "../../../components/machine/updateMachine.vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
export default {
  components: {
    addMachine,
    updateMachine,
  },
  data() {
    return {
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
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: true,
          value: "machine_name",
        },
        {
          text: "Machine Code",
          align: "start",
          sortable: true,
          value: "machine_code",
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
    addmachine() {
      this.$bvModal.show("createMachine");
    },
    async getcanteenmachine(obj) {
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
    async fetchData() {
      this.isfetching = true;
      await this.$store.dispatch("getcanteensList");
      await this.$store.dispatch("productsList",{pagination:true});
      await this.$store
        .dispatch("machinesList")
        .then((response) => {
          this.isfetching = false;
          this.items = this.getmachineList;
        })
        .catch((ex) => {
          this.isfetching = false;
        });
    },

    async viewItem(obj) {
      this.machinename = obj.machine_name;
      await this.$store.dispatch("getmachinechannels", obj._id).then((r) => {
        this.$bvModal.show("updateMachine");
      });
    },
    async editItem(obj) {
      await this.$store.dispatch("getChannelsOfMachine", obj).then((r) => {
        this.$bvModal.show("createMachine");
      });
    },

    closeModel() {
      this.fetchData();
      this.$bvModal.hide("createMachine");
      this.$bvModal.hide("updateMachine");
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
  },
  destroyed() {
    this.$store.dispatch("resetmachineListState");
  },
  mounted() {
    this.permissions = this.userDetails.permissions;
    if (this.getcanteenById) {
      this.canteenId = this.getcanteenById._id;
      this.getcanteenmachine(this.canteenId);
    } else {
      this.fetchData();
    }
  },
  computed: {
    ...mapGetters([
      "getmachineList",
      "getcanteenListActive",
      "userDetails",
      "getcanteenById",
    ]),
  },
};
</script>
