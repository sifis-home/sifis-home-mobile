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
          v-model="password1"
          secure="true"
          returnKeyType="next"
        ></TextField>
      </StackLayout>

      <Label text="Confirm password" class="text-label" />
      <StackLayout class="input-field">
        <TextField
          class="list-button"
          hint="Confirm password"
          v-model="password2"
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

export default Vue.extend({
  data() {
    return {
      username: '',
      password1: '',
      password2: '',
    };
  },
  methods: {
    save() {
      if(this.password1 != this.password2) {
        alert('Passwords do not match!');
      }
      else {
        alert('User added!');
      }
    },
  },
});
</script>

<style></style>
