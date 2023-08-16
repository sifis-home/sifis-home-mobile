
<template>
  <Page>
    <ActionBar>
      <Label text="Mobile Device" class="font-bold text-lg" />
    </ActionBar>

    <StackLayout class="m-16">

      <Image
        class="logo"
        src="~/include/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />


      <Label :text="product_name" class="text-center font-bold text-lg" />
      <Label :text="uuid" class="text-center  text-md" />

      <Button v-if="stats.length === 0" class="list-button" text="Get Status" @tap="getStatus" />
      <Button v-else class="list-button" text="Hide Status" @tap="hideStatus" />

      <ActivityIndicator v-show="loading" style="margin-top: 50px;" :busy=loading />

      <Label v-for="(value, key) in stats" :text="key + ': ' + value" class="text-center text-sm" />

      <Button class="list-button" text="Set value" @tap="setValue" />
      <Button class="list-button" text="Restart" @tap="restart" />
      <Button class="list-button" text="Factory Reset" @tap="reset" />
<!--      <TextView :text="stats" editable=false />-->

      <ActivityIndicator style="margin-top: 20px;" :busy="status > 1" />
      <Label text="Performing factory reset ..." v-show="status == 3" class="text-center text-bold text-md" style="color: red;" />
      <Label text="Restarting Mobile device ..." v-show="status == 2" class="text-center text-bold text-md" style="color: orange;" />
      <Label text="Everything ok" v-show="status == 1" class="text-center text-bold text-md" style="color: green;"/>

    </StackLayout>
  </Page>
</template>

  </Page>
</template>

<script>
import Vue from 'nativescript-vue';
import ApiMixin from '@/mixins/apiMixin';

export default Vue.extend({
  mixins: [ApiMixin],
  props: {
    id: Number,
    name: String
  },
  data() {
    return {
      loading: true,
      status: 0,
      product_name: '', // Demo Device1
      uuid: '', // "01887025-c61f-77e7-b4a9-ad09ab364218"
      stats: [],
    };
  },
  created() {

    this.getDeviceInfo().then((response) => {
      if(response) {
        this.status = 1;
        this.product_name = response.product_name;
        this.uuid = response.uuid;
      }
      else {
        this.product_name = "Error";
        this.uuid = "No response from device";
      }

      this.loading = false;
    });
  },

  methods: {
    getStatus() {
      this.loading = true;
      this.stats = '';
      this.getDeviceStatus().then((response) => {
        this.myTimeout = setTimeout(() => {
          this.stats = response;
          this.loading = false;
        }, 500);
      });
    },
    hideStatus() {
      this.stats = '';
    },

    setValue() {

    },
    reset() {
      this.status = 3;
      this.stats = '';
      this.resetDevice().then((response) => {  
        this.myTimeout = setTimeout(() => {
          this.restart();
        }, 2000);
      });
    },
    restart() {
      this.status = 2;
      this.stats = '';
      this.restartDevice().then((response) => {  
        this.myTimeout = setTimeout(() => {
          this.status = 1;
        }, 2000);
      });
    },

  },
});
</script>

<style>
</style>
