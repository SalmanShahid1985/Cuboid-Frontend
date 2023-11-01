<template>
  <div>
    <div class="d-flex justify-space-around align-center mb-2 mt-3">
      <v-card-text class="pl-0">
        <div class="pageHeadingIcon">
          <div>
            <img
              src="../../../assets/logos/role-bg.svg"
              style="margin-top: -10px"
            />
          </div>
          <!-- <div class="pageName">
            <svg class="pageNameSvg useraddIcon">
              <use xlink:href="#userplusIcon"></use>
            </svg>
          </div> -->
          <h2>User Roles & Permissions</h2>
        </div>
      </v-card-text>
    </div>
    <v-row class="mb-3">
      <v-col class="col-4">
        <div class="right-inner-addon input-container pb-0 w-75">
          <input
            type="text"
            class="form-control login-field"
            placeholder="Role Name*"
            disabled
            v-model="roleModel.role_name"
          />
        </div>
      </v-col>
      <v-col class="col-8 d-flex">
        <label class="regularFont login-font mt-2 mr-5 pr-3"
          >Status <small style="color: red">*</small></label
        >
        <v-radio-group disabled v-model="roleModel.role_permission_status" row>
          <v-radio class="pr-3" label="Active" value="Active"></v-radio>
          <v-radio class="pr-3" label="InActive" value="InActive"></v-radio>
        </v-radio-group>
      </v-col>
    </v-row>
    <div class="d-flex mb-2 mt-3">
      <div class="pageHeadingIcon">
        <h2 style="color: #f8932d">Select Permissions</h2>
      </div>
    </div>
    <div v-for="(data, index) in permissionList" :key="index">
      <div class="d-flex mb-2 mt-3 mb-3">
        <div class="pageHeadingIcon">
          <!-- <div class="pageName">
            <svg class="pageNameSvg userManagmentIcon">
              <use xlink:href="#userManagment"></use>
            </svg>
          </div> -->
          <h5 class="text-capitalize" style="font-size: 22px; font-weight: 400">{{ removeLines(data.name) }}</h5>
        </div>
      </div>
      <v-col class="col-12 d-flex mb-5 pb-5 pl-0">
        <!-- <v-btn class="mr-5 per-btn" @click="submit"> Product Create </v-btn> -->
        <v-btn
          class="mr-5 text-capitalize"
          :class="isExist(obj) ? 'per-btn' : 'per-btn-gray'"
          v-for="(obj, ndx) in data.permission"
          :key="ndx"
        >
          {{ removeLines(obj) }}
        </v-btn>
      </v-col>
    </div>
  </div>
</template>
<script>
import addPermission from "../../../components/users/addPermission.vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
export default {
  components: {
    addPermission,
  },
  data() {
    return {
      roleModel: {
        permission_name: [],
        role_permission_status: "Active",
        role_name: null,
      },
    };
  },
  watch: {
    currentPage: {
      handler: function () {
        this.fetchData();
      },
    },
  },
  methods: {
    removeLines(obj) {
      return obj.replaceAll("-", " ").replaceAll("_", " ").toLowerCase()
    },
    isExist(obj) {
      var esixt = false;
      this.roleModel.permission_name.forEach((e) => {
        if (e == obj) {
          esixt = true;
        }
      });
      return esixt;
    },
    addPermsision(obj) {
      var esixt = false;
      this.roleModel.permission_name.forEach((e) => {
        if (e == obj) {
          esixt = true;
        }
      });
      if (esixt) {
        this.roleModel.permission_name = this.roleModel.permission_name.filter(
          (x) => {
            return x != obj;
          }
        );
      } else {
        this.roleModel.permission_name.push(obj);
      }
    },
    async fetchData() {
      this.isfetching = true;
      this.search = this.search == null ? "" : this.search;
      await this.$store
        .dispatch("getPermissionList")
        .then((response) => {
          if (response) {
            this.isfetching = false;
            this.items = response.Data;
          }
        })
        .catch((ex) => {
          this.isfetching = false;
        });
    },
    async submit() {
      if (!this.roleModel._id) {
        await this.$store
          .dispatch("addRole", this.roleModel)
          .then((response) => {
            if (response.success) {
              this.$router.push({ name: "role" });
            }
            if (response.errors.length > 0) {
              Swal.fire({
                title: "Error!",
                text: response.errors[0].msg,
                icon: "error",
              });
            }
          })
          .catch((ex) => {
            this.isfetching = false;
          });
      } else {
        await this.$store
          .dispatch("updateRole", this.roleModel)
          .then((response) => {
            if (response.success) {
              this.$router.push({ name: "role" });
            }
            if (response.errors.length > 0) {
              Swal.fire({
                title: "Error!",
                text: response.errors[0].msg,
                icon: "error",
              });
            }
          })
          .catch((ex) => {
            this.isfetching = false;
          });
      }
    },

    permissionName(obj) {
      if (obj.permission_names) {
        return obj.permission_names.toString().replaceAll(",", " ");
      } else {
        return null;
      }
    },
  },
  mounted() {
    this.fetchData();
    if (this.getRoleById) {
      this.roleModel = this.getRoleById;
      this.roleModel.role_permission_status = this.getRoleById.role_status;
    }
  },
  computed: {
    ...mapGetters(["permissionList", "getRoleById"]),
  },
};
</script>
<style scoped>
.login-field {
  border-radius: 8px;
  background-color: #ecf5f7;
  border: none;
}
.form-control {
  padding: 0.54rem 0.75rem;
}
.v-input--selection-controls {
  margin-top: 8px !important;
  padding-top: 0px !important;
}
label {
  font-size: 19px;
}
.pageName {
  width: 42px !important;
  height: 39px !important;
}
.btnn{
  height: 51px !important;
  width: 197px !important;
  font-size: 18px !important;
}
</style>
