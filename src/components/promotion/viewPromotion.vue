<template> 
    <v-row>
      <v-col class="col-6">
         <label class="regularFont login-font" style="">Full Name  <small style="color: red">*</small></label> 
          <div class="right-inner-addon input-container pb-0">
            <input
              v-model="promotionModel.promo_name"
              :error-messages="promo_nameErrors"
              :counter="10"
              disabled
              type="text"
              class="form-control login-field"
              placeholder="name"
            />
          </div>
        <!-- <v-text-field
          v-model="promotionModel.promo_name"
          :error-messages="promo_nameErrors"
          label="Name"
          required
          color="blue darken-3"
          @input="$v.promotionModel.promo_name.$touch()"
          @blur="$v.promotionModel.promo_name.$touch()"
        >
          <template v-slot:label>
            <div>Name <small style="color: red">*</small></div>
          </template>
        </v-text-field> -->
      </v-col>
      <v-col class="col-6">
         <label class="regularFont login-font" style="">Promo Code  <small style="color: red">*</small></label>
          <div class="right-inner-addon input-container pb-0">
            <input
               v-model="promotionModel.promo_code"
          :error-messages="promo_codeErrors" 
              type="text" disabled
              class="form-control login-field"
              placeholder="Promo Code"
            />
          </div>
        <!-- <v-text-field
          v-model="promotionModel.promo_code"
          :error-messages="promo_codeErrors"
          label="Promo Code"
          required
          color="blue darken-3"
          @input="$v.promotionModel.promo_code.$touch()"
          @blur="$v.promotionModel.promo_code.$touch()"
        >
          <template v-slot:label>
            <div>Promo Code <small style="color: red">*</small></div>
          </template>
        </v-text-field> -->
      </v-col>
      <v-col class="col-6">
         <label class="regularFont login-font" style="">Description <small style="color: red">*</small></label>
          <div class="right-inner-addon input-container pb-0">
            <input
                v-model="promotionModel.promo_description"
          disabled
              type="text"
              class="form-control login-field"
              placeholder="Description"
            />
          </div>
        <!-- <v-text-field
          v-model="promotionModel.promo_description"
          label="Description"
          color="blue darken-3"
        ></v-text-field> -->
      </v-col>
      <v-col class="col-6">
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y disabled
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="promotionModel.promo_start_date"
              label="Start Date"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs" disabled
              v-on="on"
            >
              <template v-slot:label>
                <div class="regularFont login-font">Start Date <small style="color: red">*</small></div>
              </template>
            </v-text-field>
          </template>
          <v-date-picker
            @input="menu = false"
            :min="nowDate" disabled
            v-model="promotionModel.promo_start_date"
            no-title
            scrollable
          >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col class="col-6">
        <v-menu
          ref="menu1" disabled
          v-model="menu1"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="promotionModel.promo_end_date"
              label="End Date"
              prepend-icon="mdi-calendar"
              readonly disabled
              v-bind="attrs"
              v-on="on"
              ><template v-slot:label>
                <div class="regularFont login-font">End Date <small style="color: red">*</small></div>
              </template></v-text-field
            >
          </template>
          <v-date-picker
            @input="menu1 = false"
            v-model="promotionModel.promo_end_date"
            no-title
            scrollable disabled
            :min="nowDate"
          >
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col class="col-3">
       <label class="regularFont login-font" style=""
        >Promo Type <small style="color: red">*</small></label
      >
        <v-radio-group disabled v-model="promotionModel.promo_type" row>
          <v-radio label="Percentage" value="Percentage"></v-radio>
          <v-radio label="Flat" value="Flat"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col class="col-3">
         <label class="regularFont login-font" style="">Value <small style="color: red">*</small></label>
          <div class="right-inner-addon input-container pb-0">
            <input disabled
            v-model="promotionModel.promo_value"
              :error-messages="promo_valueErrors"
               type="text"
              class="form-control login-field"
              placeholder="Value"
            />
          </div>
        <!-- <v-text-field
          v-model="promotionModel.promo_value"
          :error-messages="promo_valueErrors"
          label="Value"
          required
          color="blue darken-3"
          @input="$v.promotionModel.promo_value.$touch()"
          @blur="$v.promotionModel.promo_value.$touch()"
          ><template v-slot:label>
            <div>Value <small style="color: red">*</small></div>
          </template></v-text-field
        > -->
      </v-col>
      <!-- <v-col class="col-6">
       
        <label class="regularFont login-font" style="">Select Product <small style="color: red">*</small></label>
          <div class="right-inner-addon input-container pb-0">
            <select disabled v-model="promotionModel.promo_productid" class="form-control login-field">
                <option v-for="(d,i) in getproductList" :key="i" :value="d._id">{{d.product_name}}</option> 
            </select>
          </div>
      </v-col> -->
      <v-col class="col-6">
        <label class="regularFont login-font" style=""
        >Status <small style="color: red">*</small></label
      >
        <v-radio-group  disabled v-model="promotionModel.promo_status" row>
          <v-radio label="Active" value="Active"></v-radio>
          <v-radio label="InActive" value="InActive"></v-radio>
        </v-radio-group>
      </v-col> 
     <v-col class="col-12 d-flex justify-center">
      <v-btn class="mr-4 modal-btn btnn" @click="clear"> Close </v-btn>
      <!-- <v-btn class="modal-btn" dark color="main_bg_color" @click="submit">
        Submit
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
  validations: {
    promotionModel: {
      promo_name: { required },
      promo_code: { required },
      promo_start_date: { required },
      promo_end_date: { required },
      promo_type: { required },
      promo_value: { required },
    },
  },
  data: () => ({
    menu: false,
    nowDate: new Date().toISOString().slice(0, 10),
    menu1: false,
    promotionModel: {
      promo_name: "",
      promo_code: "",
      promo_description: "",
      promo_start_date: "",
      promo_end_date: "",
      promo_type: "Percentage",
      promo_value: "",
      promo_productid: "",
      promo_status: "Active",
    },
  }),
  computed: {
    ...mapGetters(["getproductList", "getpromotionById"]),

    promo_nameErrors() {
      const errors = [];
      if (!this.$v.promotionModel.promo_name.$dirty) return errors;
      !this.$v.promotionModel.promo_name.required &&
        errors.push("Name is required.");
      return errors;
    },
    promo_codeErrors() {
      const errors = [];
      if (!this.$v.promotionModel.promo_code.$dirty) return errors;
      !this.$v.promotionModel.promo_code.required &&
        errors.push("Promo code is required.");
      return errors;
    },
    promo_valueErrors() {
      const errors = [];
      if (!this.$v.promotionModel.promo_value.$dirty) return errors;
      !this.$v.promotionModel.promo_value.required &&
        errors.push("Promo value is required.");
      return errors;
    },
  },

  methods: {
    fetchData() {
      this.items = this.getproductList;
    },  dateConvert(obj) {
      var date = new Date(obj);
      return (
        date.getFullYear() + "-" + date.getMonth() + 1 + "-" + date.getDate()
      );
    },
    async submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.promotionModel._id == null) {
          await this.$store
            .dispatch("addpromotion", this.promotionModel)
            .then((res) => {
              
              if (res.success) {
                
                this.$emit("closeIt");
              } else if (res.errors) {
                
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
            .dispatch("updatepromotion", this.promotionModel)
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
      (this.promotionModel = {
        quantity: "",
      }),
        this.$emit("closeIt");
    },
     dateConvert(obj) {
      var date = new Date(obj);
      var mS = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];

      return (
        date.getDate() + "-" + mS[date.getMonth()] + "-" + date.getFullYear()
      );
    },
  },
  mounted() {
 
    this.fetchData();
    if (this.getpromotionById) {
      this.promotionModel = this.getpromotionById;
      this.promotionModel.promo_start_date = this.dateConvert(
        this.promotionModel.promo_start_date
      );
      this.promotionModel.promo_end_date = this.dateConvert(
        this.promotionModel.promo_end_date
      );
    }
  },
  destroyed() {
    //
    this.$store.dispatch("resetpromotionState");
  },
};
</script>
