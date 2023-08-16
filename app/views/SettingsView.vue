<template>
  <Page>
    <ActionBar title="Settings" />

    <StackLayout>
      <HeaderView />

      <Image
        class="logo"
        src="~/include/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />

      <Label text="Local DHT Server Address" class="text-label" />
      <StackLayout class="input-field">
        <TextField
          class="list-button"
          hint="Local DHT Server address"
          v-model="localServerAddress"
          returnKeyType="next"
        ></TextField>
      </StackLayout>

      <Label text="Remote DHT Server Address" class="text-label" />
      <StackLayout class="input-field">
        <TextField
          class="list-button"
          hint="Remote DHT Server address"
          v-model="remoteServerAddress"
          returnKeyType="next"
        ></TextField>
      </StackLayout>

      <Label text="Type of DHT Server Connection" class="text-label" />
      <StackLayout class="input-field">
        <ListPicker
          class="list-button"
          :items="listOfItems"
          v-model="serverType"
        />
      </StackLayout>

      <Button class="list-button" text="Save" @tap="save" />
    </StackLayout>
  </Page>
</template>

<script>
import Vue from 'nativescript-vue';
import apiMixin from '@/mixins/apiMixin';
import HeaderView from './HeaderView.vue';
import Home from './Home.vue';

export default Vue.extend({
  components: {
    HeaderView,
  },
  data() {
    return {
      localServerAddress: 'https://127.0.0.1',
      remoteServerAddress: 'https://sifis-proxy.riots.fi/dht-proxy.php',
      serverType: 0,
      listOfItems: ['Local', 'Remote'],
    };
  },
  mixins: [apiMixin],
  methods: {
    save() {
      this.setDHTAddress(
        this.localServerAddress,
        this.remoteServerAddress,
        this.serverType
      );
      this.$navigateTo(Home);

      alert('Settings saved').then(function () {
        console.log('Navigate to Home');
      });
    },
  },
  mounted() {
    let configs = this.getDHTConfig();
    if (configs[0]) {
      this.localServerAddress = configs[0];
    }
    if (configs[1]) {
      this.remoteServerAddress = configs[1];
    }
    if (configs[2]) {
      this.serverType = configs[2];
    }
  },
});
</script>

<style></style>
