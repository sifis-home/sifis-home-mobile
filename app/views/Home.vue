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

      <!--
      <FlexboxLayout
        flexDirection="column"
        style="
          width: 90%;
          color: #ffffff;
          padding: 8;
          background-color: #65adf1;
        "
      >
        <Label
          :text="'Logged in as: ' + user_name + '(' + user_id + ')'"
        ></Label>
        <Label :text="'Organization: ' + organization_name"></Label>
      </FlexboxLayout>
-->

      <Button class="list-button" @tap="deviceList">
        <FormattedString>
          <Span class="fas" text.decode="&#xf2db;"></Span>
          <Span text=" Devices" fontAttributes="Bold"></Span>
        </FormattedString>
      </Button>

      <Button class="list-button" @tap="marketplace">
        <FormattedString>
          <Span class="fas" text.decode="&#xf07a;"></Span>
          <Span text=" Marketplace" fontAttributes="Bold"></Span>
        </FormattedString>
      </Button>

      <Button class="list-button" @tap="logs">
        <FormattedString>
          <Span class="fas" text.decode="&#xf15c;"></Span>
          <Span text=" Statistics & Analytics" fontAttributes="Bold"></Span>
        </FormattedString>
      </Button>

      <Button class="list-button" @tap="settings">
        <FormattedString>
          <Span class="fas" text.decode="&#xf085;"></Span>
          <Span text=" Settings" fontAttributes="Bold"></Span>
        </FormattedString>
      </Button>

      <Button class="list-button" @tap="policy_panel">
        <FormattedString>
          <Span class="fas" text.decode="&#xf505;"></Span>
          <Span text=" Policy definition panel" fontAttributes="Bold"></Span>
        </FormattedString>
      </Button>

      <Button class="list-button" @tap="privacy_dashboard">
        <FormattedString>
          <Span class="fas" text.decode="&#xf084;"></Span>
          <Span text=" Privacy dashboard" fontAttributes="Bold"></Span>
        </FormattedString>
      </Button>

      <Button style="margin-top: 50px" class="list-button" @tap="logout">
        <FormattedString>
          <Span class="fas" text.decode="&#xf2f5;"></Span>
          <Span text=" Log out" fontAttributes="Bold"></Span>
        </FormattedString>
      </Button>

      <!-- <Button class="list-button" text="Mobile API" @tap="mobileapi" /> -->
      <!-- <Button class="list-button" text="User management" @tap="users" />-->
      <!-- <Button class="list-button" text="Key Cloak" @tap="keycloak" /> -->
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
import PolicyPanelView from './PolicyPanelView.vue';
import PrivacyDashboardView from './PrivacyDashboardView.vue';
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
      this.$navigateTo(PolicyPanelView);
    },
    privacy_dashboard() {
      this.$navigateTo(PrivacyDashboardView);
    },
    logout() {
      this.yggioLogout();
      this.$navigateTo(LoginView);
    },
  },
});
</script>

<style></style>
