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
      <Button class="list-button" text="List of devices" @tap="logMessage" />
      <Button class="list-button" text="Settings" @tap="logMessage" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';
import ApiMixin from '@/mixins/apiMixin';

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
          this.apiLogin(result.userName, result.password);
          this.apiLogin(result.userName, result.password).then((response) => {
            if (response !== undefined) {
              this.$navigateTo(TargetListView);
            } else {
              alert({
                title: 'Login failed',
                okButtonText: 'Ok',
                message: 'Please check your password or email',
              });
            }
          });
        }
      );
    },
    logMessage() {
      console.log('You have tapped the message!');
      alert('You have tapped the message!');
    },
  },
});
</script>

<style>
/* .info {
    font-size: 20;
  } */

.list-button {
  background-color: #fff;
  margin: 15px;
  height: 80px;
  border-color: #000000;
  border-width: 2;
}

.logo {
  margin: 40px;
}
</style>
