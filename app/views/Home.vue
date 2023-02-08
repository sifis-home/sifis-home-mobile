<template>
  <Page>
    <ActionBar>
      <Label text="Home" class="font-bold text-lg" />
    </ActionBar>

    <!--    <StackLayout backgroundColor="#3c495e"> -->
    <StackLayout>
      <Button class="list-button" text="Settings" @tap="logMessage" />
      <Button class="list-button" text="List of devices" @tap="logMessage" />

      <StackLayout class="input-field">
        <TextField
          height="50"
          class="list-button input m-0"
          hint="email"
          width="90%"
          keyboardType="email"
          autocorrect="false"
          autocapitalizationType="none"
          v-model="email"
          returnKeyType="next"
        ></TextField>
      </StackLayout>
      <StackLayout class="input-field">
        <TextField
          height="50"
          width="90%"
          class="list-button input m-0"
          #password
          hint="password"
          secure="true"
          v-model="password"
        ></TextField>
      </StackLayout>

      <Button class="btn-primary" text="login" @tap="login"></Button>
    </StackLayout>
    <!--
    <GridLayout backgroundColor="#3c495e">
      <Button class="list-button" :text="message" @tap="logMessage" />
      <Label
        class="text-xl align-middle text-center text-gray-500 bordered"
        :text="message"
        @tap="logMessage"
      />
    </GridLayout>
-->
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
    logMessage() {
      console.log('You have tapped the message!');
      alert('You have tapped the message!');
    },
    login() {
      console.log('login');
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
</style>
