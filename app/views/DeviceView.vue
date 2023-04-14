<template>
  <Page>
    <ActionBar>
      <Label text="Device view" class="font-bold text-lg" />
    </ActionBar>

    <StackLayout class="m-16">

      <Image
        class="logo"
        src="~/include/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />

      <Label :text="name" class="text-center font-bold text-lg" />
      <Image
        class="logo"
        src="~/include/riots_thermostat.png"
        height="200"
        verticalAlignment="center"
      />
      <Label text="22.2°C" class="text-center font-bold text-lg" />

    </StackLayout>
  </Page>
</template>

  </Page>
</template>

<script>
import Vue from 'nativescript-vue';

export default Vue.extend({  

  props: {
    id: Number,
    name: String
  },  
  methods: {
    logMessage() {
      console.log('You have tapped the message!');
      alert('You have tapped the message!');
    },
  },
});
</script>

<style>
</style>
