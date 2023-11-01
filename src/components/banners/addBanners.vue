<template>
  <v-row>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Title <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="bannerModel.banner_title"
          type="text"
          class="form-control login-field"
        />
      </div>
      <div class="invalid-feedback" v-if="$v.bannerModel.banner_title.$error">
        <span v-if="$v.bannerModel.banner_title.$error">Title is required</span>
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style="">Select Canteen </label>
      <div class="right-inner-addon input-container pb-0">
        <select v-model="canteenId" class="form-control login-field">
          <option v-for="(d, i) in getcanteenList" :key="i" :value="d._id">
            {{ d.canteen_name }}
          </option>
        </select>
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
            v-model="bannerModel.banner_start_date"
            label="Start Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          :min="nowDate"
          @input="menu = false"
          v-model="bannerModel.banner_start_date"
          no-title
          scrollable
        >
        </v-date-picker>
      </v-menu>
      <div
        class="invalid-feedback"
        v-if="$v.bannerModel.banner_start_date.$error"
      >
        <span v-if="$v.bannerModel.banner_start_date.$error"
          >Start Date is required</span
        >
      </div>
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
            v-model="bannerModel.banner_end_date"
            label="End Date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          :min="nowDate"
          @input="menu1 = false"
          v-model="bannerModel.banner_end_date"
          no-title
          scrollable
        >
        </v-date-picker>
      </v-menu>
      <div
        class="invalid-feedback"
        v-if="$v.bannerModel.banner_end_date.$error"
      >
        <span v-if="$v.bannerModel.banner_end_date.$error"
          >End Date is required</span
        >
      </div>
    </v-col>
    <v-col class="col-6">
      <label>Select image</label> <small style="color: red">*</small>
      <br />
      <span style="color:red">The image file must meet the following requirements:<br />
        Maximum File Size: 10MB<br />
        File Type: png, jpg or jpeg<br />
        Maximum Resolution: 400px by 66px<br />
      </span>
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
        "
        @click="showFileInput = true"
      >
        Change Image
      </button>
      <input
        v-else
        class="py-3"
        type="file"
        id="file"
        ref="file"
        accept="image/jpg, image/jpeg, image/png"
        @change="handleFileUpload()"
      />

      <img
        width="30%"
        ref="bannerImg"
        :src="getImgUrl(bannerModel.banner_image)"
        alt=""
      />
    </v-col>
    <v-col class="col-6">
      <strong>Status</strong>

      <v-radio-group v-model="bannerModel.banner_status" row>
        <v-radio label="Active" value="Active"></v-radio>
        <v-radio label="InActive" value="InActive"></v-radio>
      </v-radio-group>
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
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

import Swal from "sweetalert2";
export default {
  mixins: [validationMixin],
  validations: {
    bannerModel: {
      banner_title: { required },
      banner_start_date: { required },
      banner_end_date: { required },
    },
  },
  props: ["editMode"],
  data: () => ({
    showFileInput: false,
    menu: false,
    nowDate: new Date().toISOString().slice(0, 10),
    menu1: false,
    item: null,
    image: null,
    machineIds: null,
    canteenId: null,
    bannerModel: {
      banner_title: "",
      machine_id: [],
      banner_description: "",
      banner_status: "Active",
      image: "",
    },
  }),
  computed: {
    ...mapGetters(["getcanteenList", "getmachineList", "bannerById"]),

    titleErrors() {
      const errors = [];
      if (!this.$v.bannerModel.banner_title.$dirty) return errors;
      !this.$v.bannerModel.banner_title.required &&
        errors.push("Title is required.");
      return errors;
    },
  },

  methods: {
    handleFileUpload() {
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
          this.bannerModel.image = this.$refs.file.files[0];
          var reader = new FileReader();
          reader.onload = () => {
            this.$refs.bannerImg.src = reader.result;
          };
          reader.readAsDataURL(this.$refs.file.files[0]);
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
      if (!this.$v.$invalid) {
        if (
          (!this.bannerModel.image && this.editMode) ||
          (this.bannerModel.image.size < 10000000 &&
            this.bannerModel.image == this.$refs.file.files[0])
        ) {
          this.bannerModel.banner_canteen_ids = [];
          this.bannerModel.banner_canteen_ids.push(this.canteenId);
          if (this.bannerModel._id == null) {
            await this.$store
              .dispatch("addbanner", this.bannerModel)
              .then((res) => {
                if (res.success) {
                  Swal.fire({
                    title: "",
                    text: res.message,
                    icon: "success",
                  });
                } else if (res.errors) {
                  Swal.fire({
                    title: "",
                    text: res.errors[0].msg,
                    icon: "error",
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
            this.$store
              .dispatch("updatebanner", this.bannerModel)
              .then((res) => {
                if (res.errors) {
                  Swal.fire({
                    title: "",
                    text: res.errors[0].msg,
                    icon: "error",
                  });
                }
                if (res.data.success) {
                  Swal.fire({
                    title: "",
                    text: res.data.message,
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
          this.$emit("closeIt");
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
    async changeRoute(id) {
      await this.$store.dispatch("machinesList", id).then((res) => {
        this.item = this.getmachineList;
        this.machineIds = this.getmachineList.map(function (a) {
          return a._id;
        });
      });
    },
    dateConvert(obj) {
      var date = new Date(obj);
      return (
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
      );
    },
  },
  mounted() {
    this.item = this.getmachineList;
    if (this.bannerById) {
      this.bannerModel = this.bannerById;
      this.bannerModel.banner_start_date = this.dateConvert(
        this.bannerModel.banner_start_date
      );
      this.bannerModel.banner_end_date = this.dateConvert(
        this.bannerModel.banner_end_date
      );

      this.canteenId = this.bannerModel.canteens.map((e) => {
        return e._id;
      })[0];
    }
  },
  destroyed() {
    this.$store.dispatch("resetbannerState");
  },
};
</script>
