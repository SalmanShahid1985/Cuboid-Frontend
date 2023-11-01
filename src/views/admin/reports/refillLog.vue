<template>
  <div>
    <div class="d-flex justify-space-around align-center mb-2 mt-3">
      <v-card-text>
        <div class="pageHeadingIcon">
          <div class="pageName">
            <svg class="pageNameSvg userManagmentIcon">
              <use xlink:href="#report"></use>
            </svg>
          </div>
          <h2>Refill Log</h2>
        </div>
      </v-card-text>

      <div class="d-flex pb-0">
          <v-btn
              class="mr-4"
              style="background-color: #ecf5f7"
              @click="showFilter = !showFilter"
              ><i class="mr-2"
                ><img
                  src="../../../assets/logos/setting-icon.svg"
                  style="margin-top: -4px; width: 18px; height: 18px"
                /> </i
          >{{showFilter ? 'Hide':'Show'}} Filters</v-btn>
      </div>
    </div>
    <div class="col-12 d-flex">
      <div :class="showFilter ? 'col-md-9' : 'col-md-12'" class="col-md-9 p-0">
        <v-card class="mainCard pa-0 pl-0 ml-0 mt-0 m-3 ">
          <v-card-header>
            <div
                  class="d-flex align-center  right-inner-addon float-right input-container mt-2 mb-2 pb-0 mr-3"
                >
                  <b-icon class="export-svg" icon="download"></b-icon>
              <button  @click="exportCsv()" class="form-control login-field pl-40" style="width: 110px !important;">
                Export CSV
           
              </button>
                              
            </div>          
          </v-card-header>
          <v-card-content>
              <table class="table attention machine-table mb-0">
                <thead class="tarnsactionHead">
                  <tr class="table_row">
                    <th >Date</th>
                    <th  >Machine</th>
                    <th>Location</th>
                    <th >Refiller</th> 
                    <th>Sorce</th>
                    <th>Type</th>
                    <th >Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="table_row">
                    <td>19.05.2022</td>
                    <td class="name">Stor STA</td>
                    <td>Chicken Caesar Lys</td>
                    <td >Chicken Caesar Lys </td>
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td></td>
                  </tr>
                  <tr class="table_row">
                    <td>19.05.2022</td>
                    <td class="name" >Stor STA</td>
                    <td>Chicken Caesar Lys</td>
                    <td>Chicken Caesar Lys </td>
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td></td>
                  </tr>
                  <tr class="table_row">
                     <td>19.05.2022</td>
                    <td class="name">Stor STA</td>
                    <td>Chicken Caesar Lys</td>
                    <td>Chicken Caesar Lys </td>
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td></td>
                  </tr>
                  <tr class="table_row">
                    <td>19.05.2022</td>
                    <td class="name" >Stor STA</td>
                    <td>Chicken Caesar Lys</td>
                    <td >Chicken Caesar Lys </td>
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td></td>
                  </tr>
                  <tr class="table_row">
                    <td>19.05.2022</td>
                    <td class="name" >Stor STA</td>
                    <td>Chicken Caesar Lys</td>
                    <td  >Chicken Caesar Lys </td>
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td></td>
                  </tr>
                </tbody>
                
              </table>
              <div class="mt-3 mb-3 text-center d-flex justify-center">
                <ul class="pagiNation notranslate">
                  <li
                    class="pagiNation-item"
                  >
                    <span class="page-link activepage">
                      1
                    </span>
                  </li>

                  <li
                    class="pagiNation-item"
                  >
                    <span class="page-link"> 2</span>
                  </li>
                  <li
                    class="pagiNation-item"
                  >
                    <span class="page-link">3</span>
                  </li>

                  <li class="pagiNation-item">
                    <span class="page-link"> ... </span>
                  </li>
                  <li
                    class="pagiNation-item"
                  >
                    <span class="page-link"> 9 </span>
                  </li>
                </ul>
                <div class="right-inner-addon input-container pb-0 mr-3">
                  <i style="padding: 13.5px 8px;"
                    ><img
                      src="../../../assets/logos/bxs-down-arrow.svg"
                      height="6px"
                  /></i>
                  <select class="form-control mt-2 p-2 pt-1 pb-1 pr-5">
                    <option value="25" selected="selected">25</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                  </select>
                </div>
                <div class="mt-4"><strong> Total Record: 350 </strong></div>
              </div>
          </v-card-content>
        </v-card> 
      </div>
      <div v-show="showFilter" class="col-md-3 p-0">
        <v-card class="mainCard pa-0 pl-0 ml-0">
          <v-card-header>
            <h6 class="pa-3 b-bottom cardHeading mb-0"><strong>Filters</strong></h6>
          </v-card-header>
          <v-card-content>
              <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Period</label>
              <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
                <i style="padding: 8.2px 12px"
                  ><img
                    src="../../../assets/logos/bxs-down-arrow.svg"
                    height="7px"
                /></i>
                <select
                  class="form-control" style="padding: 0.375rem 0.5rem !important;"
                >
                  <option  value="19.05.2022 00.00 - 19.05.2022 23.59" selected="selected">
                    19.05.2022 00.00 - 19.05.2022 23.59
                  </option>
                  <option  value="10.05.2022 00.00 - 15.05.2022 23.59">
                    10.05.2022 00.00 - 15.05.2022 23.59
                  </option>
                  <option  value="5.05.2022 00.00 - 9.05.2022 23.59">
                    5.05.2022 00.00 - 9.05.2022 23.59
                  </option>
                </select>
              </div>
              <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Machine Tags</label>
              <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
                <i style="padding: 8.2px 12px"
                  ><img
                    src="../../../assets/logos/bxs-down-arrow.svg"
                    height="7px"
                /></i>
                <select
                  class="form-control" style="padding: 0.375rem 0.5rem !important;"
                >
                  <option  value="No Options" selected="selected">
                    No Options
                  </option>
                  <option  value="No Options">
                    No Options
                  </option>
                  <option  value="No Options">
                    No Options
                  </option>
                </select>
              </div>
              <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Machines</label>
              <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
                <i style="padding: 8.2px 12px"
                  ><img
                    src="../../../assets/logos/bxs-down-arrow.svg"
                    height="7px"
                /></i>
                <select
                  class="form-control" style="padding: 0.375rem 0.5rem !important;"
                >
                  <option  value="All" selected="selected">
                    All
                  </option>
                  <option  value="All">
                    All
                  </option>
                  <option  value="All">
                    All
                  </option>
                </select>
              </div>
              <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Locations</label>
              <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
                <i style="padding: 8.2px 12px"
                  ><img
                    src="../../../assets/logos/bxs-down-arrow.svg"
                    height="7px"
                /></i>
                <select
                  class="form-control" style="padding: 0.375rem 0.5rem !important;"
                >
                  <option  value="All" selected="selected">
                    All
                  </option>
                  <option  value="All">
                    All
                  </option>
                  <option  value="All">
                    All
                  </option>
                </select>
              </div>
              <label class="regularFont login-font filterLabels mb-0 m-2 mb-0" style=""
              >Clients</label>
              <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
                <i style="padding: 8.2px 12px"
                  ><img
                    src="../../../assets/logos/bxs-down-arrow.svg"
                    height="7px"
                /></i>
                <select
                  class="form-control" style="padding: 0.375rem 0.5rem !important;"
                >
                  <option  value="All" selected="selected">
                    All
                  </option>
                  <option  value="All">
                    All
                  </option>
                  <option  value="All">
                    All
                  </option>
                </select>
              </div>
              <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Sales</label>
              <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
                <i style="padding: 8.2px 12px"
                  ><img
                    src="../../../assets/logos/bxs-down-arrow.svg"
                    height="7px"
                /></i>
                <select
                  class="form-control" style="padding: 0.375rem 0.5rem !important;"
                >
                  <option  value="All" selected="selected">
                    All
                  </option>
                  <option  value="All">
                    All
                  </option>
                  <option  value="All">
                    All
                  </option>
                </select>
              </div>
              <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >Transaction Type</label>
              <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
                <i style="padding: 8.2px 12px"
                  ><img
                    src="../../../assets/logos/bxs-down-arrow.svg"
                    height="7px"
                /></i>
                <select
                  class="form-control" style="padding: 0.375rem 0.5rem !important;"
                >
                  <option  value="Confirmed Transactions" selected="selected">
                    Confirmed Transactions
                  </option>
                  <option  value="Confirmed Transactions">
                    Confirmed Transactions
                  </option>
                  <option  value="Confirmed Transactions">
                    Confirmed Transactions
                  </option>
                </select>
              </div>
              <label class="regularFont login-font filterLabels mb-0 m-2" style=""
              >VAT</label>
              <div class="right-inner-addon input-container pb-0 m-2 mb-0 mt-1">
                <i style="padding: 8.2px 12px"
                  ><img
                    src="../../../assets/logos/bxs-down-arrow.svg"
                    height="7px"
                /></i>
                <select
                  class="form-control" style="padding: 0.375rem 0.5rem !important;"
                >
                  <option  value="With VAT" selected="selected">
                    With VAT
                  </option>
                  <option  value="With VAT">
                    With VAT
                  </option>
                  <option  value="With VAT">
                    With VAT
                  </option>
                </select>
              </div>
              <hr>
              <div class="mt-3 mb-3 text-center m-2">
                <v-btn class="pl-5 pr-5 w-100" dark color="main_bg_color">
                  Show Results
                </v-btn>
              </div>
          </v-card-content>
        </v-card>
      </div>
    </div>


       <v-card-actions class="pa-5">
        <v-dialog
          v-model="viewdialog"
          transition="dialog-top-transition"
          scrollable
          width="1024px"
        >
          <template v-if="viewdialog" v-slot:default="viewdialog">
            <v-card>
              <v-toolbar
                class="mb-2 text-center justify-center b-border m-2"
                style="box-shadow: none"
              >
                <span>View Product</span>
                <span @click="closeModel" class="crossPossition">
                  <img src="../../../assets/logos/Icon metro-cross.svg" />
                </span>
              </v-toolbar>

              <v-card-text>
             <v-card-content>
              <table class="table attention machine-table mb-0">
                <thead class="tarnsactionHead">
                  <tr>
                    <th >Datsse</th>
                    <th  >Machine</th>
                    <th>Location</th>
                    <th >Refiller</th> 
                    <th>Sorce</th>
                    <th>Type</th>
                    <th >Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>19.05.2022</td>
                    <td class="name">Stor STA</td>
                    <td>Chicken Caesar Lys</td>
                    <td >Chicken Caesar Lys </td>
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td></td>
                  </tr>
                  <tr>
                    <td>19.05.2022</td>
                    <td class="name" >Stor STA</td>
                    <td>Chicken Caesar Lys</td>
                    <td>Chicken Caesar Lys </td>
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td></td>
                  </tr>
                  <tr>
                     <td>19.05.2022</td>
                    <td class="name">Stor STA</td>
                    <td>Chicken Caesar Lys</td>
                    <td>Chicken Caesar Lys </td>
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td></td>
                  </tr>
                  <tr>
                    <td>19.05.2022</td>
                    <td class="name" >Stor STA</td>
                    <td>Chicken Caesar Lys</td>
                    <td >Chicken Caesar Lys </td>
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td></td>
                  </tr>
                  <tr>
                    <td>19.05.2022</td>
                    <td class="name" >Stor STA</td>
                    <td>Chicken Caesar Lys</td>
                    <td  >Chicken Caesar Lys </td>
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td>A1003</td> 
                    <td></td>
                  </tr>
                </tbody>
                
              </table>
              <div class="mt-3 mb-3 text-center d-flex justify-center">
                <ul class="pagiNation">
                  <li
                    class="pagiNation-item"
                  >
                    <span class="page-link activepage">
                      1
                    </span>
                  </li>

                  <li
                    class="pagiNation-item"
                  >
                    <span class="page-link"> 2</span>
                  </li>
                  <li
                    class="pagiNation-item"
                  >
                    <span class="page-link">3</span>
                  </li>

                  <li class="pagiNation-item">
                    <span class="page-link"> ... </span>
                  </li>
                  <li
                    class="pagiNation-item"
                  >
                    <span class="page-link"> 9 </span>
                  </li>
                </ul>
                <div class="right-inner-addon input-container pb-0 mr-3">
                  <i style="padding: 13.5px 8px;"
                    ><img
                      src="../../../assets/logos/bxs-down-arrow.svg"
                      height="6px"
                  /></i>
                  <select class="form-control mt-2 p-2 pt-1 pb-1 pr-5">
                    <option value="25" selected="selected">25</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                  </select>
                </div>
                <div class="mt-4"><strong> Total Record: 350 </strong></div>
              </div>
          </v-card-content>
              </v-card-text>
            </v-card>
          </template>
        </v-dialog>
      </v-card-actions>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Swal from "sweetalert2";

export default {
  components: {
    // LineChart,
  },
  data() {
    return {
      viewdialog: false,
      showFilter: true,
    };
  },
  watch: {},
  methods: {
    exportCsv() {
      var tableClass;

      tableClass = "table_row";

      var rows = [];
      var item = document.getElementsByClassName(tableClass);
      for (var i = 0; i < item.length; i++) {
        var contentRow = [];
        for (var j = 0; j < item[i].querySelectorAll("td, th").length; j++) {
          contentRow.push(item[i].querySelectorAll("td, th")[j].innerText);
        }
        rows.push(contentRow);
      }


      this.downloadCsv(rows.join("\n"));
    },

    downloadCsv(data) {
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.setAttribute("href", url);
      a.setAttribute("download", "Refill Log.csv");
      a.click();
    },
  },
  mounted() {},
  computed: {},
};
</script>

<style scoped>
.v-card__actions > .v-btn.v-btn {
  padding: 0 20px;
}
.login-field {
  border-radius: 8px;
  background-color: #ecf5f7;
  border: none;
  width: 140px;
}
</style>
