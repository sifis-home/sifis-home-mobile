<template>
  <Page>
    <ActionBar title="Device view" />

    <StackLayout>
      <HeaderView />

      <Image
        class="logo"
        src="~/include/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />


      <Label v-if="topic_value.name" :text="topic_value.name" class="text-center font-bold text-lg"/>
      <Label v-else :text="topic_name" class="text-center font-bold text-lg" />

      <Button v-show="!loading && !is_shelly" :text="getIcon()" class="button-icon" :class="getClass()" />

      <template v-if="is_shelly">
        <Button v-if="topic_value.output1" class="button-icon button-toggle black fas" text.decode="&#xf205;" @tap="toggle" />
        <Button v-else class="button-icon button-toggle grey fas" text.decode="&#xf204;" @tap="toggle" />

        <Label class="text-center font-bold text-sm" :text="'Value ID: ' + topic_value.id" />
        <Label class="text-center font-bold text-sm" :text="'MAC address: ' + topic_value.mac_address" />
        <Label class="text-center font-bold text-sm" :text="'Output1: ' + topic_value.output1" />
        <Label class="text-center font-bold text-sm" :text="'Input1: ' + topic_value.input1" />
      </template>


      <template v-else>
        <template v-if="is_light">'
          <Button v-if="topic_value.status" class="button-icon button-toggle fas" text.decode="&#xf205;" @tap="toggle" />
          <Button v-else class="button-icon button-toggle fas" text.decode="&#xf204;" @tap="toggle" />
        </template>
        <Label v-if="typeof topic_value.status !== 'undefined'" class="text-center font-bold text-sm" :text="'Status: ' + topic_value.status" />
        <Label v-if="typeof topic_value.power !== 'undefined'" class="text-center font-bold text-sm" :text="getPower(topic_value.power)" />
        <Label v-if="typeof topic_value.energy  !== 'undefined'" class="text-center font-bold text-sm" :text="getEnergy(topic_value.energy)" />
      </template>

      <ActivityIndicator v-show="loading" style="margin-top: 50px;" :busy=loading />


      <StackLayout orientation="horizontal" style = "margin-top: 50px;">
        <Label text="" width="40%" />
        <Button v-show="is_shelly" class="button-icon fas" width="10%" text.decode="&#xf044;" @tap="modify" />
        <Button class="button-danger button-icon fas" :width="is_shelly? '10%' : '20%'" text.decode="&#xf2ed;" @tap="deleteDevice" />
        <Label text="" width="40%"/>
      </StackLayout>



    </StackLayout>
  </Page>
</template>

  </Page>
</template>

<script>
import Vue from 'nativescript-vue';
import HeaderView from './HeaderView.vue';
import DeviceAddView from './DeviceAddView.vue';
import apiMixin from '@/mixins/apiMixin';
import Home from './Home.vue';

export default Vue.extend({  
  mixins: [apiMixin],

  components: {
    HeaderView,
  },
  props: {
    topic_uuid: String,
    topic_name: String,
    value: Object,
  },
  data() {
    return {
      topic_value: {},
      loading: false,
      is_shelly: false,
      is_sensor: false,
      is_light: false,
    };
  }, 
  created() {
    console.log("Device view created");
    this.loading = true;
    this.checkSensor();
    this.timer = setInterval(this.checkSensor, 1000);
  },
  
  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {
    getEnergy(energy) {
      return 'Energy: ' + Math.round(energy) + " W/h"; 
    },
    getPower(power) {
      return 'Power: ' + Math.round(power) + " W"; 
    },
    getClass() {
      if(this.topic_name.indexOf('shelly') == 0) {
          if(this.topic_value.output1) return "black fas";
          return "grey fas";
        }
      else if(this.topic_name == 'domo_window_sensor' || this.topic_name == 'domo_door_sensor') {
        if(this.topic_value.status) return "grey far";
        return "black fas";
      }
      else if (this.topic_name == 'domo_pir_sensor') {
        if (this.topic_value.status) return "black fas";
        return "grey far";
      }
      else if(this.topic_name == 'domo_light') {
        if(this.topic_value.status) return "black fas";
        return "grey far";
      }
    },

    getIcon() {
      if(this.topic_name.indexOf('shelly') == 0) {
        if(this.topic_value.output1) return String.fromCharCode(0xf205);  // toggle-on
        return String.fromCharCode(0xf204); // toggle-off
      }
      else if(this.topic_name == 'domo_window_sensor' || this.topic_name == 'domo_door_sensor') {
        if(this.topic_value.status) return String.fromCharCode(0xf058); // circle-check
        return String.fromCharCode(0xf06a); // circle exlamation
      }
      else if (this.topic_name == 'domo_pir_sensor') {
        if (this.topic_value.status) return String.fromCharCode(0xf06a); // circle exlamation
        return String.fromCharCode(0xf058); // circle-check
      }
      else if(this.topic_name == 'domo_light') {
        return String.fromCharCode(0xf0eb); // light bulb
      }
      return String.fromCharCode(0xf059); // circle-question
    },

    checkSensor() {
      //this.loading = true;
      this.getDhtTopicNameUuid(this.topic_name, this.topic_uuid).then((response) => {
        if(!response) {
          this.error = 'Error connecting to:\n' + this.getDHTAddress();
        }
        else {
          this.loading = false;
          this.topic_value = response.value;
          if(this.topic_name.indexOf('shelly') == 0) {
            this.is_shelly = true;
          }
          if( this.topic_name == 'domo_window_sensor' ||
              this.topic_name == 'domo_door_sensor' ||
              this.topic_name == 'domo_pir_sensor') {
            this.is_sensor = true;
          }
          else if(this.topic_name == 'domo_light') {
            this.is_light = true;
          }
        }
      });
    },
    isObject(data) {
      return data !== null && (typeof data === 'object' || Array.isArray(data));
    },
    deleteDevice() {
      confirm('Are you sure you want to delete this device?')
        .then(result => {
          if(result) {
            clearInterval(this.timer);
            this.$navigateTo(Home);
            this.deleteDhtSensor(this.topic_name, this.topic_uuid).then((response) => {
              console.log("Then *" + response + "*");
            });
          }
        });
    },
    modify() {
      console.log("Device modify");
      this.$navigateTo(DeviceAddView, {
        props: {
          uuid: this.topic_uuid,
          name: this.topic_name,
          properties: this.topic_value,
          label: "Configure Device"
        },        
        transition: {
          name: 'fade',
          duration: 225,
          curve: 'easeIn',
        },
      });
    },

    toggle() {
      clearInterval(this.timer);
      if(this.is_shelly) {
      // first toggle output1 status
        this.topic_value.output1 = !this.topic_value.output1;
        // output_number hardcoded to 1
        let action_payload = {
          output_number: 1,
          value: this.topic_value.output1
        };
        let action_payload_string = JSON.stringify(action_payload);
        let command = {
          pub_timestamp: Date.now(),
          command: {
            command_type: "shelly_actuator_command",
            value: {
              mac_address: this.topic_value.mac_address,
              shelly_action: {
                input: {
                  action: {
                    action_name: "set_output",
                    action_payload: action_payload_string
                  }
                }
              }
            }
          }
        };
        this.pubDhtSensor(command).then((response) => {
          console.log("Command Sent, response: *" + JSON.stringify(response) + "*");
        });
      }
      else if(this.is_light) {
        // first toggle topic_value.status
        this.topic_value.status = !this.topic_value.status;

        let command = {
            timestamp: Date.now(),
            command: {
                command_type: "turn_command",
                value: {
                    topic_name: this.topic_name,
                    topic_uuid: this.topic_uuid,
                    desired_state: this.topic_value.status
                }
            }
        };
        console.log("sending command");
        console.log(command);
        this.pubDhtSensor(command).then((response) => {
          console.log("Command Sent, response: *" + JSON.stringify(response) + "*");
        });
      }
      this.timer = setInterval(this.checkSensor, 1000);
    }
  },
});
</script>

<style>
</style>
