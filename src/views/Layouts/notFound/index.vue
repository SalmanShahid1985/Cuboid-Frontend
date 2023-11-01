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
                    404! Page Not Found!
                  </h1>
                </div>
                <div class="text-center large-text">
                  Unfortunately we could not find the page that you were looking for. <br />
                  <a :href="baseUrl">Take me back to home</a>
                </div>
              </div>
            </div>
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
export default {
  data: () => ({
    baseUrl: process.env.VUE_APP_PORTAL_URL
  }),
mounted() {
    this.baseUrl = process.env.VUE_APP_PORTAL_URL;
  },
};
</script>
<style>
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

.large-text {
  font-size: large;
}

.extra-extra-extra-large-text {
  font-size: xxx-large;
}

.center-horizontally {
  display:flex; 
  flex-direction: row; 
  justify-content: center;
}
</style>
