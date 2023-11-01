<template>
  <div class="mt-5">
    <v-list-item class="px-2" style="background-color: #F8932D; height: 64px">
      <v-img 
        src="../../../assets/logos/Frigg_Logo_F_Tekst_Horisontal_hvit.png"
        width="auto"
        height="50px"
      ></v-img>
    </v-list-item>

    <v-list rounded>
      <v-list-group
        v-for="item in items"
        :key="item.title"
        v-model="item.active"
        :prepend-icon="item.icon"
        no-action
        color="white"
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="child in item.items"
          :key="child.title"
          class="menu-item-active"
          color="white"
        >
          <router-link
            :to="child.route"
            style="text-decoration: none; color: inherit"
          >
            <v-list-item-content color="white">
              <v-list-item-title v-text="child.title"></v-list-item-title>
            </v-list-item-content>
          </router-link>
        </v-list-item>
      </v-list-group>
    </v-list>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    drawerValue: Boolean,
  },
  data() {
    return {
      items: [
        {
          icon: "fas fa-users",
          items: [
            { permissionName: "user_view", title: "User", route: "userList" },
            {
              permissionName: "white_list_user",
              title: "White List Users",
              route: "whitelist_user",
            },
            { permissionName: "role_view", title: "Role List", route: "role" },
          ],
          title: "User",
          route: "userList",
        },
        {
          icon: "fas fa-store-alt",
          items: [
            {
              permissionName: "canteen_view",
              title: "Canteen Management",
              route: "canteenList",
            },
          ],
          title: "Canteen Management",
          route: "canteenList",
        },
        {
          icon: "fas fa-tram",
          items: [
            {
              permissionName: "machine_view",
              title: "Machine",
              route: "machineList",
            },
          ],
          title: "Machine",
          route: "machineList",
        },
        {
          icon: "fas fa-store-alt",
          items: [
            {
              permissionName: "category_view",
              title: "Category",
              route: "categoryList",
            },
          ],
          title: "Category",
          route: "categoryList",
        },
        {
          icon: "fab fa-product-hunt",
          items: [
            {
              permissionName: "product_view",
              title: "Product",
              route: "productList",
            },
            {
              permissionName: "inventory_view",
              title: "Inventory",
              route: "inventoryList",
            },
            {
              permissionName: "wastage_view",
              title: "Waste Management ",
              route: "wasteList",
            },
          ],
          title: "Product",
          route: "productList",
        },
        {
          icon: "fab fa-first-order",
          items: [{ permissionName: "", title: "Order", route: "orderList" }],
          title: "Order",
          route: "orderList",
        },
        {
          icon: "fab fa-first-order",
          items: [
            {
              permissionName: "page_view",
              title: "Page_Builder",
              route: "cmsList",
            },
          ],
          title: "Page_Builder",
          route: "cmsList",
        },
        {
          icon: "fab fa-first-order",
          items: [
            {
              permissionName: "banner_view",
              title: "Banner",
              route: "bannerList",
            },
          ],
          title: "Banner",
          route: "bannerList",
        },
        {
          icon: "fab fa-first-order",
          items: [
            { permissionName: "", title: "Report", route: "reportList" },
            { permissionName: "", title: "Logs", route: "logList" },
          ],
          title: "Report",
          route: "reportList",
        },
        {
          icon: "fab fa-product-hunt",
          items: [
            {
              permissionName: "promotion_view",
              title: "Promotion",
              route: "promotionList",
            },
            {
              permissionName: "discount_view",
              title: "Discount",
              route: "discountList",
            },
          ],
          title: "Promotion",
          route: "promotionList",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["userDetails"]),
  },
  mounted() {
    if (this.userDetails) {
      this.roleModel = this.userDetails;
    }
    this.items = this.items.filter((o1) =>
      this.userDetails.permissions.permission_name.some((o2) =>
        o2.includes(o1.title.toLowerCase())
      )
    );
    var userPermission = this.userDetails.permissions;
    this.items.forEach((obj, nd) => {
      obj.items = obj.items.filter((o1) => {
        return userPermission.permission_name.some((o2) =>
          o2.includes(o1.permissionName.toLowerCase())
        );
      });
      
      this.items[nd].items = obj.items;
    });

    this.$router.push({ name: this.items[0].route });
  },
};
</script>
<style scoped>
.v-list-item .router-link-active {
  color: white !important;
}
</style>
