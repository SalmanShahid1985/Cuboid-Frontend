<template>
  <form>
    <v-row>
      <v-col class="col-6">
        <label class="regularFont login-font" style=""
          >Category Name <small style="color: red">*</small></label
        >
        <div class="right-inner-addon input-container pb-0">
          <input
            v-model="categoryModel.catagories_name"
            type="text"
            class="form-control login-field"
            placeholder=" Category Name"
          />
        </div>
        <div
          class="invalid-feedback"
          v-if="$v.categoryModel.catagories_name.$error"
        >
          <span v-if="$v.categoryModel.catagories_name.$error"
            >Category Name is required</span
          >
        </div>
      </v-col>
      <v-col class="col-6">
        <label class="regularFont login-font" style=""
          >Status<small style="color: red">*</small></label
        >
        <v-radio-group v-model="categoryModel.catagories_status" row>
          <v-radio label="Active" value="Active"></v-radio>
          <v-radio label="InActive" value="InActive"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col class="col-6">
        <label class="regularFont login-font" style=""
          >Select Image <small style="color: red">*</small></label
        >
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
            mb-4
            mt-2
          "
          style="display: block"
          @click="showFileInput = true"
        >
          Change Image
        </button>
        <input
          v-else
          style="display: block"
          class="py-2"
          type="file"
          id="file"
          ref="file"
          accept="image/jpg, image/jpeg, image/png"
          @change="handleFileUpload"
        />

        <img v-if="uploadedimg" width="20%" :src="uploadedimg" alt="" />
        <img
          v-else
          width="30%"
          :src="getImgUrl(categoryModel.catagories_image)"
          alt=""
        />
      </v-col>
      <v-col class="col-12 d-flex justify-center">
        <v-btn class="mr-4 modal-btn btnn" @click="clear"> Close </v-btn>

        <v-btn class="modal-btn" dark color="main_bg_color" @click="submit">
          Submit
        </v-btn>
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
  props: ["editMode"],
  mixins: [validationMixin],
  validations: {
    categoryModel: {
      catagories_name: { required },
    },
  },
  data: () => ({
    showFileInput: false,
    uploadedimg: null,
    categoryModel: {
      catagories_name: "",
      category_image: "",
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
            icon: "error",
          });
        } else {
          this.categoryModel.category_image = this.$refs.file.files[0];
          const file = e.target.files[0];
          this.image = file;
          this.uploadedimg = URL.createObjectURL(file);
        }

      }

    },
    getImgUrl(url) {
      if (url) {
        return url.replace("public/", "");
      }
    },
    async submit() {
      this.$v.$touch();
      if (
        (!this.categoryModel.category_image && this.editMode) ||
        (this.categoryModel.category_image.size < 10000000 &&
          this.categoryModel.category_image == this.$refs.file.files[0])
      ) {
        if (this.categoryModel._id == null) {
          if (!this.$v.$invalid) {
            await this.$store
              .dispatch("addcategory", this.categoryModel)
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
          }
        } else {
          await this.$store
            .dispatch("updatecategory", this.categoryModel)
            .then((res) => {
              if (res.data.success) {
                Swal.fire({
                  title: "",
                  text: res.data.message,
                  icon: "success",
                });
              } else {
                Swal.fire({
                  title: "Error!",
                  text: res.data.message,
                  icon: "error",
                });
              }
            });
          this.$emit("closeIt");
        }
      } else {
        Swal.fire({
          title: "Error!",
          text: "Please Select a valid image",
          icon: "error",
        });
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
