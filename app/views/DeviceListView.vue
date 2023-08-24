<!--
UC06

For demonstrating this use case, we should be able to delete the shelly_1pm topic from the DHT. I suggest to prepare a specific panel on the mobile application where all the shelly_* devices and the domo_light, domo_window_sensor, etc are shown. Then, we can imagine to have a button close to each device, that allows deleting its corresponding topic from the DHT

-->

<template>
  <Page>
    <ActionBar title="Device List" />
    <ScrollView orientation="vertical">

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

<!--      <Button class="small-button text-center" text="Add new" @tap="addDevice" />-->

      <Button class="button-icon fas" width="10%" text.decode="&#x2b;" @tap="addDevice" />

      <template v-for="device in devices">
        <Button class="list-button text-center" textWrap="true" @tap="$event => loadDevice(device)">
          <Span :text="getIcon(device)" :class="getClass(device)" />
          <Span :text="getText(device)" fontAttributes="Bold" class="text-center" />
        </Button>

      </template>

<!--

        <Button class="list-button text-center" textWrap="true" @tap="$event => loadDevice(device)">

          <FormattedString>
              <Span class="fas" text.decode="&#xf0eb;" style="color: red; float: left" />
              <Span class="fas" style="text-align: right; float:right; color: red;" width="20%" text.decode="&#xf06a;" />
              <Span :text="getText(device)" fontAttributes="Bold" class="text-center" />
          </FormattedString>
        </Button>

 -->

<!--            <Button class="list-button text-center" textWrap="true" @tap="$event => loadDevice(device)">

              <Span :text="getText(device)" class="text-sm"/>
            </Button>-->

    </StackLayout>
    </ScrollView>
    
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
      loading: false,
      devices: [],
      error: '',
    };
  },
  created() {
    this.checkDevices();
    this.timer = setInterval(this.checkDevices, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {
    checkDevices()  {
      this.getDhtDevices().then((response) => {
        if(!response) {
          this.error = 'Error connecting to:\n' + this.getDHTAddress();
        }
        else {
          this.error = '';
          this.devices = response;
          this.loading = false;
        }
      });
    },
    
    getClass(device) {
      if(device.topic_name.indexOf('shelly') == 0) {
          if(device.value.output1) return "black fas";
          return "grey fas";
        }
      else if(device.topic_name == 'domo_window_sensor' || device.topic_name == 'domo_door_sensor') {
        if(device.value.status) return "grey far";
        return "black fas";
      }
      else if (device.topic_name == 'domo_pir_sensor') {
        if (device.value.status) return "black fas";
        return "grey far";
      }
      else if(device.topic_name == 'domo_light') {
        if(device.value.status) return "black fas";
        return "grey far";
      }
    },

    getIcon(device) {
      if(device.topic_name.indexOf('shelly') == 0) {
        if(device.value.output1) return String.fromCharCode(0xf205);  // toggle-on
        return String.fromCharCode(0xf204); // toggle-off
      }
      else if(device.topic_name == 'domo_window_sensor' || device.topic_name == 'domo_door_sensor') {
        if(device.value.status) return String.fromCharCode(0xf058); // circle-check
        return String.fromCharCode(0xf06a); // circle exlamation
      }
      else if (device.topic_name == 'domo_pir_sensor') {
        if (device.value.status) return String.fromCharCode(0xf06a); // circle exlamation
        return String.fromCharCode(0xf058); // circle-check
      }
      else if(device.topic_name == 'domo_light') {
        return String.fromCharCode(0xf0eb); // light bulb
      }
      return String.fromCharCode(0xf059); // circle-question
    },
    getText(device) {
      let text = " ";
      if(device.value.name) {
        text += device.value.name;
        if(device.value.area_name) {
          text += " / " + device.value.area_name;
        }
      }
      else {
        text += device.topic_name;
      }
      return text;
    },

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