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
          disabled
          class="form-control login-field"
        />
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Select Canteen <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <select disabled v-model="canteenId" class="form-control login-field">
          <option v-for="(d, i) in getcanteenList" :key="i" :value="d._id">
            {{ d.canteen_name }}
          </option>
        </select>
      </div>
    </v-col>

    <v-col class="col-6">
      <v-text-field
        v-model="bannerModel.banner_start_date"
        label="Start Date"
        prepend-icon="mdi-calendar"
        readonly
        disabled
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </v-col>
    <v-col class="col-6">
      <v-text-field
        v-model="bannerModel.banner_end_date"
        label="End Date"
        prepend-icon="mdi-calendar"
        disabled
        readonly
        v-bind="attrs"
        v-on="on"
      ></v-text-field>
    </v-col>
    <v-col class="col-6">
      <label>Image</label> <small style="color: red">*</small>
      <br />
      <img
        width="30%"
        disabled
        :src="getImgUrl(bannerModel.banner_image)"
        alt=""
      />
    </v-col>
    <v-col class="col-6">
      <strong>Status</strong>

      <v-radio-group disabled v-model="bannerModel.banner_status" row>
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
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

import Swal from "sweetalert2";
export default {
  mixins: [validationMixin],
  validations: {
    bannerModel: {
      banner_title: { required },
      banner_status: { required },
    },
  },
  data: () => ({
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
        errors.push("title is required.");
      return errors;
    },
  },

  methods: {
    handleFileUpload() {
      this.bannerModel.image = this.$refs.file.files[0];
    },
    getImgUrl(url) {
      if (url) {
        return url.replace("public/", "");
      }
    },
    async submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
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
          this.$store.dispatch("updatebanner", this.bannerModel).then((res) => {
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
      }
    },
    clear() {
      this.$v.$reset();

      this.$emit("closeIt");
    },
      dateConvert(obj) {
      var date = new Date(obj);
      return (
        date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate()
      );
    },
    async changeRoute(id) {
      await this.$store.dispatch("machinesList", id).then((res) => {
        this.item = this.getmachineList;
        this.machineIds = this.getmachineList.map(function (a) {
          return a._id;
        });
      });
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
