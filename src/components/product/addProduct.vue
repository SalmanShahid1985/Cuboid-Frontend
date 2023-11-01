<template>
  <v-row>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Product Name <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="productModel.product_name"
          type="text"
          class="form-control login-field"
          placeholder=" Product Name"
        />
      </div>
      <div class="invalid-feedback" v-if="$v.productModel.product_name.$error">
        <span v-if="$v.productModel.product_name.$error"
          >Product is required</span
        >
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Price (NOK)<small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="productModel.product_price"
          :error-messages="product_priceErrors"
          label="Price"
          required
          type="number"
          class="form-control login-field"
          placeholder="1 NOK"
        />
      </div>
      <div class="invalid-feedback" v-if="$v.productModel.product_price.$error">
        <span v-if="$v.productModel.product_price.$error"
          >Price is required</span
        >
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Max Limit<small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="productModel.product_max_limit"
          :error-messages="product_priceErrors"
          label="Max Limit"
          required
          type="number"
          class="form-control login-field"
          placeholder="1 NOK"
        />
      </div>
      <div
        class="invalid-feedback"
        v-if="$v.productModel.product_max_limit.$error"
      >
        <span v-if="!$v.productModel.product_max_limit.minValue">
          Limit should be greater 0</span
        >
        <span
          v-else-if="
            $v.productModel.product_max_limit.$error &&
            $v.productModel.product_max_limit.minValue
          "
          >Limit is required</span
        >
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >VAT (%)<small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="productModel.product_VAT"
          :error-messages="product_priceErrors"
          label="VAT"
          type="number"
          required
          class="form-control login-field"
        />
      </div>
      <div class="invalid-feedback" v-if="$v.productModel.product_VAT.$error">
        <span v-if="!$v.productModel.product_VAT.minValue">
          VAT should be greater 0</span
        >
        <span v-else-if="!$v.productModel.product_VAT.maxValue">
          VAT should be Less than 100</span
        >
        <span
          v-else-if="
            $v.productModel.product_VAT.$error &&
            $v.productModel.product_VAT.minValue &&
            $v.productModel.product_VAT.maxValue
          "
        >
          VAT is required</span
        >
      </div>
    </v-col>

    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Description <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="productModel.product_description"
          label="Description"
          required
          class="form-control login-field"
          placeholder="Description"
        />
      </div>
      <div
        class="invalid-feedback"
        v-if="$v.productModel.product_description.$error"
      >
        <span v-if="$v.productModel.product_description.$error"
          >Description is required</span
        >
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Ingredients (e.g Soy,Nuts,Eggs)
      </label>
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="productModel.ingradients"
          required
          class="form-control login-field"
          placeholder="Ingredients"
        />
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style="">Extraction Time (sec) <small style="color: red">*</small></label>
      <div class="right-inner-addon input-container pb-0">
        <input
        type="number"
        v-model="productModel.extraction_time"
        class="form-control login-field"
        placeholder="1 sec"
        />
      </div>
      <div
        class="invalid-feedback"
        v-if="$v.productModel.extraction_time.$error"
      >
        <span v-if="$v.productModel.extraction_time.$error"
          >Extraction Time is required</span
        >
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style="">Dispensing Speed <small style="color: red">*</small></label>
      <div class="right-inner-addon input-container pb-0">
        <i><img src="../../assets/logos/bxs-down-arrow.svg" height="7px" /></i>
        <select
          v-model="productModel.dispensing_speed"
          class="form-control login-field"
        >
          <option v-for="i in 20" :key="i">
            {{ i - 1 }}
          </option>
        </select>
      </div>
      <div
        class="invalid-feedback"
        v-if="$v.productModel.dispensing_speed.$error"
      >
        <span v-if="$v.productModel.dispensing_speed.$error"
          >Dispensing Speed is required</span
        >
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Product Recipe <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="productModel.product_recipes"
          required
          class="form-control login-field"
          placeholder="Recipe"
        />
      </div>
      <div
        class="invalid-feedback"
        v-if="$v.productModel.product_recipes.$error"
      >
        <span v-if="$v.productModel.product_recipes.$error"
          >Recipe is required</span
        >
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Allergies <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="productModel.product_allergies"
          required
          class="form-control login-field"
          placeholder="Allergies"
        />
      </div>
      <div
        class="invalid-feedback"
        v-if="$v.productModel.product_allergies.$error"
      >
        <span v-if="$v.productModel.product_allergies.$error"
          >Allergies are required</span
        >
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Product Number <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="productModel.product_number"
          required
          class="form-control login-field"
          placeholder="Product Number"
        />
      </div>
      <div
        class="invalid-feedback"
        v-if="$v.productModel.product_number.$error"
      >
        <span v-if="$v.productModel.product_number.$error"
          >Product Number is required</span
        >
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Category Name <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <v-select
          v-model="productModel.product_catagory_id"
          item-value="_id"
          item-text="catagories_name"
          outlined
          multiple
          color="blue darken-3"
          :items="getcategoryList"
        >
        </v-select>
      </div>
      <div
        class="invalid-feedback"
        v-if="$v.productModel.product_catagory_id.$error"
      >
        <span v-if="$v.productModel.product_catagory_id.$error"
          >Category is required</span
        >
      </div>
    </v-col>
    <v-col class="col-6">
      <label>Select Image </label> <small style="color: red">*</small>
      <br />
      <span style="color:red">The image file must meet the following requirements:<br />
        Maximum File Size: 10MB<br />
        File Type: png, jpg or jpeg</span>
      <br />
      <button
        v-if="!showFileInput && editMode == true"
        class="
          modal-btn
          v-btn v-btn--is-elevated v-btn--has-bg
          theme--dark
          v-size--default
          main_bg_color
          mr-10
          py-2
        "
        @click="showFileInput = true"
      >
        Change Image
      </button>
      <input
        v-else
        type="file"
        id="file"
        ref="file"
        accept="image/jpg, image/jpeg, image/png"
        @change="handleFileUpload"
        class="py-2"
      />
      <img v-if="uploadedimg" width="20%" :src="uploadedimg" alt="" />
      <img
        v-else
        width="20%"
        :src="getImgUrl(productModel.product_image)"
        alt=""
      />
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Status <small style="color: red">*</small></label
      >

      <v-radio-group v-model="productModel.product_status" row>
        <v-radio label="Active" value="Active"></v-radio>
        <v-radio label="InActive" value="InActive"></v-radio>
      </v-radio-group>
    </v-col>

    <v-col class="col-12 d-flex justify-center">
      <v-btn class="mr-4 modal-btn btnn" @click="clear"> Close </v-btn>
      <v-btn
        v-if="!isSubmitting"
        class="modal-btn"
        dark
        color="main_bg_color"
        @click="submit"
      >
        Submit
      </v-btn>
      <div v-else class="modal-btn" dark color="main_bg_color">
        <v-progress-circular
          indeterminate
          color="orange darken-1"
        ></v-progress-circular>
      </div>
    </v-col>
  </v-row>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, minValue, maxValue } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

import Swal from "sweetalert2";
export default {
  props: ["editMode"],
  mixins: [validationMixin],
  validations: {
    productModel: {
      product_name: { required },
      product_max_limit: { required, minValue: minValue(1) },
      product_price: { required },
      product_description: { required },
      product_VAT: { required, minValue: minValue(1), maxValue: maxValue(100) },
      product_status: { required },
      product_catagory_id: { required },
      dispensing_speed: { required },
      product_number: { required },
      product_allergies: { required },
      product_recipes: { required },
      extraction_time: { required }
    },
  },
  data: () => ({
    isSubmitting: false,
    menu: false,
    image: null,
    showFileInput: false,
    uploadedimg: null,
    productModel: {
      product_number: "",
      product_name: "",
      product_price: "",
      product_VAT: "",
      product_description: "",
      ingradients: "",
      product_catagory_id: "",
      product_max_limit: 0,
      dispensing_speed: 0,
      product_recipes: "",
      product_allergies: "",
      extraction_time: 0,
      // category: "",
      product_status: "Active",
      product_image: "",
    },
  }),
  computed: {
    ...mapGetters(["getcanteenList", "getcategoryList", "getproductById"]),

    product_nameErrors() {
      const errors = [];
      if (!this.$v.productModel.product_name.$dirty) return errors;
      !this.$v.productModel.product_name.required &&
        errors.push("Name is required.");
      return errors;
    },
    product_priceErrors() {
      const errors = [];
      if (!this.$v.productModel.product_price.$dirty) return errors;
      !this.$v.productModel.product_price.required &&
        errors.push("price is required.");
      return errors;
    },

    product_VATErrors() {
      const errors = [];
      if (!this.$v.productModel.product_VAT.$dirty) return errors;
      !this.$v.productModel.product_VAT.required &&
        errors.push("VAT is required.");
      return errors;
    },
    categoryErrors() {
      const errors = [];
      if (!this.$v.productModel.product_catagory_id.$dirty) return errors;
      !this.$v.productModel.product_catagory_id.required &&
        errors.push("category is required.");
      return errors;
    },
    product_descriptionErrors() {
      const errors = [];
      if (!this.$v.productModel.product_description.$dirty) return errors;
      !this.$v.productModel.product_description.required &&
        errors.push("Decription is required.");
      return errors;
    },
  },

  methods: {
    handleFileUpload(e) {
      const fileSize = this.$refs.file.files[0].size;
      const imageType = this.$refs.file.files[0].type;
      if(imageType !=='image/jpeg' && imageType !=='image/png'){
        Swal.fire({
          title: "Error!",
          text: "Please select a png, jpeg or jpg image file.",
          icon: "error"
        });
        return;
      } else {
        if (fileSize > 10000000) {        
          Swal.fire({
            title: "Error!",
            text: "File Size cannot exceed 10 MegaBytes",
            icon: "error"
          });
        } else {
          this.productModel.product_image = this.$refs.file.files[0];
          const file = e.target.files[0];
          this.image = file;
          this.uploadedimg = URL.createObjectURL(file);
        }

      }
    },
    getImgUrl(url) {
      if (url.name) {
        return null;
      } else {
        return url.replace("public/", "");
      }
    },
    async submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (
          (typeof this.productModel.product_image == "string" &&
            this.productModel.product_image != "") ||
          (this.productModel.product_image.size < 10000000 &&
            this.productModel.product_image == this.$refs.file.files[0])
        ) {
          this.isSubmitting = true;
          if (this.productModel._id == null) {
            await this.$store
              .dispatch("addproduct", this.productModel)
              .then((res) => {
                this.$emit("closeIt");
                if (res.success) {
                  Swal.fire({
                    title: "",
                    text: res.message,
                    icon: "success",
                  });
                } else {
                  Swal.fire({
                    title: "Error!",
                    text: res.errors[0].msg ? res.errors[0].msg : 'there was an unexpected error',
                    icon: "error",
                  });
                }
              });
          } else {
            await this.$store
              .dispatch("updateproduct", this.productModel)
              .then((res) => {
                this.$emit("closeIt");
                if (res.success) {
                  Swal.fire({
                    title: "",
                    text: res.message,
                    icon: "success",
                  });
                } else {
                  Swal.fire({
                    title: "Error!",
                    text: res.message,
                    icon: "error",
                  });
                }
              });
          }
        } else {
          Swal.fire({
            title: "Error!",
            text: "Please Select a Valid Image",
            icon: "error",
          });
        }
      }
    },
    clear() {
      this.$v.$reset();

      this.$emit("closeIt");
    },
  },
  mounted() {
    if (this.getproductById) {
      this.productModel = this.getproductById;
      var productCatagory = [];
      if (this.productModel.product_catagory_id) {
        this.productModel.product_catagory_id.forEach((x) => {
          productCatagory.push(x._id);
        });
        this.productModel.product_catagory_id = productCatagory;
      }
      this.productModel.ingradients =
        this.productModel.product_gradient.toString();
    }
  },
  destroyed() {
    this.$store.dispatch("resetproductState");
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
.right-inner-addon i {
  position: absolute;
  right: 0px;
  padding: 8px 12px;
  pointer-events: none;
}
</style>
