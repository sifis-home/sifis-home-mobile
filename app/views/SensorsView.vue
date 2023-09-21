<template>
  <Page>
    <ActionBar title="Sensor status" />
    <ScrollView orientation="vertical">

    <StackLayout>
      <HeaderView />

      <Image
        class="logo"
        src="~/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />

      <ActivityIndicator v-show="loading" style="margin-top: 50px;" :busy=loading />

      <TextView v-show="error" :text="error" class="text-center" editable=false fontSize="16" style="color: red; margin-top:20px" />

        <template v-for="sensor in sensors">
            <Button class="list-button text-center" textWrap="true" @tap="$event => loadDevice(device)">
              <Span :text="getText(device)" class="text-sm"/>
            </Button>
        </template>

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
      loading: true,
      sensors: [],
      error: '',
    };
  },
  created() {
    this.checkSensors();
    this.timer = setInterval(this.checkSensors, 5000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {
    checkSensors()  {
      this.getDhtSensors().then((response) => {
        if(!response) {
          this.error = 'Error connecting to:\n' + this.getDHTAddress();
        }
        else {
          this.sensors = response;
          this.loading = false;
        }
      });
    },
    getText(device) {
      let text = "";
      if(device.value.name) {
        text = device.value.name + "\n";
      }
      text += device.topic_name;
      if(device.value.status) text += "\nStatus: " + device.value.status;
      if(device.value.temperature) text += "\nTemperature: " + device.value.temperature;
      if(device.value.humidity) text+="\nHumidity: " + device.value.humidity;
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

},
});
</script>

<style scoped>
</style>