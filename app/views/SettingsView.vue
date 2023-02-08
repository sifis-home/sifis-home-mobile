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

      <Label text="Server IP Address" class="text-label" />
      <StackLayout class="input-field">
        <TextField
          class="list-button"
          hint="IP address"
          v-model="ipAddress"
          returnKeyType="next"
        ></TextField>
      </StackLayout>

      <Label text="DHT shared key" class="text-label" />
      <StackLayout class="input-field">
        <TextField
          class="list-button"
          hint="32 bytes in hex format"
          v-model="sharedKey"
          returnKeyType="next"
        ></TextField>
      </StackLayout>

      <Label text="User name" class="text-label" />
      <StackLayout class="input-field">
        <TextField
          class="list-button"
          hint="User name"
          v-model="userName"
          returnKeyType="next"
        ></TextField>
      </StackLayout>

      <Button class="list-button" text="Save" @tap="save" />
    </StackLayout>
  </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';

export default Vue.extend({
  data() {
    return {
      ipAddress: '127.0.0.1',
      sharedKey: '360ba80f4f84eb2079416775644402d0',
      userName: 'John Doe',
    };
  },
  methods: {
    save() {
      console.log('You have tapped the message!');
      alert('Settings saved!');
    },
  },
});
</script>

<style></style>
