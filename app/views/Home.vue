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

      <Button class="list-button" text="NSSD Control" @tap="deviceList" />
      <Button class="list-button" text="Settings" @tap="settings" />

      <Button class="list-button" text="Marketplace" @tap="marketplace" />
      <Button class="list-button" text="Smart devices" @tap="deviceList" />
      <Button class="list-button" text="Voice commands" @tap="settings" />
      <Button class="list-button" text="View logs" @tap="settings" />

      <Button class="list-button" :text="loginLabel" @tap="login" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';
import ApiMixin from '@/mixins/apiMixin';
import DeviceListView from './DeviceListView.vue';
import MarketplaceView from './MarketplaceView.vue';
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
      loginLabel: 'Login',
    };
  },
  methods: {
    login() {
      if (this.getToken()) {
        alert({
          title: 'Token',
          okButtonText: 'Ok',
          message: this.getToken(),
        });
      } else {
        login('Please enter your credentials', 'Username', 'Password').then(
          (result) => {
            if (result.result) {
              this.apiLogin(result.userName, result.password).then(
                (response) => {
                  if (response !== undefined) {
                    this.loginLabel = 'Show token';
                    alert({
                      title: 'Login Success',
                      okButtonText: 'Ok',
                      message: response,
                    });
                  } else {
                    alert({
                      title: 'Login failed',
                      okButtonText: 'Ok',
                      message: 'Please check your password and email',
                    });
                  }
                }
              );
            }
          }
        );
      }
    },
    settings() {
      this.$navigateTo(SettingsView);
    },
    deviceList() {
      this.$navigateTo(DeviceListView);
    },
    marketplace() {
      this.$navigateTo(MarketplaceView);
    },
  },
});
</script>

<style></style>
