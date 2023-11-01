<template>
  <div v-if="machine">
    <div
      class="channel-header 
      d-flex justify-space-around 
      align-center mb-2 mt-3"
    >
      <v-card-text>
        <div class="pageHeadingIcon">
          <div class="pageName">
            <svg class="pageNameSvg userManagmentIcon">
              <use xlink:href="#userManagment"></use>
            </svg>
          </div>
          <h2 class="mb-1">
            Vending Machine : {{ machineName }}
          </h2>
        </div>

        <span class="head-title ml-55">Canteen: {{ canteenName }} </span>
      </v-card-text>

      <div style="display: flex; flex-direction:column;">
        <v-card-actions class="pa-2 pt-0">
          <v-dialog
            v-model="dialog"
            transition="dialog-top-transition"
            scrollable
            width="1024px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-if="hasPermission('user_create')"
                class="mr-4"
                style="background-color: #ecf5f7"
                @click="machinesettings()"
                ><i class="mr-2"
                  ><img
                    src="../../assets/logos/setting-icon.svg"
                    style="margin-top: -4px; width: 18px; height: 18px"
                  /> </i
                >Machine Setting</v-btn
              >
            <v-btn
                dark
                color="main_bg_color"
                @click="getLatestChannelStatusEvent()"
                ><i class="mr-2">
                  <img
                    src="../../assets/logos/Icon-awesome-arrow-alt-circle-right.svg"
                    style="margin-top: -4px; width: 18px; height: 18px"
                  /> </i>
                Get Latest Status
            </v-btn>
            <v-btn
                v-if="row < 10"
                dark
                color="main_bg_color"
                @click="addrowinmachine()"
                ><i class="mr-2">
                  <img
                    src="../../assets/logos/Icon-awesome-arrow-alt-circle-right.svg"
                    style="margin-top: -4px; width: 18px; height: 18px"
                  /> </i
                >
                Add Row
            </v-btn>
            </template>
          </v-dialog>
          <v-btn dark color="main_bg_color" @click="removeRow(1)">
            <i class="mr-2">
            <img
                src="../../assets/logos/Icon-awesome-arrow-alt-circle-right.svg"
                style="margin-top: -4px; width: 18px; height: 18px"
              /> </i
            >Remove Row
          </v-btn>
        </v-card-actions>
        <v-card-actions class="pa-2 pt-0">
        <v-col cols="6">
        <template>
          <v-btn
            block
            dark
            color="main_bg_color"
            @click="createChannelsMapping()"
            ><i class="mr-2">
              <img
                src="../../assets/logos/Icon-awesome-arrow-alt-circle-right.svg"
                style="margin-top: -4px; width: 18px; height: 18px"
              /> </i>
            <span v-if="channels && channels.length">Update Channel Mapping</span>
            <span v-else>Create Channel Mapping</span>
          </v-btn>
        </template>
        
        </v-col>
        <v-col cols="6">
          <template v-if="!channelsMappingBeingCreated && percentageChannelsStatusUpdated >= 99 && !channelsBeingCreated">
          <v-btn
            block
              dark
              color="main_bg_color"
              @click="createChannels()"
              ><i class="mr-2">
                <img
                  src="../../assets/logos/Icon-awesome-arrow-alt-circle-right.svg"
                  style="margin-top: -4px; width: 18px; height: 18px"
                /> </i
              >
              Create Channels
            </v-btn>        
          </template>
          <template v-else>
          <v-btn
            block
            disabled
              ><i class="mr-2">
                <img
                  src="../../assets/logos/Icon-awesome-arrow-alt-circle-right.svg"
                  style="margin-top: -4px; width: 18px; height: 18px"
                /> </i
              >
              Create Channels
            </v-btn>   
          </template>        
        </v-col>         
         
        </v-card-actions>
        <v-card-actions class="pa-2 pt-0">
          <v-col cols="6">
            <v-btn dark color="main_bg_color" style="width:100%;" @click="readRequestForMachineFaults(true)">
              <i class="mr-2">
              <img
                src="../../assets/logos/Icon-awesome-arrow-alt-circle-right.svg"
                style="margin-top: -4px; width: 18px; height: 18px"
                /> </i
              >Read Machine Fault Codes
            </v-btn>       
          </v-col>
          <v-col cols="6">
            <v-btn dark color="main_bg_color" style="width:100%;" @click="sendRequestForRestFault()">
              <i class="mr-2">
              <img
                src="../../assets/logos/Icon-awesome-arrow-alt-circle-right.svg"
                style="margin-top: -4px; width: 18px; height: 18px"
                /> </i
              >Send Request for Reset Fault
            </v-btn>       
          </v-col>         
         
        </v-card-actions>
      </div>
    </div>

    <div v-if="channels && channels.length && channelsMappingBeingCreated" class="channel-header d-flex justify-start">
      <v-card-text style="width: 50%; text-align: left;">
        <p style="font-size: xx-large; font-weight: bold;">
          Channel Mapping Update {{percentageChannelsStatusUpdated}} % Completed
        </p>
      </v-card-text>
    </div>

    <div class="main-bg-clr" v-if="channels && channels.length">
      <div :class="'R'" v-for="(row, i) in channelsByRow" :key="i">
        
        <div class="machine-row d-flex w-100">
          <div class="d-flex w-90">
            <div
              v-for="(data, index) in row"
              :key="index"
              class="w-100 text-center right-border"
            >
              <div class="machine-box">
                <img
                  @click="
                    editChannel(data, row)
                  "
                  class="edit-icon"
                  src="../../assets/logos/edit-icon-bg.svg"
                  alt="Edit Channel"
                  title="Edit Channel"
                />
                <img
                  v-if="data.products"
                  @click="
                    dissociateProduct(data)
                  "
                  class="remove-icon"
                  src="../../assets/logos/delete.svg"
                  alt="Remove Product From The Channel"
                  title="Remove Product From The Channel"
                />
                <!-- ../../assets/logos/machine-img.svg -->
                <img
                  width="100%"
                  height="95%"
                  class="my-auto"
                  :src="
                    getImgUrl(data)
                      ? getImgUrl(data)
                      : require('../../assets/logos/Group 16.png')
                  "
                />
                <!--  -->
              </div>
              <span
                v-b-tooltip.hover
                title="Product Quantity"
                v-if="data.channel_product_quantity"
                >{{ data.channel_product_quantity }}</span
              >

              <span v-b-tooltip.hover title="Product Name" v-if="data.products">
                {{ data.products.product_name }} <br />
              </span>
              <span v-b-tooltip.hover title="Channel Status">
                Channel Status: {{data.channel_machine_status}} <br />
              </span>
            </div>
          </div>
          <div class="r-icon">
            <div class="d-flex" style="margin: 62px auto;justify-content: space-evenly !important;">
              <img
                @click="
                  addnewchannel(i+1, row)
                "
                v-if="row.length < 10"
                src="../../assets/logos/add.svg"
                alt="add"
                class="pr-0 mt-1 actionIcons"
                style="height: 30px"
              />
              <img
                @click="
                  removechannel(i+1, row)
                "
                src="../../assets/logos/subb.svg"
                alt="sub"
                class="actionIcons mt-1"
              />
            </div>
          </div>
        </div>
        <div class="d-flex w-90">
          <div
            v-for="(data, index) in row"
            :key="index"
            class="d-flex pt-1 pb-1"
            style="width: 90%"
          >
            <div class="w-100 text-center">
              <span class="font-weight-bold text-black">
                <span
                  v-b-tooltip.hover
                  title="Channel Name"
                  v-if="data.channel_name"
                >
                  {{ data.channel_name }} <br /> </span
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="channels && channels.length == 0 && channelsMappingBeingCreated" class="channel-header d-flex justify-space-around align-center mb-2 mt-10">
        <v-card-text style="width: 50%; text-align: center;">
          <h1>Retrieving Channels Status from the Machine</h1>
          <p style="font-size: x-large;">
            Please wait, this may take a few minutes. Once the percentage count reaches 100% we will give further instructions.
          </p>               
          <p style="font-size: xx-large; font-weight: bold;">
            {{percentageChannelsStatusUpdated}} % completed
          </p>
        </v-card-text>
      </div>
      <div v-else-if="!channelsMappingBeingCreated && percentageChannelsStatusUpdated >= 99" class="channel-header d-flex justify-space-around align-center mb-2 mt-10">
        <v-card-text style="width: 50%; text-align: center;">
          <h1>Channels Mapping Completed</h1>
          <p style="font-size: large;">
          You can now click on the Create Channels Button in order to automatically create the channels based on the channel mapping that has been created.
          </p>   
        </v-card-text>
      </div>
      <div v-else class="channel-header d-flex justify-space-around align-center mb-2 mt-10">
        <v-card-text style="width: 50%; text-align: center;">
          <h1>Channels not found for the machine</h1>
          <p style="font-size: large;">
          You can create news channels indiviually or through our automated channel mapping algorithm.
          To commence the channels creation process through the automated algorithm, please click on the Create Channel Mapping button.
          Once that is done, please wait for further instructions on this screen.
          </p>   
        </v-card-text>
      </div>
       
    </div>
    <v-card-actions class="pa-5">
      <v-dialog
        v-model="dialog"
        transition="dialog-top-transition"
        scrollable
        width="1024px"
      >
        <template v-if="dialog" v-slot:default="dialog">
          <v-card>
            <v-toolbar
              class="mb-2 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <span>Edit Channel</span>

              <span class="crossPossition" @click="clear">
                <img src="../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>
            <v-card-text>
              <v-row>
                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Channel No <small style="color: red">*</small></label
                  >
                  <div class="right-inner-addon input-container pb-0">
                    <input
                      type="text"
                      v-model="chanelModel.channel_name"
                      disabled
                      class="form-control login-field"
                      placeholder=""
                    />
                  </div>
                </v-col>
                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Merge Channel
                  </label>
                  <div class="right-inner-addon input-container pb-0">
                    <select
                      v-model="chanelModel.merge_to"
                      class="form-control login-field"
                    >
                      <option
                        v-for="(data, index) in mergeRow"
                        :key="index"
                        :value="data._id"
                      >
                        {{ data.channel_name }}
                      </option>
                    </select>
                  </div>
                </v-col>             
                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Thresh Hold
                  </label>
                  <div class="right-inner-addon input-container pb-0">
                    <input
                      type="text"
                      v-model="chanelModel.channel_product_threshold"
                      class="form-control login-field"
                      placeholder=""
                    />
                  </div>
                  <div
                    class="invalid-feedback"
                    v-if="$v.chanelModel.channel_product_threshold.$error"
                  >
                    <span v-if="$v.chanelModel.channel_product_threshold.$error"
                      >Threshold is required</span
                    >
                  </div>
                </v-col>
                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Channel Product limit
                    <small style="color: red">*</small></label
                  >
                  <div class="right-inner-addon input-container pb-0">
                    <input
                      v-model="chanelModel.channel_product_limit"
                      type="number"
                      class="form-control login-field"
                      placeholder=""
                    />
                  </div>
                </v-col>
                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Product <small style="color: red">*</small>
                  </label>
                  <div class="right-inner-addon input-container pb-0">
                    <model-select
                      :options="productOptions"
                      v-model="channel_product_id"
                      class="form-control login-field"
                    >
                    </model-select>
                    <div
                      class="invalid-feedback"
                      v-if="$v.chanelModel.channel_product_id.$error"
                    >
                      <span v-if="$v.chanelModel.channel_product_id.$error"
                        >Product is required</span
                      >
                    </div>
                  </div>
                </v-col>
                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Quantity <small style="color: red">*</small></label
                  >
                  <div class="right-inner-addon input-container pb-0">
                    <input
                      type="number"
                      v-model="chanelModel.channel_product_quantity"
                      class="form-control login-field"
                      placeholder=""
                    />
                  </div>
                  <div
                    class="invalid-feedback"
                    v-if="$v.chanelModel.channel_product_quantity.$error"
                  >
                    <span
                      v-if="!$v.chanelModel.channel_product_quantity.minValue"
                    >
                      Quantity should be greater than Thresh hold</span
                    >
                    <span
                      v-else-if="!$v.chanelModel.channel_product_quantity.maxValue"
                    >
                      Quantity should be less than or equal to product limit</span
                    >
                    <span
                      v-else-if="
                        $v.chanelModel.channel_product_quantity.$error &&
                        $v.chanelModel.channel_product_quantity.minValue
                      "
                    >
                      Quantity is required</span
                    >
                  </div>
                </v-col>

                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Extraction Time (sec)
                    <small style="color: red">*</small></label
                  >
                  <div class="right-inner-addon input-container pb-0">
                    <input
                      type="number"
                      v-model="chanelModel.channel_extraction_time"
                      class="form-control login-field"
                      placeholder="1 sec"
                    />
                  </div>
                  <div
                    class="invalid-feedback"
                    v-if="$v.chanelModel.channel_extraction_time.$error"
                  >
                    <span v-if="$v.chanelModel.channel_extraction_time.$error"
                      >Extraction Time is required</span
                    >
                  </div>
                </v-col>
                <v-col class="col-6">
                  <label class="regularFont login-font" style="">Dispensing Speed </label>
                  <div class="right-inner-addon input-container pb-0">
                    <model-select
                      :options="dispensingSpeedOptions"
                      v-model="chanelModel.dispensing_speed"
                      class="form-control login-field"
                    >
                    </model-select>
                  </div>
                  <div
                    class="invalid-feedback"
                    v-if="$v.chanelModel.dispensing_speed.$error"
                  >
                    <span v-if="$v.chanelModel.dispensing_speed.$error"
                      >Dispensing Speed is required</span
                    >
                  </div>
                </v-col>
                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Status <small style="color: red">*</small></label
                  >
                  <v-radio-group v-model="chanelModel.channel_status" row>
                    <v-radio label="Active" value="Active"></v-radio>
                    <v-radio label="InActive" value="InActive"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Mapped Tray/Channel Number <small style="color: red">*</small></label
                  >
                  <input
                      type="string"
                      disabled
                      v-model="chanelModel.mapped_tray_channel_number"
                      class="form-control login-field"
                      placeholder="11/0"
                    />
                </v-col>
                <v-col class="col-12 d-flex justify-center">
                  <v-btn
                    class="mr-4 modal-btn"
                    dark
                    color="main_bg_color"
                    @click="submitAssociate"
                  >
                    Apply Changes
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
    <v-card-actions class="pa-5">
      <v-dialog
        v-model="RemoveRow"
        transition="dialog-top-transition"
        scrollable
        width="1024px"
      >
        <template v-if="RemoveRow" v-slot:default="RemoveRow">
          <v-card>
            <v-toolbar
              class="mb-2 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <span>Remove Row</span>
              <span class="crossPossition" @click="clear">
                <img src="../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>
            <v-card-text>
              <v-row>
                <v-col class="col-6">
                  <label class="regularFont login-font">Remove Row </label>
                  <div class="right-inner-addon input-container pb-0">
                    <select
                      v-model="rowsNumber"
                      class="form-control login-field"
                    >
                     <option v-for="(r, i) in channelsByRow" :key="i" :value="r">
                      Row {{ r[0].row_number }}
                    </option>
                    </select>
                  </div>
                </v-col>
                <v-col class="col-12 d-flex justify-center">
                  <v-btn
                    class="mr-4 modal-btn"
                    dark
                    color="main_bg_color"
                    @click="rowDeletePermission"
                  >
                    Apply Changes
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
    <v-card-actions class="pa-5">
      <v-dialog
        v-model="remvnewchanneldialog"
        transition="dialog-top-transition"
        scrollable
        width="1024px"
      >
        <template
          v-if="remvnewchanneldialog"
          v-slot:default="remvnewchanneldialog"
        >
          <v-card>
            <v-toolbar
              class="mb-2 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <b><h1>Remove Channel</h1></b>
              <span class="crossPossition" @click="clear">
                <img src="../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>
            <v-card-text>
              <v-row>
                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Row No <small style="color: red">*</small></label
                  >
                  <div class="right-inner-addon input-container pb-0">
                    <input
                      disabled
                      v-model="chanelModel.row_number"
                      type="text"
                      class="form-control login-field"
                      placeholder=""
                    />
                  </div>
                </v-col>
                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Position After Channel<small style="color: red"
                      >*</small
                    ></label
                  >
                  <select
                    v-model="chanelModel.channel_position"
                    class="form-control login-field"
                  >
                    <option
                      v-for="(data, index) in mergeRow"
                      :key="index"
                      :value="data._id"
                    >
                      {{ data.channel_name }}
                    </option>
                  </select>
                </v-col>

                <v-col class="col-12 d-flex justify-center">
                  <v-btn
                    class="mr-4 modal-btn"
                    dark
                    color="main_bg_color"
                    @click="remChannelinrow"
                  >
                    Apply Changes
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
    <v-card-actions class="pa-5">
      <v-dialog
        v-model="addnewchanneldialog"
        transition="dialog-top-transition"
        scrollable
        width="1024px"
      >
        <template
          v-if="addnewchanneldialog"
          v-slot:default="addnewchanneldialog"
        >
          <v-card>
            <v-toolbar
              class="mb-2 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <b><h1>Add Channel</h1></b>
              <span class="crossPossition" @click="clear">
                <img src="../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>
            <v-card-text>
              <v-row>
                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Row No <small style="color: red">*</small></label
                  >
                  <div class="right-inner-addon input-container pb-0">
                    <input
                      disabled
                      v-model="chanelModel.row_number"
                      type="text"
                      class="form-control login-field"
                      placeholder=""
                    />
                  </div>
                </v-col>
                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Thresh Hold
                  </label>
                  <div class="right-inner-addon input-container pb-0">
                    <input
                      type="text"
                      v-model="chanelModel.channel_product_threshold"
                      class="form-control login-field"
                      placeholder=""
                    />
                  </div>
                  <div
                    class="invalid-feedback"
                    v-if="$v.chanelModel.channel_product_threshold.$error"
                  >
                    <span v-if="$v.chanelModel.channel_product_threshold.$error"
                      >Threshold is required</span
                    >
                  </div>
                </v-col>
                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Product <small style="color: red">*</small></label
                  >
                  <div class="right-inner-addon input-container pb-0">
                    <select
                      v-model="channel_product_id"
                      class="form-control login-field"
                    >
                      <option
                        v-for="(d, i) in getproductList"
                        :key="i"
                        :value="d._id"
                      >
                        {{ d.product_name }}
                      </option>
                    </select>
                  </div>
                  <div
                    class="invalid-feedback"
                    v-if="$v.chanelModel.channel_product_id.$error"
                  >
                    <span v-if="$v.chanelModel.channel_product_id.$error"
                      >Product is required</span
                    >
                  </div>
                </v-col>
                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Quantity <small style="color: red">*</small></label
                  >
                  <div class="right-inner-addon input-container pb-0">
                    <input
                      v-model="chanelModel.channel_product_quantity"
                      type="number"
                      class="form-control login-field"
                      placeholder=""
                    />
                  </div>
                  <div
                    class="invalid-feedback"
                    v-if="$v.chanelModel.channel_product_quantity.$error"
                  >
                    <span
                      v-if="!$v.chanelModel.channel_product_quantity.minValue"
                    >
                      Quantity should be greater than Thresh hold</span
                    >
                    <span
                      v-else-if="
                        $v.chanelModel.channel_product_quantity.$error &&
                        $v.chanelModel.channel_product_quantity.minValue
                      "
                    >
                      Quantity is required</span
                    >
                  </div>
                </v-col>
                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Channel Product limit
                    <small style="color: red">*</small></label
                  >
                  <div class="right-inner-addon input-container pb-0">
                    <input
                      v-model="chanelModel.channel_product_limit"
                      type="number"
                      class="form-control login-field"
                      placeholder=""
                    />
                  </div>
                </v-col>

                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Extraction Time <small style="color: red">*</small></label
                  >
                  <div class="right-inner-addon input-container pb-0">
                    <input
                      v-model="chanelModel.channel_extraction_time"
                      type="text"
                      class="form-control login-field"
                      placeholder="1 sec"
                    />
                  </div>
                  <div
                    class="invalid-feedback"
                    v-if="$v.chanelModel.channel_extraction_time.$error"
                  >
                    <span v-if="$v.chanelModel.channel_extraction_time.$error"
                      >Extraction time is required</span
                    >
                  </div>
                </v-col>
                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Position <small style="color: red">*</small></label
                  >
                  <select
                    v-model="chanelModel.position"
                    class="form-control login-field"
                  >
                    <option value="start">Start</option>
                    <option value="end">End</option>
                    <option value="random">Random</option>
                  </select>
                </v-col>

                <v-col v-if="chanelModel.position == 'random'" class="col-6">
                  <label class="regularFont login-font" style=""
                    >Position After Channel<small style="color: red"
                      >*</small
                    ></label
                  >
                  <select
                    v-model="chanelModel.channel_position"
                    class="form-control login-field"
                  >
                    <option
                      v-for="(data, index) in mergeRow"
                      :key="index"
                      :value="data._id"
                    >
                      {{ data.channel_name }}
                    </option>
                  </select>
                </v-col>
                 <v-col class="col-6">
                  <label class="regularFont login-font" style="">Dispensing Speed </label>
                  <div class="right-inner-addon input-container pb-0">
                    <model-select
                      :options="dispensingSpeedOptions"
                      v-model="chanelModel.dispensing_speed"
                      class="form-control login-field"
                    >
                    </model-select>
                  </div>
                  <div
                    class="invalid-feedback"
                    v-if="$v.chanelModel.dispensing_speed.$error"
                  >
                    <span v-if="$v.chanelModel.dispensing_speed.$error"
                      >Dispensing Speed is required</span
                    >
                  </div>
                </v-col>
                <v-col class="col-6">
                  <label class="regularFont login-font" style=""
                    >Status <small style="color: red">*</small></label
                  >
                  <v-radio-group v-model="chanelModel.channel_status" row>
                    <v-radio label="Active" value="Active"></v-radio>
                    <v-radio label="InActive" value="InActive"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col class="col-12 d-flex justify-center">
                  <v-btn
                    class="mr-4 modal-btn"
                    dark
                    color="main_bg_color"
                    @click="addChannelinrow"
                  >
                    Apply Changes
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
    <v-card-actions class="pa-5">
      <v-dialog
        v-model="addRowDialoge"
        transition="dialog-top-transition"
        scrollable
        width="1024px"
      >
        <template v-if="addRowDialoge" v-slot:default="addRowDialoge">
          <v-card>
            <v-toolbar
              class="mb-2 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <span> Add Row </span>
              <span class="crossPossition" @click="clear">
                <img src="../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>
            <v-card-text>
              <v-row>
                <v-col class="col-6">
                  <strong>Position</strong>
                  <select
                    v-model="rowModel.row_position"
                    class="form-control login-field"
                  >
                    <option value="start">Start</option>
                    <option value="end">End</option>
                    <option value="Random">Random</option>
                  </select>
                  <div
                    class="invalid-feedback"
                    v-if="$v.rowModel.row_position.$error"
                  >
                    <span v-if="$v.rowModel.row_position.$error"
                      >Position is required</span
                    >
                  </div>
                </v-col>
                <v-col v-if="rowModel.row_position == 'Random'" class="col-6">
                  <strong>Add Row After *</strong>
                  <select
                    v-model="rowModel.row_number"
                    class="form-control login-field"
                  >
                    <option v-for="(r, i) in channelsByRow" :key="i" :value="r">
                      Row {{ r[0].row_number }}
                    </option>
                  </select>
                </v-col>

                <v-col class="col-12 d-flex justify-center">
                  <v-btn
                    class="mr-4 modal-btn"
                    dark
                    color="main_bg_color"
                    @click="submit_NewRow"
                  >
                    Apply Changes
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
    <v-card-actions class="pa-5">
      <v-dialog
        v-model="machineSetting"
        transition="dialog-top-transition"
        scrollable
        width="426px"
      >
        <template v-if="machineSetting" v-slot:default="machineSetting">
          <v-card>
            <v-toolbar
              class="mb-2 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <span>Machine Settings </span>
              <span class="crossPossition" @click="clear">
                <img src="../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>
            <v-card-text>
              <v-row>
                <v-col class="col-12 justify-center">
                  <label class="regularFont login-font" style=""
                    >Set Temperature <small style="color: red">*</small></label
                  >
                  <div class="right-inner-addon input-container pb-0"> 
                    <input-facade mask="+|-##.#" placeholder="+02.5" type="text" v-model="temperature"
                    class="form-control login-field"
                    />
                  </div>
                  <div class="invalid-feedback" v-if="$v.temperature.$error">
                    <span v-if="$v.temperature.$error"
                      >Temperature is required</span
                    >
                  </div>
                </v-col>
                 <v-col class="col-12 justify-center">
                  <label class="regularFont login-font" style="">
                  Programming Time Waiting for Product Collection (minutes)
                  </label>
                  <div class="right-inner-addon input-container pb-0">
                    <input
                      type="number"
                      v-model="programming_time_wating_for_product_collection"
                      class="form-control login-field"
                      placeholder=""
                      min="1"
                      max="10"
                    />
                  </div>
                </v-col>
                <v-col class="col-12 d-flex justify-center">
                  <v-btn
                    class="mr-4 modal-btn"
                    dark
                    color="main_bg_color"
                    @click="ApplyMachineSettings()"
                  >
                    Apply Changes
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
    <v-card-actions class="pa-5">
      <v-dialog
        v-model="removeRowDialoge"
        transition="dialog-top-transition"
        scrollable
        width="360px"
      >
        <template v-if="removeRowDialoge" v-slot:default="removeRowDialoge">
          <v-card>
            <v-toolbar
              class="mb-2 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <span
                style="font-size: 30px !important; font-weight: 800 !important"
                >Warning
              </span>
              <span class="crossPossition" @click="clear">
                <img src="../../assets/logos/Icon metro-cross.svg" />
              </span>
            </v-toolbar>
            <v-card-text>
              <v-col class="col-12 d-flex justify-center">
                <div
                  class="justify-center"
                  style="color: orange; font-size: 22px"
                >
                  Are You Sure?
                </div>
              </v-col>
              <v-col
                class="col-12 justify-center text-center"
                style="font-size: 20px"
              >
                <div class="justify-center">
                  You Want to delete {{ rowsNumber[0].row_number }} row?
                </div>
                <br />
                <div class="justify-center">
                  On Deletion All products will be added in Waste (If Any)
                </div>
              </v-col>
              <br />
              <v-row>
                <v-col class="col-12 d-flex justify-center">
                  <v-btn
                    class="mr-4 modal-btn"
                    dark
                    color="main_bg_color"
                    @click="removeRowfromMachine"
                  >
                    Submit
                  </v-btn>
                  <v-btn class="modal-btn" @click="clear"> Close </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
    <v-card-actions style="width: 900px" class="pa-5">
      <v-dialog
        v-model="successDialog"
        transition="dialog-top-transition"
        scrollable
      >
        <template v-if="successDialog" v-slot:default="successDialog">
          <v-card>
            <v-toolbar
              class="mb-2 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <span style="font-weight: bolder">Successful</span>
              <span class="crossPossition" @click="clear">
                <img
                  src="../../assets/logos/Icon metro-cross.svg"
                  @click="closeSuccessModel"
                />
              </span>
            </v-toolbar>

            <v-card-text class="pt-10 text-h6">
              <center>
                <span>Machine row is updated successfully</span><br /><br />
                <i
                  ><img src="../../assets/logos/Path 10980.svg" height="100px"
                /></i>
              </center>
              <br /><br />
              <v-col class="col-12 d-flex justify-space-around">
                <v-btn
                  class="modal-btn"
                  style="min-width: 100px !important"
                  @click="closeSuccessModel"
                >
                  Close
                </v-btn>
              </v-col>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
    <v-card-actions style="width: 900px" class="pa-5">
      <v-dialog
        v-model="successDialog2"
        transition="dialog-top-transition"
        scrollable
      >
        <template v-if="successDialog2" v-slot:default="successDialog2">
          <v-card>
            <v-toolbar
              class="mb-2 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <span style="font-weight: bolder">Successful</span>
              <span class="crossPossition" @click="clear">
                <img
                  src="../../assets/logos/Icon metro-cross.svg"
                  @click="closeSuccessModel"
                />
              </span>
            </v-toolbar>

            <v-card-text class="pt-10 text-h6">
              <center>
                <span>Machine settings have been updated successfully</span
                ><br /><br />
                <i
                  ><img src="../../assets/logos/Path 10980.svg" height="100px"
                /></i>
              </center>
              <br /><br />
              <v-col class="col-12 d-flex justify-space-around">
                <v-btn
                  class="modal-btn"
                  style="min-width: 100px !important"
                  @click="closeSuccessModel"
                >
                  Close
                </v-btn>
              </v-col>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
    <v-card-actions style="width: 900px" class="pa-5">
      <v-dialog
        v-model="successDialog3"
        transition="dialog-top-transition"
        scrollable
      >
        <template v-if="successDialog3" v-slot:default="successDialog3">
          <v-card>
            <v-toolbar
              class="mb-2 text-center justify-center b-border m-2"
              style="box-shadow: none"
            >
              <span style="font-weight: bolder">Successful</span>
              <span class="crossPossition" @click="clear">
                <img
                  src="../../assets/logos/Icon metro-cross.svg"
                  @click="closeSuccessModel"
                />
              </span>
            </v-toolbar>

            <v-card-text class="pt-10 text-h6">
              <center>
                <span>{{ getMachineUpdateResponse.message }}</span
                ><br /><br />
                <i
                  ><img
                    src="../../assets/logos/Path 10980.svg"
                    height="100px"
                  />
                </i>
              </center>
              <br /><br />
              <v-col class="col-12 d-flex justify-space-around">
                <v-btn
                  class="modal-btn"
                  style="min-width: 100px !important"
                  @click="closeSuccessModel"
                >
                  Close
                </v-btn>
              </v-col>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-card-actions>
  </div>
  <div v-else>
    <div class="channel-header d-flex justify-space-around align-center mb-2 mt-3">
      <v-card-text style="width: 50%; text-align: center;">
          <h1>Channels not found for the machine</h1>          
      </v-card-text>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minValue, maxValue } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
import { ModelSelect } from "vue-search-select";
import "vue-search-select/dist/VueSearchSelect.css";
import { InputFacade, facade, filter } from 'vue-input-facade'

export default {
  mixins: [validationMixin],
  validations() {
    return {
      temperature: { required },
      rowModel: { row_position: { required } },
      chanelModel: {
        channel_product_quantity: {
          required,
          minValue: minValue(
            parseInt(this.chanelModel.channel_product_threshold)
          ), maxValue: maxValue(
            parseInt(this.chanelModel.channel_product_limit)
          )
        },
        channel_product_id: { required },
        channel_product_threshold: { required },
        channel_extraction_time: { required },
        dispensing_speed: { required },
      },
    };
  },
  data: () => ({
    canteenName: "",
    sec: " sec",
    channel_product_id: '',
    row: null,
    temperature: null,
    permissions: [],
    dialog: false,
    addnewchanneldialog: false,
    remvnewchanneldialog: false,
    addRowDialoge: false,
    RemoveRow: false,
    successDialog2: false,
    successDialog3: false,
    removeRowDialoge: false,
    successDialog: false,
    machineSetting: false,
    delDialog: false,
    allowDel: false,
    mergeWith: null,
    mergeRow: null,
    selectedChanalForMerge: null,
    quantityModel: {
      channel_product_quantity: 0,
      channel_id: "",
      product_id: "",
    },
    chanelModel: {
      row_number: 0,
      channel_product_id: "",
      channel_extraction_time: 0,
      channel_product_limit: 0,
      channel_status: "Active",
      channel_product_threshold: 0,
      channel_product_quantity: 0,
      position: "",
      channel_position: "",
      dispensing_speed: 0,
      mapped_tray_channel_number: ""
    },
    remchanel: {
      channel_id: "",
      machine_id: "",
      row_number: 0,
    },
    rowsNumber: null,
    rowModel: {
      row_position: "",
      row_number: "",
    },
    productOptions: [],
    item2: "",
    channelStatusesIntervalId: 0,
    dispensingSpeedOptions: [],
    channels: null,
    programming_time_wating_for_product_collection: 1,
    machine: null,
    machineName: '',
    percentageChannelsStatusUpdated: 0,
    channelsMappingBeingCreated: false,
    percentageUpdatecheckIntervalId: 0,
    channelsBeingCreated: false,
    channelsByRow: [],
    machineFaults: null

  }),
  computed: {
    ...mapGetters([
      "getcanteenList",
      "getproductList",
      "userDetails",
      "getChannelsOfMachine",
      "getCanteenName",
      "getMachineUpdateResponse",
      "getSelectedMachine",
      "getChannelsMappingBeingCreated",
      "getPercentageChannelStatusUpdatedValue",
      "getChannelsBeingCreated",
      "getChannels",
      "getMachineFaults"
    ]),
  },
  watch: {
    channel_product_id: {
      handler: function()  {
        if(this.channel_product_id != this.chanelModel.channel_product_id) {
          this.chanelModel.channel_product_id = this.channel_product_id;
          const product = this.getproductList.find(
            (product) => product._id === this.channel_product_id
          );
          console.log('product',product);
          if(product) {
            this.chanelModel.channel_product_limit = product.product_max_limit;
            this.chanelModel.channel_product_threshold = product.channel_product_threshold;
            this.chanelModel.channel_extraction_time = product.extraction_time;
            this.chanelModel.dispensing_speed = product.dispensing_speed;
          }

          // var productLimit = this.getproductList.filter(x => {
          //   return x._id == this.channel_product_id
          // })[0].product_max_limit
          // this.chanelModel.channel_product_limit = productLimit;
          // this.chanelModel.dispensing_speed = 
        }
      }
    },
    getChannelsOfMachine: {
      handler: function (res) {
        //if there is data then the channels of the machine will be returned
        if(this.getChannelsOfMachine) {
          this.channels = [...this.getChannelsOfMachine];
          this.channelsByRow = [];
          let previousRowNumber = 0;
          this.channels.forEach(channel => {
            if(channel.row_number !== previousRowNumber) {
              this.channelsByRow.push([channel]);
              previousRowNumber = channel.row_number;
            } else {
              this.channelsByRow[this.channelsByRow.length - 1].push(channel);
            }
          });

        }
      }
    },
    getSelectedMachine: {
      handler: function(res) {
        this.machine = res;
      }
    },
    getChannelsMappingBeingCreated: {
      handler: function(res) {
        this.channelsMappingBeingCreated = res;
      }
    },
    getPercentageChannelStatusUpdatedValue: {
      handler: async function(res) {
        if(res) {
          this.percentageChannelsStatusUpdated = res;
          if(res <= 99) {
            await this.$store.dispatch("setChannelsMappingBeingCreatedToTrue");      
            await this.$store.dispatch("setChannelsBeingCreatedToFalse");      
          } else {
            await this.$store.dispatch("setChannelsMappingBeingCreatedToFalse");
            clearInterval(this.percentageUpdatecheckIntervalId);
            //execute the update channels mapping code that updates the channel number and mapped tray number and mapped channel number
            //if there are channels
            if(this.channels && this.channels.length && this.getSelectedMachine) {
              await this.$store.dispatch("updateChannelsMappingInExistingChannels", {machine_id: this.getSelectedMachine._id});
              await this.$store.dispatch("getChannels", {
               machine_id: this.getSelectedMachine._id
              });
            }
          }
        } else {
          this.percentageChannelsStatusUpdated = 0;
        }
      }
    },
    getChannelsBeingCreated: {
      handler: function(res) {
        this.channelsBeingCreated = res;
      }
    },
    getChannels: {
      handler: function(res) {
        this.channels = res;
        this.channelsByRow = [];
        let previousRowNumber = 0;
        this.channels.forEach(channel => {
          if(channel.row_number !== previousRowNumber) {
            this.channelsByRow.push([channel]);
            previousRowNumber = channel.row_number;
          } else {
            this.channelsByRow[this.channelsByRow.length - 1].push(channel);
          }
        });
      }
    }
  },
  components: {
    ModelSelect,
    InputFacade 
  },
  directives: { facade },
  filters: { facade: filter },
  methods: {
    closeSuccessModel() {
      this.successDialog = false;
      this.successDialog2 = false;
      this.successDialog3 = false;
    },
    formatData() {
      for(let i = 0; i< 20; i++) {
        this.dispensingSpeedOptions.push({value: i, text: i});
      }

      for (let i = 0; i < this.getproductList.length; i++) {
        this.productOptions.push({
          value: this.getproductList[i]._id,
          text: this.getproductList[i].product_name,
        });
      }
    },

    getImgUrl(url) {
      if (url.products && url.products.product_image) {
        return url.products.product_image.replace("public/", "");
      } else {
        return null;
      }
    },
    editChannel(data, array) {
      this.chanelModel = [];

      this.chanelModel = data;
      this.chanelModel.mapped_tray_channel_number = `${data.mapped_tray_number}/${data.mapped_channel_number}`;
      this.selectedChanalForMerge = null;
      this.mergeWith = data;
      const index = array.findIndex((e) => e._id == data._id);
      const prev = array[index - 1];
      const after = array[index + 1];
      this.mergeRow = array.filter((e) => {
        if (prev && after) {
          return e._id == prev._id || e._id == after._id;
        } else if (prev) {
          return e._id == prev._id;
        } else if (after) {
          return e._id == after._id;
        }
      });
      this.channel_product_id = this.chanelModel.channel_product_id
      this.dialog = true;
      this.isEdit = true;
    },
    addnewchannel(obj, array) {
      this.chanelModel = [];
      this.mergeRow = array;
      this.chanelModel.row_number = obj;
      this.addnewchanneldialog = true;
      this.isEdit = true;
    },
    removechannel(obj, array) {
      this.chanelModel = [];
      this.mergeRow = array;
      this.chanelModel.row_number = obj;
      this.remvnewchanneldialog = true;
      this.isEdit = true;
    },
    async ApplyMachineSettings() {
      this.$v.temperature.$touch();
      if (!this.$v.temperature.$invalid) {
        const vm = this;
        console.log('this.temperature', typeof(this.temperature), this.temperature);
        let tempArr =[];
        for(let i=0; i<this.temperature.length; i++){
          tempArr.push(this.temperature[i]);
        } 
        tempArr.splice(tempArr.length-1,0,'.');
        this.temperature = tempArr.join().replace(/\,/g,'');
        const data = {
          id: this.getChannelsOfMachine[0].machine_id,
          machine_temperature: this.temperature,
          programming_time_wating_for_product_collection: this.programming_time_wating_for_product_collection
        };
        await this.$store.dispatch("ApplyMachineSettings", data).then((r) => {
          if (r.success) {
            vm.successDialog2 = true;
            vm.machineSetting = false;
            vm.isEdit = false;
          }
        });
      }
    },
    rowDeletePermission() {
      this.RemoveRow = false;
      this.removeRowDialoge = true;
    },
    async removeRowfromMachine() {
      const vm = this;
      const data = {
        id: this.channels[0].machine_id,
        row: this.rowsNumber[0].row_number,
      };
      await this.$store.dispatch("delRow", data).then((r) => {
        if (r.success) {
          vm.successDialog = true;
          vm.removeRowDialoge = false;
          vm.isEdit = false;
        }
      });
      
      if(this.getSelectedMachine) {
        await this.$store.dispatch("getChannels", {
              machine_id: this.getSelectedMachine._id
        });
      }
      this.channelsByRow = [];
      let previousRowNumber = 0;
      this.channels.forEach(channel => {
        if(channel.row_number !== previousRowNumber) {
          this.channelsByRow.push([channel]);
          previousRowNumber = channel.row_number;
        } else {
          this.channelsByRow[this.channelsByRow.length - 1].push(channel);
        }
      });

    },
    removeRow(obj) {
      this.rowsNumber = obj;
      this.RemoveRow = true;
      this.isEdit = true;
    },
    addrowinmachine() {
      this.addRowDialoge = true;
      this.isEdit = true;
    },
    hasPermission(obj) {
      // if (
      //   this.userDetails &&
      //   this.userDetails.user &&
      //   this.userDetails.user.user_role == "super_admin"
      // ) {
      return true;
      // } else {
      //   return this.userDetails.permissions.permission_name.includes(obj);
      // }
    },
    channalname(obj) {
      return obj.substring(0, 2);
    },
    addChanal(obj, array) {
      this.chanelModel.row_number = obj;
      this.mergeRow = array;
      this.$bvModal.show("addChannel");
    },

    mergeChanal(obj, array) {
      this.selectedChanalForMerge = null;
      this.mergeWith = obj;
      let index = array.findIndex((e) => e._id == obj._id);
      let prev = array[index - 1];
      let after = array[index + 1];
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

    clear() {
      (this.dialog = false),
        (this.addnewchanneldialog = false),
        (this.addRowDialoge = false),
        (this.remvnewchanneldialog = false),
        (this.RemoveRow = false),
        (this.removeRowDialoge = false),
        (this.machineSetting = false),
        (this.delDialog = false),
        (this.allowDel = false);
    },
    async submitAssociate() {
      this.$v.chanelModel.$touch();
      if (!this.$v.chanelModel.$invalid) {
        await this.$store
          .dispatch("updateChannel", this.chanelModel)
          .then((x) => {
            if (!x.success) {
              Swal.fire({
                title: "Error!",
                text: x.message,
                icon: "error",
              });
            } else {
              this.successDialog3 = true;
            }
          });

          if(this.getSelectedMachine) {
            await this.$store.dispatch("getChannels", {
                machine_id: this.getSelectedMachine._id
            });
          }
        
        this.channelsByRow = [];
        let previousRowNumber = 0;
        this.channels.forEach(channel => {
          if(channel.row_number !== previousRowNumber) {
            this.channelsByRow.push([channel]);
            previousRowNumber = channel.row_number;
          } else {
            this.channelsByRow[this.channelsByRow.length - 1].push(channel);
          }
        });
        this.machineModel = this.getChannelsOfMachine;

        this.dialog = false;
        this.isEdit = false;
      }
    },
    async addChannelinrow() {
      this.$v.chanelModel.$touch();
      var vm = this;
      if (!this.$v.chanelModel.$invalid) {
        this.chanelModel.machine_id = this.getChannelsOfMachine[0].machine_id;
        await this.$store.dispatch("addChannel", this.chanelModel).then((x) => {
            if (!x.success) {
              Swal.fire({
                title: "Error!",
                text: x.message,
                icon: "error",
              });
            }  
            else {
        this.successDialog = true;

            }
          });
        
        if(this.getSelectedMachine) {
          await this.$store.dispatch("getChannels", {
                machine_id: this.getSelectedMachine._id
          });
        }
        this.channelsByRow = [];
        let previousRowNumber = 0;
        this.channels.forEach(channel => {
          if(channel.row_number !== previousRowNumber) {
            this.channelsByRow.push([channel]);
            previousRowNumber = channel.row_number;
          } else {
            this.channelsByRow[this.channelsByRow.length - 1].push(channel);
          }
        });
        this.addnewchanneldialog = false;
        this.isEdit = false;
      }
    },
    async remChannelinrow() {
      this.chanelModel.machine_id = this.getChannelsOfMachine[0].machine_id;
      const response = await this.$store.dispatch("delchanel", this.chanelModel);
      if (!response.success) {
            Swal.fire({
              title: "Error!",
              text: response.message,
              icon: "error",
            });
        }  
        else {
          this.successDialog = true;
          if(this.getSelectedMachine) {
            await this.$store.dispatch("getChannels", {
                machine_id: this.getSelectedMachine._id
            });

          }
          
          this.channelsByRow = [];
          let previousRowNumber = 0;
          this.channels.forEach(channel => {
            if(channel.row_number !== previousRowNumber) {
              this.channelsByRow.push([channel]);
              previousRowNumber = channel.row_number;
            } else {
              this.channelsByRow[this.channelsByRow.length - 1].push(channel);
            }
          });
          
          this.remvnewchanneldialog = false;
          this.successDialog = true;
          this.isEdit = false;

        }
      
     
    },
    machinesettings() {
      this.machineSetting = true;
      this.isEdit = true;
    },
    async submit_NewRow() {
      // this.$v.rowModel.row_number = this.$v.rowModel.$model.row_number[0].row_number;
      // console.log('post rowmodel', this.$v.rowModel, this.$v.rowModel.$model, this.$v.rowModel.$model.row_number[0].row_number);
      this.$v.rowModel.$touch();
      if (!this.$v.rowModel.$invalid) {
        if(this.machine) {
          console.log('machine', this.machine);
          this.rowModel.machine_id = this.machine._id;
          this.rowModel.row_number = this.rowModel.row_position === "Random" ? this.$v.rowModel.$model.row_number[0].row_number : "";
          const response = await this.$store.dispatch("addRow", this.rowModel);
          console.log('response',response);
          if(!response.success) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: response.message ? response.message : 'There was an error, process failed'
            });
          } else {
             Swal.fire({
                  icon: 'success',
                  text: `Row added successfully`,
                  title: 'Success'
                });
          }

        } else {
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'An error occured. Machine was not found.'
            });
        }
        
        // await this.$store.dispatch("getmachinechannels", {
        //   _id: this.rowModel.machine_id,
        //   canteen_name: this.canteenName,
        // })
        // if(this.getSelectedMachine) {
        //   await this.$store.dispatch("getChannels", {
        //       machine_id: this.getSelectedMachine._id
        //   }).then(resp => {
        //     console.log('resp',resp);
        //     if(resp.success) {
  
        //       Swal.fire({
        //         icon: 'success',
        //         text: `Row added successfully`,
        //         title: 'Success'
        //       })
  
        //     }
        //     else {
        //       Swal.fire({
        //         icon: 'error',
        //         title: 'Error',
        //         text: resp.message ? resp.message : 'There was an error, process failed'
        //       })
        //     }
        //   });
        // }
        
        this.channelsByRow = [];
        let previousRowNumber = 0;
        this.channels.forEach(channel => {
          if(channel.row_number !== previousRowNumber) {
            this.channelsByRow.push([channel]);
            previousRowNumber = channel.row_number;
          } else {
            this.channelsByRow[this.channelsByRow.length - 1].push(channel);
          }
        });

        this.addRowDialoge = false;
        // this.successDialog3 = true;
        this.isEdit = false;
      }
    },
     getLatestChannelsStatuses(instance, machine_id, canteen_id) {
      this.$store.dispatch("getChannels", {
              machine_id: machine_id
      }).then().catch();

      // this.$store.dispatch("getmachinechannels", {
      //   _id: machine_id,
      //   canteen_name: this.canteenName,
      // });
    },
    getLatestChannelStatusEvent() {
      if(this.getChannelsOfMachine && this.getChannelsOfMachine.length>0) {
         const machineId = this?.getChannelsOfMachine[0].machine_id;
         const canteenId = this?.getChannelsOfMachine[0].machine.canteen_id;
        this.$store.dispatch("requestChannelStatuses", { machine_id: machineId, canteen_id: canteenId });
      }
    },
    async createChannelsMapping() {
      console.log('this.machine',this.machine);
      if(this.machine.door_status === 'Door closed') {
        //send request to the machine controller to begin the channels scan for the machine
        // if(!this.channelsMappingBeingCreated) {
          const response = await this.$store.dispatch("startSelectionForMachine", { machine_id: this.machine._id }); 
          if(!response.success) {
            Swal.fire({
              title: "Error!",
              text: 'The command can not be sent due to an internal error. Please send the command again.',
              icon: "error",
            });
          } else {
            clearInterval(this.percentageUpdatecheckIntervalId);
            this.percentageUpdatecheckIntervalId = setInterval(() => {
                this.percentageChannelsStatusUpdated = this.getPercentageChannelStatusUpdatedValue;
                this.getLatestPercentageUpdate();
            }, 6000);
          }
        // } 
      } else {
          Swal.fire({
            title: "Error!",
            text: 'The command can not be sent because the door is open. Please close the door before sending the command.',
            icon: "error",
          });
      }      
      
    },
    async createChannels() {
      this.channelsBeingCreated = true;
      this.$store.dispatch('resetPercentageOfChannelsStatusUpdatedToZero');
      this.$store.dispatch("setChannelsBeingCreatedToTrue"); 
      await this.$store.dispatch("getChannelsMapping", { machine_id: this.machine._id });
      if(this.getSelectedMachine) {
        //send request to the server to build the channels based on the channels config that has been given by the machine controller
         this.$store.dispatch("getChannels", {
              machine_id: this.getSelectedMachine._id
          }).then().catch();

      }
    },
    getLatestPercentageUpdate() {
      this.$store.dispatch("getPercentageChannelStatusUpdated", { machine_id: this.machine._id, canteen_id: this.machine.canteen_id._id });
    },
   readRequestForMachineFaults(showDataModal) {
     if(showDataModal) {
      if(this.getMachineFaults && this.getMachineFaults.length>0) {
        this.machineFaults = this.getMachineFaults; 
        let table = `
            <table style="margin:auto;">
              <tr style="word-break:normal;">
                <th>Status</th>
                <th>Fault</th>
                <th>Number of Times Fault Appeared</th>
                <th>Partial Number of Times Fault Appeared</th>
                <th>Minutes Accumulated</th>
                <th>Initial Date Time</th>
              </tr>
        `;

        this.machineFaults.forEach(fault => { 
          table += `
            <tr style="word-break:normal;">
              <td>${fault.status}</td>
              <td>${fault.fault || 'No Fault Detected'}</td>
              <td>${fault.numberOfTimesFaultAppeared || 0}</td>
              <td>${fault.partialNumberOFTimesFaultAppeared || 0}</td>
              <td>${fault.minutesAcumulated || ''}</td>
              <td>${fault.initialDateTime || ''}</td>
            </tr>
          `;

        });

        table += `
              </table>
        `;
        Swal.fire({
            title: "Faults Codes of Machine",
            html: table,
            icon: "success",
          });

          
        } else {
          Swal.fire({
            title: "Error!",
            text: 'There are no faults for this machine.',
            icon: "error",
          });
        }
      }

      if(this.getSelectedMachine) {
        this.$store.dispatch("readRequestForMachineFaults", { machine_id: this.getSelectedMachine._id });
      }
    },
    sendRequestForRestFault() {
      if(this.getSelectedMachine) {
        this.$store.dispatch("sendRequestForRestFault", { machine_id: this.getSelectedMachine._id });
        Swal.fire({
          title: "Reset Faults Codes of Machine",
          text: 'The request has been sent successfully.',
          icon: "success",
        });
      }
    },
    async dissociateProduct(data) {
      await this.$store.dispatch("removeProductFromChannel",{channel_id: data._id });
      await this.$store.dispatch("getChannels", { machine_id: this.getSelectedMachine._id }).then().catch();
    }

  },
  mounted() {
    const instance = this;
    this.permissions = this.userDetails.permissions;
    this.$store.dispatch("setChannelsMappingBeingCreatedToFalse");      
    this.$store.dispatch('resetPercentageOfChannelsStatusUpdatedToZero');
    this.$store.dispatch('setChannelsBeingCreatedToFalse');
    this.channelsMappingBeingCreated = this.getChannelsMappingBeingCreated;

    this.percentageChannelsStatusUpdated = 0;
    if(this.getSelectedMachine) {
      this.machine = this.getSelectedMachine;
      this.canteenName = this.machine.canteen_id.canteen_name;
      this.machineName = this.machine.machine_name;
      this.readRequestForMachineFaults(false);
      // if(this.channelsMappingBeingCreated) { 
        if(this.percentageChannelsStatusUpdated < 100) {
          clearInterval(this.percentageUpdatecheckIntervalId);
          this.percentageUpdatecheckIntervalId = setInterval(() => {
            // this.percentageChannelsStatusUpdated = this.getPercentageChannelStatusUpdatedValue;
            this.getLatestPercentageUpdate();
          }, 6000);
        
          this.$store.dispatch("getChannels", {
              machine_id: this.getSelectedMachine._id
          }).then().catch();
          
        } else {
          clearInterval(this.percentageUpdatecheckIntervalId);
        }        
    
      if(this.getChannelsOfMachine && this.getChannelsOfMachine.length>0) {
        // this.machine = this.getChannelsOfMachine;
        this.channels = [...this.getChannelsOfMachine];

        this.channelsByRow = [];
        let previousRowNumber = 0;
        this.channels.forEach(channel => {
          if(channel.row_number !== previousRowNumber) {
            this.channelsByRow.push([channel]);
            previousRowNumber = channel.row_number;
          } else {
            this.channelsByRow[this.channelsByRow.length - 1].push(channel);
          }
        });
  
        this.formatData();
        const machineId = this.machine._id;
        const canteenId = this.machine.canteen_id._id;
        this.programming_time_wating_for_product_collection = this?.machine?.programming_time_wating_for_product_collection || 1;
        this.temperature = this?.machine?.machine_temperature.replace(/C/g,'').replace(/''/g,'') || '+00.0';
        let temp = parseFloat(this.temperature);
        let temp2 = Math.trunc(temp);
        let zeroRem = Math.abs(Math.abs(temp-temp2));
        zeroRem = zeroRem === 0 ? '.0' : '';
        if(temp >= 0 && temp <= 9) {
          this.temperature = `+0${temp}${zeroRem}`;
        } else if(temp < 0) {
          this.temperature = `-0${temp}${zeroRem}`;
        } else {
          this.temperature = `+${temp}${zeroRem}`;
        }
        this.channelStatusesIntervalId = setInterval(() => {
          this.getLatestChannelsStatuses(instance, machineId, canteenId);        
        }, 10000);
  
      }
      
    } else {
      this.machine = null;
    }
  },

  destroyed() {
    clearInterval(this.channelStatusesIntervalId);
    clearInterval(this.percentageUpdatecheckIntervalId);
    this.$store.dispatch("resetmachineState");
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
.v-card__actions > .v-btn.v-btn {
  padding: 0 20px;
}
.theme--light.v-data-table thead {
  background-color: #747474 !important;
}
.right-border {
  border-right: 2px solid #f8932d;
}
.machine-row {
  background-color: #fff;
  border-top-left-radius: 19px;
  border-top-right-radius: 19px;
  border: 2px solid #f8932d;
}
.machine-box {
  background-color: #f7f8e8;
  width: 99px;
  height: 100px;
  margin: 14px auto 8px;
  text-align: center;
  border-radius: 18px;
  padding: 18px;
}
.r-icon {
  width: 10%;
  right: 0;
  border-top-right-radius: 18px;
}
.m-37 {
  margin: 37px auto;
}
.pr-22 {
  padding-right: 22px;
}
.right-border span {
  color: #222222;
  letter-spacing: 1px;
  opacity: 1;
}
.main-bg-clr {
  background-color: rgb(236, 245, 247);
  border-top-left-radius: 19px;
  border-top-right-radius: 19px;
}
.edit-icon {
  width: 36px;
  margin-top: -27px;
  height: 36px;
  margin-left: 58px;
  position: absolute;
  cursor: pointer;
}
.remove-icon {
  width: 20px;
  height: 20px;
  margin-top: 10px;
  margin-left: 65px;
  position: absolute;
  cursor: pointer;
}
.ml-55 {
  margin-left: 55px !important;
}
.head-title {
  font-size: 18px;
  letter-spacing: 1.2px;
  color: #707070;
  opacity: 1;
}
* {
  letter-spacing: 1px;
}
.b-border {
  border-bottom: 1px solid #f8932d;
}
.m-45 {
  margin: 45px auto;
}

.actionIcons {
  width: 30px;
  height: 30px;
  cursor: pointer;
}
.ui.selection.dropdown {
  min-height: 2.71428571em;
}

</style>
