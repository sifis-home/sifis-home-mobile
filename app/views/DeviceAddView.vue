<!--
UC05
The mobile application should insert a "shelly_1pm" WiFi actuator on the DHT. The mobile application should allow to insert the 
  "id", 
  "MAC address", 
  "login" and 
  "password" fields of the WiFi actuator. 
Please note that the topic_uuid to use is a random UUID. 

This is a possible value of a "shelly_1pm" topic, just after the creation of the topic:

{"topic_name":"shelly_1pm","topic_uuid":"70125dd8-e635-46f0-b725-34e7199b6aba","value":{"id":1,"mac_address":"aa:bb:cc:dd:ee:ff","user_login":"test","user_password":"test"}}


UC07
I think that for demonstrating this use case, it can be sufficient to have the possibility to edit the device information. For example, changing ID, MAC, login, password of the shelly_1pm device.

-->

<template>
  <Page>
    <ActionBar>
      <Label text="Add new device" class="font-bold text-lg" />
    </ActionBar>

    <StackLayout>
      <Image
        class="logo"
        src="~/include/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />

      <!-- The "id" is a numeric identifier of the actuator, i.e. 1, 2, 3, etc. -->
      <Label text="Device ID" class="text-label" />
      <StackLayout class="input-field">
        <TextField
          class="list-button"
          hint="Device ID"
          v-model="device_id"
          returnKeyType="next"
        ></TextField>
      </StackLayout>

      <Label text="MAC address" class="text-label" />
      <StackLayout class="input-field">
        <TextField
          class="list-button"
          hint="MAC address"
          v-model="mac_address"
          returnKeyType="next"
        ></TextField>
      </StackLayout>

      <Label text="Login" class="text-label" />
      <StackLayout class="input-field">
        <TextField
          class="list-button"
          hint="Login"
          v-model="login"
          returnKeyType="next"
        ></TextField>
      </StackLayout>

      <Label text="Password" class="text-label" />
      <StackLayout class="input-field">
        <TextField
          class="list-button"
          hint="Password"
          v-model="password"
          secure="false"
          returnKeyType="next"
        ></TextField>
      </StackLayout>

      <Button class="list-button" text="Save" @tap="save" />
    </StackLayout>
  </Page>
</template>

<script>
import Vue from 'nativescript-vue';
import apiMixin from '@/mixins/apiMixin';

export default Vue.extend({
  mixins: [apiMixin],
  props: {
    properties: Array,
  },
  data() {
    return {
      device_id: '',
      mac_address: '',
      login: '',
      password: '',
    };
  },
  created() {
    if (this.properties) {
      if (this.properties.ap_mac_address) {
        this.mac_address = this.properties.ap_mac_address;
      }
      if (this.properties.id) {
        this.device_id = this.properties.id;
      }
      if (this.properties.user_login) {
        this.login = this.properties.user_login;
      }
      if (this.properties.user_password) {
        this.password = this.properties.user_password;
      }
    }
  },
  methods: {
    save() {
      let command = {
        pub_timestamp: Date.now(),
        command: {
          command_type: 'device_add_command',
          value: {
            id: this.device_id,
            mac_address: this.mac_address,
            login: this.login,
            password: this.password,
          },
        },
      };
      this.postDhtSensor(command).then((response) => {
        alert('Sensor added!');
      });
    },
  },
});
</script>

<style></style>
