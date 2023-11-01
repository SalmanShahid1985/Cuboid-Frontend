<template>
  <v-row>
   
     <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Select Canteen <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <select
          v-model="vendLimitModel.canteen_id"
          class="form-control login-field"
        >
          <option v-for="(d, i) in getcanteenList" :key="i" :value="d._id">
            {{ d.canteen_name }}
          </option>
        </select>
      </div>
      </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Product Vend Limit <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="vendLimitModel.product_vend_limit"
          class="form-control login-field"
          placeholder="Value" type="number"
        />
      </div>
       
     </v-col>
    
    <v-col class="col-12 d-flex justify-center">
      <v-btn class="mr-4 modal-btn btnn" @click="clear"> Close </v-btn>
      <v-btn class="modal-btn" dark color="main_bg_color" @click="submit">
        {{vendLimitModel._id ? 'Update':'Submit'}}
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
    // vendLimitModel: {
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
    vendLimitModel: {
      canteen_id:'', product_vend_limit:null
    },
  }),
  computed: {
    ...mapGetters([ 
      "getcanteenList",
      "getvendLimitById",
    ]),
    
  
  },

  methods: {
   
    async submit() {
      this.$v.$touch();
         
        if (this.vendLimitModel._id == null) {
   
          await this.$store
            .dispatch("addvendLimit", this.vendLimitModel)
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
            .dispatch("updatesubsidy", this.vendLimitModel)
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
    },
    clear() {
      this.$v.$reset();
      (this.vendLimitModel = {
        quantity: "",
      }),
        this.$emit("closeIt");
    },
  },
  mounted() {  
    if (this.getsubsidyById) {
      this.vendLimitModel = this.getsubsidyById;  
      this.vendLimitModel.canteen_id = this.getsubsidyById.canteen_id._id;  
    }
  },
  destroyed() { 
  },
};
</script>
