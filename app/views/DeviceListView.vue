<template>
  <Page>
    <ActionBar>
      <Label text="Device List" class="font-bold text-lg" />
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

    <StackLayout class="m-16">
      <RadListView
        for="device in devices"
        separatorColor="transparent"
        class="list-group h-full"
      >
        <v-template>
          <StackLayout>
            <GridLayout class="riots-list--item" rows="auto" columns="auto, *">
              <Image
                row="0"
                col="0"
                class="fas list-icon--black"
                src.decode="font://&#xf1ad;"
              ></Image>
              <Label
                row="0"
                col="1"
                colSpan="2"
                :text="device.name"
                class="h2 m-l-4 text-riots--black"
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

export default Vue.extend({

  data() {
    return {
      devices: [ 
        { name: "One" },
        { name: "Two" },
      ],
    };
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
