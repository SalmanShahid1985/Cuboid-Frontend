<template>
  <div>
    <v-card class="d-flex justify-space-around align-center mb-10">
      <v-card-text>
        <p class="text-h4 text--primary mb-0">
          <i class="fas fa-stream Orders mr-2 main_color"></i>
          Discount
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
              v-if="hasPermission('discount_create')"
              dark
              color="main_bg_color"
              v-bind="attrs"
              v-on="on"
            >
              <i class="fas fa-plus mr-2"></i>Add Discount</v-btn
            >
          </template>
          <template v-if="dialog" v-slot:default="dialog">
            <v-card>
              <v-toolbar color="main_bg_color" dark class="mb-2">
                <span v-if="isEdit == false"
                  ><i class="fas fa-stream Orders mr-2"></i>Add Discount</span
                >
                <span v-else
                  ><i class="fas fa-stream Orders mr-2"></i>Edit Discount</span
                >
              </v-toolbar>
              <v-card-text>
                <addDiscount @closeIt="closeModel"></addDiscount>
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
      </v-card-actions>
    </v-card>
    <v-card v-if="hasPermission('discount_view')">
      <v-card-title>
        Discount List
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
        <template v-slot:[`item.discount_start_date`]="{ item }">
          {{ dateConvert(item.discount_start_date) }}
        </template>
        <template v-slot:[`item.discount_end_date`]="{ item }">
          {{ dateConvert(item.discount_end_date) }}
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            v-if="hasPermission('discount_edit')"
            class="mr-2 edit_btn"
            @click.stop="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            v-if="hasPermission('discount_delete')"
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
import addDiscount from "../../../components/discount/addDiscount.vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
export default {
  components: {
    addDiscount,
  },
  data() {
    return {
      isEdit: false,
      dialog: false,
      delDialog: false,
      allowDel: false,
      itemId: "",
      isfetching: false,
      search: "",  permissions: [],
      headers: [
        {
          text: "Name",
          align: "start",
          sortable: true,
          value: "discount_name",
        },

        {
          text: "Start Date",
          align: "start",
          sortable: true,
          value: "discount_start_date",
        },
        {
          text: "End Date",
          align: "start",
          sortable: true,
          value: "discount_end_date",
        },
        {
          text: "Type",
          align: "start",
          sortable: true,
          value: "discount_type",
        },
        {
          text: "Value",
          align: "start",
          sortable: true,
          value: "discount_value",
        },
        {
          text: "Status",
          align: "start",
          sortable: true,
          value: "discount_status",
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
    dateConvert(obj) {
      var date = new Date(obj);
      return (
        date.getFullYear() + "-" + date.getMonth() + 1 + "-" + date.getDate()
      );
    },
    async fetchData() {
      await this.$store.dispatch("machinesList");
      await this.$store.dispatch("getcanteensList");
      await this.$store.dispatch("productsList");
      this.isfetching = true;
      await this.$store
        .dispatch("discountsList")
        .then((response) => {
          this.isfetching = false;
          this.items = this.getdiscountList;
        })
        .catch((ex) => {
          this.isfetching = false; 
        });
    },

    editItem(obj) {
      this.$store.dispatch("getdiscountById", obj);
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

    async deleteItem() {
      await this.$store
        .dispatch("removediscount", this.itemId)
        .then((response) => {
          Swal.fire({
            title: "",
            text: response.message,
            icon: "success",
          });
        });
      this.delDialog = false;
      this.itemId = "";

      this.fetchData() 
    },
  },
  destroyed() {
    this.$store.dispatch("resetdiscountListState");
  },
  mounted() {
    this.fetchData();  
     this.permissions = this.userDetails.permissions;
  },
  computed: {
    ...mapGetters([
      "userDetails","getdiscountList"]),
  },
};
</script>
