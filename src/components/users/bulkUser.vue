<template>
  <v-row>
    <v-col class="col-6 d-flex align-center">
      <label class="regularFont login-font"
        >Upload CSV<small style="color: red">*</small></label
      >
      <br />
      <span style="color:red">The image file must meet the following requirements:<br />
        CSV file separated by commas</span>
      <input
        style="margin: 5px auto; display: block"
        type="file"
        id="fileUpload"
      />
      <hr />
    </v-col>
    <v-col v-show="type != 'company'" class="col-6">
      <label class="regularFont login-font" style=""
        >Select Role <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <i><img src="../../assets/logos/bxs-down-arrow.svg" height="7px" /></i>
        <select
          v-model="userModel.user_role_id"
          class="form-control login-field"
        >
          <option
            v-for="(d, i) in getroleList"
            :key="i"
            :value="d._id"
            v-show="d.role_name != 'company_admin'"
          >
            {{
              d.role_name
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/(?: |\b)(\w)/g, function (key, p1) {
                  return key.toUpperCase();
                })
            }}
          </option>
        </select>
      </div>
      <div class="invalid-feedback" v-if="$v.userModel.user_role_id.$error">
        <span v-if="$v.userModel.user_role_id.$error">Role is required</span>
      </div>
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
  props: ["type"],
  mixins: [validationMixin],
  validations: {
    userModel: {
      user_role_id: { required },
    },
  },

  data: () => ({
    userModel: {
      user_role_id: "",
    },
  }),
  computed: {
    ...mapGetters(["getroleList"]),
    roleErrors() {
      const errors = [];
      if (!this.$v.userModel.user_role_id.$dirty) return errors;
      !this.$v.userModel.user_role_id.required &&
        errors.push("Role is required");
      return errors;
    },
  },
  mounted() {
    if (this.type && this.type == "company") {
      this.setRoleCompany();
    }
  },
  methods: {
    setRoleCompany() {
      var id = this.getroleList.filter((x) => {
        return x.role_name == "company_admin";
      });
      this.userModel.user_role_id = id[0]._id;
    },
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        var vm = this;
        var rol_id = this.userModel.user_role_id;
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
                    user_status: dataval[4].replace("\r", ""),
                  });
                }
              });

              vm.sendData(rol_id, arrayData);
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
      }
    },
    async sendData(rol_id, data) {
      await this.$store
        .dispatch("bulkUser", { user_role_id: rol_id, data: data })
        .then((res) => {
          this.$emit("closeIt");
          if (res.success) {
            Swal.fire({
              title: "Success",
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
