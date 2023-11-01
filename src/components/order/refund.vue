<template>
  <v-row>
    <h5>
      <strong>Order ID # {{ getOrderById._id }}</strong>
    </h5>
    <v-col class="col-12">
      <label class="regularFont login-font" style=""
        >Amount <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <input
          v-model="amount"
          type="number"
          class="form-control login-field"
          placeholder="30"
        />
      </div>
    </v-col>
    <v-col class="col-12">
      <label class="regularFont login-font" style=""
        >Reason <small style="color: red">*</small></label
      >
      <div class="right-inner-addon input-container pb-0">
        <textarea
          v-model="reason"
          rows="3"
          class="form-control login-field"
          placeholder="Message"
        ></textarea>
      </div>
    </v-col>

    <v-col class="col-12 d-flex justify-center">
      <v-btn class="modal-btn w-50" dark color="main_bg_color" @click="submit">
        Refund
      </v-btn>
    </v-col>
  </v-row>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, maxLength, email, sameAs } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

import Swal from "sweetalert2";
export default {
  mixins: [validationMixin],

  data: () => ({
    amount: 0,
    reason: null,
  }),

  computed: {
    ...mapGetters(["getOrderById"]),
  },

  methods: {
    submit() {
      this.$store
        .dispatch("addrefund", {
          orderId: this.getOrderById._id,
          reason: this.reason,
          amount: parseFloat(this.amount),
        })
        .then((res) => {
          if (res.success) {
            Swal.fire({
              title: "",
              text: res.message,
              icon: "success",
            });
            this.$emit("closeIt");
          }
          else if (res.success == false) {
             Swal.fire({
              title: "Error!",
              text: res.message,
              icon: "error",
            });
          }
          else {
            Swal.fire({
              title: "Error!",
              text: res.errors[0].msg,
              icon: "error",
            });
          }
        });
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
    if (this.getOrderById) {
      this.amount = this.getOrderById.total_price;
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