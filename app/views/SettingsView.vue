<template>
  <Page>
    <ActionBar>
      <Label text="Settings" class="font-bold text-lg" />
    </ActionBar>

    <StackLayout>
      <Image
        class="logo"
        src="~/include/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />

      <Button class="list-button" text="Settings" @tap="logMessage" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';

export default Vue.extend({
  methods: {
    logMessage() {
      console.log('You have tapped the message!');
      alert('You have tapped the message!');
    },
  },
});
</script>

<style>
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
