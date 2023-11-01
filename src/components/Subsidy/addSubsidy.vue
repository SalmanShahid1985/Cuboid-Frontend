<template>
  <v-row>
    <v-col v-if="!isEdit" class="col-6">
      <label class="regularFont login-font" style=""
        >Select Company<small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <select
          :disabled="isEdit"
          v-model="subsidyModel.company_id"
          class="form-control login-field"
        >
          <option v-for="(d, i) in getCompanyList" :key="i" :value="d._id">
            {{ d.user_name }}
          </option>
        </select>
      </div>
    </v-col>
    <v-col v-else class="col-6">
      <label class="regularFont login-font" style=""
        >Company <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          class="form-control login-field"
          disabled
          :placeholder="subsidyModel.edit_company_name"
        />
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Select Canteen <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <v-select
          :items="getcanteenList"
          item-value="_id"
          item-text="canteen_name"
          v-model="subsidyModel.canteen_id"
          outlined
          multiple
          color="blue darken-3"
        ></v-select>
        <!-- <select
          v-model="subsidyModel.canteen_id"
          class="form-control login-field"
        >
          <option v-for="(d, i) in getcanteenList" :key="i" :value="d._id">
            {{ d.canteen_name }}
          </option>
        </select> -->
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Type <small style="color: red">*</small></label
      >
      <v-radio-group v-model="subsidyModel.subsidy_type" row>
        <v-radio label="Credit Points" value="credit_base"></v-radio>
        <v-radio label="Subsidy" value="subsidy"></v-radio>
      </v-radio-group>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont d-flex login-font" style="gap: 2px"
        >Subsidy <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="subsidyModel.subsidy"
          class="form-control login-field"
          :placeholder="
            subsidyModel.subsidy_type == 'subsidy' ? 'Value %' : 'Value'
          "
          type="number"
          :max="subsidyModel.subsidy_type == 'subsidy' ? 100 : ''"
          min="0"
        />
        <small
          v-if="
            subsidyModel.subsidy_type == 'subsidy' && subsidyModel.subsidy > 100
          "
          style="color: red"
          >Please enter a value between 1 and 100</small
        >
      </div>
    </v-col>
    <v-col class="col-6">
      <v-menu
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="subsidyModel.start_date"
            label="Start Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          >
            <template v-slot:label>
              <div class="regularFont login-font">
                Start Date <small style="color: red">*</small>
              </div>
            </template>
          </v-text-field>
        </template>
        <v-date-picker
          @input="menu = false"
          :min="nowDate"
          v-model="subsidyModel.start_date"
          no-title
          scrollable
        >
        </v-date-picker>
      </v-menu>
    </v-col>
    <v-col v-if="subsidyModel.subsidy_type == 'subsidy'" class="col-6">
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
            v-model="subsidyModel.end_date"
            label="End Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            ><template v-slot:label>
              <div class="regularFont login-font">
                End Date <small style="color: red">*</small>
              </div>
            </template></v-text-field
          >
        </template>
        <v-date-picker
          @input="menu1 = false"
          v-model="subsidyModel.end_date"
          no-title
          scrollable
          :min="nowDate"
        >
        </v-date-picker>
      </v-menu>
    </v-col>

    <v-col v-if="subsidyModel.subsidy_type == 'credit_base'" class="col-6">
      <label class="regularFont login-font" style=""
        >Renew Period (In Days)<small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="subsidyModel.renew_period"
          class="form-control login-field"
          type="number"
          placeholder="Value"
        />
      </div>
    </v-col>

    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Status <small style="color: red">*</small></label
      >

      <v-radio-group v-model="subsidyModel.status" row>
        <v-radio label="Active" value="Active"></v-radio>
        <v-radio label="InActive" value="InActive"></v-radio>
      </v-radio-group>
    </v-col>

    <v-col class="col-12 d-flex justify-center">
      <v-btn class="mr-4 modal-btn btnn" @click="clear"> Close </v-btn>
      <v-btn class="modal-btn" dark color="main_bg_color" @click="submit">
      {{isEdit ? 'Update' : 'Submit'}}
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
    // subsidyModel: {
    //   discount_name: { required },
    //   discount_start_date: { required },
    //   discount_end_date: { required },
    //   discount_type: { required },
    //   discount_value: { required },
    // },
  },
  data: () => ({
    menu: false,
    menu1: false,
    nowDate: new Date().toISOString().slice(0, 10),
    discount_product_id: "",
    subsidyModel: {
      canteen_id: "",
      status: "Active",
      subsidy: null,
      subsidy_type: "",
      start_date: "",
      end_date: "",
      company_id: "",
    },
  }),
  computed: {
    ...mapGetters([
      "getproductList",
      "getmachineList",
      "getcanteenList",
      "getCompanyList",
      "getsubsidyById",
    ]),

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
  props: ["isEdit"],
  methods: {
    fixDateFormat() {
      var a = new Date(this.subsidyModel.end_date);
      var month = a.getMonth() + 1;
      var date = a.getDate();
      var year = a.getFullYear();
      this.subsidyModel.end_date = [year, month, date].join("-");
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
      if (
        this.subsidyModel.subsidy_type != "subsidy" ||
        this.subsidyModel.subsidy <= 100
      ) {
        if (this.subsidyModel._id == null) {
          if (this.subsidyModel.subsidy_type == "credit_base") {
            this.subsidyModel.end_date = new Date();
          }

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
          this.$store
            .dispatch("updatesubsidy", this.subsidyModel)
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
          // }
        }
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
      this.subsidyModel = { ...this.getsubsidyById };
      this.subsidyModel.company_id = this.getsubsidyById.company_id._id;
      this.subsidyModel.edit_company_name = this.getsubsidyById.company_id.user_name
      this.subsidyModel.canteen_id = this.getsubsidyById.canteen_id.map(
        (x) => x._id
      );
      this.fixDateFormat();
    }
    this.subsidyModel.start_date = new Date(this.subsidyModel.start_date)
      .toISOString()
      .split("T")[0];
  },
  destroyed() {
    this.$store.dispatch("getdiscountById", null);
  },
};
</script>
<style>
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
