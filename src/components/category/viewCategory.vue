<template>
  <form>
    <v-row>
      <v-col class="col-6">
        <label class="regularFont login-font" style="">Category Name <small style="color: red">*</small></label>
          <div class="right-inner-addon input-container pb-0">
            <input
             v-model="categoryModel.catagories_name" 
              type="text"
              disabled
              class="form-control login-field"
              placeholder=" Category Name"
            />
          </div> 
      </v-col>
      <v-col class="col-6">
      <label class="regularFont login-font" style="">Status<small style="color: red">*</small></label>
        <v-radio-group disabled v-model="categoryModel.catagories_status" row>
          <v-radio label="Active" value="Active"></v-radio>
          <v-radio label="InActive" value="InActive"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col class="col-6">
        <label class="regularFont login-font mb-3" style="">Image <small style="color: red">*</small></label>
        <br />
        <img width="30%" :src="getImgUrl(categoryModel.catagories_image)" alt="" />
        
      </v-col>
        <v-col class="col-12 d-flex justify-center">
        <v-btn class="mr-4 modal-btn btnn" @click="clear"> Close </v-btn>

      
      </v-col>
      
    </v-row>
  </form>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
export default {
  mixins: [validationMixin],
  validations: {
    categoryModel: {
      catagories_name: { required },
    },
  },
  data: () => ({
    categoryModel: {
      catagories_name: "",
      catagories_status: "Active",
    },
  }),

  computed: {
    ...mapGetters(["getcategoryById"]),
    catagories_nameErrors() {
      const errors = [];
      if (!this.$v.categoryModel.catagories_name.$dirty) return errors;
      !this.$v.categoryModel.catagories_name.required &&
        errors.push("Catagory name is required.");
      return errors;
    },
  },

  methods: {
    handleFileUpload() {
      this.categoryModel.product_image = this.$refs.file.files[0];
    },
    getImgUrl(url) {
      if(url) {
        return url.replace('public/','')
      }
    }
    ,
    async submit() {
      this.$v.$touch();
      if (this.categoryModel._id == null) {
        if (!this.$v.$invalid && this.categoryModel.product_image) {
          await this.$store.dispatch("addcategory", this.categoryModel)
            .then((res) => {
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
              this.$emit("closeIt");
            });
        }else{
           Swal.fire({
                title: "",
                text:"Image is Required",
                icon: "error",
              });
        }
      } else {
        await this.$store
          .dispatch("updatecategory", this.categoryModel)
          .then((res) => {
            if (res.data.success) {
              Swal.fire({
                title: "",
                text: res.data.success,
                icon: "success",
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: res.data.success,
                icon: "error",
              });
            }
          });
        this.$emit("closeIt");
      }
    },
    clear() {
      this.$v.$reset();
      (this.categoryModel = {
        catagories_name: "",
        location: "",
      }),
        this.$emit("closeIt");
    },
  },
  mounted() {
    if (this.getcategoryById) {
      this.categoryModel = this.getcategoryById;
    }
  },
  destroyed() {
    this.$store.dispatch("resetcategoryState");
  },
};
</script>
