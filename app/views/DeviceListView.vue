<template>
  <Page>
    <ActionBar>
      <Label text="Device List" class="font-bold text-lg" />
    </ActionBar>

    <StackLayout>
      <Image
        class="logo"
        src="~/include/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />

      <ActivityIndicator v-show="loading" style="margin-top: 50px;" :busy=loading />

      <GridLayout rows="*" columns="*">
        <RadListView
          style="margin-top: 50px;"
          for="device in devices"
          class="list-group h-full"
        >
          <v-template>
            <Button class="list-button text-center" textWrap="true" @tap="$event => loadDevice(device)">
              <Span :text="device.name" />
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

export default Vue.extend({
  mixins: [ApiMixin],

  data() {
    return {
      loading: true,
      devices: [],
    };
  },
  created() {

    this.getDhtAll().then((response) => {
      console.log("Done");
      console.log(response);

      this.devices.push({ id: 1, name: "Living room thermostat" });
      this.devices.push({ id: 2, name: "Outdoor weather" });
      this.devices.push({ id: 3, name: "Fridge" });
      this.devices.push({ id: 4, name: "Main door camera" });
      this.devices.push({ id: 5, name: "Water leak sensor" });
      console.log(this.devices);


      this.loading = false;
    });
  },
  methods: {
    loadDevice(device) {
      this.$navigateTo(DeviceView, {
        props: {
          id: device.id,
          name: device.name
        }
      });     
    },
},
});
</script>

<style scoped>
</style>