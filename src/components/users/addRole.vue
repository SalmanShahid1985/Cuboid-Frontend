<template>
  <form>
    <v-row>
      <v-col class="col-12">
        <strong>Role Name</strong>
        <v-radio-group v-model="RoleName" row>
          <v-radio
            :label="data"
            :value="data"
            v-for="data in roleList"
          ></v-radio>
          <v-radio label="other" value="other"></v-radio>
        </v-radio-group>
      </v-col>
      <v-col class="col-6" v-if="RoleName == 'other'">
        <v-text-field
          v-model="roleModel.role_name"
          :error-messages="NameErrors"
          label="Name"
          required
          color="blue darken-3"
          @input="$v.roleModel.role_name.$touch()"
          @blur="$v.roleModel.role_name.$touch()"
        >
          <template v-slot:label>
            <div>Name <small style="color: red">*</small></div>
          </template>
        </v-text-field>
      </v-col>
      <v-col class="col-6" v-if="RoleName != 'other'">
        <v-text-field
          v-model="roleModel.role_name"
          :error-messages="NameErrors"
          label="Name"
          disabled
          required
          color="blue darken-3"
          @input="$v.roleModel.role_name.$touch()"
          @blur="$v.roleModel.role_name.$touch()"
        >
          <template v-slot:label>
            <div>Name <small style="color: red">*</small></div>
          </template>
        </v-text-field>
      </v-col>
      <v-col class="col-6">
        <strong>Status</strong>
        <v-radio-group v-model="roleModel.role_permission_status" row>
          <v-radio label="Active" value="Active"></v-radio>
          <v-radio label="InActive" value="InActive"></v-radio>
        </v-radio-group>
      </v-col>
      <v-row v-for="(data, ndx) in permissionList" :key="ndx">
        <h4>{{ data.name }}</h4>
        <v-col v-for="(obj, n) in data.permission" :key="n">
          <v-checkbox
            v-model="roleModel.permission_name"
            :label="obj"
            :value="obj"
          ></v-checkbox>
        </v-col>
      </v-row>
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
    roleModel: {
      role_name: { required },
    },
  },

  data: () => ({
    RoleName: "",
    roleList: ["food_supplier", "canteen_admin", "machine_filler"],
    roleModel: {
      role_name: "",
      role_permission_status: "Active",
      permission_name: [],
    },
  }),

  computed: {
    ...mapGetters(["getRoleById", "permissionList", "getroleList"]),

    NameErrors() {
      const errors = [];
      if (!this.$v.roleModel.role_name.$dirty) return errors;
      !this.$v.roleModel.role_name.required && errors.push("Name is required.");
      return errors;
    },
  },

  methods: {
    submit() {
      this.$v.$touch();
      if (!this.roleModel._id) {
        if (!this.$v.$invalid) {
          this.$store.dispatch("addRole", this.roleModel).then((res) => {
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
        this.$store.dispatch("updateRole", this.roleModel).then((res) => {
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
  watch: {
    RoleName: {
      handler: function () {
        this.roleModel.role_name = "";
        if (this.RoleName != "other") {
          this.roleModel.role_name = this.RoleName;
        }
      },
    },
  },
  destroyed() {
    this.$store.dispatch("resetRoleState");
  },

  mounted() {
    if (this.getRoleById) {
      this.roleModel = this.getRoleById;
      this.roleModel.role_permission_status = this.getRoleById.role_status;
    }
    
    var result = this.roleList.filter((o1) =>
      this.getroleList.some((o2) => o1 == o2.role_name)
    );
    if (result.length > 0) { 
      result.forEach((e) => {
        this.roleList = this.roleLis.filter(function (el) {
          return el != e;
        });
      });
    }
  },
};
</script>
