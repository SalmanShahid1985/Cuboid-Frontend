<template>
  <div>
    <div class="d-flex justify-space-around align-center mb-2 mt-3">
      <v-card-text>
        <div class="pageHeadingIcon">
          <div class="pageName">
            <svg class="pageNameSvg userManagmentIcon">
              <use xlink:href="#orderManagment"></use>
            </svg>
          </div>
          <h2>Settings</h2>
        </div>
      </v-card-text>
    </div>
    <div class="tableWrapper">
      <table class="row mx-0" id="myTable">
        <thead class="px-0">
          <tr class="tableHead">
            <th class="name" style="width: 50%">Canteen</th>
            <th class="name" style="width: 40%; border:none;">Payment Method</th>
          </tr>
        </thead>
        <tbody class="px-0">
          <div class="my-7" v-show="table_loader">
            <v-progress-linear
              indeterminate
              color="orange darken-1"
            ></v-progress-linear>
          </div>
          <div>
            <tr
              class="px-0 tabledata"
              v-for="(data, index) in getcanteenList"
              :key="index"
            >
              <td class="namedata" style="width: 50%">
                {{ data.canteen_name }}
              </td>
              <td class="namedata" style="width: 40%">
                <div class="right-inner-addon input-container pb-0">
                  <i style="margin-top: -7px"
                    ><img
                      src="../../../assets/logos/bxs-down-arrow.svg"
                      height="7px"
                  /></i>
                  <select
                    @change="setPaymentMethod(data)"
                    v-model="data.payment_method"
                    class="form-control login-field"
                  >
                    <option>Vipps and Stripe</option>
                    <option>Vipps</option>
                    <option>Stripe</option>
                    <option>Subsidy Only</option>
                  </select>
                </div>
              </td>
            </tr>
          </div>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
export default {
    data() {
        return {
          table_loader: true,  
        }
    },
  mounted() {
    this.fetchData();
  },
  methods: {
    setPaymentMethod(obj) {
      var canteenModel = {
        canteen_name: obj.canteen_name,
        canteen_location: obj.canteen_location,
        canteen_status: obj.canteen_status,
        payment_method: obj.payment_method,
        canteen_admin_id: obj.canteen_admin_id._id,
        machine_filler_id: obj.machine_filler_id._id,
        _id : obj._id,
        canteen_company_ids: obj.canteen_company_ids.map((x) => {
          return x._id;
        }),
      };
      this.$store.dispatch("updateCanteen", canteenModel).then((res) => {
        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Payment Method Changed Successfully",
          });
          this.fetchData();
        }
        else {
            Swal.fire({
                icon: "error",
                title: 'Error!',
                text: res.data.message
            });
            this.fetchData();
        }
      }).catch(err => {
        console.log(err)
      });
      this.fetchData();
    },
    async fetchData() {
        this.table_loader = true
      await this.$store.dispatch("getcanteensList", {
        pagination: true,
      }).then(res => {
        this.table_loader = false
      }).catch(err => {
        console.log(err)
        this.table_loader = false
    })
    },
  },
  computed: {
    ...mapGetters(["getcanteenList", "getcanteenListTotal"]),
  },
};
</script>

<style scoped></style>
