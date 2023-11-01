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
          <h2>Refund List</h2>
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
            <th class="email" style="width: 15%">Date</th>
            <th class="email" style="width: 15%">Price</th>
            <th class="status" style="width: 15%">Delivery status</th>
            <th class="status" style="width: 15%">Payment Status</th>
            <th class="status" style="width: 15%">Payment Method</th>
             <th class="action" style="width: 13%">Action</th>
          </tr>
        </thead>
        <tbody class="px-0">
          <div class="my-7" v-show="table_loader">
            <v-progress-linear
              indeterminate
              color="orange darken-1"
            ></v-progress-linear>
          </div>
          <div v-if="table_loader == false">
            <tr v-for="(d, i) in getRefundList" :key="i" class="px-0 tabledata">
              <td
                class="namedata"
                style="width: 12%"
                @click="viewOrderSummary(d)"
              >
                {{ d._id }}
              </td>
              <td
                class="emaildata"
                style="width: 15%"
                @click="viewOrderSummary(d)"
              >
                {{ dateConvert(d.createdAt) }}
              </td>
              <td
                class="emaildata"
                style="width: 15%"
                @click="viewOrderSummary(d)"
              >
                NOK {{ d.total_price }}
              </td>
              <td
                class="statusdata"
                style="width: 15%"
                @click="viewOrderSummary(d)"
              >
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
                  {{ d.order_status.toLowerCase() }}
                </button>
              </td>
              <td class="statusdata text-capitalize" style="width: 15%">
                {{ d.payment_status.toLowerCase() }}
              </td>
              <td class="statusdata text-capitalize" style="width: 15%">
                {{ d.payment_method.toLowerCase() }}
              </td>
              <td class="actiondata" style="width: 13%">
                <img
                  src="../../../assets/logos/Icon-ionic-ios-eye.svg"
                  alt="eye"
                  width="18px"
                  height="18px"
                  @click="viewOrderSummary(d)"
                />
              </td>
            </tr>
          </div>
          </tbody>
      </table>
    </div>
    <div class="pagiNationWrapper notranslate">
      <p v-if="getRefundList">
        Showing {{ currentPage }}-{{ getRefundList.length }} of
        {{ getRefundListTotal }} results
      </p>
      <p v-else>Showing 0-0 of0 results</p>

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
        v-model="viewDialog2"
        transition="dialog-top-transition"
        scrollable
      >
        <template v-if="viewDialog2" v-slot:default="viewDialog2">
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
                  <td v-else class="pt-3 pl-5 pr-5 text-orange">
                    Guest User
                  </td>
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
                    {{ order.order_status.toLowerCase() }}
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
                  <td class="pl-5 pr-5 text-orange">{{ order.discount }}</td>
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
  </div>
</template>
<script>
import addUser from "../../../components/users/addUser.vue";
import addCanteen from "../../../components/canteen/addCanteen.vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
export default {
  components: {
    addUser,
    addCanteen,
  },
  data() {
    return {
      currentPage: 1,
      isEdit: false,
      dialog: false,
      order: null,
      table_loader: true,
      deletedialog: false,
      delDialog: false,
      viewDialog2: false,
      allowDel: false,
      itemId: "",
      filter: "",
      isfetching: false,
      search: "",
      permissions: [],
      items: [],
      fields: [
        {
          value: "user_namedata",
          text: "Name",
        },
        {
          value: "user_email",
          text: "Email",
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
          text: "Status",
        },
        {
          value: "action",
          text: "Action",
          sortable: false,
        },
      ],
      isApprovedOptions: [
        { text: "Approved", value: true },
        { text: "Not Approved", value: false },
      ],
    };
  },
  watch: {
    currentPage: {
      handler: function () {
        this.fetchData();
      },
    },
    getuserList: {
      handler: function () {
        this.items = this.getuserList.filter((x) => {
          return x.white_list_user != "true";
        });
      },
    },
  },
  methods: {
    totalVal(obj) {
      var val = 0;
      if (obj) {
        obj.forEach((x) => {
          val = val + x.product_price * x.product_quantity;
        });
      }
      return val;
    },
    dateConvert(obj) {
      var date = new Date(obj);
      var mS = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "June",
        "July",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ];

      return (
        date.getDate() + "-" + mS[date.getMonth()] + "-" + date.getFullYear()
      );
    },
    updateCurrentPage(obj) {
      if (obj >= 1) {
        this.currentPage = obj;
      }
    },

    hasPermission(obj) {
      // if (
      //   this.userDetails &&
      //   this.userDetails.user &&
      //   this.userDetails.user.user_role == "super_admin"
      // ) {
      return true;
      // } else {
      //   return this.userDetails.permissions.permission_namedatadata.includes(obj);
      // }
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

    async fetchData() {
      this.isfetching = true;
      this.search = this.search == null ? "" : this.search;
      await this.$store.dispatch("getRoleList", { pagination: true });
        await this.$store.dispatch("getCompanyList", { pagination: true });
     
      await this.$store.dispatch("getRefundList", {
        resultPerPage: 10,
        filter: this.filter,
        currentPage: this.currentPage,
      });
      this.table_loader = false;
    },

    editItem(obj) {
      // this.$store.dispatch("getUserById", obj);
      this.dialog = true;
      this.isEdit = true;
    },

    viewOrderSummary(obj) {
      this.order = obj;
      this.$store.dispatch("getUserById", obj);
      this.viewDialog2 = true;
      // this.isEdit = true;
    },
    async closeModel() {
      // await this.fetchData();
      this.viewDialog2 = false;
      this.isEdit = false;
    },

    warningModel(id) {
      this.delDialog = true;
      this.itemId = id;
    },

    closeWarningModel() {
      this.delDialog = false;
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
      this.delDialog = false;
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
    ...mapGetters(["getRefundList","getCompanyList", "getRefundListTotal"]),
    maxPages() {
      return Math.ceil(this.getRefundListTotal / 10);
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
</style>
