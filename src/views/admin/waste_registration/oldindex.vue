<template>
  <div>
    <v-card class="d-flex justify-space-around align-center mb-10">
      <v-card-text>
        <p class="text-h4 text--primary mb-0">
          <i class="fas fa-stream Orders mr-2 main_color"></i>
          Waste Management
        </p>
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
              v-if="hasPermission('wastage_create')"
              dark
              color="main_bg_color"
              v-bind="attrs"
              v-on="on"
            >
              <i class="fas fa-plus mr-2"></i>Add Waste
            </v-btn>
          </template>
          <template v-if="dialog" v-slot:default="dialog">
            <v-card>
              <v-toolbar color="main_bg_color" dark class="mb-2">
                <span v-if="isEdit == false"
                  ><i class="fas fa-stream Orders mr-2"></i>Add Waste</span
                >
                <span v-else
                  ><i class="fas fa-stream Orders mr-2"></i>Edit Waste</span
                >
              </v-toolbar>
              <v-card-text>
                <addWasteRegistration
                  @closeIt="closeModel"
                ></addWasteRegistration>
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
      </v-card-actions>
    </v-card>
    <v-card v-if="hasPermission('wastage_view')">
      <v-card-title>
        Waste List
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
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
        <!-- @click="" -->
        <template v-slot:[`item.wastage_product_Name`]="{ item }">
          {{ getName(item) }}
        </template>
        <template v-slot:[`item.wastage_canteen_Name`]="{ item }">
          {{ getMachineName(item) }}
        </template>
        <template v-slot:[`item.wastage_machine_Name`]="{ item }">
          {{ getCanteneName(item) }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            v-if="hasPermission('wastage_edit')"
            class="mr-2 edit_btn"
            @click.stop="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            v-if="hasPermission('wastage_delete')"
            @click="warningModel(item._id)"
            class="del_btn"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
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
      machine_id: "",
      product_id: "",
      canteen_id: "",
      isEdit: false,
      dialog: false,
      delDialog: false,
      allowDel: false,
      isfetching: false,
      search: "",    permissions: [],
      itemId: "",

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

  methods: {   hasPermission(obj) {
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
    async fetchData() {
      this.isfetching = true;

      await this.$store
        .dispatch("wasteList")
        .then((response) => { 
          this.isfetching = false;
          this.items = this.getwasteList;
        })
        .catch((ex) => {
          this.isfetching = false; 
        });

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

      this.fetchData() 
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
      "getmachineList",
      "getproductList",
      "getcanteenList","userDetails"
    ]),
  },
};
</script>
