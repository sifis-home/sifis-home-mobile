
<template>
  <StackLayout>
    <FlexboxLayout v-if="this.connectionType === 'none'" flexDirection="column" style="color: #1D1F21; padding: 8; background-color: #F4A600;">
      <Label :text="'No Internet connection. Please try again.'"></Label>
    </FlexboxLayout>
  </StackLayout>
</template>

<script>
import { Connectivity } from '@nativescript/core'

export default {
  name: "InternetConnection",
  data() {
    return {
      connectionType: this.connectionType,
      timer: ''
    }
  },
  methods: {
    checkConnection() {
      let type = Connectivity.getConnectionType();

      switch (type) {
        case Connectivity.connectionType.none:
          this.connectionType = "none";
          break;
        case Connectivity.connectionType.wifi:
          this.connectionType = "Wi-Fi";
          break;
        case Connectivity.connectionType.mobile:
          this.connectionType = "Mobile";
          break;
        case Connectivity.connectionType.bluetooth:
          this.connectionType = "Bluetooth";
          break;
        default:
          break;
      }
    },
  },
  created() {
    this.checkConnection();
    this.timer = setInterval(this.checkConnection, 10000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
}
</script>

<style scoped>

</style>