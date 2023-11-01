<template>
  <form>
    <v-row>

  <v-col class="col-6">
        <v-select
          :items="getcanteenList"
          item-value="_id"
          item-text="canteen_name"
          v-model="wasteModel.wastage_canteen_id"
          label="Canteen"
           @change="onChangeCanteen"
          required
          color="blue darken-3"
          @input="$v.wasteModel.wastage_canteen_id"
          @blur="$v.wasteModel.wastage_canteen_id"
        ></v-select>
      </v-col>
       <v-col class="col-6">
        <v-select


       :items="getmachineList"
          :clearable="true"
          item-value="_id"
          item-text="machine_name"
          v-model="wasteModel.wastage_machine_id"
        
          @change="onChangeMachine"
          label="Machine"
          color="blue darken-3"
          required
          @input="$v.wasteModel.wastage_machine_id"
          @blur="$v.wasteModel.wastage_machine_id"
          
        ></v-select>

      </v-col>
      <v-col class="col-6">
        <v-select
          :items="getproductList"
          item-value="_id"
          item-text="product_name"
          @change="onChangeProduct"
          v-model="wasteModel.wastage_product_id"
        
          label="Product"
          required
          color="blue darken-3"
          @input="$v.wasteModel.wastage_product_id"
          @blur="$v.wasteModel.wastage_product_id"
        ></v-select>
      </v-col>

     


      <v-col class="col-6">
        <v-text-field
          v-model="wasteModel.wastage_product_quantity"
          :error-messages="quantityErrors"
          label="Quantity"
          required
          type="number"
          color="blue darken-3" 
          @input="$v.wasteModel.wastage_product_quantity"
          @blur="$v.wasteModel.wastage_product_quantity"
        ></v-text-field>
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
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

import Swal from "sweetalert2";
export default {
  mixins: [validationMixin],
  validations: {
    wasteModel: {
       wastage_product_quantity :{ required },
      wastage_product_id: { required },
      wastage_canteen_id:{required},
     wastage_machine_id:{required}, 
    },


  },

  data: () => ({
    wasteModel: {
      wastage_product_quantity:"",
      wastage_product_id:"", 
      wastage_canteen_id:"",
      wastage_machine_id:"",

    },
  }),
  computed: {
    ...mapGetters(["getproductList","getmachineList","getcanteenList", "getwasteById"]),

    quantityErrors() {
      const errors = [];
      if (!this.$v.wasteModel.wastage_product_quantity.$dirty) return errors;
      !this.$v.wasteModel.wastage_product_quantity.required && errors.push("quantity is required.");
      return errors;
    },
    productErrors() {
      const errors = [];
      if (!this.$v.wasteModel.wastage_product_id.$dirty) return errors;
      !this.$v.wasteModel.wastage_product_id.required &&
        errors.push("product is required.");
      return errors;
    }, 
    machineErrors() {
      const errors = [];
      if (!this.$v.wasteModel.wastage_machine_id.$dirty) return errors;
      !this.$v.wasteModel.wastage_machine_id.required &&
        errors.push("Machine is required.");
      return errors;
    }, 
    canteenErrors() {
      const errors = [];
      if (!this.$v.wasteModel.wastage_canteen_id.$dirty) return errors;
      !this.$v.wasteModel.wastage_canteen_id.required &&
        errors.push("Canteen is required.");
      return errors;
    }, 
  },

  methods: {
    async fetchData() {
      this.items = this.getproductList;
      await this.$store.dispatch("getcanteensList");
      await this.$store.dispatch("productsList",{pagination:true});
      await this.$store.dispatch("machinesList", null);
      await this.$store.dispatch("wasteList").then((res) => {
        if (res) {
         
          this.items = this.getwasteList;
        }
      });
      this.isfetching = true;
    },

         async onChangeCanteen(obj) {
      if (obj) {
        await this.$store.dispatch("machinesList", obj)
          .then((response) => { 
             this.getmachineList;
          }) 
        await this.$store
          .dispatch("wasteList", "canteen/" + obj)
          .then((res) => {
            if (res) {
              this.items = this.getwasteList;
            }
          });
      }else{
      await  this.fetchData()
      }
    },
    async onChangeMachine(obj) {
      if (obj) {

        await this.$store.dispatch("getProductByMachineId",obj)
        await this.$store
          .dispatch("wasteList", "machine/" + obj)
          .then((res) => {
            if (res) {
              this.items = this.getwasteList;
            }
          });
      }else{
      await  this.fetchData()
      }
    },
    async onChangeProduct(obj) {
      if (obj) {
        await this.$store
          .dispatch("wasteList", "product/" + obj)
          .then((res) => {
            if (res) {
              this.items = this.getwasteList;
            }
          });
      }else{
      await  this.fetchData()
      }
    


    },
    submit() { 
      this.$v.$touch();
       if(!this.$v.$invalid){
      if (this.wasteModel._id == null) {
        this.$store.dispatch("addwaste", this.wasteModel).then((res) => {

          if (res.success) {
            Swal.fire({
              title: "",
              text: res.message,
              icon: "success",
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: res.message,
              icon: "error",
            });
          }
        });
      } else {
        this.$store.dispatch("updatewaste", this.wasteModel).then((res) => {
          if (res.success) {
            Swal.fire({
              title: "",
              text: res.message,
              icon: "success",
            });
          } else {
            Swal.fire({
              title: "Error!",
              text: res.message,
              icon: "error",
            });
          }
        });
      }
      this.$emit("closeIt");}
    },
    clear() {
      this.$v.$reset();
      (this.wasteModel = {
        quantity: "", 
      }),
        this.$emit("closeIt");
    },
  },
  mounted() {
    this.fetchData();
   ;
    if (this.getwasteById) {
      this.wasteModel = this.getwasteById;
    }
  },
  destroyed() {
    //
    this.$store.dispatch("resetwasteState");
  },
};
</script>