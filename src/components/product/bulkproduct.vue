<template>
  <v-row>
    <v-col
      class="col-12 d-flex align-center"
      style="border-bottom: 1px solid #ccc"
    >
      <label class="regularFont login-font" style=""
        >Upload CSV<small style="color: red">*</small></label
      >
      <br />
      <span style="color:red">The image file must meet the following requirements:<br />
        CSV file separated by commas</span>
      <input
        type="file"
        style="margin: 5px auto; display: block"
        id="fileUpload"
      />
      <hr />
    </v-col>

    <v-col class="col-12">
      <div id="dvCSV"></div>
    </v-col>

    <v-col class="col-12 d-flex justify-center">
      <v-btn class="mr-4 modal-btn btnn" @click="clear"> Close </v-btn>
      <v-btn class="modal-btn" dark color="main_bg_color" @click="submit">
        Submit
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

import Swal from "sweetalert2";
export default {
  mixins: [validationMixin],
  validations: {
    // productModel: {
    //   product_catagory_id: { required },
    // },
  },
  data: () => ({
    csvTable: {},
    menu: false,
    image: null,
    productModel: {
      product_catagory_id: "",
    },
    csvFile: "",
  }),
  computed: {
    ...mapGetters(["getcategoryList"]),
    categoryErrors() {
      const errors = [];
      if (!this.$v.productModel.product_catagory_id.$dirty) return errors;
      !this.$v.productModel.product_catagory_id.required &&
        errors.push("category is required.");
      return errors;
    },
  },

  methods: {
    submit() {
      var vm = this;
      var cat_id = this.productModel.product_catagory_id;
      var fileUpload = document.getElementById("fileUpload");
      var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
      if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof FileReader != "undefined") {
          var reader = new FileReader();
          reader.onload = function (e) {
            var rows = e.target.result.split("\n");
            var arrayData = [];
            rows.forEach((e, x) => {
              var dataval = e.split(",");
              if (x >= 1 && e) {
                arrayData.push({
                  product_name: dataval[0].replaceAll("\r", ""),
                  product_price: dataval[1].replaceAll("\r", ""),
                  product_description: dataval[2].replaceAll("\r", ""),
                  product_VAT: dataval[3].replaceAll("\r", ""),
                  product_expiry_date: dataval[4].replaceAll("\r", ""),
                  product_status: dataval[5].replaceAll("\r", ""),
                  product_gradient: dataval[6]
                    .replaceAll("\r", "")
                    .replaceAll("-", ","),
                  product_image: dataval[7].replaceAll("\r", ""),
                  category_name: dataval[8].replaceAll("\r", ""),
                  dispensing_speed: dataval[9].replaceAll("\r", ""),
                  product_recipes: dataval[10].replaceAll("\r", ""),
                  product_allergies: dataval[11]
                    .replaceAll("\r", "")
                    .split("-"),
                  product_number: dataval[12].replaceAll("\r", ""),
                  product_max_limit: dataval[13].replaceAll("\r", ""),
                  extraction_time: dataval[14].replaceAll("\r", ""),
                });
              }
            });
            vm.sendData(cat_id, arrayData);
          };
          reader.readAsText(fileUpload.files[0]);
        } else {
          alert("This browser does not support HTML5.");
        }
      } else {
        Swal.fire({
          title: "Please upload a valid CSV file.",
          icon: "error",
        });
      }
    },
    async sendData(cat_id, data) {
      await this.$store.dispatch("bulkproduct", { data: data }).then((res) => {
        this.$emit("closeIt");
        if (res.success) {
          Swal.fire({
            title: "Error!",
            text: res.message,
            icon: "error",
          });
        } else {
          Swal.fire({
            title: "Success",
            text: res.message,
            icon: "success",
          });
        }
      });
    },
    // async submit() {
    //   this.$v.$touch();

    //   if (!this.$v.$invalid) {
    //     if (this.productModel._id == null) {
    //       await this.$store
    //         .dispatch("addproduct", this.productModel)
    //         .then((res) => {
    //           this.$emit("closeIt");
    //           if (res.success) {
    //             Swal.fire({
    //               title: "",
    //               text: res.message,
    //               icon: "success",
    //             });
    //           } else {
    //             Swal.fire({
    //               title: "Error!",
    //               text: res.message,
    //               icon: "error",
    //             });
    //           }
    //         });
    //     } else {
    //       await this.$store
    //         .dispatch("updateproduct", this.productModel)
    //         .then((res) => {
    //           this.$emit("closeIt");
    //           if (res.success) {
    //             Swal.fire({
    //               title: "",
    //               text: res.message,
    //               icon: "success",
    //             });
    //           } else {
    //             Swal.fire({
    //               title: "Error!",
    //               text: res.message,
    //               icon: "error",
    //             });
    //           }
    //         });
    //     }
    //   }
    // },
    clear() {
      this.$v.$reset();
      this.$emit("closeIt");
    },
  },
  mounted() {
    if (this.getproductById) {
      this.productModel = this.getproductById;
      this.productModel.product_catagory_id =
        this.productModel.product_catagory_id._id;
      this.productModel.ingradients =
        this.productModel.product_gradient.toString();
    }
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
</style>
