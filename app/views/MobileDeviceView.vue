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

      <ActivityIndicator v-show="loading" style="margin-top: 50px;" :busy=loading />

      <Label :text="product_name" class="text-center font-bold text-lg" />
      <Label :text="uuid" class="text-center  text-md" />

      <Button class="list-button" text="Get Status" @tap="getDeviceStatus" />

      <TextView :text="stats" editable=false />

    </StackLayout>
  </Page>
</template>

  </Page>
</template>

<script>
import Vue from 'nativescript-vue';

export default Vue.extend({  

  props: {
    id: Number,
    name: String
  },
  data() {
    return {
      loading: true,
      product_name: '', // Demo Device1
      uuid: '', // "01887025-c61f-77e7-b4a9-ad09ab364218"
      stats: [],
    };
  },
  created() {

    this.getDeviceInfo().then((response) => {
      console.log("Done");
      this.product_name = response.product_name;
      this.uuid = response.uuid;

      this.loading = false;
    });
  },

  methods: {
    getDeviceStatus() {

      this.loading = true;
      this.getDeviceStatus().then((response) => {
        this.stats = response;
        this.loading = false;
        });

      
    "cpu_usage": [
        0.010132945,
        0.010217978,
        0.010313579,
        0.009866236,
        0.009690617,
        0.009647967,
        0.009947007,
        0.010283207,
        0.009701527,
        0.008757405,
        0.008650031,
        0.008502737,
        0.008542145,
        0.0086776
    ],
    "mem_usage": {
        "total": 16809451520,
        "free": 14222209024,
        "used": 2587242496,
        "usage": 0.15391594
    },
    "swap_usage": {
        "total": 2147479552,
        "free": 2104487936,
        "used": 42991616,
        "usage": 0.02001957
    },
    "disks": [
        {
            "device": "/dev/sda1",
            "file_system": "ext4",
            "total_space": 52519469056,
            "mount_point": "/",
            "available_space": 9767632896,
            "usage": 0.81401885
        }
    ],
    "uptime": 108270,
    "load_average": [
        0.35,
        0.35,
        0.33
    ]


    },
  },
});
</script>

<style>
</style>
