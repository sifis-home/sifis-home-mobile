<template>
  <Page>
    <ActionBar>
      <Label text="Device List" class="font-bold text-lg" />
    </ActionBar>

    <StackLayout class="m-16">
      <Image
        class="logo"
        src="~/include/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />

      <RadListView
        for="device in devices"
        separatorColor="transparent"
        class="list-group h-full"
        @itemTap="loadDevice"
      >
        <v-template>
          <StackLayout>
            <GridLayout class="list--item" rows="auto" columns="auto, *">
              <Label
                row="0"
                col="1"
                colSpan="3"
                :text="device.name"
                class="h2 m-l-4 text--black"
              />
            </GridLayout>
          </StackLayout>
        </v-template>
      </RadListView>
    </StackLayout>
  </Page>
</template>

  </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';
import DeviceView from './DeviceView.vue';

export default Vue.extend({

  data() {
    return {
      devices: [ 
        { id: 1, name: "Living room thermostat" },
        { id: 2, name: "Water leak sensor" },
        { id: 3, name: "Fridge" },
        { id: 4, name: "Outdoor weather" },
        { id: 5, name: "Main door camera" },
      ],
    };
  },  
  methods: {
    logMessage() {
      console.log('You have tapped the message!');
      alert('You have tapped the message!');
    },
    loadDevice(event) {
      this.$navigateTo(DeviceView, {
        props: {
          id: event.item.id,
          name: event.item.name
        }
      });     
},
},
});
</script>

<style>
</style>
