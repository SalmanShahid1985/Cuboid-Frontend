<template>
  <v-row>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Name <small style="color: red">*</small></label
      > 
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="discountModel.discount_name"
          disabled
          type="text"
          class="form-control login-field"
        />
      </div>
       </v-col>

    <v-col class="col-6">
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        disabled
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="discountModel.discount_start_date"
            label="Start Date"
            prepend-icon="mdi-calendar"
            readonly
            disabled
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          @input="menu = false"
          v-model="discountModel.discount_start_date"
          no-title
          :min="nowDate"
          disabled
          scrollable
        >
        </v-date-picker>
      </v-menu>
    </v-col>
    <v-col class="col-6">
      <v-menu
        ref="menu1"
        v-model="menu1"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="discountModel.discount_end_date"
            label="End Date"
            prepend-icon="mdi-calendar"
            readonly
            :min="nowDate"
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          @input="menu1 = false"
          v-model="discountModel.discount_end_date"
          no-title
          :min="nowDate"
          disabled
          scrollable
        >
        </v-date-picker>
      </v-menu>
    </v-col>
    <v-col class="col-3">
      <strong>Discount Type</strong>
      <v-radio-group disabled v-model="discountModel.discount_type" row>
        <v-radio label="Percentage" value="Percentage"></v-radio>
        <v-radio label="Flat" value="Flat"></v-radio>
      </v-radio-group>
    </v-col>
    <v-col class="col-3">
      <label class="regularFont login-font" style=""
        >Value <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
        disabled
          v-model="discountModel.discount_value"
          class="form-control login-field"
          placeholder="Value"
        />
      </div>
      <!-- <v-text-field
          v-model="discountModel.discount_value"
          :error-messages="discount_valueErrors"
          label="Value"
          required
          color="blue darken-3"
          @input="$v.discountModel.discount_value.$touch()"
          @blur="$v.discountModel.discount_value.$touch()"
        >
          <template v-slot:label>
            <div>Value <small style="color: red">*</small></div>
          </template>
        </v-text-field> -->
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Select Product <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <select disabled v-model="discountModel.discount_product_id._id" class="form-control login-field">
          <option v-for="(d, i) in getproductList" :key="i" :value="d._id">
            {{ d.product_name }}
          </option>
        </select>
      </div>
      <!-- <v-select 
          v-model="discount_product_id"
          label="Product"
          color="blue darken-3"
          :clearable="true"
        ></v-select> -->
    </v-col>
     <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Select Canteen <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <select
          v-model="discountModel.discount_canteen_id._id"
          class="form-control login-field"
          disabled
        >
          <option v-for="(d, i) in getcanteenList" :key="i" :value="d._id">
            {{ d.canteen_name }}
          </option>
        </select>
      </div>
     </v-col>
    <v-col class="col-6">
      <strong>Status</strong>

      <v-radio-group disabled v-model="discountModel.discount_status" row>
        <v-radio label="Active" value="Active"></v-radio>
        <v-radio label="InActive" value="InActive"></v-radio>
      </v-radio-group>
    </v-col>

    <v-col class="col-12 d-flex justify-center">
      <v-btn class="mr-4 modal-btn btnn" @click="clear"> Close </v-btn>
    
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
  
  data: () => ({
    menu: false,
    menu1: false,
    nowDate: new Date().toISOString().slice(0, 10),
    discount_product_id: "",
    discountModel: {
      discount_name: "",
      discount_start_date: "",
      discount_end_date: "",
      discount_type: "Percentage",
      discount_value: "",
      discount_product_id: "",
      discount_machine_id: "",
      discount_canteen_id: "",
      discount_status: "Active",
    },
  }),
  computed: {
    ...mapGetters([
      "getproductList",
      "getmachineList",
      "getcanteenList",
      "getdiscountById",
    ]),
    setAuthDateS() {
      return new Date();
    },
    discount_nameErrors() {
      const errors = [];
      if (!this.$v.discountModel.discount_name.$dirty) return errors;
      !this.$v.discountModel.discount_name.required &&
        errors.push("Name is required.");
      return errors;
    },

    discount_valueErrors() {
      const errors = [];
      if (!this.$v.discountModel.discount_value.$dirty) return errors;
      !this.$v.discountModel.discount_value.required &&
        errors.push("Discount value is required.");
      return errors;
    },
  },

  methods: {
    fetchData() {
      this.items = this.getproductList;
    },
    dateConvert(obj) {
      var date = new Date(obj);
      return (
        date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate()
      );
    },
    async submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.discount_product_id) {
          this.discountModel.discount_product_id = this.discount_product_id;
        }
        if (this.discountModel._id == null) {
          this.discountModel.discount_value = parseInt(
            this.discountModel.discount_value
          );
          await this.$store
            .dispatch("adddiscount", this.discountModel)
            .then((res) => {
              if (res.success) {
                Swal.fire({
                  title: "",
                  text: res.message,
                  icon: "success",
                });
                this.$emit("closeIt");
              } else if (res.errors) {
                Swal.fire({
                  title: "",
                  text: res.errors[0].msg,
                  icon: "error",
                });
              } else {
                Swal.fire({
                  title: "",
                  text: res.message,
                  icon: "error",
                });
              }
            });
        } else {
          this.$store
            .dispatch("updatediscount", this.discountModel)
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
        (this.discountModel = {
        quantity: "",
      }),
        this.$emit("closeIt");
    },
  },
  mounted() {
    this.fetchData();
    if (this.getdiscountById) {
      this.discountModel = this.getdiscountById;
      this.discount_product_id = this.discountModel.discount_product_id;
      this.discountModel.discount_start_date = this.dateConvert(
        this.discountModel.discount_start_date
      );
      this.discountModel.discount_end_date = this.dateConvert(
        this.discountModel.discount_end_date
      );
    }
  },
  destroyed() {
    this.$store.dispatch("resetdiscountState");
  },
};
</script>
