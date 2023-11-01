<template>
  <v-row>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Machine Filler <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <i><img src="../../assets/logos/bxs-down-arrow.svg" height="7px" /></i>
        <select
          v-model="canteenModel.machine_filler_id"
          class="form-control login-field"
        >
          <option
            v-for="(d, i) in getmachinefillerList"
            :key="i"
            :value="d._id"
          >
            {{ d.user_name }}
          </option>
        </select>
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Canteen Admin <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <i><img src="../../assets/logos/bxs-down-arrow.svg" height="7px" /></i>
        <select
          v-model="canteenModel.canteen_admin_id"
          class="form-control login-field"
        >
          <option v-for="(d, i) in getcanteenAdminList" :key="i" :value="d._id">
            {{ d.user_name }}
          </option>
        </select>
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Name <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="canteenModel.canteen_name"
          type="text"
          class="form-control login-field"
        />
      </div>
      <div class="invalid-feedback" v-if="$v.canteenModel.canteen_name.$error">
        <span v-if="$v.canteenModel.canteen_name.$error">Name is required</span>
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Location <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="canteenModel.canteen_location"
          type="text"
          class="form-control login-field"
        />
      </div>
      <div
        class="invalid-feedback"
        v-if="$v.canteenModel.canteen_location.$error"
      >
        <span v-if="$v.canteenModel.canteen_location.$error"
          >Location is required</span
        >
      </div>
    </v-col>
 <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Companies <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <v-select
          v-model="canteenModel.canteen_company_ids"
          item-value="_id"
          item-text="user_name"
          outlined
          multiple
          color="blue darken-3"
          :items="getCompanyList"
        >
        </v-select>
      </div>
      <div
        class="invalid-feedback"
        v-if="$v.canteenModel.canteen_company_ids.$error"
      >
        <span v-if="$v.canteenModel.canteen_company_ids.$error"
          >Company is required</span
        >
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Payment Method</label
      >
      <div class="right-inner-addon input-container pb-0">
        <i><img src="../../assets/logos/bxs-down-arrow.svg" height="7px" /></i>
        <select
        v-model="canteenModel.payment_method"
          class="form-control login-field"
        >
          <option
            v-for="(d, i) in PaymentMothodList"
            :key="i"
            :value="d"
          >
            {{ d }}
          </option>
        </select>
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Allow Guest Use</label
      >
      <div class="right-inner-addon input-container pb-0">
        <i><img src="../../assets/logos/bxs-down-arrow.svg" height="7px" /></i>
        <select
        v-model="canteenModel.guest_use"
          class="form-control login-field"
        >
          <option value="Yes">
            Yes
          </option>
          <option value="No">
            No
          </option>
        </select>
      </div>
    </v-col>
    <!-- <v-col class="col-6">
      <v-select
        :items="PaymentMothodList"
        v-model="canteenModel.payment_method"
        label="Payment Method"
        color="blue darken-3"
      ></v-select> -->
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Status <small style="color: red">*</small></label
      >

      <v-radio-group v-model="canteenModel.canteen_status" row>
        <v-radio label="Active" value="Active"></v-radio>
        <v-radio label="InActive" value="InActive"></v-radio>
      </v-radio-group>
    </v-col>
    <v-col class="col-12 d-flex justify-center">
      <v-btn class="mr-4 modal-btn btnn" @click="clear"> Close </v-btn>

      <v-btn class="modal-btn" dark color="main_bg_color" @click="submit">
        {{ canteenModel._id ? "Update" : "Submit" }}
      </v-btn>
    </v-col>
  </v-row>
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
      canteen_location: { required },
      canteen_company_ids: {required},
      guest_use: { required },
    },
  },
  props: ["isEdit"],
  data: () => ({
       PaymentMothodList: ["Vipps and Stripe", "Vipps", "Stripe","Subsidy Only"],
    canteenModel: {
      canteen_name: "",
      canteen_admin_id: "",
      machine_filler_id: "",
      payment_method:"Vipps and Stripe",    
      canteen_location: "",
      canteen_status: "Active",
      canteen_company_ids: [],
      guest_use: "Yes",
    },
  }),

  computed: {
    ...mapGetters([
      "getCompanyList",
      "getcanteenById",
      "getfoodSupplierList",
      "getmachinefillerList",
      "getcanteenAdminList",
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
                  `${res.canteen.canteen_name} has been added. Now you can now add a new machine and link them with this canteen.`,
                showCancelButton: true,
                confirmButtonText: "Add New Machine",
              }).then(async (result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                  await this.$store.dispatch("getcanteenById", res.canteen);
                  this.$router.push({
                    name: "machineList",
                    query: {
                      'action': 'addNewMachine'
                    }
                    
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
            });
        }
        this.$emit("closeIt");
      }
    },
    clear() {
      this.$v.$reset();
      (this.canteenModel = {
        canteen_name: "",
        canteen_location: "",
      }),
        this.$emit("closeIt");
    },
  },
  watch: {},
  mounted() {
    if (this.isEdit && this.getcanteenById) {

      this.canteenModel = this.getcanteenById;
              if(this.canteenModel.canteen_company_ids)
{
  var canteenIds = [];
  this.canteenModel.canteen_company_ids.forEach(x => {
    canteenIds.push(x._id)
  })
  this.canteenModel.canteen_company_ids = canteenIds
}

      this.canteenModel.machine_filler_id =
        this.getcanteenById.machine_filler_id._id;
      this.canteenModel.canteen_admin_id =
        this.getcanteenById.canteen_admin_id._id;
        
    }
  },
  destroyed() {
    this.clear()
    this.$store.dispatch("resetcanteenState");
  },
};
</script>
<style>
.right-inner-addon i {
  position: absolute;
  right: 0px;
  padding: 8px 12px;
  pointer-events: none;
}
.v-text-field--full-width .v-input__prepend-outer,
.v-text-field--full-width .v-input__prepend-inner,
.v-text-field--full-width .v-input__append-inner,
.v-text-field--full-width .v-input__append-outer,
.v-text-field--enclosed .v-input__prepend-outer,
.v-text-field--enclosed .v-input__prepend-inner,
.v-text-field--enclosed .v-input__append-inner,
.v-text-field--enclosed .v-input__append-outer {
  margin-top: 8px !important;
}
.v-text-field--outlined fieldset {
  margin-bottom: 17.9px !important;
  margin-top: 6px !important;
  border: 1px solid #d3d0d0 !important;
}
.v-select__selections {
  margin-top: -18px !important;
}
</style>
