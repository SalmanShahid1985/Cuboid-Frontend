<template>
  <div>
    <span style="display: none;"><v-google-translate /></span>
      <v-app id="inspire">
        <router-view></router-view>
      </v-app>
  </div>
</template>
<script>
export default {
  destroyed() {
    this.$store.dispatch("logOut").then(() => {
      this.$router.push({ name: "login" });
    });
  },
};
</script>
<style>
.main_color {
  color: #f8932d !important;
}
.main_bg_color {
  background-color: #f8932d !important;
}
.disabled_button_color {
  background-color:#aaa9a9;
  color: #ffffff;
}
.edit_btn {
  cursor: pointer !important;
  color: #757575 !important;
}
.edit_btn:hover {
  color: #fb8c00 !important;
}
.del_btn {
  cursor: pointer !important;
  color: #757575 !important;
}
.del_btn:hover {
  color: #bf360c !important;
}

@font-face {
  font-family: "Bebas Neue Pro";
  src: url("./assets/font/BebasNeuePro-BoldItalic.eot");
  src: local("Bebas Neue Pro Bold Italic"), local("BebasNeuePro-BoldItalic"),
    url("./assets/font/BebasNeuePro-BoldItalic.eot?#iefix")
      format("embedded-opentype"),
    url("./assets/font/BebasNeuePro-BoldItalic.woff2") format("woff2"),
    url("./assets/font/BebasNeuePro-BoldItalic.woff") format("woff"),
    url("./assets/font/BebasNeuePro-BoldItalic.ttf") format("truetype");
  font-weight: bold;
  font-style: italic;
}

@font-face {
  font-family: "Bebas Neue Pro";
  src: url("./assets/font/BebasNeuePro-Bold.eot");
  src: local("Bebas Neue Pro Bold"), local("BebasNeuePro-Bold"),
    url("./assets/font/BebasNeuePro-Bold.eot?#iefix")
      format("embedded-opentype"),
    url("./assets/font/BebasNeuePro-Bold.woff2") format("woff2"),
    url("./assets/font/BebasNeuePro-Bold.woff") format("woff"),
    url("./assets/font/BebasNeuePro-Bold.ttf") format("truetype");
  font-weight: bold;
  font-style: normal;
}

@font-face {
  font-family: "Bebas Neue Pro";
  src: url("./assets/font/BebasNeuePro-Italic.eot");
  src: local("Bebas Neue Pro Italic"), local("BebasNeuePro-Italic"),
    url("./assets/font/BebasNeuePro-Italic.eot?#iefix")
      format("embedded-opentype"),
    url("./assets/font/BebasNeuePro-Italic.woff2") format("woff2"),
    url("./assets/font/BebasNeuePro-Italic.woff") format("woff"),
    url("./assets/font/BebasNeuePro-Italic.ttf") format("truetype");
  font-weight: normal;
  font-style: italic;
}

@font-face {
  font-family: "Bebas Neue Pro";
  src: url("./assets/font/BebasNeuePro-Regular.eot");
  src: local("Bebas Neue Pro Regular"), local("BebasNeuePro-Regular"),
    url("./assets/font/BebasNeuePro-Regular.eot?#iefix")
      format("embedded-opentype"),
    url("./assets/font/BebasNeuePro-Regular.woff2") format("woff2"),
    url("./assets/font/BebasNeuePro-Regular.woff") format("woff"),
    url("./assets/font/BebasNeuePro-Regular.ttf") format("truetype");
  font-weight: normal;
  font-style: normal;
}
</style>
