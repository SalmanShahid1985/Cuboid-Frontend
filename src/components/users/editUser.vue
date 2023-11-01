<template>
  <v-row>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Full Name <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="userModel.user_name"
          :error-messages="NameErrors"
          disabled
          :counter="10"
          type="text"
          class="form-control login-field"
          placeholder="Full Name"
        />
      </div>
      <!-- <v-text-field
          v-model="userModel.user_name"
          :error-messages="NameErrors"
          :counter="10"
          label="Name"
          required
          color="blue darken-3"
          @input="$v.userModel.user_name.$touch()"
          @blur="$v.userModel.user_name.$touch()"
        >
          <template v-slot:label>
            <div>Name <small style="color: red">*</small></div>
          </template>
        </v-text-field> -->
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Email <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="userModel.user_email"
          :error-messages="NameErrors"
          :counter="10"
          disabled
          type="text"
          class="form-control login-field"
          placeholder="info@friggkantine.com"
        />
      </div>
      <!-- <v-select
          v-model="userModel.user_role_id"
          :items="getActiveroleList"
          :error-messages="roleErrors"
          item-value="_id"
          item-text="role_name"
          label="Select role"
          required
          color="blue darken-3"
          @change="$v.userModel.user_role_id.$touch()"
          @blur="$v.userModel.user_role_id.$touch()"
        >
          <template v-slot:label>
            <div>Select Role <small style="color: red">*</small></div>
          </template>
        </v-select> -->
    </v-col>

    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Phone Number <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="userModel.user_phone"
          :error-messages="NameErrors"
          :counter="15"
          type="tel"
          disabled
          class="form-control login-field"
          :placeholder="phoneNumberFormat"
          @input="userModel.user_phone = enforcePhoneFormat(userModel, 'user_phone')"
        />
      </div>
      <div class="invalid-feedback" v-if="$v.userModel.user_phone.$error">
        <span v-if="!$v.userModel.user_phone.required">Phone is required</span>
        <span
          v-else-if="
            !$v.userModel.user_phone.maxLength ||
            !$v.userModel.user_phone.minLength
          "
          >Phone Number must of 8 characters</span
        >
      </div>
      <!-- <v-text-field
          v-model="userModel.user_phone"
          label="Phone Number"
          required
          color="blue darken-3"
          :error-messages="phoneNumberErrors"
          @input="userModel.user_phone = enforcePhoneFormat(userModel, 'user_phone')"
          :counter="15"
        >
          <template v-slot:label>
            <div>Phone Number <small style="color: red">*</small></div>
          </template>
        </v-text-field> -->
    </v-col>
    <v-col v-if="!this.userModel._id" class="col-6">
      <label class="regularFont login-font" style=""
        >Password <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <!-- <i  @click="showPassword = !showPassword"
              ><img @click="showPassword = !showPassword"
                src="../../assets/logos/Icon-ionic-md-eye-off.png"
                height="15px"
                width="18px"
            /></i> -->
        <input
          v-model="userModel.user_password"
          :type="showPassword ? 'text' : 'password'"
          class="form-control login-field"
          disabled
          placeholder="Password"
        />
      </div>
    </v-col>

    <v-col class="col-6" v-show="type != 'company'">
      <label class="regularFont login-font" style=""
        >Select Role <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <select
          disabled
          v-model="userModel.user_role_id"
          class="form-control login-field"
        >
          <option v-for="(d, i) in getroleList" :key="i" :value="d._id">
            {{ d.role_name }}
          </option>
        </select>
      </div>
    </v-col>

    <v-col class="col-6" v-show="type == 'company'">
      <label class="regularFont login-font" style=""
        >Company Location <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="userModel.user_location"
          disabled
          type="text"
          class="form-control login-field"
          placeholder="Company Location"
        />
      </div>
    </v-col>
    <v-col class="col-6" v-show="type == 'company'">
      <label class="regularFont login-font" style=""
        >Company Title <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="userModel.user_title"
          disabled
          type="text"
          class="form-control login-field"
          placeholder="Company Location"
        />
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Status <small style="color: red">*</small></label
      >
      <v-radio-group disabled v-model="userModel.user_status" row>
        <v-radio label="Active" value="Active"></v-radio>
        <v-radio label="InActive" value="InActive"></v-radio>
      </v-radio-group>
    </v-col>
    <v-col class="col-12 d-flex justify-center">
      <v-btn class="mr-4 modal-btn btnn" @click="clear"> Close </v-btn>

      <!-- <v-btn class="modal-btn" dark color="main_bg_color" @click="submit">
          Submit
        </v-btn> -->
    </v-col>
  </v-row>
</template>
<script>
import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  email,
  sameAs,
} from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

import Swal from "sweetalert2";
export default {
  props: ["type"],
  mixins: [validationMixin],

  validations() {
    return {
      userModel: {
        user_name: { required, maxLength: maxLength(30) },
        user_role_id: { required },
        user_phone: {
          required,
          maxLength: maxLength(8),
          minLength: minLength(8),
        },
        user_email: { required, email },
        user_password: this.userModel._id ? "" : { required },
      },
    };
  },

  data: () => ({
    showPassword: false,
    items: ["Machine Filler", "Food Supplier", "Canteen Admin"],
    userModel: {
      user_name: "",
      user_role_id: "",
      user_phone: "",
      user_email: "",
      user_password: "",
      user_status: "Active",
    },
  }),

  computed: {
    ...mapGetters(["getActiveroleList", "getUserById", "getroleList"]),

    roleErrors() {
      const errors = [];
      if (!this.$v.userModel.user_role_id.$dirty) return errors;
      !this.$v.userModel.user_role_id.required &&
        errors.push("Role is required");
      return errors;
    },

    NameErrors() {
      const errors = [];
      if (!this.$v.userModel.user_name.$dirty) return errors;
      !this.$v.userModel.user_name.maxLength &&
        errors.push("Name must be at most 10 characters long");
      !this.$v.userModel.user_name.required && errors.push("Name is required.");
      return errors;
    },

    phoneNumberErrors() {
      const errors = [];
      if (!this.$v.userModel.user_phone.$dirty) return errors;
      !this.$v.userModel.user_phone.maxLength &&
        errors.push("Phone Number must be at most 14 characters long");
      !this.$v.userModel.user_phone.required &&
        errors.push("Phone Number is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.userModel.user_email.$dirty) return errors;
      !this.$v.userModel.user_email.email &&
        errors.push("Must be valid e-mail");
      !this.$v.userModel.user_email.required &&
        errors.push("E-mail is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.userModel.user_password.$dirty) return errors;
      !this.$v.userModel.user_password && errors.push("Must be valid Password");
      !this.$v.userModel.user_password.required &&
        errors.push("Password is required");
      return errors;
    },
  },

  methods: {
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (!this.userModel._id) {
          this.$store.dispatch("addUser", this.userModel).then((res) => {
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
                text: res.errors[0].msg,
                icon: "error",
              });
            }
          });
        } else {
          this.$store.dispatch("updateUser", this.userModel).then((res) => {
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
        }
      }
    },
    clear() {
      this.$v.$reset();
      this.userModel = {
        name: "",
        user_role_id: "",
        phone: "",
        email: "",
        password: "",
      };
      this.$emit("closeIt");
    },
  },

  destroyed() {
    //
    this.$store.dispatch("resetUserState");
  },

  mounted() {
    if (this.getUserById) {
      this.userModel = this.getUserById;
      this.userModel.user_phone = this.enforcePhoneFormat(this.userModel, 'user_phone')
    }
  },
};
</script>
<style scoped>
.login-field {
  border-radius: 8px;
  background-color: #ecf5f7;
  border: none;
}
.p-2 {
  padding: 0.5rem !important;
}
.form-control {
  padding: 0.54rem 0.75rem;
}
.modal-btn {
  height: 45px !important;
  min-width: 70px !important;
  padding: 0 55px !important;
  box-shadow: none;
}
label {
  font-size: 19px;
  margin-bottom: 4px;
}
.right-inner-addon i {
  padding: 8px 12px !important;
}
</style>