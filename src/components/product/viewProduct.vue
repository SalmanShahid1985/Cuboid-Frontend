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
          disabled
          placeholder=" Product Name"
        />
      </div>
      <!-- <v-text-field
          v-model="productModel.product_name"
          :error-messages="product_nameErrors"
          label="Name"
          required
          color="blue darken-3"
          @input="$v.productModel.product_name.$touch()"
          @blur="$v.productModel.product_name.$touch()"
        >
          <template v-slot:label>
            <div>Product Name <small style="color: red">*</small></div>
          </template>
        </v-text-field> -->
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
          disabled
          class="form-control login-field"
          placeholder="Price"
        />
      </div>
      <!-- <v-text-field
          v-model="productModel.product_price"
          :error-messages="product_priceErrors"
          label="Price"
          required
          type="number"
          color="blue darken-3"
          @input="$v.productModel.product_price.$touch()"
          @blur="$v.productModel.product_price.$touch()"
        >
          <template v-slot:label>
            <div>Price <small style="color: red">*</small></div>
          </template>
        </v-text-field> -->
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >VAT <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="productModel.product_VAT"
          :error-messages="product_priceErrors"
          label="VAT"
          disabled
          required
          class="form-control login-field" 
        />
      </div>
      <!-- <v-text-field
          v-model="productModel.product_VAT"
          :error-messages="product_VATErrors"
          label="VAT"
          required
          color="blue darken-3"
          @input="$v.productModel.product_VAT.$touch()"
          @blur="$v.productModel.product_VAT.$touch()"
        >
          <template v-slot:label>
            <div>VAT <small style="color: red">*</small></div>
          </template>
        </v-text-field> -->
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Category Name <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <v-select
        readonly
          v-model="productModel.product_catagory_id"
          :items="getcategoryList"
          item-value="_id"
          item-text="catagories_name"
        />
        </select>
      </div>
      <!-- <v-select 
          item-text="catagories_name"
          v-model="productModel.product_catagory_id"
          label="Category"
          color="blue darken-3"
        >
          <template v-slot:label>
            <div>Category Name <small style="color: red">*</small></div>
          </template>
        </v-select> -->
    </v-col>
    

    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Description <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="productModel.product_description"
          label="Description"
          required disabled
          class="form-control login-field"
          placeholder="Description"
        />
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Ingredients (e.g Soy,Nuts,Eggs)
      </label>
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="productModel.ingradients"
          required disabled
          class="form-control login-field"
          placeholder="Description"
        />
      </div>
      <!-- <v-text-field
          v-model="productModel.ingradients"
          label="Ingredients (e.g Soy,Nuts,Eggs)"
          required
          color="blue darken-3"
        ></v-text-field> -->
    </v-col>
     <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Dispensing Speed <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="productModel.dispensing_speed"
          label="Dispensing Speed"
          required disabled
          class="form-control login-field"
          placeholder="Dispensing Speed"
        />
      </div>
    </v-col>
     <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Product Recipe <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="productModel.product_recipes"
          label="Recipe"
          required disabled
          class="form-control login-field"
          placeholder="Recipe"
        />
      </div>
    </v-col>
     <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Allergies <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="productModel.product_allergies"
          label="Allergies"
          required disabled
          class="form-control login-field"
          placeholder="Allergies"
        />
      </div>
    </v-col>
     <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Product Number <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="productModel.product_number"
          label="Product Number"
          required disabled
          class="form-control login-field"
          placeholder="Product Number"
        />
      </div>
    </v-col>
    <v-col class="col-6">
      <label>Image </label> <small style="color: red">*</small>
      <br />
      <img width="30%" :src="getImgUrl(productModel.product_image)" alt="" />
      
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Status <small style="color: red">*</small></label
      >

      <v-radio-group  disabled v-model="productModel.product_status" row>
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
import { required, maxLength } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

import Swal from "sweetalert2";
export default {
  mixins: [validationMixin],
  validations: {
    productModel: {
      product_name: { required },
      product_price: { required },
      product_description: { required, maxLength: maxLength(50) },
      product_VAT: { required },
      product_status: { required },
      product_catagory_id: { required },
    },
  },
  data: () => ({
    menu: false,
    image: null,
    productModel: {
      product_name: "",
      product_price: "",
      product_VAT: "",
      product_description: "",
      ingradients: "",
      product_catagory_id: "",
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
    handleFileUpload() {
      this.productModel.product_image = this.$refs.file.files[0];
    },
getImgUrl(img_url) {
if(img_url) {

  return img_url.replace('public/','')
}
},
    async submit() {
      this.$v.$touch();
      if (this.productModel.product_image) {
        if (!this.$v.$invalid) {
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
                    text: res.message,
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
        }
      } else {
        Swal.fire({
          title: "Error!",
          text: "Image is Required",
          icon: "error",
        });
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
        this.productModel.product_catagory_id = this.productModel.product_catagory_id._id;
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
.v-text-field--full-width .v-input__prepend-outer, .v-text-field--full-width .v-input__prepend-inner, .v-text-field--full-width .v-input__append-inner, .v-text-field--full-width .v-input__append-outer, .v-text-field--enclosed .v-input__prepend-outer, .v-text-field--enclosed .v-input__prepend-inner, .v-text-field--enclosed .v-input__append-inner, .v-text-field--enclosed .v-input__append-outer {
    margin-top: 8px !important;
}
.v-text-field--outlined fieldset{
    margin-bottom: 17.9px !important;
    margin-top: 6px !important;
    border: 1px solid #d3d0d0 !important;
}
.v-select__selections{
  margin-top: -18px !important;
}</style>
