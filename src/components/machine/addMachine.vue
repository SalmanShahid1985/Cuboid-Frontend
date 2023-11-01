<template>
  <div>
    <v-row>
      <v-col class="col-6">
        <label class="regularFont login-font" style=""
          >Select Canteen <small style="color: red">*</small></label
        >
        <div class="right-inner-addon input-container pb-0">
          <i
            ><img src="../../assets/logos/bxs-down-arrow.svg" height="7px"
          /></i>
          <select
            v-model="machineModel.canteen_id"
            class="form-control login-field"
          >
            <option v-for="(d, i) in getcanteenList" :key="i" :value="d._id">
              {{ d.canteen_name }}
            </option>
          </select>
        </div>
        <div class="invalid-feedback" v-if="$v.machineModel.canteen_id.$error">
          <span v-if="$v.machineModel.canteen_id.$error"
            >Canteen is required</span
          >
        </div>
        <!-- <v-select
            v-model="machineModel.canteen_id"
            label="Canteen"
            required
            color="blue darken-3"
            ><template v-slot:label>
              <div>Canteen <small style="color: red">*</small></div>
            </template></v-select
          > -->
      </v-col>
      <v-col class="col-6">
        <label class="regularFont login-font" style=""
          >Machine Name <small style="color: red">*</small></label
        >
        <div class="right-inner-addon input-container pb-0">
          <input
            v-model="machineModel.machine_name"
            type="text"
            class="form-control login-field"
          />
        </div>
        <div
          class="invalid-feedback"
          v-if="$v.machineModel.machine_name.$error"
        >
          <span v-if="$v.machineModel.machine_name.$error"
            >Name is required</span
          >
        </div>
        <!-- <v-text-field
            v-model="machineModel.machine_name"
            :error-messages="machine_nameErrors"
            label="Name"
            required
            color="blue darken-3"
            @input="$v.machineModel.machine_name.$touch()"
            @blur="$v.machineModel.machine_name.$touch()"
          >
            <template v-slot:label>
              <div>Machine Name <small style="color: red">*</small></div>
            </template>
          </v-text-field> -->
      </v-col>
      <v-col class="col-6">
        <label class="regularFont login-font" style="">Location </label>
        <div class="right-inner-addon input-container pb-0">
          <input
            v-model="machineModel.machine_location"
            label="Row"
            type="text"
            class="form-control login-field"
          />
        </div>
        <div
          class="invalid-feedback"
          v-if="$v.machineModel.machine_location.$error"
        >
          <span v-if="$v.machineModel.machine_location.$error"
            >Code is required</span
          >
        </div>
      </v-col>
      <!-- <v-col class="col-6">
          <v-select
            :items="PaymentMothodList"
            v-model="machineModel.payment_method"
            label="Payment Method"
            color="blue darken-3"
          ></v-select>
        </v-col> -->
      <v-col class="col-6">
        <strong>Status</strong>
        <v-radio-group v-model="machineModel.machine_status" row>
          <v-radio label="Active" value="Active"></v-radio>
          <v-radio label="InActive" value="InActive"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col class="col-12 d-flex justify-center">
        <v-btn class="mr-4 modal-btn btnn" @click="clear"> Close </v-btn>

        <v-btn class="modal-btn" dark color="main_bg_color" @click="submit">
          Submit
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

import Swal from "sweetalert2";
export default {
  mixins: [validationMixin],
  validations: {
    machineModel: {
      machine_name: { required },
      canteen_id: { required },
      machine_location: { required },
      // voltage: { required },
      // temperature: { required },
      machine_status: { required },
    },
  },
  data: () => ({
    modalShow: false,
    Column: 7,
    isdisable: false,
    Row: 5,
    chanelModel: null,
    machineModel: {
      machine_name: "",
      canteen_id: "",
      Column: 7,
      Row: 5,
      machine_location: "",
      payment_method: ["VIPPS", "STRIPE"],
      // voltage: "",
      // temperature: "",
      machine_status: "Active",
    },
    PaymentMothodList: ["Both", "Vipps", "Debit/Credit"],
  }),
  computed: {
    ...mapGetters(["getcanteenList", "getproductList", "getChannelsOfMachine"]),

    machine_nameErrors() {
      const errors = [];
      if (!this.$v.machineModel.machine_name.$dirty) return errors;
      !this.$v.machineModel.machine_name.required &&
        errors.push("Name is required.");
      return errors;
    },
    canteenErrors() {
      const errors = [];
      if (!this.$v.machineModel.canteen_id.$dirty) return errors;
      !this.$v.machineModel.canteen_id.required &&
        errors.push("canteen is required.");
      return errors;
    },
    machine_locationErrors() {
      const errors = [];
      if (!this.$v.machineModel.machine_location.$dirty) return errors;
      !this.$v.machineModel.machine_location.required &&
        errors.push("Machine_location is required.");
      return errors;
    },
    voltageErrors() {
      const errors = [];
      if (!this.$v.machineModel.voltage.$dirty) return errors;
      !this.$v.machineModel.voltage.required &&
        errors.push("Voltage is required.");
      return errors;
    },
    temperatureErrors() {
      const errors = [];
      if (!this.$v.machineModel.temperature.$dirty) return errors;
      !this.$v.machineModel.temperature.required &&
        errors.push("Temperature is required.");
      return errors;
    },
  },
  watch: {
    Row: {
      handler: function () {
        // this.createTable();
      },
    },
    Column: {
      handler: function () {
        // this.createTable();
      },
    },
  },
  methods: {
    fetchData() {
      this.items = this.getcanteenList;
    },
    async submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.machineModel.rows = parseInt(this.Row);
        this.machineModel.columns = parseInt(this.Column);
        if (this.machineModel._id == null) {
          await this.$store
            .dispatch("addmachine", this.machineModel)
            .then((res) => {
              if (res.success) {
                Swal.fire({
                  title: "",
                  text: res.message,
                  icon: "success",
                });
                this.$emit("closeIt");
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
            .dispatch("updatemachine", this.machineModel)
            .then((res) => {
              if (res.success) {
                Swal.fire({
                  title: "",
                  text: res.message,
                  icon: "success",
                });
                this.$emit("closeIt");
              } else {
                Swal.fire({
                  title: "Error!",
                  text: res.message,
                  icon: "error",
                });
              }
            });
        }
      }
    },
    clear() {
      this.$v.$reset();
      (this.machineModel = {
        machine_name: "",
      }),
        this.$emit("closeIt");
    },
  },
  mounted() {
    this.fetchData();
    this.isdisable = false;
    if (this.getChannelsOfMachine) {
      this.isdisable = true;
      this.machineModel = this.getChannelsOfMachine;
    }
    if(this.getChannelsOfMachine && this.getChannelsOfMachine.canteen_id){
      let canteenId = this.getcanteenList[0]._id;
      this.getcanteenList.forEach((canteen) => {
        if(canteen._id == this.getChannelsOfMachine.canteen_id._id) {
          canteenId = canteen._id;
        }
      });
      this.machineModel.canteen_id = canteenId;
    } else {
      this.machineModel.canteen_id = this.getcanteenList[0]._id;
    }
  },
  destroyed() {
    this.$store.dispatch("resetmachineState");
  },
};
</script>
<style scoped>
.channalDiv {
  border-style: solid;
  border-color: #f8932d;
}
#myTable {
  padding-left: 30%;
}
.right-inner-addon i {
  position: absolute;
  right: 0px;
  padding: 8px 12px;
  pointer-events: none;
}
</style>
