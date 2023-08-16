<template>
  <Page>
    <ActionBar title="Home" />

    <StackLayout>
      <HeaderView />

      <Image
        class="logo"
        src="~/include/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />

      <ActivityIndicator
        v-show="loading"
        style="margin-top: 50px"
        :busy="loading"
      ></ActivityIndicator>

      <FlexboxLayout
        flexDirection="column"
        style="color: #ffffff; padding: 8; background-color: #65adf1"
      >
        <Label
          :text="'Logged in as: ' + user_name + '(' + user_id + ')'"
        ></Label>
        <Label :text="'Organization: ' + organization_name"></Label>
      </FlexboxLayout>

      <Button class="list-button" text="Sensors" @tap="deviceList" />

      <!--      <Button class="list-button" text="Mobile API" @tap="mobileapi" /> -->

      <Button class="list-button" text="Marketplace" @tap="marketplace" />

      <Button class="list-button" text="View logs" @tap="logs" />

      <Button class="list-button" text="User management" @tap="users" />
      <Button class="list-button" text="Key Cloak" @tap="keycloak" />

      <Button
        class="list-button"
        text="Policy definition panel"
        @tap="policy_panel"
      />

      <Button class="list-button" text="Settings" @tap="settings" />

      <Button class="list-button" text="Log out" @tap="logout" />
    </StackLayout>
  </Page>
</template>

<script>
import Vue from 'nativescript-vue';
import apiMixin from '@/mixins/apiMixin';
import DeviceListView from './DeviceListView.vue';
import LogView from './LogView.vue';
import UserListView from './UserListView.vue';
import MarketplaceView from './MarketplaceView.vue';
import KeyCloak from './KeyCloak.vue';
import NodeManager from './NodeManager.vue';
import PolicyView from './PolicyView.vue';
import MobileDeviceView from './MobileDeviceView.vue';
import LoginView from './LoginView.vue';
import HeaderView from './HeaderView.vue';
import SettingsView from './SettingsView.vue';

export default Vue.extend({
  mixins: [apiMixin],
  components: {
    HeaderView,
  },

  data() {
    return {
      user_name: '',
      user_id: '',
      organization_id: '',
      organization_name: '',
      organization_members: '',
      unit_id: '',
      loading: false,
    };
  },
  created() {
    this.loading = true;
    this.initializeApp();
    this.getUserData().then((userData) => {
      if (!userData || !userData._id) {
        this.$navigateTo(LoginView);
      } else {
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
    this.loading = false;
  },
  methods: {
    mobileapi() {
      this.$navigateTo(MobileDeviceView);
    },
    settings() {
      this.$navigateTo(SettingsView);
    },
    deviceList() {
      this.$navigateTo(DeviceListView);
    },
    logs() {
      this.$navigateTo(LogView);
    },
    users() {
      this.$navigateTo(UserListView, {
        transition: {
          name: 'fade',
          duration: 225,
          curve: 'easeIn',
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
    keycloak() {
      this.$navigateTo(KeyCloak);
    },
    nodemanager() {
      this.$navigateTo(NodeManager);
    },
    policy_panel() {
      this.$navigateTo(PolicyView);
    },
    logout() {
      this.yggioLogout();
      this.$navigateTo(LoginView);
    },
  },
});
</script>

<style></style>
