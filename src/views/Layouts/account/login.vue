<template>
  <v-card class="mx-auto" max-width="344">
    <v-card-text>
      <div class="mb-3">
        <h1><strong>WELCOME</strong></h1>
      </div>
      <div style="color: #f8932d">
        <h3>Login to your Account</h3>
      </div>
    </v-card-text>
    <v-card-text>
      <form>
        <div class="left">
          <label> Email Address</label>
        </div>
        <div class="right-inner-addon input-container">
          <i
            ><img
              src="../../../assets/logos/Icon material-email.png"
              height="11px"
          /></i>

          <input
            class="left w-100 p-2 border-radius bg-clr mt-1"
            type="text"
            placeholder="Admin@gmail.com"
            v-model="loginForm.user_email"
            v-on:keyup.enter="submit"
          />
        </div>
        <div class="invalid-feedback" v-if="$v.loginForm.user_email.$error">
          <span v-if="$v.loginForm.user_email.$error">Email is in-valid</span>
        </div>
        <!-- <v-text-field
          v-model="loginForm.user_email"
          :error-messages="user_emailErrors"
          class="pt-0"
          placeholder="  Admin@gmail.com"
          required
          color="blue darken-3"
          @input="$v.loginForm.user_email.$touch()"
          @blur="$v.loginForm.user_email.$touch()"
        ></v-text-field> -->

        <div class="left mt-4">
          <label>Password</label>
        </div>
        <div class="right-inner-addon input-container">
          <i
            ><img
              @click="showPassword = !showPassword"
              src="../../../assets/logos/Icon ionic-ios-lock.svg"
              height="15px"
          /></i>
          <input
            v-model="loginForm.user_password"
            class="left w-100 p-2 border-radius bg-clr mt-1"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Password"
            v-on:keyup.enter="submit"
          />
          <!-- <input class="left w-100 p-2 border-radius bg-clr mt-1" type="password" placeholder="Password" :type="showPassword ? 'text' : 'password'" v-model="loginForm.user_password" />  -->
        </div>
        <div class="invalid-feedback" v-if="$v.loginForm.user_password.$error">
          <span v-if="$v.loginForm.user_password.$error"
            >passwrod is required</span
          >
        </div>

        <!-- <v-text-field
          v-model="loginForm.user_password"
          :error-messages="user_passwordErrors"
          color="blue darken-3"
          class="pt-0"
          placeholder="  Password"
          :type="showPassword ? 'text' : 'password'"
          required
          @input="$v.loginForm.user_password.$touch()"
          @blur="$v.loginForm.user_password.$touch()"
          @click:append="showPassword = !showPassword"
        ></v-text-field> -->
        <v-btn block class="mt-5" color="main_bg_color" dark @click="submit">
          Login
        </v-btn>
        <!-- <v-btn
          block
          class="mt-4"
          color="main_bg_color"
          dark
         
        >
          Forgot Password
        </v-btn> -->
        <button
          data-v-575fd5b7=""
          type="button"
          class="mt-4 v-btn v-btn--block v-size--default"
        >
          <span
            class="v-btn__content"
            @click="redirectToForgot()"
            style="color: #8e8e8e"
          >
            Forgot Password
          </span>
        </button>
      </form>
    </v-card-text>
    <!-- <v-card-actions>
      <v-btn
        color="main_bg_color"
        block
        dark
        class="pa-5"
        @click="redirectToSignUp()"
      >
        Sign Up
      </v-btn>
    </v-card-actions> -->
  </v-card>
</template>
<script>
import { mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
import { required, maxLength, email } from "vuelidate/lib/validators";
import Swal from "sweetalert2";
export default {
  mixins: [validationMixin],

  validations: {
    loginForm: {
      user_email: { required, email },
      user_password: { required },
    },
  },

  data: () => ({
    showPassword: false,

    loginForm: {
      user_email: "",
      user_password: "",
    },
  }),

  computed: {
    ...mapGetters(["getRoutes"]),
    user_passwordErrors() {
      const errors = [];
      if (!this.$v.loginForm.user_password.$dirty) return errors;
      !this.$v.loginForm.user_password.required &&
        errors.push("Password is required.");
      return errors;
    },
    user_emailErrors() {
      const errors = [];
      if (!this.$v.loginForm.user_email.$dirty) return errors;
      !this.$v.loginForm.user_email.email &&
        errors.push("Must be valid e-mail");
      !this.$v.loginForm.user_email.required &&
        errors.push("E-mail is required");
      return errors;
    },
  },

  methods: {
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.$store.dispatch("signInUser", this.loginForm).then((response) => {
          if (response.success) {
            var routes = this.getRoutes;
            this.$router.push({ name: "dashboard" });
          } else if (response.errors) {
            Swal.fire({
              title: "",
              text: response.errors[0].msg,
              icon: "error",
            });
            this.loginForm.user_password = "";
          } else {
            Swal.fire({
              title: "Error!",
              text:
                response.message == "user name or password is wrong"
                  ? "The username or password is incorrect"
                  : response.message,
              icon: "error",
            });
            this.loginForm.user_password = "";
          }
        });
      }
    },

    redirectToSignUp() {
      this.$router.push({ name: "signup" });
    },
    redirectToForgot() {
      this.$router.push({ name: "forgot" });
    },

    clear() {
      this.$v.$reset();
      this.loginForm = {
        userName: "jams",
        password: "123456",
      };
    },
  },
};
</script>
<style scoped>
.v-sheet.v-card:not(.v-sheet--outlined) {
  box-shadow: none;
}
.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
  border: none !important;
}
.v-text-field input {
  padding-left: 10px !important;
}
.border-radius {
  border-radius: 6px;
}
.bg-clr {
  background-color: #ecf5f7;
  color: #8e8e8e !important;
}
@media (min-width: 1200px) {
  h1,
  .h1 {
    font-size: 1.9rem;
    font-weight: 800;
  }
}
@media (min-width: 1200px) {
  h3,
  .h3 {
    font-size: 1.6rem;
  }
}
.v-btn {
  text-transform: none;
}
input:focus-visible {
  outline: none;
}
.right-inner-addon {
  position: relative;
  padding-bottom: 20px;
}
.right-inner-addon input {
  padding-right: 35px !important;
}
.right-inner-addon i {
  position: absolute;
  right: 0px;
  padding: 12px 12px;
  pointer-events: none;
}
.left label {
  color: #4b4b4b;
  opacity: 1;
  letter-spacing: 0.66px;
  font-size: 17px !important;
}
</style>
