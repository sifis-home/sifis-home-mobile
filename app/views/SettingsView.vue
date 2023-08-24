<template>
  <Page>
    <ActionBar title="Settings" />

    <ScrollView orientation="vertical">
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

        <Label text="DHT port number" class="text-label" />
        <StackLayout class="input-field">
          <TextField
            class="list-button"
            hint="DHT port number"
            v-model="dhtPort"
            returnKeyType="next"
          ></TextField>
        </StackLayout>

        <Label text="Policy panel port number" class="text-label" />
        <StackLayout class="input-field">
          <TextField
            class="list-button"
            hint="Policy panel port number"
            v-model="policyPort"
            returnKeyType="next"
          ></TextField>
        </StackLayout>

        <Label text="Privacy dashboard port number" class="text-label" />
        <StackLayout class="input-field">
          <TextField
            class="list-button"
            hint="Privacy dashboard port number"
            v-model="privacyPort"
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
    </ScrollView>
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
      localServerAddress: '',
      remoteServerAddress: '',
      dhtPort: 0,
      policyPort: 0,
      privacyPort: 0,
      serverType: 1,
      listOfItems: ['Local', 'Remote'],
    };
  },
  mixins: [apiMixin],
  methods: {
    save() {
      this.setDHTAddress(
        this.localServerAddress,
        this.remoteServerAddress,
        this.serverType,
        this.dhtPort,
        this.policyPort,
        this.privacyPort
      );
      this.$navigateTo(Home);

      alert('Settings saved').then(function () {
        console.log('Navigated to Home');
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
    if (configs[3]) {
      this.dhtPort = configs[3];
    }
    if (configs[4]) {
      this.policyPort = configs[4];
    }
    if (configs[5]) {
      this.privacyPort = configs[5];
    }
  },
});
</script>

<style></style>
