<template>
  <v-card class="mx-auto" max-width="344">
    <v-card-text>
      <div class="mb-3" style="color: #f8932d">
        <h1>Forgot Password</h1>
      </div>
      <div>
        <h3>Enter Your Email Address</h3>
      </div>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-text>
      <form>
        <v-text-field
          v-model="forgotForm.user_email"
          :error-messages="emailErrors"
          label="E-mail Address"
          required
          color="blue darken-3"
          @input="$v.forgotForm.user_email.$touch()"
          @blur="$v.forgotForm.user_email.$touch()"
          v-on:keypress.enter.prevent="submit"
        ></v-text-field>

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
import { required, maxLength, email } from "vuelidate/lib/validators";
import Swal from "sweetalert2";
export default {
  mixins: [validationMixin],

  validations: {
    forgotForm: {
      user_email: { required, email },
    },
  },

  data: () => ({
    forgotForm: {
      user_email: "",
    },
  }),

  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.forgotForm.user_email.$dirty) return errors;
      !this.$v.forgotForm.user_email.email && errors.push("Must be valid e-mail");
      !this.$v.forgotForm.user_email.required && errors.push("E-mail is required");
      return errors;
    },
  },

  methods: {
    submit() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        this.$store.dispatch("forgotUser", this.forgotForm).then((response) => {
          if (response.error) {
            Swal.fire({
              title: "",
              text: response.errors[0].msg,
              icon: "error",
            });
          } else if (response) {
            Swal.fire({
              title: "",
              text: response.message,
              icon: "success",
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: "SomeThing Went Wrong!",
              icon: "error",
            });
          }
          // this.clear();

          // this.$router.push({ name: "userList" });
        });
      }
    },

    redirectToLogin() {
      this.$router.push({ name: "login" });
    },
  },
};
</script>
