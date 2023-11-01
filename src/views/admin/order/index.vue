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
          <h2>Order Management</h2>
        </div>
      </v-card-text>
       <div class="role_dropdown_user pr-10 pb-7">
        <div>
          <label class="regularFont login-font" style=""
            >Select Company <small style="color: red">*</small></label
          >
          <div class="right-inner-addon input-container pb-0">
            <i><img src="../../../assets/logos/bxs-down-arrow.svg" height="7px" /></i>
            <select @change="fetchData()" v-model="filter" class="form-control login-field">
              <option value="">All</option>
              <option  v-for="item,index in getCompanyList" :key="index" :value="item._id"> {{item.user_name}}  </option>
            </select>
          </div>
        </div>
      </div>
    </div>
    <div class="tableWrapper">
      <table class="row mx-0" id="myTable">
        <thead class="px-0">
          <tr class="tableHead">
            <th class="name" style="width: 12%">Order ID #</th>
            <th class="email" style="width: 15%">Date &amp; Time</th>
            <th class="email normal-word-break" style="width: 15%">Amount Charged</th>
            <th class="status" style="width: 15%">Delivery status</th>
            <th class="status" style="width: 15%">Payment Status</th>
            <th class="status" style="width: 15%">Payment Method</th>
            <th class="status" style="width: 15%">Company</th>
            <th class="action" style="width: 13%">Action</th>
          </tr>
        </thead>
        <tbody class="px-0 notranslate">
          <tr v-for="(d, i) in getOrderList" :key="i" class="px-0 tabledata">
            <td class="namedata" style="width: 12%">{{ d._id }}</td>
            <td class="emaildata normal-word-break" style="width: 15%">
              {{ dateConvert(d.createdAt) }}
            </td>
            <td class="emaildata normal-word-break  text-capitalize" style="width: 15%">
              {{ amountCharged(d) }}
            </td>
            <td class="statusdata" style="width: 15%">
              <button
                class="btnActive text-capitalize"
                :class="
                  d.order_status == 'pending'
                    ? 'yellow'
                    : d.order_status == 'Canceled'
                    ? 'grey'
                    : 'green'
                "
              >
                {{ d.order_status.replace(/_/g,' ').toLowerCase() }}
              </button>
            </td>
            <td class="statusdata text-capitalize" style="width: 15%">
              {{ d.payment_status.toLowerCase() }}
            </td>
            <td class="statusdata text-capitalize" style="width: 15%">
              {{ d.payment_method }}
            </td>
            <td class="statusdata text-capitalize" style="width: 15%">
              {{ d.company && d.company.user_name.toLowerCase().replace(/_/g,' ') || 'N/A, Guest User' }}
            </td>
            <td class="actiondata" style="width: 13%">
              <img
                src="../../../assets/logos/Icon-ionic-ios-eye.svg"
                alt="eye"
                width="18px"
                height="18px"
                @click="viewOrderSummary(d)"
                style="cursor: pointer"
              />
              <span
                v-if="d.payment_status == 'SALE'"
                @click="viewRefund(d)"
                style="cursor: pointer"
              >
                / refund
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagiNationWrapper notranslate">
      <p v-if="getOrderListTotal">
        Showing {{ currentPage }}-{{ getOrderList.length }} of
        {{ getOrderListTotal }} results
      </p>
      <p v-else>Showing 0-0 of 0 results</p>

      <!-- Pagination Bar at table bottom  -->
      <ul class="pagiNation notranslate">
        <li
          v-if="currentPage > 1"
          @click="updateCurrentPage(currentPage - 1)"
          class="pagiNation-item"
        >
          <a class="page-link">
            <svg class="svgIconLeft">
              <use xlink:href="#leftIcon"></use>
            </svg>
          </a>
        </li>

        <li
          v-if="currentPage == maxPages && currentPage > 2"
          @click="updateCurrentPage(currentPage - 2)"
          class="pagiNation-item"
        >
          <span class="page-link"> {{ currentPage - 2 }}</span>
        </li>
        <li
          v-if="currentPage > 1"
          @click="updateCurrentPage(currentPage - 1)"
          class="pagiNation-item"
        >
          <span class="page-link"> {{ currentPage - 1 }}</span>
        </li>

        <li @click="updateCurrentPage(currentPage)" class="pagiNation-item">
          <span class="page-link activepage"> {{ currentPage }}</span>
        </li>
        <li
          v-if="currentPage + 1 <= maxPages"
          @click="updateCurrentPage(currentPage + 1)"
          class="pagiNation-item"
        >
          <span class="page-link"> {{ currentPage + 1 }}</span>
        </li>
        <li
          v-if="currentPage == 1 && maxPages > 2"
          @click="updateCurrentPage(currentPage + 2)"
          class="pagiNation-item"
        >
          <span class="page-link"> {{ currentPage + 2 }}</span>
        </li>

        <li
          v-if="currentPage != maxPages"
          @click="updateCurrentPage(currentPage + 1)"
          class="pagiNation-item"
        >
          <a class="page-link">
            <svg class="svgIconNext">
              <use xlink:href="#rightIcon"></use>
            </svg>
          </a>
        </li>
      </ul>
    </div>
    <v-card-action class="pa-5">
      <v-dialog
        v-model="viewDialog"
        transition="dialog-top-transition"
        scrollable
      >
        <template v-if="viewDialog" v-slot:default="viewDialog">
          <v-card class="pl-5 pr-5">
            <v-toolbar
              class="mb-2 pt-1 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <h2>ORDER SUMMARY</h2>
              <span @click="closeModel" class="crossPossition">
                <img
                  class="mb-5"
                  src="../../../assets/logos/Icon metro-cross.svg"
                />
              </span>
            </v-toolbar>
            <v-card-text class="pt-10 text-h6">
              <table class="orderModal mr-0">
                <tr>
                  <td class="pt-3 pl-5 pr-5">Order ID #</td>
                  <td></td>
                  <td class="pt-3 pl-5 pr-5 text-orange">
                    {{ order._id }}
                  </td>
                </tr>
                <tr>
                  <td class="pt-3 pl-5 pr-5">Canteen</td>
                  <td></td>
                  <td class="pt-3 pl-5 pr-5 text-orange">
                    {{ order.canteen_id.canteen_name }}
                  </td>
                </tr>
                <tr>
                  <td class="pt-3 pl-5 pr-5">User</td>
                  <td></td>
                  <td v-if="order.user_id" class="pt-3 pl-5 pr-5 text-orange">
                    {{ order.user_id.user_name }}
                  </td>
                  <td v-else class="pt-3 pl-5 pr-5 text-orange">Guest User</td>
                </tr>
                <tr>
                  <td class="pt-3 pl-5 pr-5">Date</td>
                  <td></td>
                  <td class="pt-3 pl-5 pr-5 text-orange">
                    {{ dateConvert(order.createdAt) }}
                  </td>
                </tr>
                <tr>
                  <td class="pt-3 pl-5 pr-5">Delivery Status</td>
                  <td></td>
                  <td class="pt-3 pl-5 pr-5 text-orange text-capitalize">
                    {{ order.order_status.replace(/_/g,' ').toLowerCase() }}
                  </td>
                </tr>
                <tr>
                  <td class="pt-3 pl-5 pr-5">Payment Status</td>
                  <td></td>
                  <td class="pt-3 pl-5 pr-5 text-orange text-capitalize">
                    {{ order.payment_status.toLowerCase() }}
                  </td>
                </tr>
                <tr>
                  <td class="pt-3 pl-5 pr-5">Payment Method</td>
                  <td></td>
                  <td class="pt-3 pl-5 pr-5 text-orange text-capitalize">
                   {{ order.payment_method.toLowerCase() }} 
                  </td>
                </tr>
                <tr>
                  <td class="pt-3 pl-5 pr-5">Machines</td>
                  <td></td>
                  <td class="pt-3 pl-5 pr-5 text-orange text-capitalize">
                    {{ order.machine_id.map(x=>{return x.machine_name}).toString()}}
                  </td>
                </tr>
                <tr>
                  <td class="pl-2 pt-7"><h2>Details</h2></td>
                </tr>
                <tr class="b-border"></tr>

                <tr v-for="(data, index) in order.products" :key="index">
                  <td class="pb-3 pl-5 pr-5">
                    <span class="text-orange mr-1">
                      {{ data.product_quantity }}x
                    </span>
                    {{ data.product_name }}
                  </td>
                  <td class="pb-3 pl-5 pr-5">{{ data.product_price }} NOK</td>
                  <td class="pb-3 pl-5 pr-5 text-capitalize mw-50">
                    {{ data.deliveryStatusList.join(", ").toLowerCase() }}
                   
                  </td>
                </tr>
                <tr class="b-border"></tr>

                <tr>
                  <td class="pt-3 pl-5 pr-5">Item Total</td>
                  <td></td>
                  <td class="pt-3 pl-5 pr-5 text-orange">
                    {{ totalVal(order.products) }} NOK
                  </td>
                </tr>
                <tr>
                  <td class="pl-5 pr-5">VAT</td>
                  <td></td>
                  <td class="pl-5 pr-5 text-orange">
                    {{ order.total_VAT }} NOK
                  </td>
                </tr>
                <tr>
                  <td class="pl-5 pr-5">Discount</td>
                  <td></td>
                  <td class="pl-5 pr-5 text-orange">
                    {{ order.discount }} NOK
                  </td>
                </tr>
                <tr>
                  <td class="pl-5 pr-5">Promotion (% / NOK)</td>
                  <td></td>
                  <td class="pl-5 pr-5 text-orange">{{ order.promotion }}</td>
                </tr>

                <tr>
                  <td class="pl-5 pr-5">Subsidy</td>
                  <td></td>
                  <td class="pl-5 pr-5 text-orange">{{ order.subsidy }} NOK</td>
                </tr>
                <tr>
                  <td class="pl-5 pr-5">Credit Points</td>
                  <td></td>
                  <td class="pl-5 pr-5 text-orange">
                    {{ order.subsidy_points }} NOK
                  </td>
                </tr>
                <tr>
                  <td class="pl-5 pr-5">Subtotal</td>
                  <td></td>
                  <td class="pl-5 pr-5 text-orange">
                    {{ order.total_price }} NOK
                  </td>
                </tr>
              </table>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-action>

    <v-card-action class="pa-5">
      <v-dialog v-model="dialog" transition="dialog-top-transition" scrollable>
        <template v-if="dialog" v-slot:default="dialog">
          <v-card class="pl-5 pr-5">
            <v-toolbar
              class="mb-2 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <span
                class="text-center justify-center"
                style="font-size: 30px !important; font-weight: 800 !important"
              >
                <strong>REFUND </strong>
              </span>
              <span @click="closeModel" class="crossPossition">
                <img src="../../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>
            <v-card-text>
              <refund @closeIt="closeModel"></refund>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-action>
  </div>
</template>
<script>
import refund from "../../../components/order/refund.vue";
import addCanteen from "../../../components/canteen/addCanteen.vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
export default {
  components: {
    refund,
    addCanteen,
  },
  data() {
    return {
      isEdit: false,
      dialog: false,
      filter: '',
      deletedialog: false,
      order: null,
      viewDialog: false,
      allowDel: false,
      itemId: "",
      isfetching: false,
      search: "",
      permissions: [],
      items: [],
      currentPage: 1,
      fields: [
        {
          value: "user_name",
          text: "name",
        },
        {
          value: "user_email",
          text: "email",
        },
        {
          value: "user_phone",
          text: "PHONE.",
        },
        {
          value: "user_role",
          text: "Role",
        },
        {
          value: "user_status",
          text: "status",
        },
        {
          value: "action",
          text: "action",
          sortable: false,
        },
      ],
      isApprovedOptions: [
        { text: "Approved", value: true },
        { text: "Not Approved", value: false },
      ],
    };
  },

  methods: {
    amountCharged(obj) {
      // d.total_price.toFixed(2)
      console.log('object',obj);
      let amountChargedToUser = '';
      if(obj.subsidy_points > 0 && obj.total_price > 0) {
        amountChargedToUser = `Credit Points: ${obj.subsidy_points.toFixed(2)} + ${obj.payment_method}: Nok ${obj.total_price.toFixed(2)}`;
      } else if (obj.subsidy_points > 0) {
        amountChargedToUser = `Credit Points: ${obj.subsidy_points.toFixed(2)}`;
      } else if( obj.total_price > 0) {
        amountChargedToUser = ` ${obj.payment_method}: Nok ${obj.total_price.toFixed(2)}`;
      }
      return amountChargedToUser;
    },
    hasPermission(obj) {
      // if (
      //   this.userDetails &&
      //   this.userDetails.user &&
      //   this.userDetails.user.user_role == "super_admin"
      // ) {
      return true;
      // } else {
      //   return this.userDetails.permissions.permission_namedata.includes(obj);
      // }
    },
    totalVal(obj) {
      var val = 0;
      if (obj) {
        obj.forEach((x) => {
          val = val + x.product_price * x.product_quantity;
        });
      }
      return val;
    },
    updateCurrentPage(obj) {
      if (obj > 0) {
        this.currentPage = obj;
      }
    },
    rolenamedata(obj) {
      if (obj) {
        let namedata = this.getroleList.filter((x) => x._id == obj);
        if (namedata.length > 0) {
          return namedata[0].namedata;
        }
      } else {
        return;
      }
    },
    dateConvert(obj) {
      const date = new Date(obj);
      return date.toLocaleString();
    },
    async fetchData() {
      this.isfetching = true;
      this.search = this.search == null ? "" : this.search;
      // await this.$store.dispatch("getRoleList");
      // await this.$store.dispatch("getUserList")
      await this.$store.dispatch("getCompanyList", { pagination: true });
      await this.$store.dispatch("getOrdersList", {
        resultPerPage: 10,
        filter: this.filter,
        currentPage: this.currentPage,
      });
    },

    editItem(obj) {
      // this.$store.dispatch("getUserById", obj);
      this.dialog = true;
      this.isEdit = true;
    },

    viewOrderSummary(obj) {
      this.order = obj;
      this.viewDialog = true;
    },
    viewRefund(obj) {
      this.$store.dispatch("setOrder", obj);
      this.dialog = true;
      // this.isEdit = true;
    },

    async closeModel() {
      // await this.fetchData();
      this.viewDialog = false;
      this.dialog = false;
      this.isEdit = false;
    },

    warningModel(id) {
      this.viewDialog = true;
      this.itemId = id;
    },

    closeWarningModel() {
      this.viewDialog = false;
      this.itemId = "";
    },

    deleteItem() {
      this.$store.dispatch("removeUser", this.itemId).then((r) => {
        if (r.success) {
          this.fetchData();
          Swal.fire({
            title: "",
            text: r.message,
            icon: "success",
          });
        } else {
          Swal.fire({
            title: "Error!",
            text: r.message,
            icon: "error",
          });
        }
      });
      this.viewDialog = false;
      this.itemId = "";
    },

    getColor(value) {
      if (value == true) return "green";
      else return "orange";
    },
  },
  mounted() {
    this.fetchData();
    // this.permissions = this.userDetails.permissions;
  },
  computed: {
    ...mapGetters(["getOrderList", "getCompanyList", "getOrderListTotal"]),
    maxPages() {
      return Math.ceil(this.getOrderListTotal / 10);
    },
  },
  watch: {
    currentPage: {
      handler: function () {
        this.fetchData();
      },
    },
  },
};
</script>

<style scoped>
.bg-clr {
  background-color: #ecf5f7;
}
.v-input__slot:before {
  border: none;
}
.v-card__actiondatas > .v-btn.v-btn {
  padding: 0 20px;
}
.theme--light.v-data-table thead {
  background-color: #747474 !important;
}
.b-border {
  border-bottom: 1px solid #f8932d;
}
.orderModal {
  color: black;
}
v-card-actions {
  margin: 0 auto;
  width: 50%;
}

</style>
