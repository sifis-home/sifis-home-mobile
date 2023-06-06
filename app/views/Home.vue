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

      <FlexboxLayout flexDirection="column" style="color: #ffffff; padding: 8; background-color: #65adf1;">
        <Label :text="'Logged in as: ' + user_name + '(' + user_id + ')'"></Label>
        <Label :text="'Organization: ' + organization_name"></Label>
      </FlexboxLayout>

      <Button class="list-button" text="Device Control" @tap="deviceList" />

      <Button class="list-button" text="User management" @tap="users" />

      <Button class="list-button" text="Settings" @tap="settings" />

      <Button class="list-button" text="Marketplace" @tap="marketplace" />
<!--
      <Button class="list-button" text="Voice commands" @tap="settings" />
      <Button class="list-button" text="View logs" @tap="settings" />
-->
      <Button class="list-button" text="Log out" @tap="logout" />

    </StackLayout>
  </Page>
</template>

<script>
import Vue from 'nativescript-vue';
import apiMixin from '@/mixins/apiMixin';
import DeviceListView from './DeviceListView.vue';
import UserListView from './UserListView.vue';
import MarketplaceView from './MarketplaceView.vue';
import SettingsView from './SettingsView.vue';
import LoginView from "./LoginView.vue";

export default Vue.extend({
  mixins: [apiMixin],
  data() {
    return {
      user_name: '',
      user_id: '',
      organization_id: '',
      organization_name: '',
      organization_members: '',
      unit_id: '',
    };
  },
  created() {
    this.initYggioToken();
    this.getUserData().then((userData) => {
      if (!userData || !userData._id) {
        this.$navigateTo(LoginView);
      }
      else {
        this.user_name = userData.username;
        this.user_id = userData._id;
        this.getOrganization().then((organization) => {
          this.organization_id = organization._id;
          this.organization_name = organization.name;
          this.unit_id = organization.rootUnit._id;
          this.getUsers(organization.members).then((users) => {
            this.organization_members = users;

          });
        });
      }
    });
  },
  methods: {
    settings() {
      this.$navigateTo(SettingsView);
    },
    deviceList() {
      this.$navigateTo(DeviceListView);
    },
    users() {
      this.$navigateTo(UserListView, {
        transition: {
          name: "fade",
          duration: 225,
          curve: "easeIn"
        },
        props: { 
          users: this.organization_members,
          organization: this.organization_id,
          token: this.unit_id,
        },
      });
    },
    marketplace() {
      this.$navigateTo(MarketplaceView);
    },
    logout() {
      this.apiLogout();
      this.$navigateTo(LoginView);
    }
  },
});
</script>

<style></style>
