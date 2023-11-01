<template>
  <v-row>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Company <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          class="form-control login-field"
          disabled
          :placeholder="subsidyModel.company_id.user_name"
        />
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Canteen <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          class="form-control login-field"
          disabled
          :placeholder="canteenList"
        />
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Type <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          class="form-control login-field"
          disabled
          :placeholder="subsidyModel.subsidy_type"
        />
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Subsidy <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="subsidyModel.subsidy"
          class="form-control login-field"
          disabled
          placeholder="Value"
        />
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Start Date <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="subsidyModel.start_date"
          class="form-control login-field"
          disabled
          placeholder="Value"
        />
      </div>
    </v-col>
    <v-col class="col-6" v-show="subsidyModel.subsidy_type == 'subsidy'">
      <label class="regularFont login-font" style=""
        >End Date <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="subsidyModel.end_date"
          class="form-control login-field"
          disabled
          placeholder="Value"
        />
      </div>
    </v-col>
    <v-col v-show="subsidyModel.subsidy_type == 'credit_base'" class="col-6">
      <label class="regularFont login-font" style=""
        >Renew Period (In Days) <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="subsidyModel.renew_period"
          class="form-control login-field"
          disabled
          placeholder="Value"
        />
      </div>
    </v-col>

    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Status <small style="color: red">*</small></label
      >

      <v-radio-group disabled v-model="subsidyModel.status" row>
        <v-radio label="Active" value="Active"></v-radio>
        <v-radio label="InActive" value="InActive"></v-radio>
      </v-radio-group>
    </v-col>

    <v-col class="col-12 d-flex justify-center">
      <v-btn class="mr-4 modal-btn btnn" @click="clear"> Close </v-btn>
      <!-- <v-btn class="modal-btn" dark color="main_bg_color" @click="submit">
        {{subsidyModel._id ? 'Update':'Submit'}}
      </v-btn> -->
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
  validations: {},
  data: () => ({
    menu: false,
    menu1: false,
    nowDate: new Date().toISOString().slice(0, 10),
    discount_product_id: "",
    subsidyModel: {
      canteen_id: "",
      status: "Active",
      subsidy: null,
    },
  }),
  computed: {
    ...mapGetters([
      "getproductList",
      "getmachineList",
      "getcanteenList",
      "getsubsidyById",
    ]),
    canteenList() {
      if (this.subsidyModel && this.subsidyModel.canteen_id) {
        var x = this.subsidyModel.canteen_id.map(function(x) {
          return x.canteen_name
        });
        return x.toString();
      } else {
        return 0;
      }
    },
    discount_nameErrors() {
      const errors = [];
      if (!this.$v.subsidyModel.discount_name.$dirty) return errors;
      !this.$v.subsidyModel.discount_name.required &&
        errors.push("Name is required.");
      return errors;
    },

    discount_valueErrors() {
      const errors = [];
      if (!this.$v.subsidyModel.discount_value.$dirty) return errors;
      !this.$v.subsidyModel.discount_value.required &&
        errors.push("Discount value is required.");
      return errors;
    },
  },

  methods: {
    fixDateFormat(){
       var end = new Date(this.subsidyModel.end_date)
       var start = new Date(this.subsidyModel.start_date)
      var month = end.getMonth() + 1
      var date = end.getDate()
      var year = end.getFullYear()
      var monthStart = start.getMonth() + 1
      var dateStart = start.getDate()
      var yearStart = start.getFullYear()
      this.subsidyModel.end_date =  ([year,month, date].join('-'))
      this.subsidyModel.start_date =  ([yearStart,monthStart, dateStart].join('-'))
    },
    fetchData() {
      this.items = this.getproductList;
    },
    dateConvert(obj) {
      var date = new Date(obj);
      return (
        date.getFullYear() + "-" + date.getMonth() + 1 + "-" + date.getDate()
      );
    },
    async submit() {
      this.$v.$touch();
      // if (!this.$v.$invalid) {

      if (this.subsidyModel._id == null) {
        await this.$store
          .dispatch("addsubsidy", this.subsidyModel)
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
        this.$store.dispatch("updatesubsidy", this.subsidyModel).then((res) => {
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
        // }
      }
    },
    clear() {
      this.$v.$reset();
      (this.subsidyModel = {
        quantity: "",
      }),
        this.$emit("closeIt");
    },
  },
  mounted() {
    this.fetchData();
    if (this.getsubsidyById) {
      this.subsidyModel = {...this.getsubsidyById};
      this.fixDateFormat()
    }
  },
  destroyed() {
    this.$store.dispatch("getdiscountById", null);
  },
};
</script>
