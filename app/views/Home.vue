<template>
  <Page>
    <ActionBar>
      <Label text="Home" class="font-bold text-lg" />
    </ActionBar>

    <StackLayout>
      <Image
        class="logo"
        src="~/include/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />

      <Button class="list-button" text="Login" @tap="login" />
      <Button class="list-button" text="List of devices" @tap="deviceList" />
      <Button class="list-button" text="Settings" @tap="settings" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';
import ApiMixin from '@/mixins/apiMixin';
import DeviceListView from './DeviceListView.vue';
import SettingsView from './SettingsView.vue';

export default Vue.extend({
  computed: {
    message() {
      return 'Sifis-HOME Mobile app (nothing to see)';
    },
  },
  mixins: [ApiMixin],
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    login() {
      login('Please enter your credentials', 'Username', 'Password').then(
        (result) => {
          if (result.result) {
            this.apiLogin(result.userName, result.password).then((response) => {
              if (response !== undefined) {
                this.$navigateTo(TargetListView);
              } else {
                alert({
                  title: 'Login failed',
                  okButtonText: 'Ok',
                  message: 'Please check your password and email',
                });
              }
            });
          }
        }
      );
    },
    settings() {
      this.$navigateTo(SettingsView);
    },
    deviceList() {
      this.$navigateTo(DeviceListView);
    },
  },
});
</script>

<style></style>
