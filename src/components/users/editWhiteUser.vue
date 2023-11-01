<template>
  <v-row>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Full Name <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="userModel.user_name"
          disabled
          :counter="10"
          type="text"
          class="form-control login-field"
          placeholder="Full Name"
        />
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Email <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="userModel.user_email"
          :counter="10"
          disabled
          type="text"
          class="form-control login-field"
          placeholder="info@friggkantine.com"
        />
      </div>
    </v-col>

    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Company <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="userModel.company_id"
          disabled
          type="text"
          class="form-control login-field"
          placeholder="Company"
        />
      </div>
    </v-col>

    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Phone Number <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="userModel.user_phone"
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
    </v-col>
    <v-col v-if="!this.userModel._id" class="col-6">
      <label class="regularFont login-font" style=""
        >Password <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="userModel.user_password"
          :type="showPassword ? 'text' : 'password'"
          class="form-control login-field"
          disabled
          placeholder="Password"
        />
      </div>
    </v-col>

    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Canteen <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          :value="canteen_names"
          class="form-control login-field"
          type="text"
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
  mixins: [validationMixin],

  data: () => ({
    showPassword: false,
    items: ["Machine Filler", "Food Supplier", "Canteen Admin"],
    userModel: {
      user_name: "",
      user_canteen_id: "",
      user_phone: "",
      user_email: "",
      user_password: "",
      user_status: "Active",
      company_id: "",
    },
    canteen_names: "",
  }),

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

  computed: {
    ...mapGetters([
      "getActiveroleList",
      "getUserById",
      "getcanteenList",
      "getroleList",
    ]),
  },

  methods: {
    clear() {
      this.userModel = {
        name: "",
        user_canteen_id: "",
        phone: "",
        email: "",
        password: "",
      };
      this.$emit("closeIt");
    },
  },

  destroyed() {
    this.$store.dispatch("resetUserState");
  },

  mounted() {
    if (this.getUserById) {
      this.userModel = this.getUserById;
      console.log("userModel", this.userModel);
      this.userModel.user_canteen_id = this.userModel.user_canteen_id;
      this.canteen_names =
        this.userModel &&
        this.userModel.user_canteen_id &&
        this.userModel.user_canteen_id.length
          ? this.userModel.user_canteen_id
              .map((canteen) => canteen.canteen_name)
              .join(",")
          : this.userModel.user_canteen_id;
      this.userModel.company_id = this.userModel.user_parent_id.user_name;
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