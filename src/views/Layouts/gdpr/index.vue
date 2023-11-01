<template>
    <v-main>
      <v-row class="ma-0" style="min-height: 100% !important">
        <v-col class="col-4 pa-0 mt-5">
          <v-row class="ma-10">
           <div class="center-horizontally">
            <img
                src="../../../assets/logos/Frigg_Logo_F_Tekst_Vertikal_gul.888942ba.svg" 
                alt="Cuboid"
                width="auto"
                height="150px"
              />
           </div>
          </v-row>
          <v-row class="ma-10">
            <div class="center-horizontally">
              <div>
                <div class="text-center">
                  <h1 class="extra-extra-extra-large-text">
                   GDPR Acceptance Form
                  </h1>
                </div>
              </div>
            </div>

            <v-card-text>
              <form>
                <div class="left">
                  <label>Full Name</label>
                </div>
                <div class="right-inner-addon input-container">
                  <input
                    class="left w-100 p-2 border-radius bg-clr mt-1"
                    type="text"
                    placeholder="Full Name"
                    v-model="fullName"
                    disabled
                  />
                </div>
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
                    v-model="emailAddress"
                    disabled
                  />
                </div>
                <div class="left">
                  <label>Password</label>
                </div>
                <div class="right-inner-addon input-container">
                  <i
                  ><img
                    src="../../../assets/logos/Icon ionic-ios-lock.svg"
                    height="15px"
                /></i>
                  <input
                    v-model="gdprForm.user_password"
                    class="left w-100 p-2 border-radius bg-clr mt-1"
                    placeholder="Password"
                    type="password"
                    v-on:keyup.enter="submit"
                  />
                </div>
                <div class="right-inner-addon input-container">
                  <input
                    type="checkbox"
                    class="left w-10 p-2 border-radius bg-clr mt-1 check"
                    v-on:click="acceptedGDPRClick()"
                  /><label class="right w-90 ml-2"><span v-on:click="showGDPRTerms()" class="clickable">I accept the GDPR Terms and Conditions*</span></label>
                </div>
                <v-btn v-if="acceptedGDPR" block class="mt-5" color="main_bg_color" dark @click="submit">
                  Submit
                </v-btn>
                <v-btn v-else block class="mt-5" disabled>
                  Submit
                </v-btn>
              </form>
            </v-card-text>
          </v-row>
        </v-col>
        <v-col class="col-8 pa-0">
          <img
            src="../../../assets/banner/frigg.jpg"
            class="banner"
            alt="Symphony"
          />
        </v-col>
      </v-row>
    </v-main>
</template>
<script>
import Swal from "sweetalert2";
export default {
  data: () => ({
    acceptedGDPR: false,
    fullName: "",
    emailAddress: "",
    gdprForm: {
      user_id: "",
      user_password: "",
      accepted: false,
      token: ""
    }
  }),
  async mounted() {
    const userId = this.$route.params.userId;
    const gdprToken = this.$route.params.gdprToken;
    console.log(userId, gdprToken);
    if(userId && gdprToken) {
      const response = await this.$store.dispatch("getUserDetailsById", {userId, gdprToken});
      this.gdprForm.user_id = userId;
      this.gdprForm.token = gdprToken;
      console.log(response);
      if(response.success) {
        const gdprAccepted = response.data.gdpr_accepted;
        const gdprAcceptedDate = response.data.gdpr_accepted_date;
        if(gdprAccepted && gdprAcceptedDate) {
          Swal.fire({
            title: "GDPR Accepted",
            text: "You have already accepted the GDPR Terms and Conditions",
            icon: "success",
            confirmButtonText: "OK"
          }).then((result) => {
              console.log('result', result);
              if (result.isConfirmed) {
                this.$router.push({
                  name: "login",
                  params: {
                  },
                });
              }
            });
        } else {
          this.fullName = response.data.full_name;
          this.emailAddress = response.data.email;
        }
        
      } else {
        Swal.fire({
          title: "Invalid Link Provided!",
          text:'The link is invalid as it does not contain the required user id and/or the token. Please use the correct link in order to proceed.',
          icon: "error",
        });
      }
    } else {
      Swal.fire({
      title: "Invalid Link Provided!",
      text:'The link is invalid as it does not contain the required user id and/or the token. Please use the correct link in order to proceed.',
      icon: "error",
      });
    }

  },
  methods: {
    showGDPRTerms(){
      Swal.fire({
                title: "We process the following personal data about you:",
                html:`
                <div>
                  <ul style="text-align: left;">
                    <li>Email and Name, for the purpose of managing the user relationship. This involves creating a user and communicating with the user.</li>
                    <li>Creation so that users can use the system.</li>
                    <li>Communication, such as welcome messages and other relevant messages.</li>
                  </ul>
                  <p style="text-align:left;">
                    The data is stored in our systems and is not shared with third parties.
                    User lists are revised at least once per year, to ensure that we do not become redundant
                    sitting with personal data. If you wish to delete your data, you can contact the system supplier at
                    <a href="mailto:supplier.support@friggkantine.no">supplier.support@friggkantine.no</a>.
                  </p>
                </div>  
                `,
                icon: "info",
              });
    },
    acceptedGDPRClick() {
      this.acceptedGDPR = !this.acceptedGDPR;
    },
    submit() {
      // this.$v.$touch();
      // if (!this.$v.$invalid) {
        this.$store.dispatch("gdprAcceptance", this.gdprForm).then((response) => {
          if (response.success) {
            Swal.fire({
            title: "GDPR Accepted!",
            text:'You have successfully accepted the GDPR Terms and Conditions. You can now proceed to login.',
            icon: "success",
            }).then((result) => {
              console.log('result', result);
              if (result.isConfirmed) {
                this.$router.push({
                  name: "login",
                  params: {
                  },
                });
              }
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: response.message,
              icon: "error",
            });
          }
        });
      // }
    },
    redirectToForgot() {
      this.$router.push("/forgot-password");
    },
  },
};
</script>
<style scoped>
.center-horizontally{
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.check {
  cursor: pointer;
}
.clickable {
  cursor: pointer;
  color:cornflowerblue;
  text-decoration: underline;
}
.banner {
  min-width: 100% !important;
  min-height: 100% !important;
}
.father {
  position: relative;
  text-align: center;
}

.child {
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

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
