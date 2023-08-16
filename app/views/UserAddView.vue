<template>
  <Page>
    <ActionBar>
      <Label text="Add new user" class="font-bold text-lg" />
    </ActionBar>

    <StackLayout>
      <Image
        class="logo"
        src="~/include/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />

      <Label text="Username" class="text-label" />
      <StackLayout class="input-field">
        <TextField
          class="list-button"
          hint="Username"
          v-model="username"
          returnKeyType="next"
        ></TextField>
      </StackLayout>

      <Label text="Password" class="text-label" />
      <StackLayout class="input-field">
        <TextField
          class="list-button"
          hint="Password"
          v-model="password"
          secure="true"
          returnKeyType="next"
        ></TextField>
      </StackLayout>

      <Label text="Confirm password" class="text-label" />
      <StackLayout class="input-field">
        <TextField
          class="list-button"
          hint="Confirm password"
          v-model="password_confirm"
          secure="true"
          returnKeyType="next"
        ></TextField>
      </StackLayout>

      <Button class="list-button" text="Save" @tap="save" />
    </StackLayout>
  </Page>
</template>

<script>
import Vue from 'nativescript-vue';
import apiMixin from '@/mixins/apiMixin';

export default Vue.extend({
  mixins: [apiMixin],

  props: {
    organization: String,
  },
  data() {
    return {
      username: '',
      password: '',
      password_confirm: '',
    };
  },
  methods: {
    save() {
      if (this.password != this.password_confirm) {
        alert('Passwords do not match!');
      } else {
        this.yggioCreateUser(
          this.organization,
          this.username,
          this.password
        ).then((response) => {
          alert('User added!');
        });
      }
    },
  },
});
</script>

<style></style>
