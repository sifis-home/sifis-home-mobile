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

      <Label :text="topic_name" class="text-center font-bold text-lg" />
      <Label :text="topic_uuid" class="text-center text-sm" style="margin-bottom: 30px;" />

      <ActivityIndicator v-show="loading" style="margin-top: 50px;" :busy=loading />
      <Button class="list-button v-if="topic_name.includes('shelly_')" text-center" text="Toggle" @tap="toggle" />
      <Button class="list-button v-if="topic_name.includes('shelly_')" text-center" text="Modify" @tap="modify" />

      <Button class="list-button text-center" text="Toggle" @tap="toggle" />
      <Button class="list-button text-center" text="Modify" @tap="modify" />

      <Button class="list-button button-danger text-center" text="Delete" @tap="deleteDevice" />

      <template v-for="(content, key) in topic_value">
        <Label v-if="!isObject(content)" textWrap="true" :text="key + ': ' + content" class="text-center text-sm list-group"/>
        <TextView v-else v-for="(subcontent, subkey) in content" :text="subkey + ': ' + subcontent" editable=false fontSize="12" class="list-group"/>
      </template>



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
      commandName: 'On',
      loading: false,
    };
  }, 
  created() {
    this.topic_value = this.value;
    this.timer = setInterval(this.checkSensor, 5000);
  },
  
  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {
    checkSensor() {
      this.loading = true;
      console.log("checkSensor");
      this.getDhtSensor(this.topic_name, this.topic_uuid).then((response) => {
        console.log("Then");
        console.log("*" + response + "*");
        if(!response) {
          this.error = 'Error connecting to:\n' + this.getDHTAddress();
        }
        else {
          this.topic_value = response;
        }
        this.loading = false;
      });
    },
    isObject(data) {
      return data !== null && (typeof data === 'object' || Array.isArray(data));
    },
    deleteDevice() {
      console.log("delete");
      this.deleteDhtSensor(this.topic_name, this.topic_uuid).then((response) => {
        console.log("Then");
        console.log("*" + response + "*");
      });
    },
    modify() {
      console.log("Device modify");
      let props = [];
      props["ap_mac_address"] = "MAC";
      props["id"] = "7";
      props["user_login"] = "user";
      props["user_password"] = "pass";

      this.$navigateTo(DeviceAddView, {
        props: {
          properties: props
        },        
        transition: {
          name: 'fade',
          duration: 225,
          curve: 'easeIn',
        },
      });
    },
    toggle() {
      console.log("toggle");
      let action_payload = {
        topic_name: this.name,
        topic_uuid: this.id,
        value: this.commandName == 'On' ? true : false,
      };
      let action_payload_string = JSON.stringify(action_payload);
      let command = {
        pub_timestamp: Date.now(),
        command: {
          command_type: "shelly_actuator_command",
          value: {
            mac_address: this.mac_address,
            shelly_action: {
              input: {
                action: {
                  action_name: "set_output",
                  action_payload: action_payload_string,
                },
              },
            },
          },
        },
      };
      this.postDhtSensor(command).then((response) => {
        console.log("Command Sent")
        if(this.commandName == 'On') {
          this.commandName == 'Off';
        }
        else {
          this.commandName == 'On';
        }
      });
    }
  },
});
</script>

<style>
</style>
