<template>
  <v-card class="mx-auto" max-width="344">
    <v-card-text>
      <div class="mb-3" style="color: #f8932d">
        <h1>Reset Password</h1>
      </div>
      <div>
        <h3>Enter Your New Password</h3>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text>
      <form>
        <div class="right-inner-addon input-container">
            <i
            ><img
                    src="../../../assets/logos/Icon ionic-ios-lock.svg"
                    height="15px"
            /></i>
            <v-text-field
                v-model="loginForm.user_password"
                :error-messages="passwordErrors"
                label="Password"
                required
                color="blue darken-3"
                type="password"
                @input="$v.loginForm.user_password.$touch()"
                @blur="$v.loginForm.user_password.$touch()"
                v-on:keypress.enter.prevent="submit"
                ></v-text-field>             
        </div>
        <v-btn block class="mt-4" color="main_bg_color" dark @click="submit">
          Continue
        </v-btn>
      </form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <button data-v-575fd5b7="" type="button" class="mb-2 v-btn v-btn--block v-size--default "><span class="v-btn__content"  @click="redirectToLogin()" style="color:#8E8E8E"> Back to Login </span></button>
    </v-card-actions>
  </v-card>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import Swal from "sweetalert2";
import JwtService from "../../../store/jwt";

export default {
  mixins: [validationMixin],

  validations: {
    loginForm: {
      user_password: { required },
    },
  },

  data: () => ({
    loginForm: {
      user_password: "",
    },
  }),

  computed: {
    passwordErrors() {
      const errors = [];
      if (!this.$v.loginForm.user_password.$dirty) return errors;
      !this.$v.loginForm.user_password.required &&
        errors.push("Password is required.");
      return errors;
    },
  },

  methods: {
    submit() {
      //   this.$v.$touch();
      if (!this.$v.$invalid) {
        var vm = this;
        if (window.location.search.replace("?token=", "")) {
          this.loginForm.token = window.location.search.replace("?token=", "");
        } else {
          this.loginForm.token = JwtService.getToken();
        }
        this.$store
          .dispatch("resetPassword", this.loginForm)
          .then((response) => {
            if (response.success) {
              Swal.fire({
                title: "Success!",
                text: response.message,
                icon: "success",
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: response.message,
                icon: "error",
              });
            }
          });
      }
    },

    redirectToLogin() {
      this.$router.push({ name: "login" });
    },
  },
};
</script>
