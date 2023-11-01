<template>
  <form>
    <v-row>
      <v-col class="col-6">
        <v-select
          :items="getmachinefillerList"
          item-value="_id"
          item-text="user_name"
          disabled
          v-model="canteenModel.machine_filler_id"
          label="Food Supplier"
          color="blue darken-3"
        >
          <template v-slot:label>
            <div>Machine Filler <small style="color: red">*</small></div>
          </template>
        </v-select>
      </v-col>
      <v-col class="col-6">
        <v-select
          :items="getcanteenAdminList"
          item-value="_id"
          item-text="user_name"
          disabled
          v-model="canteenModel.canteen_admin_id"
          label="Food Supplier"
          color="blue darken-3"
        >
          <template v-slot:label>
            <div>Canteen Admin <small style="color: red">*</small></div>
          </template>
        </v-select>
      </v-col>
      <v-col class="col-6">
        <v-text-field
          v-model="canteenModel.canteen_name"
          disabled
          label="Name"
          required
          color="blue darken-3"
        >
          <template v-slot:label>
            <div>Name <small style="color: red">*</small></div>
          </template></v-text-field
        >
      </v-col>
      <v-col class="col-6">
        <v-text-field
          v-model="canteen_company_ids"
          disabled
          label="Name"
          required
          color="blue darken-3"
        >
          <template v-slot:label>
            <div>Company <small style="color: red">*</small></div>
          </template></v-text-field
        >
      </v-col>
      <v-col class="col-6">
        <v-text-field
          v-model="canteenModel.canteen_location"
          label="Location"
          disabled
          required
          color="blue darken-3"
        >
          <template v-slot:label>
            <div>Location <small style="color: red">*</small></div>
          </template>
        </v-text-field>
      </v-col>
      <v-col class="col-6">
        <strong>Status</strong>
        <v-radio-group disabled v-model="canteenModel.canteen_status" row>
          <v-radio label="Active" value="Active"></v-radio>
          <v-radio label="InActive" value="InActive"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col class="col-12 d-flex justify-center">
        <v-btn class="mr-4 modal-btn btnn" @click="clear"> Close </v-btn>
      </v-col>
    </v-row>
  </form>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

import Swal from "sweetalert2";
export default {
  mixins: [validationMixin],
  validations: {
    canteenModel: {
      canteen_name: { required },
      food_supplier_id: { required },
      canteen_admin_id: { required },
      canteen_location: { required },
      canteen_status: { required },
    },
  },
  props: ["isEdit"],
  data: () => ({
    canteenModel: {
      canteen_name: "",
      canteen_admin_id: "",
      food_supplier_id: "",
      canteen_location: "",
      canteen_status: "Active",
      canteen_company_ids: [],
    },
  }),

  computed: {
    ...mapGetters([
      "getcanteenById",
      "getfoodSupplierList",
      "getcanteenAdminList",
      "getmachinefillerList",
    ]),
  },

  methods: {
    fetchData() {},
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.canteenModel._id == null) {
          this.$store.dispatch("addcanteen", this.canteenModel).then((res) => {
            if (res.success) {
              Swal.fire({
                text:
                  "2 Machines have been added associated with the Canteen: " +
                  res.canteen.canteen_name,
                showCancelButton: true,
                confirmButtonText: "Show Machine",
              }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  await this.$store.dispatch("getcanteenById", res.canteen);
                  this.$router.push({
                    name: "machineList",
                  });
                }
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: res.message,
                icon: "error",
              });
            }
          });
        } else {
          this.$store
            .dispatch("updateCanteen", this.canteenModel)
            .then((res) => {
              Swal.fire({
                title: "",
                text: res.data.message,
                icon: "success",
              });
              // if (res.success) {

              // } else {
              //   Swal.fire({
              //     title: "Error!",
              //     text: res.message,
              //     icon: "error",
              //   });
              // }
            });
        }
        this.$emit("closeIt");
      }
    },
    clear() {
      this.$emit("closeIt");
    },
  },
  watch: {},
  mounted() {
    if (this.getcanteenById) {
      this.canteenModel = this.getcanteenById;
    }
    var companyArr = [];
    if (this.canteenModel.canteen_company_ids) {
      this.canteenModel.canteen_company_ids.forEach((x) => {
        companyArr.push(x.user_name);
      });
      this.canteen_company_ids = companyArr.join(", ");
    }
  },
  destroyed() {
    this.$store.dispatch("resetcanteenState");
  },
};
</script>
