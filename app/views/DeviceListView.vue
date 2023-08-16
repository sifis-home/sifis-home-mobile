<!--
UC06

For demonstrating this use case, we should be able to delete the shelly_1pm topic from the DHT. I suggest to prepare a specific panel on the mobile application where all the shelly_* devices and the domo_light, domo_window_sensor, etc are shown. Then, we can imagine to have a button close to each device, that allows deleting its corresponding topic from the DHT

-->

<template>
  <Page>
    <ActionBar title="Device List" />

    <StackLayout>
      <HeaderView />

      <Image
        class="logo"
        src="~/include/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />

      <ActivityIndicator v-show="loading" style="margin-top: 50px;" :busy=loading />

      <TextView v-show="error" :text="error" class="text-center" editable=false fontSize="16" style="color: red; margin-top:20px" />
      <Button class="list-button text-center" text="Add new" @tap="addDevice" />

      <GridLayout rows="*" columns="*">
        <RadListView
          style="margin-top: 50px;"
          for="device in devices"
          class="list-group">

          <v-template>

            <Button class="list-button text-center" textWrap="true" @tap="$event => loadDevice(device)">
            <Span :text="device.topic_name + '\n' + device.topic_uuid" class="text-sm"/>

          </Button>
        </v-template>

        </RadListView>
      </GridLayout>


    </StackLayout>
  </Page>
</template>

  </Page>
</template>

<script>
import Vue from 'nativescript-vue';
import DeviceView from './DeviceView.vue';
import ApiMixin from '@/mixins/apiMixin';
import HeaderView from './HeaderView.vue';
import DeviceAddView from './DeviceAddView.vue';

export default Vue.extend({
  mixins: [ApiMixin],
  components: {
    HeaderView,
  },
  data() {
    return {
      loading: true,
      devices: [],
      error: '',
    };
  },
  created() {

    //this.getDhtSensors().then((response) => {
    this.getDhtAll().then((response) => {
      console.log("Then");
      console.log("*" + response + "*");
      if(!response) {
        this.error = 'Error connecting to:\n' + this.getDHTAddress();
      }
      else {
        this.devices = response;
        this.loading = false;
      }
    });
  },
  methods: {
    loadDevice(device) {
      this.$navigateTo(DeviceView, {
        props: {
          topic_uuid: device.topic_uuid,
          topic_name: device.topic_name,
          value: device.value,
        }
      });     
    },
/*    editDevice(device) {
      this.$navigateTo(DeviceEditView, {
        props: {
          id: device.topic_uuid,
          name: device.topic_name,
          value: device.value,
        }
      });     
    },*/    
    addDevice() {
      console.log("Device add");
      this.$navigateTo(DeviceAddView, {
        transition: {
          name: 'fade',
          duration: 225,
          curve: 'easeIn',
        },
      });
    },    
},
});
</script>

<style scoped>
</style>