import JwtService from "../jwt";
import { apiCall } from "../request";
const axios = require("axios");

export default {
  state: {
    machine: null,
    machineTotal: null,
    singlemachine: null,
    canteen_name: null,
    machineUpdateResponse: null,
    selectedMachine: null,
    channelsMappingBeingCreated: false,
    percentageChannelsStatusUpdated: 0,
    channelsBeingCreated: false,
    channels: null,
    machineFaults: null

  },
  getters: {
    getmachineList(state) {
      return state.machine;
    },
    getMachineUpdateResponse(state) {
      return state.machineUpdateResponse
    },
    getmachineListTotal(state) {
      return state.machineTotal;
    },
    getChannelsOfMachine(state) {
      return state.singlemachine;
    },
    getCanteenName(state) {
      return state.canteen_name;
    },
    getSelectedMachine(state) {
      return state.selectedMachine;
    },
    getChannelsMappingBeingCreated(state) {
      return state.channelsMappingBeingCreated;
    },
    getPercentageChannelStatusUpdatedValue(state) {
      return state.percentageChannelsStatusUpdated;
    },
    getChannelsBeingCreated(state) {
      return state.channelsBeingCreated;
    },
    getChannels(state) {
      return state.channels;
    },
    getMachineFaults(state) {
      return state.machineFaults;
    }   
  },
  actions: {
    async machinesList({ commit }, payload) {
      if (payload.pagination) {
        return await axios
          .get(
            `${process.env.VUE_APP_API_URL}api/v1/machine?pagination=false`,
            {
              headers: { Authorization: `Bearer ${JwtService.getToken()}` },
            }
          )
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data.success) {
              commit("setmachineList", response.data.machine);
              commit("setmachineListTotal", response.data.totalRecord);
              return response.data.machine;
            }
          })
          .catch(function (error) {
            commit("setmachineList", null);
            if (error.response) {
              return error.response.data
            }
          });
      } else {
        return await axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/machine?resultPerPage=${payload.resultPerPage}&currentPage=${payload.currentPage}&pagination=true&filter=${payload.filter}&canteen_id=${payload.canteen_id}`, {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          })
          .then((response) => {
            if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
              window.location.href = '/login'
            }
            if (response.data.success) {
              commit("setmachineList", response.data.machine);
              commit("setmachineListTotal", response.data.totalRecord);
              return response.data.machine;
            }
          })
          .catch(function (error) {
            commit("setmachineList", null);
            if (error.response) {
              return error.response.data
            }
          });
      }
    },
    async getmachinechannels({ commit }, payload) {
      commit("setCanteenName", payload.canteen_name);
      commit("setSelectedMachine", payload.machine);
      return await axios
        .get(`${process.env.VUE_APP_API_URL}api/v1/channel/${payload._id}`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then((response) => {
          if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
            window.location.href = '/login'
          }
          if (response.data.success) {
            commit("setSinglemachine", response.data.channel);
          }
          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },
    async updateChannel({ commit }, payload) {
      var mergearay = []
      if (payload.merge_to != null) {

        mergearay.push(payload.merge_to)
      }
      return await axios
        .patch(
          `${process.env.VUE_APP_API_URL}api/v1/channel/${payload._id}`,
          {
            channel_name: payload.channel_name,
            channel_product_id: payload.channel_product_id,
            channel_product_threshold: payload.channel_product_threshold,
            channel_product_threshold: payload.channel_product_threshold,
            channel_extraction_time: payload.channel_extraction_time,
            channel_status: payload.channel_status,
            channel_product_quantity: payload.channel_product_quantity,
            channel_product_limit: payload.channel_product_limit,
            merge_to: mergearay,
            dispensing_speed: payload.dispensing_speed,
          },
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {
          commit('setMachineUpdate', response.data);
          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },
    
    async ApplyMachineSettings({ commit }, payload) {
      return await axios
        .patch(
          `${process.env.VUE_APP_API_URL}api/v1/machine/update_temperature/machine_id/${payload.id}`,
          {
            machine_temperature: payload.machine_temperature,
          },
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then(async(response) => {
          // return response.data;
            return await axios
            .patch(
              `${process.env.VUE_APP_API_URL}api/v1/machine/update-programming-time-waiting/machine_id/${payload.id}`,
              {
                programming_time_wating_for_product_collection: payload.programming_time_wating_for_product_collection
              },
              {
                headers: { Authorization: `Bearer ${JwtService.getToken()}` },
              }
            )
            .then((response) => {
              return response.data;
            })
            .catch(function (error) {
              if (error.response) {
                return error.response.data
              }
            });
            
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },
    async addChannel({ commit }, payload) {
      var mergearay = []
      mergearay.push(payload.merge_to)
      return await axios
        .post(
          `${process.env.VUE_APP_API_URL}api/v1/channel/machine_id/${payload.machine_id}`,
          {
            row_number: payload.row_number,
            channel_product_id: payload.channel_product_id,
            channel_extraction_time: payload.channel_extraction_time,
            channel_status: payload.channel_status,
            merge_to: mergearay,
            channel_product_threshold: payload.channel_product_threshold,
            channel_product_quantity: payload.channel_product_quantity,
            channel_product_limit: payload.channel_product_limit,
            position: payload.position,
            channel_position: payload.channel_position,
            dispensing_speed: payload.dispensing_speed,
          },
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {
          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            debugger
            return error.response.data
          }
        });
    },
    async addRow({ commit }, payload) {
      return await axios
        .post(
          `${process.env.VUE_APP_API_URL}api/v1/channel/row/machine_id/${payload.machine_id}`,
          {
            row_position: payload.row_position,
            row_number: parseFloat(payload.row_number),
          },
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {
          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },
    async delRow({ commit }, payload) {
      return await axios
        .delete(
          `${process.env.VUE_APP_API_URL}api/v1/channel/machine_id/${payload.id}/row_number/${parseInt(payload.row)}?wastage=true`,
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {
          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },
    async delchanel({ commit }, payload) {
      return await axios
        .delete(
          `${process.env.VUE_APP_API_URL}api/v1/channel/${payload.channel_position}/machine_id/${payload.machine_id}/row_number/${parseInt(payload.row_number)}`,
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {
          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },
    async addChannelQuantity({ commit }, payload) {
      return await axios
        .post(
          `${process.env.VUE_APP_API_URL}api/v1/inventory/add/channel_id/${payload.channel_id}/product_id/${payload.product_id}`,
          {
            channel_product_quantity: payload.channel_product_quantity,
          },
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {

          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },
    async remChannelQuantity({ commit }, payload) {
      return await axios
        .patch(
          `${process.env.VUE_APP_API_URL}api/v1/inventory/remove/channel_id/${payload.channel_id}/product_id/${payload.product_id}`,
          {
            channel_product_quantity: payload.channel_product_quantity,
          },
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then((response) => {

          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },
    async getChannelsOfMachine({ commit }, data) {
      commit("setSinglemachine", data);
    },

    async addmachine({ commit }, payload) {
      return await axios
        .post(`${process.env.VUE_APP_API_URL}api/v1/machine`, payload, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then((response) => {
          if (response.status) {
            commit("setmachine", response.data.machineModel);
          }
          return response.data;
        })
        .catch((error) => {
          if (error.response) {
            return error.response.data
          }
        });
    },
    async updatemachine({ commit }, payload) {
      return await axios
        .patch(
          `${process.env.VUE_APP_API_URL}api/v1/machine/${payload._id}`,
          {
            canteen_id: payload.canteen_id,
            machine_name: payload.machine_name,
            machine_code: payload.machine_code,
            machine_location: payload.machine_location,
            machine_status: payload.machine_status,
            temperature: payload.temperature,
            voltage: payload.voltage
          },
          {
            headers: { Authorization: `Bearer ${JwtService.getToken()}` },
          }
        )
        .then(function (response) {
          return response.data;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },
    async removemachine({ commit }, machineId) {
      return await axios
        .delete(`${process.env.VUE_APP_API_URL}api/v1/machine/${machineId}`, {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        })
        .then(function (response) {
          return response;
        })
        .catch(function (error) {
          if (error.response) {
            return error.response.data
          }
        });
    },
    resetmachineState({ commit }) {
      commit("setSinglemachine", null);
    },
    resetmachineListState({ commit }) {
      commit("emptymachineList", null);
    },
    requestMachineStatus({ commit }, machines) {
      machines.machines.forEach(machine => {
        axios
          .get(`${process.env.VUE_APP_API_URL}api/v1/machine/request_machine_status_from_machine/${machine.canteen_id}/${machine.machine_id}`)
          .then((response) => { })
          .catch(function (error) { });
      });
    },
    requestChannelStatuses({ commit }, data) {
      const machineId = data.machine_id;
      const canteenId = data.canteen_id;
      axios
        .get(`${process.env.VUE_APP_API_URL}api/v1/channel/request_channel_status_from_machine/${canteenId}/${machineId}`)
        .then((response) => { })
        .catch(function (error) { });
    },
    turnOnOffLightOfMachine({ commit }, data) {
      axios
        .get(`${process.env.VUE_APP_API_URL}api/v1/machine/update-machine-light-status/${data.canteenId}/${data.machineId}/${data.lightStatus}`)
        .then((response) => { })
        .catch(function (error) { });
    },
    async startSelectionForMachine({ commit }, data) {
      const machineId = data.machine_id;
      commit('setChannelsMappingBeingCreated', true);
      commit('setPercentageOfChannelsStatusUpdated');
      return await axios
      .get(
        `${process.env.VUE_APP_API_URL}api/v1/machine/send-request-channels-scan-data-for-machine/${machineId}`,
        {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        }
      )
      .then(async(response) => {
          return response.data;
      })
      .catch(function (error) {
        if (error.response) {
          return error.response.data
        }
      });
    },
    async getPercentageChannelStatusUpdated({ commit }, data) {
      const machineId = data.machine_id;
      const canteenId = data.canteen_id;
      return await axios
      .get(
        `${process.env.VUE_APP_API_URL}api/v1/machine/get-machine-data/${machineId}`,
        {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        }
      )
      .then((response) => {
        if (response.data.message == 'jwt malformed' || response.data.message == 'jwt expired') {
          window.location.href = '/login'
        }
        if (response.data.success) {
          const machineObj = response.data.data.find(machine => machine._id === machineId);
          if(machineObj) {
            commit("setPercentageOfChannelsStatusUpdated", machineObj.percentageOfChannelsStatusUpdated);
          }
          return response.data;
        }
      })
      .catch(function (error) {
        commit("setmachineList", null);
        if (error.response) {
          return error.response.data
        }
      });
    },
    async setChannelsMappingBeingCreatedToFalse({ commit }) { 
      commit('setChannelsMappingBeingCreated', false);
    },
    async setChannelsMappingBeingCreatedToTrue({ commit }) { 
      commit('setChannelsMappingBeingCreated', true);
    },
    async resetPercentageOfChannelsStatusUpdatedToZero({ commit }) {
      commit('setPercentageOfChannelsStatusUpdated',0); 
    },
    async setChannelsBeingCreatedToFalse({ commit }) {
      commit('setChannelsBeingCreated', false);
    },
    async setChannelsBeingCreatedToTrue({ commit }) {
      commit('setChannelsBeingCreated', true);
    },
    async getChannelsMapping({ commit }, data) {
      const machineId = data.machine_id;
      commit('setChannelsBeingCreated', true);
      return await axios
      .get(
        `${process.env.VUE_APP_API_URL}api/v1/machine/get-channels-mapping/${machineId}`,
        {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        }
      )
      .then(async(response) => {
        return response.data;
      })
      .catch(function (error) {
        if (error.response) {
          return error.response.data
        }
      });

    },
    async getChannels({ commit }, data) {
      const machineId = data.machine_id;
      // commit('setChannelsBeingCreated', true);
      return await axios
      .get(
        `${process.env.VUE_APP_API_URL}api/v1/channel/${machineId}`,
        {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        }
      )
      .then(async(response) => {
        if(response.data.success) {
          commit('setChannels', response.data.channel);
          commit("setSinglemachine", response.data.channel);

        } else {
          commit('setChannels', null);
        }
        return response.data.data;
      })
      .catch(function (error) {
        if (error.response) {
          return error.response.data
        }
      });

    },
    async updateChannelsMappingInExistingChannels({ commit }, data) {
      const machineId = data.machine_id;
      return await axios
      .get(
        `${process.env.VUE_APP_API_URL}api/v1/machine/update-channels-mapping-in-existing-channels/${machineId}`,
        {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        }
      )
      .then(async(response) => {
        return response.data;
      })
      .catch(function (error) {
        if (error.response) {
          return error.response.data
        }
      });

    },
    async sendRequestForRestFault({ commit }, data) {
      const machineId = data.machine_id;
      return await axios
      .get(
        `${process.env.VUE_APP_API_URL}api/v1/machine/request-for-reset-faults/${machineId}`,
        {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        }
      )
      .then(async(response) => {
        return response.data;
      })
      .catch(function (error) {
        if (error.response) {
          return error.response.data
        }
      });
    },
    async readRequestForMachineFaults({ commit }, data) {
      const machineId = data.machine_id;
      return await axios
      .get(
        `${process.env.VUE_APP_API_URL}api/v1/machine/read-request-for-machine-faults/${machineId}`,
        {
          headers: { Authorization: `Bearer ${JwtService.getToken()}` },
        }
      )
      .then(async(response) => {
        if(response.data.success) {
          commit("setMachineFaults", response.data.faults);
        } else {
          commit("setMachineFaults", null);
        } 
        return response.data;
      })
      .catch(function (error) {
        if (error.response) {
          return error.response.data
        }
      });
    }
  },
  mutations: {
    setmachine(state, payload) {
      state.machine.unshift(payload);
    },
    setMachineUpdate(state, payload) {
      state.machineUpdateResponse = payload
    },
    setmachineList(state, payload) {
      state.machine = payload;
    },
    setmachineListTotal(state, payload) {
      state.machineTotal = payload;
    },
    setSinglemachine(state, payload) {
      state.singlemachine = payload;
    },
    setCanteenName(state, payload) {
      state.canteen_name = payload;
    },
    emptymachineList(state, payload) {
      state.machine = payload;
    },
    setSelectedMachine(state, payload) {
      state.selectedMachine = payload;
    },
    setChannelsMappingBeingCreated(state, payload) {
      state.channelsMappingBeingCreated = payload;
    },
    setPercentageOfChannelsStatusUpdated(state, payload) {
      state.percentageChannelsStatusUpdated = payload;
    },
    setChannelsBeingCreated(state, payload) {
      state.channelsBeingCreated = payload;
    },
    setChannels(state, payload) {
      state.channels = payload;
    },
    setMachineFaults(state, payload) {
      state.machineFaults = payload;
    }
  },
};
