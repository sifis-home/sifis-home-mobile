<template>
  <Page>
    <ActionBar>
      <Label text="Login" class="font-bold text-lg" />
    </ActionBar>

    <StackLayout class="form">
      <InternetConnection />
      <Image
        class="m-b-16"
        v-if="!title"
        src="~/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
        style="margin-top: 30px"
      />

      <Label text="Username" class="text-label" />
      <StackLayout class="input-field">
        <TextField
          class="input m-0"
          hint="Username"
          autocorrect="false"
          autocapitalizationType="none"
          v-model="username"
          returnKeyType="next"
        ></TextField>
      </StackLayout>

      <Label text="Password" class="text-label" />
      <StackLayout class="input-field">
        <TextField
          class="input m-0"
          #password
          hint="Password"
          secure="true"
          v-model="password"
          type="password"
        ></TextField>
      </StackLayout>

      <Button class="list-button" text="Login" @tap="login" />
    </StackLayout>
  </Page>
</template>

<script>
import ApiMixin from '@/mixins/apiMixin';
import Home from './Home.vue';
import InternetConnection from './InternetConnection.vue';

export default {
  name: 'LoginView',
  components: {
    InternetConnection,
  },
  mixins: [ApiMixin],
  data() {
    return {
      username: '',
      password: '',
      title: false,
    };
  },
  methods: {
    login() {
      if (!this.username || !this.password) {
        alert({
          title: 'Please fill in the form',
          okButtonText: 'Ok',
          message: 'Provide your username and password in order to continue.',
          // sifis-home-user-1 + sfshm1!
        });
      } else {
        this.yggioLogin(this.username, this.password).then((response) => {
          if (response !== undefined) {
            this.$navigateTo(Home);
          } else {
            alert({
              title: 'Password or username does not match.',
              okButtonText: 'Ok',
              message: 'Please check your password and username.',
            });
          }
        });
      }
    },
  },
};
</script>

<style scoped>
.input {
  background-color: #fff;
  margin: 15px;
  padding: 10px;
  min-height: 80px;
  border-color: #000000;
  color: #000000;
  border-width: 1;
}
</style>
