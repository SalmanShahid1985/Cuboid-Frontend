<template>
  <v-row>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Title <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input :disabled="true"
          v-model="priorityModel.title"
          type="text"
          class="form-control login-field"
          placeholder="Title"
        />
      </div>
      <div class="invalid-feedback" v-if="$v.priorityModel.title.$error">
        <span v-if="$v.priorityModel.title.$error">Title is required</span>
      </div>
    </v-col>
    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Priority <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input :disabled="true"
          v-model="priorityModel.priority"
          type="number"
          class="form-control login-field"
          placeholder="Priority"
        />
      </div>
      <div class="invalid-feedback" v-if="$v.priorityModel.priority.$error">
        <span v-if="!$v.priorityModel.priority.minValue"
          >Priority must be greater than 0</span
        >
        <span v-else-if="!$v.priorityModel.priority.maxValue"
          >Priority must be greater than 0</span
        >
        <span
          v-else-if="
            $v.priorityModel.priority.minValue &&
            $v.priorityModel.priority.$error
          "
          >Priority is required</span
        >
      </div>
    </v-col>

    <v-col class="col-6">
      <label class="regularFont login-font" style=""
        >Status <small style="color: red">*</small></label
      >
      <v-radio-group :disabled="true" v-model="priorityModel.status" row>
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
import { required, minValue, maxValue } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

import Swal from "sweetalert2";
export default {
  mixins: [validationMixin],
  props: [ "item"],
  validations: {
    priorityModel: {
      title: { required },
      priority: { required, minValue: minValue(1), maxValue: maxValue(5) },
      status: { required },
    },
  },

  data: () => ({
    showPassword: false,
    priorityModel: {
      title: "",
      priority: 1,
      status: "Active",
    },
  }),

  computed: {
    ...mapGetters([]),

    roleErrors() {
      const errors = [];
      if (!this.$v.priorityModel.user_role_id.$dirty) return errors;
      !this.$v.priorityModel.user_role_id.required &&
        errors.push("Role is required");
      return errors;
    },

    NameErrors() {
      const errors = [];
      if (!this.$v.priorityModel.user_name.$dirty) return errors;
      !this.$v.priorityModel.user_name.maxLength &&
        errors.push("Name must be at most 10 characters long");
      !this.$v.priorityModel.user_name.required &&
        errors.push("Name is required.");
      return errors;
    },

    phoneNumberErrors() {
      const errors = [];
      if (!this.$v.priorityModel.user_phone.$dirty) return errors;
      !this.$v.priorityModel.user_phone.maxLength &&
        errors.push("Phone Number must be at most 14 characters long");
      !this.$v.priorityModel.user_phone.required &&
        errors.push("Phone Number is required.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.priorityModel.user_email.$dirty) return errors;
      !this.$v.priorityModel.user_email.email &&
        errors.push("Must be valid e-mail");
      !this.$v.priorityModel.user_email.required &&
        errors.push("E-mail is required");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.priorityModel.user_password.$dirty) return errors;
      !this.$v.priorityModel.user_password &&
        errors.push("Must be valid Password");
      !this.$v.priorityModel.user_password.required &&
        errors.push("Password is required");
      return errors;
    },
  },

  methods: {
    setRoleCompany() {
      if (this.type && this.type == "company") {
        var id = this.getroleList.filter((x) => {
          return x.role_name == "company_admin";
        });
        this.priorityModel.user_role_id = id[0]._id;
      }
    },
    
    clear() {
      this.$v.$reset();
      this.priorityModel = {
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
      this.priorityModel ={...this.item};
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
