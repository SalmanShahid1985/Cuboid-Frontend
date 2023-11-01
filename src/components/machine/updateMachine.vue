<template>
  <div>
    <div id="myTable">
      <div :class="'R' + r" class="row" v-for="(r, i) in row" :key="i">
        <div
          :class="'col-md-' + data.channel_width"
          v-for="(data, index) in getChannelsOfMachine.filter(
            (x) => x.row_number == r
          )"
          :key="index"
          class="channalDiv"
          v-if="data.row_number == r"
        >
          <span
            v-b-tooltip.hover
            title="Remove Chanel"
            v-if="hasPermission('product_remove')"
            style="cursor: pointer; position: absolute; right: 0px; top: 0px"
            @click="RemoveChanel(data, r)"
            ><i class="fas fa-trash-alt"></i>
          </span>
          <center>
            <div
              v-if="hasPermission('channel_delete')"
              @click="
                mergeChanal(
                  data,
                  getChannelsOfMachine.filter((x) => x.row_number == r)
                )
              "
            >
              <span
                style="cursor: pointer; margin: 5px"
                v-b-tooltip.hover
                title="Merge"
              >
                <i color="#f8932d" class="fas fa-object-ungroup"></i>
              </span>
            </div>
            <div
              v-if="data.channel_width > 1 && hasPermission('channel_unmerge')"
              @click="unmergeChanal(data)"
            >
              <span
                style="cursor: pointer; margin: 5px"
                v-b-tooltip.hover
                title="Un Merge"
              >
                <i color="#f8932d" class="far fa-object-ungroup"></i
              ></span>
            </div>
            <div>
              <div
                v-b-tooltip.hover
                title="Channel Number"
                style="cursor: pointer; margin: 5px; font-size: 12px"
                @click="chanalclick(data)"
              >
                <a>{{ data.channel_name }}</a>
              </div>
            </div>
            <span
              v-b-tooltip.hover
              title="Product Quantity"
              v-if="data.channel_product_quantity"
              >{{ data.channel_product_quantity }}</span
            >

            <span v-b-tooltip.hover title="Product Name" v-if="data.products">
              {{ data.products.product_name }} <br />
              <span
                style="cursor: pointer; margin: 5px"
                v-b-tooltip.hover
                title="Remove Quantity"
                @click="RemoveQunatity(data)"
                v-if="
                  hasPermission('product_remove') &&
                  data.channel_product_quantity
                "
                ><i class="fas fa-trash-alt"></i>
              </span>
              <span
                style="cursor: pointer; margin: 5px"
                v-b-tooltip.hover
                title="Add Quantity"
                @click="AddQunatity(data)"
                v-if="hasPermission('product_add')"
                ><i class="fa fa-plus" aria-hidden="true"></i></span
            ></span>
          </center>
        </div>
        <div class="col-md-1">
          <v-btn
            v-b-tooltip.hover
            title="Add Channel"
            dark
            color="main_bg_color"
            v-if="
              hasPermission('channel_create') &&
              getChannelsOfMachine.filter((x) => x.row_number == r).length < 10
            "
            @click="
              addChanal(
                r,
                getChannelsOfMachine.filter((x) => x.row_number == r)
              )
            "
          >
            <i class="fas fa-plus mr-2"></i
          ></v-btn>
        </div>
        <div class="col-md-1">
          <v-btn
            v-if="hasPermission('row_delete')"
            v-b-tooltip.hover
            title="Remove Row"
            dark
            color="main_bg_color"
            @click="delRow(r)"
          >
            <i class="fas fa-minus mr-2"></i
          ></v-btn>
        </div>
      </div>
    </div>
    <v-card-actions v-if="hasPermission('row_add') && row < 7" class="pt-5">
      <v-btn dark color="main_bg_color" @click="addRow">
        <i class="fas fa-plus mr-2"></i>Add Row</v-btn
      >
    </v-card-actions>
    <b-modal
      size="xl"
      id="addChannel"
      hide-footer
      centered
      style="height: 500px"
      no-close-on-backdrop
    >
      <template slot="modal-title">
        <span>Add Channel in Machine</span>
      </template>

      <v-row v-if="chanelModel">
        <v-col class="col-6">
          <v-text-field
            :value="chanelModel.row_number"
            label="Row # "
            disabled
          ></v-text-field>
        </v-col>
        <v-col class="col-6">
          <v-text-field
            v-model="chanelModel.channel_name"
            label="Channel : "
          ></v-text-field>
        </v-col>
        <v-col class="col-6">
          <v-select
            :items="getproductList"
            item-value="_id"
            item-text="product_name"
            v-model="chanelModel.channel_product_id"
            label="Product"
            color="blue darken-3"
          ></v-select>
        </v-col>
        <v-col class="col-6">
          <v-text-field
            v-model="chanelModel.channel_extraction_time"
            label="Extraction Time"
          ></v-text-field>
        </v-col>
        <v-col class="col-6">
          <strong>Possition</strong>
          <v-radio-group v-model="chanelModel.position" row>
            <v-radio label="Start" value="start"></v-radio>
            <v-radio label="End" value="end"></v-radio>
            <v-radio label="Random" value="random"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col v-if="chanelModel.position == 'random'" class="col-6">
          <v-select
            :items="mergeRow"
            item-value="_id"
            item-text="channel_name"
            v-model="chanelModel.channel_position"
            label="Possition After Channel"
            color="blue darken-3"
          ></v-select>
        </v-col>
        <v-col class="col-6">
          <strong>Status</strong>
          <v-radio-group v-model="chanelModel.channel_status" row>
            <v-radio label="Active" value="Active"></v-radio>
            <v-radio label="InActive" value="InActive"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col class="col-6">
          <v-text-field
            v-model="chanelModel.channel_temperature"
            label="Temperature"
          ></v-text-field>
        </v-col>
        <v-col class="col-6">
          <v-text-field
            v-model="chanelModel.channel_voltage"
            label="voltage"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="col-12">
          <v-btn
            class="mr-4"
            style="margin: 10px"
            dark
            color="main_bg_color"
            @click="addChannelinrow"
          >
            submit
          </v-btn>
          <v-btn style="margin: 10px" @click="clearAssociate"> Close </v-btn>
        </v-col>
      </v-row>
    </b-modal>
    <b-modal
      size="xl"
      id="updateChannel"
      hide-footer
      centered
      style="height: 500px"
      no-close-on-backdrop
    >
      <template slot="modal-title">
        <span>Associate Products with Channels</span>
      </template>
      <v-row v-if="chanelModel">
        <v-col class="col-6">
          <v-text-field
            :value="chanelModel.channel_name"
            label="Channel : "
            disabled
          ></v-text-field>
        </v-col>
        <v-col class="col-6">
          <v-select
            :items="getproductList"
            item-value="_id"
            item-text="product_name"
            v-model="chanelModel.channel_product_id"
            label="Product"
            color="blue darken-3"
          ></v-select>
        </v-col>
        <v-col class="col-6">
          <v-text-field
            v-model="chanelModel.channel_extraction_time"
            label="Extraction Time"
          ></v-text-field>
        </v-col>
        <!-- <v-col class="col-6">
          <v-text-field
            v-model="chanelModel.channel_product_quantity"
            label="Quantity"
          ></v-text-field>
        </v-col> -->

        <v-col class="col-6">
          <strong>Status</strong>
          <v-radio-group v-model="chanelModel.channel_status" row>
            <v-radio label="Active" value="Active"></v-radio>
            <v-radio label="InActive" value="InActive"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col class="col-6">
          <v-text-field
            v-model="chanelModel.channel_temperature"
            label="Temperature"
          ></v-text-field>
        </v-col>
        <v-col class="col-6">
          <v-text-field
            v-model="chanelModel.channel_voltage"
            label="voltage"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="col-12">
          <v-btn
            class="mr-4"
            style="margin: 10px"
            dark
            color="main_bg_color"
            @click="submitAssociate"
          >
            submit
          </v-btn>
          <v-btn style="margin: 10px" @click="clearAssociate"> Close </v-btn>
        </v-col>
      </v-row>
    </b-modal>
    <b-modal
      size="SM"
      id="addQuantity"
      hide-footer
      centered
      style="height: 500px"
      no-close-on-backdrop
    >
      <template slot="modal-title">
        <span>Add Quantity </span>
      </template>
      <v-row>
        <v-col class="col-6">
          <v-text-field
            type="number"
            v-model="quantityModel.channel_product_quantity"
            label="Quantity"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="col-12">
          <v-btn
            class="mr-4"
            style="margin: 10px"
            dark
            color="main_bg_color"
            @click="submitQuantity"
          >
            submit
          </v-btn>
          <v-btn style="margin: 10px" @click="clear"> Close </v-btn>
        </v-col>
      </v-row>
    </b-modal>
    <b-modal
      size="sm"
      id="removeQuantity"
      hide-footer
      centered
      style="height: 500px"
      no-close-on-backdrop
    >
      <b-modal
        size="sm"
        id="addRow"
        hide-footer
        centered
        style="height: 500px"
        no-close-on-backdrop
      >
      </b-modal>
      <template slot="modal-title">
        <span>Remove Quantity</span>
      </template>
      <v-row>
        <v-col class="col-6">
          <v-text-field
            type="number"
            v-model="quantityModel.channel_product_quantity"
            label="Quantity"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="col-12">
          <v-btn
            class="mr-4"
            style="margin: 10px"
            dark
            color="main_bg_color"
            @click="remQuantity"
          >
            submit
          </v-btn>
          <v-btn style="margin: 10px" @click="clear"> Close </v-btn>
        </v-col>
      </v-row>
    </b-modal>
    <b-modal
      size="sm"
      id="mergeChannal"
      hide-footer
      centered
      style="height: 500px"
      no-close-on-backdrop
    >
      <template slot="modal-title">
        <span>Merge Chanal</span>
      </template>
      <v-row>
        <v-col class="col-6">
          <v-select
            :items="mergeRow"
            item-value="_id"
            item-text="channel_name"
            v-model="selectedChanalForMerge"
            multiple
            label="Channals"
            color="blue darken-3"
          ></v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col class="col-12">
          <v-btn
            class="mr-4"
            style="margin: 10px"
            dark
            color="main_bg_color"
            @click="submit_mergChannal"
          >
            submit
          </v-btn>
          <v-btn style="margin: 10px" @click="clear"> Close </v-btn>
        </v-col>
      </v-row>
    </b-modal>

    <b-modal
      size="lg"
      id="addRow"
      hide-footer
      centered
      style="height: 500px"
      no-close-on-backdrop
    >
      <template slot="modal-title">
        <span>Add Row</span>
      </template>
      <v-row>
        <v-col class="col-6">
          <strong>Position</strong>
          <v-radio-group v-model="rowModel.row_position" row>
            <v-radio label="Start" value="start"></v-radio>
            <v-radio label="End" value="end"></v-radio>
            <v-radio label="Random" value="random"></v-radio>
          </v-radio-group>
        </v-col>
        <v-col v-if="rowModel.row_position == 'random'" class="col-6">
          <v-select
            :items="rowsNumber"
            v-model="rowModel.row_number"
            label="Possition After Row"
            color="blue darken-3"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="col-12">
          <v-btn
            class="mr-4"
            style="margin: 10px"
            dark
            color="main_bg_color"
            @click="submit_NewRow"
          >
            submit
          </v-btn>
          <v-btn style="margin: 10px" @click="clear"> Close </v-btn>
        </v-col>
      </v-row>
    </b-modal>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

import Swal from "sweetalert2";
export default {
  mixins: [validationMixin],
  validations: {},
  data: () => ({
    row: null,
    permissions: [],
    mergeWith: null,
    mergeRow: null,
    selectedChanalForMerge: null,
    quantityModel: {
      channel_product_quantity: 0,
      channel_id: "",
      product_id: "",
    },
    chanelModel: {
      channel_name: "",
      channel_product_id: "",
      channel_extraction_time: "",
      channel_status: "",
      row_number: 0,
    },
    remchanel: {
      channel_id: "",
      machine_id: "",
      row_number: 0,
    },

    rowModel: {
      row_position: "",
      row_number: "",
    },
  }),
  computed: {
    ...mapGetters([
      "getcanteenList",
      "getproductList",
      "userDetails",
      "getChannelsOfMachine",
    ]),
    rowsNumber() {
      var rown = [];
      for (var i = 1; i <= this.row; i++) {
        rown.push(i);
      }
      return rown;
    },
  },
  watch: {},
  methods: {
    hasPermission(obj) {
      if (
        this.userDetails &&
        this.userDetails.user &&
        this.userDetails.user.user_role == "super_admin"
      ) {
        return true;
      } else {
        return this.userDetails.permissions.permission_name.includes(obj);
      }
    },
    channalname(obj) {
      return obj.substring(0, 2);
    },
    addChanal(obj, array) {
      this.chanelModel.row_number = obj;
      this.mergeRow = array;
      this.$bvModal.show("addChannel");
    },
    addRow() {
      this.$bvModal.show("addRow");
    },

    mergeChanal(obj, array) {
      this.selectedChanalForMerge = null;
      this.mergeWith = obj;
      var index = array.findIndex((e) => e._id == obj._id);
      var prev = array[index - 1];
      var after = array[index + 1];
      this.mergeRow = array.filter((e) => {
        if (prev && after) {
          return e._id == prev._id || e._id == after._id;
        } else if (prev) {
          return e._id == prev._id;
        } else if (after) {
          return e._id == after._id;
        }
      });
      this.$bvModal.show("mergeChannal");
    },
    async unmergeChanal(obj) {
      await this.$store.dispatch("unmergeChannal", obj);
      await this.$store.dispatch(
        "getmachinechannels",
        this.getChannelsOfMachine[0].machine_id
      );
      this.row = this.getChannelsOfMachine.filter(
        (v, i, a) => a.findIndex((t) => t.row_number === v.row_number) === i
      ).length;
    },
    AddQunatity(obj) {
      this.quantityModel.channel_id = obj._id;
      this.quantityModel.product_id = obj.channel_product_id;
      this.$bvModal.show("addQuantity");
    },
    RemoveQunatity(obj) {
      this.quantityModel.channel_id = obj._id;
      this.quantityModel.channel_product_quantity =
        obj.channel_product_quantity;
      this.quantityModel.product_id = obj.channel_product_id;
      this.$bvModal.show("removeQuantity");
    },
    RemoveChanel(obj, r) {
      this.remchanel.channel_id = obj._id;
      this.remchanel.machine_id = this.getChannelsOfMachine[0].machine_id;
      this.remchanel.row_number = r;
      Swal.fire({
        text: "Are you Sure ,you want to Delete This Channel",
        showCancelButton: true,
        confirmButtonText: "Yes, I am",
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await this.$store.dispatch("delchanel", this.remchanel);
          await this.$store.dispatch(
            "getmachinechannels",
            this.remchanel.machine_id
          );
          this.row = this.getChannelsOfMachine.filter(
            (v, i, a) => a.findIndex((t) => t.row_number === v.row_number) === i
          ).length;
        }
      });
    },
    clear() {
      this.$bvModal.hide("addQuantity");
      this.$bvModal.hide("mergeChannal");
    },
    async submitAssociate() {
      await this.$store.dispatch("updateChannel", this.chanelModel);
      await this.$store.dispatch(
        "getmachinechannels",
        this.chanelModel.machine_id
      );
      this.row = this.getChannelsOfMachine.filter(
        (v, i, a) => a.findIndex((t) => t.row_number === v.row_number) === i
      ).length;
      this.machineModel = this.getChannelsOfMachine;
      this.$bvModal.hide("updateChannel");
    },
    async addChannelinrow() {
      this.chanelModel.machine_id = this.getChannelsOfMachine[0].machine_id;
      await this.$store.dispatch("addChannel", this.chanelModel);
      await this.$store.dispatch(
        "getmachinechannels",
        this.chanelModel.machine_id
      );
      this.row = this.getChannelsOfMachine.filter(
        (v, i, a) => a.findIndex((t) => t.row_number === v.row_number) === i
      ).length;
      this.$bvModal.hide("addChannel");
    },
    async delRow(r) {
      this.chanelModel.machine_id = this.getChannelsOfMachine[0].machine_id;
      this.chanelModel.row_number = r;
      Swal.fire({
        text: "Are you Sure ,you want to Delete Entire row",
        showCancelButton: true,
        confirmButtonText: "Yes, I am",
      }).then(async (result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          await this.$store.dispatch("delRow", this.chanelModel);
          await this.$store.dispatch(
            "getmachinechannels",
            this.chanelModel.machine_id
          );
          this.row = this.getChannelsOfMachine.filter(
            (v, i, a) => a.findIndex((t) => t.row_number === v.row_number) === i
          ).length;
        }
      });
    },
    async submit_NewRow() {
      this.rowModel.machine_id = this.getChannelsOfMachine[0].machine_id;
      await this.$store.dispatch("addRow", this.rowModel);
      await this.$store.dispatch(
        "getmachinechannels",
        this.rowModel.machine_id
      );
      this.row = this.getChannelsOfMachine.filter(
        (v, i, a) => a.findIndex((t) => t.row_number === v.row_number) === i
      ).length;
      this.$bvModal.hide("addRow");
    },
    // async RemoveQunatity(obj) {

    //   await this.$store.dispatch("addChannel", this.chanelModel);
    //   await this.$store.dispatch(
    //     "getmachinechannels",
    //     this.chanelModel.machineId
    //   );
    //   this.$bvModal.hide("addChannel");
    // },
    async submitQuantity() {
      this.quantityModel.channel_product_quantity = parseInt(
        this.quantityModel.channel_product_quantity
      );
      await this.$store.dispatch("addChannelQuantity", this.quantityModel);
      await this.$store.dispatch(
        "getmachinechannels",
        this.getChannelsOfMachine[0].machine_id
      );
      this.row = this.getChannelsOfMachine.filter(
        (v, i, a) => a.findIndex((t) => t.row_number === v.row_number) === i
      ).length;
      this.$bvModal.hide("addQuantity");
    },
    async submit_mergChannal() {
      await this.$store.dispatch("mergeChannal", {
        mergeChannal: this.mergeWith,
        arrayData: this.selectedChanalForMerge,
      });
      await this.$store.dispatch(
        "getmachinechannels",
        this.getChannelsOfMachine[0].machine_id
      );
      this.row = this.getChannelsOfMachine.filter(
        (v, i, a) => a.findIndex((t) => t.row_number === v.row_number) === i
      ).length;
      this.$bvModal.hide("mergeChannal");
    },
    async remQuantity() {
      this.quantityModel.channel_product_quantity = parseInt(
        this.quantityModel.channel_product_quantity
      );
      await this.$store.dispatch("remChannelQuantity", this.quantityModel);
      await this.$store.dispatch(
        "getmachinechannels",
        this.getChannelsOfMachine[0].machine_id
      );
      this.row = this.getChannelsOfMachine.filter(
        (v, i, a) => a.findIndex((t) => t.row_number === v.row_number) === i
      ).length;
      this.$bvModal.hide("removeQuantity");
    },

    clearAssociate() {
      this.$bvModal.hide("updateChannel");
    },

    chanalclick(obj) {
      this.chanelModel = obj;
      this.$bvModal.show("updateChannel");
    },
  },
  mounted() {
    this.permissions = this.userDetails.permissions;
    this.row = this.getChannelsOfMachine.filter(
      (v, i, a) => a.findIndex((t) => t.row_number === v.row_number) === i
    ).length;
  },
  destroyed() {
    this.$store.dispatch("resetmachineState");
  },
};
</script>


<style scoped>
.channalDiv {
  border-style: solid;
  border-color: #f8932d;
  position: relative;
  transition: 1s all;
}
</style>
