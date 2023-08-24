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
      <Label :text="header" class="font-bold text-lg" />
    </ActionBar>

    <ScrollView orientation="vertical">
      <StackLayout>
        <Image
          class="logo"
          src="~/include/sifis-home-logo.png"
          height="120"
          verticalAlignment="center"
        />

        <!-- UUID is a random string -->
        <Label text="Device name" class="text-label" />
        <StackLayout class="input-field">
          <TextField
            v-if="!this.uuid"
            class="list-button"
            hint="Device name"
            v-model="device_name"
            returnKeyType="next"
          ></TextField>
          <Label v-else :text="device_name" class="text-label" />
        </StackLayout>

        <!-- Topic Name is topic name -->
        <Label text="Device uuid" class="text-label" />
        <StackLayout class="input-field">
          <TextField
            v-if="!this.uuid"
            class="list-button"
            hint="Device topic name"
            v-model="device_uuid"
            returnKeyType="next"
          ></TextField>
          <Label v-else :text="device_uuid" class="text-label" />
        </StackLayout>

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
    </ScrollView>
  </Page>
</template>

<script>
import Vue from 'nativescript-vue';
import apiMixin from '@/mixins/apiMixin';
import DeviceListView from './DeviceListView.vue';

export default Vue.extend({
  mixins: [apiMixin],
  props: {
    properties: Array,
    uuid: String,
    name: String,
    label: String,
  },
  data() {
    return {
      device_uuid: '',
      device_name: '',
      device_id: '',
      mac_address: '',
      login: '',
      password: '',
      edit: false,
      header: 'Add new device',
    };
  },
  created() {
    if (this.label) {
      this.header = this.label;
      this.edit = true;
    }
    if (this.uuid) {
      this.device_uuid = this.uuid;
    } else {
      this.device_uuid = this.uuidv4();
    }
    if (this.name) {
      this.device_name = this.name;
    }

    if (this.properties) {
      if (this.properties.mac_address) {
        this.mac_address = this.properties.mac_address;
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
    uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
    save() {
      let command = {
        topic_name: this.device_name,
        id: this.device_id,
        mac_address: this.mac_address,
        user_login: this.login,
        user_password: this.password,
      };
      if (
        this.device_name &&
        this.device_uuid &&
        this.device_id &&
        this.mac_address &&
        this.login &&
        this.password
      ) {
        this.postDhtSensor(this.device_name, this.device_uuid, command).then(
          (response) => {
            this.$navigateTo(DeviceListView);
          }
        );
      }
    },
  },
});
</script>

<style></style>
