<template>
  <div>
    <!-- Bootstrap NavBar -->
    <nav class="navbar navbar-expand-md navbar-dark fixed-top main_bg_color">
      <a class="navbar-brand" href="#">
        <img
          src="../../../assets/logos/Frigg_Logo_F_Tekst_Horisontal_hvit.png"
          height="40"
          width="150"
          class="d-inline-block align-top ml-5"
          alt=""
          style="margin-left: 25px"
        />
      </a>
    </nav>
    <!-- NavBar END -->

    <!-- Bootstrap row -->
    <div class="row mt-5" id="body-row">
      <!-- Sidebar -->
      <!-- empty div to push content because sidebar is fixed position -->
      <div style="position:relative;" class="sidebar-expanded d-none d-md-block col-2">
      </div>
      <div
        id="sidebar-container"
        class="sidebar-expanded d-none d-md-block col-2"
      >
        <div class="userMenu">
          <div class="burgerImgWrapper">
            <img
              src="../../../assets/logos/burger.png"
              height="50"
              width="50"
              alt="burger"
            />
          </div>
          <div @click="clickProfile">
            <h5
              v-if="
                userDetails && userDetails.user && userDetails.user.user_role
              "
              style="text-transform: capitalize"
            >
              {{ userDetails.user.user_name.replaceAll("_", " ") }}
            </h5>
            <div>
              <button
                v-if="
                  userDetails && userDetails.user && userDetails.user.user_role
                "
                class="userName"
              >
                <strong style="text-transform: capitalize">
                  {{ userDetails.user.user_role.replaceAll("_", " ") }}
                </strong>
              </button>
              <div @click="logOut" class="userDropDown">
                <span>Log Out</span>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <ul class="sideNav">
          <li class="navItem">
            <span class="navLink" @click="changeRoute('dashboard')">
              <div class="navLinkIcon">
                <svg class="svgIcon">
                  <use xlink:href="#dashboard"></use>
                </svg>
              </div>
              <span class="dashboard active title fontstyle">Dashboard</span>
            </span>
          </li>
          <li
            v-if="
              hasPermission('user_view') ||
              hasPermission('white_list_user') ||
              hasPermission('role_view')
            "
            class="navItem"
          >
            <span
              @click="dropdown('UserManagementDropdown')"
              class="navLink arrowAfter userManagment UserManagementDropdown"
            >
              <div class="navLinkIcon">
                <svg class="svgIcon">
                  <use xlink:href="#userManagment"></use>
                </svg>
              </div>
              <span class="title fontstyle">User Management</span>
            </span>
            <div class="UserManagment">
              <span
                v-if="hasPermission('user_view')"
                @click="changeRoute('userList')"
                class="list userList"
                >User</span
              >
              <span
                v-if="hasPermission('white_list_user')"
                @click="changeRoute('whitelist_user')"
                class="list whitelist_user"
                >White List Users</span
              >
              <span
                v-if="hasPermission('role_view')"
                @click="changeRoute('role')"
                class="list role"
                >Roles List</span
              >
            </div>
          </li>
          <li class="navItem">
            <span class="navLink" @click="changeRoute('companyList')">
              <div class="navLinkIcon">
                <svg class="svgIcon">
                  <use xlink:href="#canteenManagment"></use>
                </svg>
              </div>
              <span
                class="title companyList fontstyle"
                >Company Management</span
              >
            </span>
          </li>
          <li v-if="hasPermission('canteen_view')" class="navItem">
            <span class="navLink" @click="changeRoute('canteenList')">
              <div class="navLinkIcon">
                <svg class="svgIcon">
                  <use xlink:href="#canteenManagment"></use>
                </svg>
              </div>
              <span
                @click="changeRoute('canteenList')"
                class="title canteenList fontstyle"
                >Canteen Management</span
              >
            </span>
          </li>
          <li v-if="hasPermission('machine_view')" class="navItem">
            <span class="navLink" @click="changeRoute('machineList')">
              <div class="navLinkIcon">
                <svg class="svgIcon">
                  <use xlink:href="#machineIcon"></use>
                </svg>
              </div>
              <span class="title machineList fontstyle"
                >Machine Management</span
              >
            </span>
          </li>
          <li v-if="hasPermission('category_view')" class="navItem">
            <span @click="changeRoute('categoryList')" class="navLink">
              <div class="navLinkIcon">
                <svg class="svgIcon">
                  <use xlink:href="#Category"></use>
                </svg>
              </div>
              <span class="title categoryList fontstyle">Category</span>
            </span>
          </li>
          <li
            v-if="
              hasPermission('product_view') ||
              hasPermission('inventory_view') ||
              hasPermission('wastage_view')
            "
            class="navItem"
          >
            <span
              @click="dropdown('ProductManagementDropdown')"
              class="navLink arrowAfter userManagment ProductManagementDropdown"
            >
              <div class="navLinkIcon">
                <svg class="svgIcon">
                  <use xlink:href="#productManagment"></use>
                </svg>
              </div>
              <span class="title fontstyle">Product Management</span>
            </span>
            <div class="ProductManagment">
              <span
                v-if="hasPermission('product_view')"
                @click="changeRoute('productList')"
                class="list productList"
                >Products</span
              >
             
              <span
                v-if="hasPermission('product_vend_limit_list')"
                @click="changeRoute('vendLimitList')"
                class="list vendLimitList"
                >Vend Limit</span
              >
            </div>
          </li>

          <li
            v-if="
              hasPermission('order_view') ||
              hasPermission('order_refund_payment')
            "
            class="navItem"
          >
            <span
              class="navLink OrderManagementDropdown arrowAfter userManagment"
              @click="dropdown('OrderManagementDropdown')"
            >
              <div class="navLinkIcon">
                <svg class="svgIcon">
                  <use xlink:href="#orderManagment"></use>
                </svg>
              </div>
              <span
                @click="
                  hasPermission('order_view') ? changeRoute('orderList') : ''
                "
                class="title orderList fontstyle"
                >Order Management</span
              >
            </span>
            <div class="OrderManagement">
              <span
                v-if="hasPermission('order_refund_payment')"
                @click="changeRoute('refundList')"
                class="list refundList"
                >Refund</span
              >
            </div>
          </li>
          <li v-if="hasPermission('page_view')" class="navItem">
            <span class="navLink" @click="changeRoute('cmsList')">
              <div class="navLinkIcon">
                <svg class="svgIcon">
                  <use xlink:href="#pageBuilder"></use>
                </svg>
              </div>
              <span class="title cmsList fontstyle">Page Builder</span>
            </span>
          </li>
          <li v-if="hasPermission('banner_view')" class="navItem">
            <span class="navLink" @click="changeRoute('bannerList')">
              <div class="navLinkIcon">
                <svg class="svgIcon">
                  <use xlink:href="#bannerIcon"></use>
                </svg>
              </div>
              <span class="title bannerList fontstyle">Banner</span>
            </span>
          </li>
          <li
            v-if="
              hasPermission('transaction_log_report') ||
              hasPermission('sale_report_by_machine') ||
              hasPermission('sale_report') ||
              hasPermission('downtime_view') ||
              hasPermission('inventory_report')
            "
            class="navItem"
          >
            <span
              @click="dropdown('ReportDropdown')"
              class="navLink arrowAfter ReportDropdown userManagment"
            >
              <div class="navLinkIcon">
                <svg class="svgIcon">
                  <use xlink:href="#report"></use>
                </svg>
              </div>
              <span class="title fontstyle">Report</span>
            </span>
            <div class="Report">
              <span
                v-if="hasPermission('transaction_log_report')"
                @click="changeRoute('transactionLog')"
                class="transactionLog list"
                >Transaction Log</span
              >

              <span
              v-if="hasPermission('sale_report')"
              @click="changeRoute('salesReport')"
              class="salesReport list"
              >Sales Report</span>

              <span
              v-if="hasPermission('sale_report')"
              @click="changeRoute('salesReportTab')"
              class="salesReportTab list"
              >Sales Summary</span>

              <span
                v-if="hasPermission('sale_report_by_machine')"
                @click="changeRoute('salesOverview')"
                class="salesReport list"
                >Sales Overview</span
              >
              <!-- <span @click="changeRoute('summary')" class="summary list"
                >Summary</span
              > -->
             
              <span
                v-if="hasPermission('downtime_view')"
                @click="changeRoute('downTime')"
                class="downTime list"
                >Down Time</span
              >
              <span
              v-if="hasPermission('wastage_view')"
              @click="changeRoute('wasteList')"
              class="list wasteList"
              >Waste Management</span>
              <span
                v-if="hasPermission('inventory_report')"
                @click="changeRoute('inventoryReport')"
                class="inventoryReport list"
                >Inventory Report</span
              >
              <span
                @click="changeRoute('machineLogsList')"
                class="machineLogsList list"
                >System Logs</span
              >
              <!-- <span
                @click="changeRoute('productSales')"
                class="productSales list"
                >Product Sales</span
              > -->
              <!-- 
              <span @click="changeRoute('refillLog')" class="refillLog list"
                >Refill Log</span
              >-->

              <span @click="changeRoute('logList')" class="logList list"
                >Machine Logs</span
              > 
             
            </div>
          </li>
          <li
            v-if="
              hasPermission('promotion_view') ||
              hasPermission('discount_view') ||
              hasPermission('subsidy_view')
            "
            class="navItem"
          >
            <span
              @click="dropdown('PromotionDropdown')"
              class="navLink arrowAfter userManagment PromotionDropdown"
            >
              <div class="navLinkIcon">
                <svg class="svgIcon">
                  <use xlink:href="#promotion"></use>
                </svg>
              </div>
              <span class="title fontstyle">Promotion</span>
            </span>
            <div class="Promotion">
              <span
                v-if="hasPermission('promotion_view')"
                @click="changeRoute('promotionList')"
                class="promotionList list"
                >Promotion</span
              >
              <span
                v-if="hasPermission('discount_view')"
                @click="changeRoute('discountList')"
                class="discountList list"
                >Discount</span
              >
              <span
                v-if="hasPermission('subsidy_view')"
                @click="changeRoute('subsidyList')"
                class="subsidyList list"
                >Subsidy</span
              >
            </div>
          </li>
          <li class="navItem">
            <span
              @click="dropdown('SettingsDropdown')"
              class="navLink arrowAfter userManagment SettingsDropdown"
            >
              <div class="navLinkIcon">
                <svg class="svgIcon">
                  <use xlink:href="#Category"></use>
                </svg>
              </div>
              <span class="title fontstyle">Settings</span>
            </span>
            <div class="Promotion">
              <span
                @click="changeRoute('settings')"
                class="promotionList list"
                >Global Payment Settings</span
              >
              <span
                @click="changeRoute('logPriority')"
                class="discountList list"
                >Priority Logs</span
              >
            </div>
          </li>
        </ul>
      </div>
      <!-- sidebar-container END -->

      <!-- MAIN -->
      <div class="col-10">
        <v-main>
          <v-container fluid>
            <router-view />
          </v-container>
        </v-main>
      </div>
      <!-- Main Col END -->
    </div>

    <div hidden>
      <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
        <symbol id="facebook" viewbox="0 0 24 24">
          <title>facebook</title>
          <path
            d="m15.997 3.985h2.191v-3.816c-.378-.052-1.678-.169-3.192-.169-3.159 0-5.323 1.987-5.323 5.639v3.361h-3.486v4.266h3.486v10.734h4.274v-10.733h3.345l.531-4.266h-3.877v-2.939c.001-1.233.333-2.077 2.051-2.077z"
          />
        </symbol>
        <symbol id="dashboard" viewbox="0 0 24 24" height="19" width="19">
          <title>DashBoard</title>
          <path
            d="M13.556,3V9.334H22V3M13.556,22H22V11.445H13.556M3,22h8.445V15.667H3m0-2.111h8.445V3H3Z"
            transform="translate(-3 -3)"
          />
        </symbol>
        <symbol
          id="downArrow"
          width="10.706"
          height="8.03"
          viewBox="0 0 10.706 8.03"
        >
          <title>downArrow</title>
          <path
            id="bxs-down-arrow"
            d="M7.916,15.3a.534.534,0,0,0,.88,0L13.614,8.34a.535.535,0,0,0-.44-.84H3.538a.536.536,0,0,0-.44.84Z"
            transform="translate(-3.004 -7.5)"
            fill="#f8932d"
          />
        </symbol>
        <symbol
          id="userManagment"
          width="15.983"
          height="21.199"
          viewBox="0 0 15.983 21.199"
        >
          <title>userManagment</title>
          <g
            id="Path_10757"
            data-name="Path 10757"
            transform="translate(-108.252 -18.326)"
          >
            <path
              d="M116.251,18.326a5.189,5.189,0,1,1-5.189,5.189A5.189,5.189,0,0,1,116.251,18.326Zm0,21.2a10.779,10.779,0,0,1-7.553-3.084,1.524,1.524,0,0,1-.4-1.456l.3-1.212a4.628,4.628,0,0,1,4.517-3.568h6.278a4.627,4.627,0,0,1,4.517,3.568l.288,1.249a1.526,1.526,0,0,1-.409,1.438A10.779,10.779,0,0,1,116.251,39.525Z"
              stroke="none"
            />
            <path
              d="M 116.2511825561523 20.32599639892578 C 114.4927368164062 20.32599639892578 113.062141418457 21.75659561157227 113.062141418457 23.51503753662109 C 113.062141418457 25.27364730834961 114.4927368164062 26.70437622070312 116.2511825561523 26.70437622070312 C 118.0096130371094 26.70437622070312 119.4402008056641 25.27364730834961 119.4402008056641 23.51503753662109 C 119.4402008056641 21.75659561157227 118.0096130371094 20.32599639892578 116.2511825561523 20.32599639892578 M 113.1125335693359 32.20630645751953 C 111.8833694458008 32.20630645751953 110.8259963989258 33.04152679443359 110.5411987304688 34.23741912841797 L 110.5377197265625 34.25178527832031 L 110.3028030395508 35.20680999755859 C 111.9352416992188 36.7041015625 114.0363311767578 37.52517700195312 116.2511825561523 37.52517700195312 C 118.4595336914062 37.52517700195312 120.5566711425781 36.70798492431641 122.1872406005859 35.21849822998047 L 121.9598617553711 34.23210144042969 C 121.6732864379883 33.0390625 120.6173477172852 32.20630645751953 119.3901290893555 32.20630645751953 L 113.1125335693359 32.20630645751953 M 116.2511825561523 18.32599639892578 C 119.1171417236328 18.32599639892578 121.4402008056641 20.64938735961914 121.4402008056641 23.51503753662109 C 121.4402008056641 26.38099670410156 119.1171417236328 28.70437622070312 116.2511825561523 28.70437622070312 C 113.3852081298828 28.70437622070312 111.062141418457 26.38099670410156 111.062141418457 23.51503753662109 C 111.062141418457 20.64938735961914 113.3852081298828 18.32599639892578 116.2511825561523 18.32599639892578 Z M 113.1125335693359 30.20630645751953 L 119.3901290893555 30.20630645751953 C 121.5493392944336 30.20630645751953 123.4065093994141 31.67329597473145 123.9067306518555 33.77407836914062 L 124.1945724487305 35.02279663085938 C 124.3139114379883 35.54033660888672 124.1661224365234 36.09002685546875 123.7852172851562 36.46041870117188 C 121.8356170654297 38.35529708862305 119.178352355957 39.52517700195312 116.2511825561523 39.52517700195312 C 113.3147125244141 39.52517700195312 110.6493988037109 38.34755706787109 108.6982574462891 36.44154739379883 C 108.3136596679688 36.06591796875 108.1689605712891 35.507568359375 108.2975769042969 34.98569488525391 L 108.5956115722656 33.77407836914062 C 109.0958404541016 31.67360687255859 110.9533081054688 30.20630645751953 113.1125335693359 30.20630645751953 Z"
              stroke="none"
            />
          </g>
        </symbol>

        <symbol
          id="canteenManagement"
          width="15.983"
          height="21.199"
          viewBox="0 0 15.983 21.199"
        >
          <title>canteenManagement</title>
          <g
            xmlns="http://www.w3.org/2000/svg"
            id="Group_1332"
            data-name="Group 1332"
            transform="translate(-277 -126)"
          >
            <g
              id="Group_1004"
              data-name="Group 1004"
              transform="translate(260 1)"
            >
              <path
                id="Path_10933"
                data-name="Path 10933"
                d="M12,0H30A12,12,0,0,1,42,12V23A12,12,0,0,1,30,35H12A12,12,0,0,1,0,23V12A12,12,0,0,1,12,0Z"
                transform="translate(17 125)"
                fill="#f8932d"
              />
            </g>
            <path
              id="Path_10959"
              data-name="Path 10959"
              d="M19.023,11.546a4.847,4.847,0,0,1-2.136-.4,4.847,4.847,0,0,1-2.136.4,4.847,4.847,0,0,1-2.136-.4,4.847,4.847,0,0,1-2.136.4,4.847,4.847,0,0,1-2.136-.4,4.847,4.847,0,0,1-2.136.4v8.546h3.2V14.75a1.069,1.069,0,0,1,1.068-1.068H14.75a1.069,1.069,0,0,1,1.068,1.068v5.341h3.2Zm2.136-.651v9.2a1.068,1.068,0,0,1,0,2.136H4.068a1.068,1.068,0,1,1,0-2.136V10.9A3.1,3.1,0,0,1,3,8.353,1.071,1.071,0,0,1,3.214,7.7l.006-.009L6.411,3.437A1.068,1.068,0,0,1,7.273,3H17.955a1.068,1.068,0,0,1,.862.437l3.191,4.255.006.009a1.057,1.057,0,0,1,.214.653A3.1,3.1,0,0,1,21.159,10.9ZM20.074,8.674,17.421,5.136H7.807L5.153,8.674c.066.565.341.735,1.051.735a3.213,3.213,0,0,0,1.077-.132,1.068,1.068,0,0,1,2.119,0,3.218,3.218,0,0,0,1.077.132,3.213,3.213,0,0,0,1.077-.132,1.068,1.068,0,0,1,2.119,0,3.218,3.218,0,0,0,1.077.132,3.213,3.213,0,0,0,1.077-.132,1.068,1.068,0,0,1,2.119,0,3.218,3.218,0,0,0,1.077.132C19.733,9.409,20.008,9.239,20.074,8.674ZM11.546,20.091h2.136V15.818H11.546Z"
              transform="translate(285 131)"
              fill="#fff"
            />
          </g>
        </symbol>
        <symbol id="Category" viewBox="0 0 18.625 18.632">
          <title>Category</title>
          <g
            xmlns="http://www.w3.org/2000/svg"
            id="Group_1281"
            data-name="Group 1281"
            transform="translate(-352.863 -118.75)"
          >
            <path
              id="Path_10845"
              data-name="Path 10845"
              d="M104.054,33.559a.412.412,0,0,0-.41.414v7.457a.412.412,0,0,0,.41.414h7.4a.412.412,0,0,0,.41-.414V33.973a.412.412,0,0,0-.41-.414Zm.41.827h6.577v6.63h-6.577Z"
              transform="translate(249.469 85.441)"
              stroke="#f8932d"
              stroke-width="0.5"
              fill-rule="evenodd"
            />
            <path
              id="Path_10846"
              data-name="Path 10846"
              d="M373.358,33.555a.412.412,0,0,0-.41.414v7.457a.412.412,0,0,0,.41.414h7.4a.412.412,0,0,0,.41-.414V33.969a.412.412,0,0,0-.41-.414h-7.4Zm.41.827h6.577v6.63h-6.577Z"
              transform="translate(-9.929 85.445)"
              stroke="#f8932d"
              stroke-width="0.5"
              fill-rule="evenodd"
            />
            <path
              id="Path_10847"
              data-name="Path 10847"
              d="M104.054,301.25a.412.412,0,0,0-.41.414v7.457a.412.412,0,0,0,.41.414h7.4a.412.412,0,0,0,.41-.414v-7.457a.412.412,0,0,0-.41-.414Zm.41.827h6.577v6.63h-6.577Z"
              transform="translate(249.469 -172.403)"
              stroke="#f8932d"
              stroke-width="0.5"
              fill-rule="evenodd"
            />
            <path
              id="Path_10848"
              data-name="Path 10848"
              d="M373.358,301.25a.412.412,0,0,0-.41.414v7.457a.412.412,0,0,0,.41.414h7.4a.412.412,0,0,0,.41-.414v-7.457a.412.412,0,0,0-.41-.414Zm.41.827h6.577v6.63h-6.577Z"
              transform="translate(-9.929 -172.403)"
              stroke="#f8932d"
              stroke-width="0.5"
              fill-rule="evenodd"
            />
          </g>
        </symbol>
        <symbol id="productManagment" viewBox="0 0 14.95 18.687">
          <title>Product Management</title>
          <path
            id="Path_10904"
            data-name="Path 10904"
            d="M90.944-518.495a1.869,1.869,0,0,1,1.869,1.869v6.54a1.869,1.869,0,0,1-1.869,1.869H90.01v7.475a.934.934,0,0,1-.934.934h-.934a.934.934,0,0,1-.934-.934v-7.475h-.934a1.869,1.869,0,0,1-1.869-1.869v-6.54a1.869,1.869,0,0,1,1.869-1.869h4.672m0,8.409v-6.54H90.01v4.2a.467.467,0,0,1-.467.467.467.467,0,0,1-.467-.467v-4.2h-.934v4.2a.467.467,0,0,1-.467.467.467.467,0,0,1-.467-.467v-4.2h-.934v6.54h4.672m7.9-8.409a.514.514,0,0,1,.514.514v17.239a.934.934,0,0,1-.934.934h-.934a.934.934,0,0,1-.934-.934v-3.737h-.934a1.869,1.869,0,0,1-1.869-1.869V-513.4a5.092,5.092,0,0,1,5.092-5.092m-3.223,12.146h1.869v-9.979a3.233,3.233,0,0,0-1.869,2.924v7.054"
            transform="translate(-84.404 518.495)"
          />
        </symbol>
        <symbol id="orderManagment" viewBox="0 0 24.425 24">
          <title>Order Management</title>
          <g
            id="Group_664"
            data-name="Group 664"
            transform="translate(-716 -188.425)"
          >
            <rect
              id="Rectangle_208"
              data-name="Rectangle 208"
              width="24"
              height="24"
              transform="translate(716.425 188.425)"
              fill="none"
            />
            <path
              id="cube-send"
              d="M16.567,4,9.319,8.183v8.2l7.248,4.183,7.248-4.183v-8.2M16.567,6.392,20.5,8.659l-3.935,2.268L12.643,8.659M0,7.106V9.177H7.248V7.106m4.142,3.22,4.142,2.392v4.856L11.39,15.193m10.354-4.867v4.867L17.6,17.575V12.718M2.071,11.248v2.071H7.248V11.248M4.142,15.39v2.071H7.248V15.39"
              transform="translate(716 188.142)"
            />
          </g>
        </symbol>
        <symbol id="pageBuilder" viewBox="0 0 17.948 21.336">
          <title>pageBuilder</title>
          <g
            id="Group_667"
            data-name="Group 667"
            transform="translate(-107 -846)"
          >
            <g
              id="Group_666"
              data-name="Group 666"
              transform="translate(110.781 851.401)"
            >
              <path
                id="Path_10837"
                data-name="Path 10837"
                d="M355.133,280h-4.745a.379.379,0,0,0-.4.4v4.745a.379.379,0,0,0,.4.4h4.745a.379.379,0,0,0,.4-.4V280.4A.379.379,0,0,0,355.133,280Z"
                transform="translate(-345.401 -275.565)"
              />
              <path
                id="Path_10838"
                data-name="Path 10838"
                d="M214.1,145.8h9.4c.208,0,.364-.1.364-.259V144c0-.161-.139-.259-.364-.259h-9.4c-.208,0-.364.1-.364.259v1.544c0,.161.156.259.364.259Z"
                transform="translate(-213.735 -143.736)"
              />
              <path
                id="Path_10839"
                data-name="Path 10839"
                d="M214,285.541h1.552c.149,0,.261-.152.261-.4V280.4c0-.247-.1-.4-.261-.4H214c-.149,0-.261.152-.261.4v4.745C213.739,285.37,213.851,285.541,214,285.541Z"
                transform="translate(-213.739 -275.564)"
              />
            </g>
            <path
              id="Path_10840"
              data-name="Path 10840"
              d="M133.835,46.662H117.411a.839.839,0,0,0-.753.9V67.1a.839.839,0,0,0,.753.9h16.442a.839.839,0,0,0,.753-.9V47.557a.865.865,0,0,0-.771-.9ZM133.1,66.207H118.146V48.431h14.936V66.207Z"
              transform="translate(-9.658 799.338)"
            />
          </g>
        </symbol>
        <symbol id="bannerIcon" viewBox="0 0 12.719 20.349">
          <title>Banner</title>
          <path
            id="noun-banner-4638743"
            d="M187.711,0q0,10.175,0,20.349l-6.359-4.508-6.359,4.508V17.271q3.174-2.286,6.362-4.553l3.823,2.718-.01-12.892H177.52c.014,3.781.01,7.561.01,11.342l-2.536,1.821V0Z"
            transform="translate(-174.993)"
          />
        </symbol>
        <symbol id="report" viewBox="0 0 17.948 21.336">
          <title>Report</title>
          <g
            id="Group_667"
            data-name="Group 667"
            transform="translate(-107 -846)"
          >
            <g
              id="Group_666"
              data-name="Group 666"
              transform="translate(110.781 851.401)"
            >
              <path
                id="Path_10837"
                data-name="Path 10837"
                d="M355.133,280h-4.745a.379.379,0,0,0-.4.4v4.745a.379.379,0,0,0,.4.4h4.745a.379.379,0,0,0,.4-.4V280.4A.379.379,0,0,0,355.133,280Z"
                transform="translate(-345.401 -275.565)"
              />
              <path
                id="Path_10838"
                data-name="Path 10838"
                d="M214.1,145.8h9.4c.208,0,.364-.1.364-.259V144c0-.161-.139-.259-.364-.259h-9.4c-.208,0-.364.1-.364.259v1.544c0,.161.156.259.364.259Z"
                transform="translate(-213.735 -143.736)"
              />
              <path
                id="Path_10839"
                data-name="Path 10839"
                d="M214,285.541h1.552c.149,0,.261-.152.261-.4V280.4c0-.247-.1-.4-.261-.4H214c-.149,0-.261.152-.261.4v4.745C213.739,285.37,213.851,285.541,214,285.541Z"
                transform="translate(-213.739 -275.564)"
              />
            </g>
            <path
              id="Path_10840"
              data-name="Path 10840"
              d="M133.835,46.662H117.411a.839.839,0,0,0-.753.9V67.1a.839.839,0,0,0,.753.9h16.442a.839.839,0,0,0,.753-.9V47.557a.865.865,0,0,0-.771-.9ZM133.1,66.207H118.146V48.431h14.936V66.207Z"
              transform="translate(-9.658 799.338)"
            />
          </g>
        </symbol>
        <symbol id="promotion" viewBox="0 0 20 20">
          <title>promotion</title>
          <g
            xmlns="http://www.w3.org/2000/svg"
            id="Group_1282"
            data-name="Group 1282"
            transform="translate(-956.434 -551.436)"
          >
            <path
              id="Path_10841"
              data-name="Path 10841"
              d="M103.933,29.557a3.379,3.379,0,0,0-4.379,4.378,3.379,3.379,0,0,0,0,6.192,3.379,3.379,0,0,0,4.379,4.378,3.379,3.379,0,0,0,6.192,0,3.379,3.379,0,0,0,4.379-4.378,3.379,3.379,0,0,0,0-6.192,3.379,3.379,0,0,0-4.379-4.378,3.379,3.379,0,0,0-6.192,0Zm.019,1a.439.439,0,0,0,.677-.281,2.475,2.475,0,0,1,4.8,0,.439.439,0,0,0,.677.281,2.475,2.475,0,0,1,3.394,3.394.439.439,0,0,0,.281.677,2.475,2.475,0,0,1,0,4.8.439.439,0,0,0-.281.677,2.475,2.475,0,0,1-3.394,3.394.439.439,0,0,0-.677.28,2.475,2.475,0,0,1-4.8,0,.439.439,0,0,0-.677-.28,2.475,2.475,0,0,1-3.394-3.394.439.439,0,0,0-.281-.677,2.475,2.475,0,0,1,0-4.8.439.439,0,0,0,.281-.677,2.475,2.475,0,0,1,3.394-3.394Z"
              transform="translate(859.405 524.405)"
              stroke="#f8932d"
              stroke-width="1"
              fill-rule="evenodd"
            />
            <path
              id="Path_10842"
              data-name="Path 10842"
              d="M248.668,177.04a1.63,1.63,0,1,0,1.63,1.63A1.631,1.631,0,0,0,248.668,177.04Zm0,.878a.752.752,0,1,1-.752.752A.752.752,0,0,1,248.668,177.918Z"
              transform="translate(715.521 380.522)"
              fill-rule="evenodd"
            />
            <path
              id="Path_10843"
              data-name="Path 10843"
              d="M367.961,296.33a1.63,1.63,0,1,0,1.63,1.63A1.63,1.63,0,0,0,367.961,296.33Zm0,.878a.752.752,0,1,1-.752.752A.752.752,0,0,1,367.961,297.208Z"
              transform="translate(600.717 265.72)"
              fill-rule="evenodd"
            />
            <path
              id="Path_10844"
              data-name="Path 10844"
              d="M255.086,191.408l6.322-6.322a.439.439,0,1,0-.621-.621l-6.322,6.322a.439.439,0,0,0,.621.621Z"
              transform="translate(708.497 373.499)"
              fill-rule="evenodd"
            />
            <circle
              id="Ellipse_1"
              data-name="Ellipse 1"
              cx="0.915"
              cy="0.915"
              r="0.915"
              transform="translate(967.7 562.701)"
            />
            <circle
              id="Ellipse_2"
              data-name="Ellipse 2"
              cx="0.915"
              cy="0.915"
              r="0.915"
              transform="translate(963.353 558.355)"
            />
          </g>
        </symbol>
        <symbol id="searchIcon" viewBox="0 0 22.464 22.47">
          <title>Search</title>
          <path
            id="Icon_ionic-ios-search"
            data-name="Icon ionic-ios-search"
            d="M26.7,25.337,20.453,19.03A8.9,8.9,0,1,0,19.1,20.4l6.207,6.265a.961.961,0,0,0,1.357.035A.968.968,0,0,0,26.7,25.337ZM13.456,20.475a7.031,7.031,0,1,1,4.973-2.059A6.987,6.987,0,0,1,13.456,20.475Z"
            transform="translate(-4.5 -4.493)"
            fill="#707070"
          />
        </symbol>
        <symbol id="userplusIcon" viewBox="0 0 25.774 25.774">
          <title>userPlusIcon</title>
          <path
            id="Icon_metro-user-plus"
            data-name="Icon metro-user-plus"
            d="M12.236,20.453a8.875,8.875,0,0,1,5.79-8.311,7.355,7.355,0,0,0,.654-2.965c0-4,0-7.249-4.833-7.249S9.014,5.174,9.014,9.177a7.2,7.2,0,0,0,3.222,5.986v1.328c-5.465.447-9.665,3.132-9.665,6.378h10a8.839,8.839,0,0,1-.335-2.416ZM21.1,13.2a7.249,7.249,0,1,0,7.249,7.249A7.249,7.249,0,0,0,21.1,13.2Zm4.027,8.054H21.9v3.222H20.291V21.259H17.069V19.648h3.222V16.426H21.9v3.222h3.222v1.611Z"
            transform="translate(-2.571 -1.928)"
            fill="#fff"
          />
        </symbol>
        <symbol id="editIcon" viewBox="0 0 18.637 18.637">
          <title>edit</title>
          <path
            id="Icon_material-edit"
            data-name="Icon material-edit"
            d="M4.5,19.251v3.882H8.382l11.45-11.45L15.95,7.8ZM22.834,8.681a1.031,1.031,0,0,0,0-1.46L20.411,4.8a1.031,1.031,0,0,0-1.46,0L17.057,6.694l3.882,3.882,1.894-1.894Z"
            transform="translate(-4.5 -4.496)"
            fill="#363636"
          />
        </symbol>
        <symbol id="deleteIcon" viewBox="0 0 14.493 18.634">
          <title>delete</title>
          <path
            id="Icon_material-delete"
            data-name="Icon material-delete"
            d="M8.535,21.064a2.077,2.077,0,0,0,2.07,2.07h8.282a2.077,2.077,0,0,0,2.07-2.07V8.641H8.535ZM21.993,5.535H18.37L17.335,4.5H12.159L11.123,5.535H7.5v2.07H21.993Z"
            transform="translate(-7.5 -4.5)"
            fill="#363636"
          />
        </symbol>
        <symbol id="eyeIcon" viewBox="0 0 18.671 16">
          <title>eye</title>
          <path
            id="Icon_ionic-md-eye-off"
            data-name="Icon-ionic-md-eye-off"
            d="M11.587,7.867a4.232,4.232,0,0,1,4.246,4.212,4.052,4.052,0,0,1-.3,1.542l2.479,2.458a9.961,9.961,0,0,0,2.912-4A10.055,10.055,0,0,0,8.2,6.35l1.833,1.821A4.2,4.2,0,0,1,11.587,7.867ZM3.1,5.571,5.037,7.492l.392.387a9.913,9.913,0,0,0-3.179,4.2A10.07,10.07,0,0,0,15.3,17.687l.358.354L18.15,20.5l1.079-1.071L4.175,4.5Zm4.692,4.654,1.317,1.3a2.387,2.387,0,0,0-.067.546A2.533,2.533,0,0,0,11.587,14.6a2.4,2.4,0,0,0,.55-.067l1.317,1.3a4.224,4.224,0,0,1-6.112-3.767A4.162,4.162,0,0,1,7.792,10.225Zm3.658-.654,2.675,2.654.017-.133A2.533,2.533,0,0,0,11.6,9.567Z"
            transform="translate(-2.25 -4.5)"
            fill="#363636"
          />
        </symbol>
        <symbol id="leftIcon" viewBox="0 0 320 512">
          <title>LeftIcon</title>
          <path
            d="M224 480c-8.188 0-16.38-3.125-22.62-9.375l-192-192c-12.5-12.5-12.5-32.75 0-45.25l192-192c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l169.4 169.4c12.5 12.5 12.5 32.75 0 45.25C240.4 476.9 232.2 480 224 480z"
          />
        </symbol>
        <symbol id="rightIcon" viewBox="0 0 320 512">
          <title>rightIcon</title>
          <path
            d="M96 480c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L242.8 256L73.38 86.63c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l192 192c12.5 12.5 12.5 32.75 0 45.25l-192 192C112.4 476.9 104.2 480 96 480z"
          />
        </symbol>
        <symbol id="openeyeIcon" viewBox="0 0 21.741 13.976">
          <title>open eye</title>
          <path
            id="Icon_ionic-ios-eye"
            data-name="Icon ionic-ios-eye"
            d="M13.111,7.875c-3.9,0-6.978,2.455-10.656,6.469a.767.767,0,0,0,0,1.034c3.149,3.479,5.925,6.473,10.661,6.473,4.678,0,8.186-3.77,10.681-6.5a.761.761,0,0,0,.024-1C21.273,11.262,17.755,7.875,13.111,7.875Zm.214,11.35a4.367,4.367,0,1,1,4.159-4.159A4.369,4.369,0,0,1,13.324,19.225Z"
            transform="translate(-2.252 -7.875)"
            fill="#363636"
          />
          <path
            id="Icon_ionic-ios-eye"
            data-name="Icon ionic-ios-eye"
            d="M16.606,14.325a2.28,2.28,0,0,1,.15-.82c-.049,0-.1,0-.15,0a3.105,3.105,0,1,0,3.106,3.106c0-.063,0-.126,0-.189a2.152,2.152,0,0,1-.883.189A2.253,2.253,0,0,1,16.606,14.325Z"
            transform="translate(-5.737 -9.618)"
            fill="#363636"
          />
        </symbol>
        <symbol id="role-per-icon" width="42" height="35" viewBox="0 0 42 35">
          <title>per icon</title>
          <g
     transform="translate(-17,-125)"
     data-name="Group 1306"
     id="Group_1306"
     style="fill:none">
    <path
       style="fill:none"
       inkscape:connector-curvature="0"
       transform="translate(17,125)"
       d="M 12,0 H 30 A 12,12 0 0 1 42,12 V 23 A 12,12 0 0 1 30,35 H 12 A 12,12 0 0 1 0,23 V 12 A 12,12 0 0 1 12,0 Z"
       data-name="Path 10933"
       id="Path_10933" />
  </g>
  <path
     style="fill:#ffffff"
     inkscape:connector-curvature="0"
     d="m 20.54,8 a 1.869,1.869 0 0 1 1.869,1.869 v 6.54 a 1.869,1.869 0 0 1 -1.869,1.869 h -0.934 v 7.475 a 0.934,0.934 0 0 1 -0.934,0.934 H 17.738 A 0.934,0.934 0 0 1 16.804,25.753 V 18.278 H 15.87 A 1.869,1.869 0 0 1 14.001,16.409 V 9.869 A 1.869,1.869 0 0 1 15.87,8 h 4.672 m 0,8.409 v -6.54 h -0.936 v 4.2 a 0.467,0.467 0 0 1 -0.467,0.467 0.467,0.467 0 0 1 -0.467,-0.467 v -4.2 h -0.934 v 4.2 a 0.467,0.467 0 0 1 -0.467,0.467 0.467,0.467 0 0 1 -0.467,-0.467 v -4.2 H 15.87 v 6.54 h 4.672 M 28.442,8 a 0.514,0.514 0 0 1 0.514,0.514 v 17.239 a 0.934,0.934 0 0 1 -0.934,0.934 H 27.088 A 0.934,0.934 0 0 1 26.154,25.753 V 22.016 H 25.22 A 1.869,1.869 0 0 1 23.351,20.147 V 13.095 A 5.092,5.092 0 0 1 28.443,8.003 M 25.22,20.149 h 1.869 V 10.17 a 3.233,3.233 0 0 0 -1.869,2.924 v 7.054"
     data-name="Path 10983"
     id="Path_10983" />
        </symbol>
        <symbol
          id="right-arrow-icon"
          width="42"
          height="35"
          viewBox="0 0 42 35"
        >
          <title>per icon</title>
          <path
            id="Icon_awesome-arrow-alt-circle-right"
            data-name="Icon awesome-arrow-alt-circle-right"
            d="M12.683.563A12.12,12.12,0,1,1,.563,12.683,12.118,12.118,0,0,1,12.683.563ZM7.014,14.833h5.669V18.3a.587.587,0,0,0,1,.415L19.271,13.1a.581.581,0,0,0,0-.826l-5.586-5.62a.586.586,0,0,0-1,.415v3.465H7.014a.588.588,0,0,0-.586.586v3.128A.588.588,0,0,0,7.014,14.833Z"
            transform="translate(-0.563 -0.563)"
            fill="#fff"
          />
        </symbol>
        <symbol id="canteenManagment" viewBox="0 0 18 18">
          <title>Canteen Managment</title>
          <path
            id="Path_223"
            data-name="Path 223"
            d="M18,11a4.538,4.538,0,0,1-2-.372A4.538,4.538,0,0,1,14,11a4.538,4.538,0,0,1-2-.372A4.538,4.538,0,0,1,10,11a4.538,4.538,0,0,1-2-.372A4.538,4.538,0,0,1,6,11v8H9V14a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v5h3Zm2-.609V19a1,1,0,0,1,0,2H4a1,1,0,0,1,0-2V10.391a2.9,2.9,0,0,1-1-2.38A1,1,0,0,1,3.2,7.4l.006-.008L6.193,3.409A1,1,0,0,1,7,3H17a1,1,0,0,1,.807.409l2.987,3.983L20.8,7.4a.99.99,0,0,1,.2.611A2.9,2.9,0,0,1,20,10.391ZM18.984,8.312,16.5,5h-9L5.016,8.312C5.078,8.841,5.335,9,6,9a3.008,3.008,0,0,0,1.008-.124,1,1,0,0,1,1.984,0A3.013,3.013,0,0,0,10,9a3.008,3.008,0,0,0,1.008-.124,1,1,0,0,1,1.984,0A3.013,3.013,0,0,0,14,9a3.008,3.008,0,0,0,1.008-.124,1,1,0,0,1,1.984,0A3.013,3.013,0,0,0,18,9C18.665,9,18.922,8.841,18.984,8.312ZM11,19h2V15H11Z"
            transform="translate(-3 -3)"
          />
        </symbol>
        <symbol id="canteen-icon" width="16" height="18" viewBox="0 0 18 18">
          <title>canteen icon</title>
          <path
            id="Path_223"
            data-name="Path 223"
            d="M18,11a4.538,4.538,0,0,1-2-.372A4.538,4.538,0,0,1,14,11a4.538,4.538,0,0,1-2-.372A4.538,4.538,0,0,1,10,11a4.538,4.538,0,0,1-2-.372A4.538,4.538,0,0,1,6,11v8H9V14a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v5h3Zm2-.609V19a1,1,0,0,1,0,2H4a1,1,0,0,1,0-2V10.391a2.9,2.9,0,0,1-1-2.38A1,1,0,0,1,3.2,7.4l.006-.008L6.193,3.409A1,1,0,0,1,7,3H17a1,1,0,0,1,.807.409l2.987,3.983L20.8,7.4a.99.99,0,0,1,.2.611A2.9,2.9,0,0,1,20,10.391ZM18.984,8.312,16.5,5h-9L5.016,8.312C5.078,8.841,5.335,9,6,9a3.008,3.008,0,0,0,1.008-.124,1,1,0,0,1,1.984,0A3.013,3.013,0,0,0,10,9a3.008,3.008,0,0,0,1.008-.124,1,1,0,0,1,1.984,0A3.013,3.013,0,0,0,14,9a3.008,3.008,0,0,0,1.008-.124,1,1,0,0,1,1.984,0A3.013,3.013,0,0,0,18,9C18.665,9,18.922,8.841,18.984,8.312ZM11,19h2V15H11Z"
            transform="translate(-3 -3)"
            fill="#f8932d"
          />
        </symbol>
        <symbol
          id="machineWhite"
          width="16"
          height="24"
          viewBox="0 0 15.058 20.903"
        >
          <title>machine icon</title>
          <g
            id="Group_689"
            data-name="Group 689"
            transform="translate(0.5 0.5)"
          >
            <g id="noun-vending-machine-4416890" transform="translate(0)">
              <path
                id="Path_10890"
                data-name="Path 10890"
                d="M185.919,67.109h10.925a2.16,2.16,0,0,0,2.169-2.169V47.669a2.16,2.16,0,0,0-2.169-2.169H185.919a2.16,2.16,0,0,0-2.169,2.169V64.94A2.16,2.16,0,0,0,185.919,67.109Zm-1.366-19.44a1.354,1.354,0,0,1,1.366-1.366h10.925a1.354,1.354,0,0,1,1.366,1.366V64.94a1.354,1.354,0,0,1-1.366,1.366H185.919a1.354,1.354,0,0,1-1.366-1.366Z"
                transform="translate(-183.75 -45.5)"
                fill="#fff"
                stroke="#fff"
                stroke-width="1"
              />
              <path
                id="Path_10894"
                data-name="Path 10894"
                d="M253.433,112h-1.872a.411.411,0,0,0-.435.435v2.047a.411.411,0,0,0,.435.435h1.872a.411.411,0,0,0,.436-.435v-2.047A.411.411,0,0,0,253.433,112ZM253,114.047h-1v-1.176h1Z"
                transform="translate(-246.849 -108.13)"
                fill="#fff"
              />
              <path
                id="Path_10895"
                data-name="Path 10895"
                d="M320.009,112h-1.934a.425.425,0,0,0-.45.45v2.114a.425.425,0,0,0,.45.45h1.934a.425.425,0,0,0,.45-.45V112.45A.425.425,0,0,0,320.009,112Zm-.45,2.114h-1.034V112.9h1.034Z"
                transform="translate(-309.694 -108.13)"
                fill="#fff"
              />
              <path
                id="Path_10896"
                data-name="Path 10896"
                d="M253.433,199.5h-1.872a.411.411,0,0,0-.435.435v2.047a.411.411,0,0,0,.435.435h1.872a.411.411,0,0,0,.436-.435v-2.047A.411.411,0,0,0,253.433,199.5Zm-.435,2h-1v-1.176h1Z"
                transform="translate(-246.849 -192.034)"
                fill="#fff"
              />
              <path
                id="Path_10897"
                data-name="Path 10897"
                d="M319.933,199.5h-1.873a.411.411,0,0,0-.436.435v2.047a.411.411,0,0,0,.436.435h1.873a.411.411,0,0,0,.435-.435v-2.047A.411.411,0,0,0,319.933,199.5Zm-.435,2h-1v-1.176h1Z"
                transform="translate(-309.693 -192.034)"
                fill="#fff"
              />
              <path
                id="Path_10900"
                data-name="Path 10900"
                d="M.592,7.768c.361,0,.607-.324.613-.8L1.288.786C1.294.31,1.058,0,.7,0S.089.324.083.8L0,6.982C-.005,7.379.23,7.772.592,7.768Z"
                transform="matrix(0.017, 1, -1, 0.017, 11.393, 14.369)"
                fill="#fff"
              />
              <path
                id="Path_10901"
                data-name="Path 10901"
                d="M.6,7.767c.367,0,.616-.324.622-.8L1.308.786C1.314.31,1.074,0,.707,0S.091.324.084.8L0,6.982C-.005,7.378.3,7.771.6,7.767Z"
                transform="matrix(0.017, 1, -1, 0.017, 11.392, 17.003)"
                fill="#fff"
              />
            </g>
          </g>
        </symbol>
        <symbol id="machineIcon" viewBox="0 0 16.263 22.609">
          <title>machineIcon</title>
          <g
            xmlns="http://www.w3.org/2000/svg"
            id="Group_1280"
            data-name="Group 1280"
            transform="translate(-34.167 -327.738)"
          >
            <g
              id="noun-vending-machine-4416890"
              transform="translate(34.417 327.988)"
            >
              <path
                id="Path_10890"
                data-name="Path 10890"
                d="M185.748,65.4H195.81a1.989,1.989,0,0,0,2-2V47.5a1.989,1.989,0,0,0-2-2H185.748a1.989,1.989,0,0,0-2,2V63.406A1.989,1.989,0,0,0,185.748,65.4ZM184.49,47.5a1.247,1.247,0,0,1,1.258-1.258H195.81a1.247,1.247,0,0,1,1.258,1.258V63.406a1.247,1.247,0,0,1-1.258,1.258H185.748a1.247,1.247,0,0,1-1.258-1.258Z"
                transform="translate(-183.75 -45.5)"
                stroke="#f8932d"
                stroke-width="0.5"
              />
              <path
                id="Path_10894"
                data-name="Path 10894"
                d="M253.251,112h-1.725a.379.379,0,0,0-.4.4v1.885a.379.379,0,0,0,.4.4h1.725a.379.379,0,0,0,.4-.4V112.4A.379.379,0,0,0,253.251,112Zm-.4,1.885h-.923V112.8h.923Z"
                transform="translate(-247.186 -108.436)"
                stroke="#f8932d"
                stroke-width="0.5"
              />
              <path
                id="Path_10895"
                data-name="Path 10895"
                d="M319.821,112h-1.781a.391.391,0,0,0-.414.414v1.947a.391.391,0,0,0,.414.414h1.781a.391.391,0,0,0,.414-.414v-1.947A.391.391,0,0,0,319.821,112Zm-.414,1.947h-.953v-1.118h.953Z"
                transform="translate(-310.32 -108.436)"
                stroke="#f8932d"
                stroke-width="0.5"
              />
              <path
                id="Path_10896"
                data-name="Path 10896"
                d="M253.251,199.5h-1.725a.379.379,0,0,0-.4.4v1.885a.379.379,0,0,0,.4.4h1.725a.379.379,0,0,0,.4-.4V199.9A.379.379,0,0,0,253.251,199.5Zm-.4,1.845h-.923v-1.083h.923Z"
                transform="translate(-247.187 -191.624)"
                stroke="#f8932d"
                stroke-width="0.5"
              />
              <path
                id="Path_10897"
                data-name="Path 10897"
                d="M319.751,199.5h-1.725a.379.379,0,0,0-.4.4v1.885a.379.379,0,0,0,.4.4h1.725a.379.379,0,0,0,.4-.4V199.9A.379.379,0,0,0,319.751,199.5Zm-.4,1.845h-.922v-1.083h.922Z"
                transform="translate(-310.32 -191.624)"
                stroke="#f8932d"
                stroke-width="0.5"
              />
              <path
                id="Path_10900"
                data-name="Path 10900"
                d="M.545,7.155c.333,0,.559-.3.565-.736L1.186.724C1.192.286.974,0,.641,0S.082.3.077.737L0,6.431C0,6.8.212,7.158.545,7.155Z"
                transform="matrix(0.017, 1, -1, 0.017, 10.493, 13.235)"
                stroke="#f8932d"
                stroke-width="0.5"
              />
              <path
                id="Path_10901"
                data-name="Path 10901"
                d="M.553,7.154c.338,0,.567-.3.573-.736L1.2.724C1.21.286.989,0,.651,0S.084.3.078.737L0,6.431C0,6.8.272,7.157.553,7.154Z"
                transform="matrix(0.017, 1, -1, 0.017, 10.493, 15.66)"
                stroke="#f8932d"
                stroke-width="0.5"
              />
            </g>
          </g>
        </symbol>
        <symbol id="machineOrg" viewBox="0 0 15.058 20.903">
          <title>machine icon</title>
          <g
            id="Group_689"
            data-name="Group 689"
            transform="translate(-33.917 -327.488)"
          >
            <g
              id="noun-vending-machine-4416890"
              transform="translate(34.417 327.988)"
            >
              <path
                id="Path_10890"
                data-name="Path 10890"
                d="M185.748,65.4H195.81a1.989,1.989,0,0,0,2-2V47.5a1.989,1.989,0,0,0-2-2H185.748a1.989,1.989,0,0,0-2,2V63.406A1.989,1.989,0,0,0,185.748,65.4ZM184.49,47.5a1.247,1.247,0,0,1,1.258-1.258H195.81a1.247,1.247,0,0,1,1.258,1.258V63.406a1.247,1.247,0,0,1-1.258,1.258H185.748a1.247,1.247,0,0,1-1.258-1.258Z"
                transform="translate(-183.75 -45.5)"
                fill="#f8932d"
                stroke="#f8932d"
                stroke-width="1"
              />
              <path
                id="Path_10894"
                data-name="Path 10894"
                d="M253.251,112h-1.725a.379.379,0,0,0-.4.4v1.885a.379.379,0,0,0,.4.4h1.725a.379.379,0,0,0,.4-.4V112.4A.379.379,0,0,0,253.251,112Zm-.4,1.885h-.923V112.8h.923Z"
                transform="translate(-247.186 -108.436)"
                fill="#f8932d"
              />
              <path
                id="Path_10895"
                data-name="Path 10895"
                d="M319.821,112h-1.781a.391.391,0,0,0-.414.414v1.947a.391.391,0,0,0,.414.414h1.781a.391.391,0,0,0,.414-.414v-1.947A.391.391,0,0,0,319.821,112Zm-.414,1.947h-.953v-1.118h.953Z"
                transform="translate(-310.32 -108.436)"
                fill="#f8932d"
              />
              <path
                id="Path_10896"
                data-name="Path 10896"
                d="M253.251,199.5h-1.725a.379.379,0,0,0-.4.4v1.885a.379.379,0,0,0,.4.4h1.725a.379.379,0,0,0,.4-.4V199.9A.379.379,0,0,0,253.251,199.5Zm-.4,1.845h-.923v-1.083h.923Z"
                transform="translate(-247.187 -192.624)"
                fill="#f8932d"
              />
              <path
                id="Path_10897"
                data-name="Path 10897"
                d="M319.751,199.5h-1.725a.379.379,0,0,0-.4.4v1.885a.379.379,0,0,0,.4.4h1.725a.379.379,0,0,0,.4-.4V199.9A.379.379,0,0,0,319.751,199.5Zm-.4,1.845h-.922v-1.083h.922Z"
                transform="translate(-310.32 -192.624)"
                fill="#f8932d"
              />
              <path
                id="Path_10900"
                data-name="Path 10900"
                d="M.545,7.155c.333,0,.559-.3.565-.736L1.186.724C1.192.286.974,0,.641,0S.082.3.077.737L0,6.431C0,6.8.212,7.158.545,7.155Z"
                transform="matrix(0.017, 1, -1, 0.017, 10.493, 13.235)"
                fill="#f8932d"
              />
              <path
                id="Path_10901"
                data-name="Path 10901"
                d="M.553,7.154c.338,0,.567-.3.573-.736L1.2.724C1.21.286.989,0,.651,0S.084.3.078.737L0,6.431C0,6.8.272,7.157.553,7.154Z"
                transform="matrix(0.017, 1, -1, 0.017, 10.493, 15.66)"
                fill="#f8932d"
              />
            </g>
          </g>
        </symbol>
        <symbol id="userOrg" viewBox="0 0 15.983 21.199">
          <title>user icon</title>
          <g
            id="Path_10757"
            data-name="Path 10757"
            transform="translate(-108.252 -18.326)"
            fill="none"
          >
            <path
              d="M116.251,18.326a5.189,5.189,0,1,1-5.189,5.189A5.189,5.189,0,0,1,116.251,18.326Zm0,21.2a10.779,10.779,0,0,1-7.553-3.084,1.524,1.524,0,0,1-.4-1.456l.3-1.212a4.628,4.628,0,0,1,4.517-3.568h6.278a4.627,4.627,0,0,1,4.517,3.568l.288,1.249a1.526,1.526,0,0,1-.409,1.438A10.779,10.779,0,0,1,116.251,39.525Z"
              stroke="none"
            />
            <path
              d="M 116.2511825561523 20.32599639892578 C 114.4927368164062 20.32599639892578 113.062141418457 21.75659561157227 113.062141418457 23.51503753662109 C 113.062141418457 25.27364730834961 114.4927368164062 26.70437622070312 116.2511825561523 26.70437622070312 C 118.0096130371094 26.70437622070312 119.4402008056641 25.27364730834961 119.4402008056641 23.51503753662109 C 119.4402008056641 21.75659561157227 118.0096130371094 20.32599639892578 116.2511825561523 20.32599639892578 M 113.1125335693359 32.20630645751953 C 111.8833694458008 32.20630645751953 110.8259963989258 33.04152679443359 110.5411987304688 34.23741912841797 L 110.5377197265625 34.25178527832031 L 110.3028030395508 35.20680999755859 C 111.9352416992188 36.7041015625 114.0363311767578 37.52517700195312 116.2511825561523 37.52517700195312 C 118.4595336914062 37.52517700195312 120.5566711425781 36.70798492431641 122.1872406005859 35.21849822998047 L 121.9598617553711 34.23210144042969 C 121.6732864379883 33.0390625 120.6173477172852 32.20630645751953 119.3901290893555 32.20630645751953 L 113.1125335693359 32.20630645751953 M 116.2511825561523 18.32599639892578 C 119.1171417236328 18.32599639892578 121.4402008056641 20.64938735961914 121.4402008056641 23.51503753662109 C 121.4402008056641 26.38099670410156 119.1171417236328 28.70437622070312 116.2511825561523 28.70437622070312 C 113.3852081298828 28.70437622070312 111.062141418457 26.38099670410156 111.062141418457 23.51503753662109 C 111.062141418457 20.64938735961914 113.3852081298828 18.32599639892578 116.2511825561523 18.32599639892578 Z M 113.1125335693359 30.20630645751953 L 119.3901290893555 30.20630645751953 C 121.5493392944336 30.20630645751953 123.4065093994141 31.67329597473145 123.9067306518555 33.77407836914062 L 124.1945724487305 35.02279663085938 C 124.3139114379883 35.54033660888672 124.1661224365234 36.09002685546875 123.7852172851562 36.46041870117188 C 121.8356170654297 38.35529708862305 119.178352355957 39.52517700195312 116.2511825561523 39.52517700195312 C 113.3147125244141 39.52517700195312 110.6493988037109 38.34755706787109 108.6982574462891 36.44154739379883 C 108.3136596679688 36.06591796875 108.1689605712891 35.507568359375 108.2975769042969 34.98569488525391 L 108.5956115722656 33.77407836914062 C 109.0958404541016 31.67360687255859 110.9533081054688 30.20630645751953 113.1125335693359 30.20630645751953 Z"
              stroke="none"
              fill="#f8932d"
            />
          </g>
        </symbol>
      </svg>
    </div>
    <!-- body-row END -->
  </div>
</template>
<script>
import asideMenu from "../Aside/Aside.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    asideMenu,
  },
  data: () => ({
    prev_obj: null,
    drawer: false,
    fav: true,
    menu: false,
    message: false,
    hints: true,
  }),
  methods: {
    hasPermission(obj) {
      if (
        this.userDetails &&
        this.userDetails.user &&
        this.userDetails.user.user_role == "super_admin"
      ) {
        return true;
      } else {
        return (
          this.userDetails &&
          this.userDetails.permissions &&
          this.userDetails.permissions.permission_name.includes(obj)
        );
      }
    },
    changeRoute(obj) {
      if (
        document.getElementsByClassName("active") &&
        document.getElementsByClassName("active")[0]
      ) {
        document.getElementsByClassName("active")[0].classList.remove("active");
      }
      if (
        document.getElementsByClassName(obj) &&
        document.getElementsByClassName(obj)[0]
      ) {
        document.getElementsByClassName(obj)[0].classList.add("active");
      }
      if (this.$router.history.current == null) {
        this.$router.push({ name: obj });
      } else if (
        this.$router.history.current &&
        this.$router.history.current.name != obj
      ) {
        this.$router.push({ name: obj });
      }
    },

    clickProfile() {
      var dropdown = document.getElementsByClassName("userDropDown");
      dropdown[0].style.display =
        dropdown[0].style.display === "block" ? "none" : "block";
    },

    dropdown(obj) {
      if (
        document.getElementsByClassName(obj) &&
        document.getElementsByClassName(obj)[0]
      ) {
        var dropdown = document.getElementsByClassName(obj)[0];
        if (dropdown.classList.contains("activeDropdown")) {
          dropdown.classList.remove("activeDropdown");
          this.dropdown_closer = "";
        } else {
          dropdown.classList.add("activeDropdown");
          var prev_obj = document.getElementsByClassName(this.dropdown_closer);
          if (prev_obj.length > 0) {
            prev_obj[0].classList.remove("activeDropdown");
          }
          this.dropdown_closer = obj;
        }
      }
    },
    logOut() {
      this.menu = false;
      this.$store.dispatch("logOut").then(() => {
        this.$router.push({ name: "login" });
      });
    },
  },
  mounted() {
    // this.test();

    var data = window.location.pathname.replace("/", "");
    this.changeRoute(data);
  },
  computed: {
    ...mapGetters(["userDetails"]),
  },
};
</script>

<style scoped>
.theme--light.v-text-field > .v-input__control > .v-input__slot:before {
  border: none !important;
}
.navbar-brand {
  padding-top: 0rem;
  padding-bottom: 0rem;
}
.icon-bg {
  background-color: #fff;
  border-radius: 10px;
  padding: 0.25rem 6px !important;
}
.h-25 {
  height: 25px !important;
}
ul#menu {
  position: relative;
  width: 100%;
  height: 3em;
  margin: 0;
  padding: 0px;
  color: rgba(0, 0, 0, 0.87);
}
ul#menu > li {
  float: left;
  list-style-type: none;
  position: relative;
}
label {
  position: relative;
  display: block;
  padding-right: 20px;
  line-height: 3em;
  transition: background 0.3s;
  cursor: pointer;
}
label:after {
  content: "";
  position: absolute;
  display: block;
  top: 50%;
  right: 5px;
  width: 0;
  height: 0;
  border-top: 4px solid rgba(0, 0, 0, 0.87);
  border-bottom: 0 solid rgba(0, 0, 0, 0.87);
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  transition: border-bottom 0.1s, border-top 0.1s 0.1s;
}
label:hover,
input:checked ~ label:after {
  border-top: 0 solid rgba(0, 0, 0, 0.87);
  border-bottom: 4px solid rgba(#fff, 0.87);
  transition: border-top 0.1s, border-bottom 0.1s 0.1s;
}
input:checked ~ label {
  background-color: #fff;
}

ul.submenu {
  max-height: 0;
  padding: 0;
  overflow: hidden;
  list-style-type: none;
  background: #fff;
  transition: max-height 0.5s ease-out;
  position: absolute;
  min-width: 100%;
}
ul.submenu li a {
  display: block;
  padding: 5px 12px;
  color: rgba(0, 0, 0, 0.87);
  text-decoration: none;
  transition: background 0.3s;
  white-space: nowrap;
}
ul.submenu li:hover {
  color: #f8932d;
}
ul.submenu li a:hover {
  color: #f8932d;
}
/*hide the inputs*/
input {
  display: none;
}
input:checked ~ ul.submenu {
  max-height: 300px;
  transition: max-height 0.5s ease-in;
}
ul#menu:target {
  outline: none;
  background-color: #fff;
}
.h-bg:hover {
  background-color: #fff !important;
}

.v-list-group--active .icon-bg {
  background-color: #f8932d !important;
}
.v-list-group--no-action {
  background-color: transparent !important;
}
.v-list-group--active {
  background-color: #fff !important;
}
.v-list-group--no-action:hover {
  background-color: #fff !important;
}
.mb--15 {
  margin-bottom: 15px !important;
}
.v-list-item__content:hover {
  color: #f8932d;
}
.fontstyle {
  font-family: Bebas Neue Pro, Regular !important;
}
</style>
