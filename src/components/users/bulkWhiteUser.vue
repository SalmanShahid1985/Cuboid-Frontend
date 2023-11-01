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
  validations: {},

  data: () => ({
    userModel: {
      user_canteen_id: "",
    },
  }),
  computed: {
    ...mapGetters(["getcanteenList"]),
    canteenErrors() {
      const errors = [];
      if (!this.$v.userModel.user_canteen_id.$dirty) return errors;
      !this.$v.userModel.user_canteen_id.required &&
        errors.push("canteen is required");
      return errors;
    },
  },
  methods: {
    submit() {
      var vm = this;
      var canteen_id = this.userModel.user_canteen_id;
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
                  user_name: dataval[0],
                  user_email: dataval[1],
                  user_password: dataval[2],
                  user_phone: dataval[3],
                  user_status: dataval[4],
                  user_canteen_id: dataval[5],
                  subsidy_points: dataval[6],
                  user_parent_id: dataval[7].replace("\r", ""),
                });
              }
            });

            console.log('arrayData', arrayData);

            vm.sendData(arrayData);
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
    async sendData(data) {
      await this.$store
        .dispatch("bulkwhiteuser", { data: data })
        .then((res) => {
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
    clear() {
      this.$v.$reset();
      this.$emit("closeIt");
    },
  },
};
</script>

<style scoped>
.right-inner-addon i {
  padding: 8px 12px !important;
}
</style>
