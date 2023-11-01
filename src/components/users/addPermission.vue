<template>
  <form>
    <v-row>
      <v-col class="col-6">
        <v-text-field
          v-model="permissionModel.permission_name"
          :error-messages="NameErrors"
          label="Name"
          required
          color="blue darken-3"
          @input="$v.permissionModel.permission_name.$touch()"
          @blur="$v.permissionModel.permission_name.$touch()"
        >
          <template v-slot:label>
            <div>Name <small style="color: red">*</small></div>
          </template>
        </v-text-field>
      </v-col>
  

      <v-col class="col-6">
        <strong>Status</strong>
        <v-radio-group v-model="permissionModel.permission_status" row>
          <v-radio label="Active" value="Active"></v-radio>
          <v-radio label="InActive" value="InActive"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col class="col-12">
        <v-btn class="mr-4" dark color="main_bg_color" @click="submit">
          submit
        </v-btn>
        <v-btn @click="clear"> Close </v-btn>
      </v-col>
    </v-row>
  </form>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, maxLength, email, sameAs } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

import Swal from "sweetalert2";
export default {
  mixins: [validationMixin],

  validations: {
    permissionModel: {
      permission_name: { required },
    },
  },

  data: () => ({
    permissionModel: {
      permission_name: "",
      permission_status: "Active",
    },
  }),

  computed: {
    ...mapGetters(["getPermissionById" ]),

    NameErrors() {
      const errors = [];
      if (!this.$v.permissionModel.permission_name.$dirty) return errors;

      !this.$v.permissionModel.permission_name.required && errors.push("Name is required.");
      return errors;
    },
  },

  methods: {
    submit() {
      this.$v.$touch();

      if (!this.permissionModel._id) {
        if (!this.$v.$invalid) {
          this.$store.dispatch("addPermission", this.permissionModel).then((res) => {
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
      } else {
        this.$store.dispatch("updatePermission", this.permissionModel).then((res) => {
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
    },
    clear() {
      this.$v.$reset();
      this.roleModel = {
        name: "",
        role: "",
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
    if (this.getRoleById) {
      this.roleModel = this.getRoleById;
    }
  },
};
</script>
