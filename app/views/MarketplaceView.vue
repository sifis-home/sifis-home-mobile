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
      <Label text="Marketplace" class="text-center font-bold text-lg" />

    </StackLayout>
  </Page>
</template>

  </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';

export default Vue.extend({  

  props: {
    id: Number,
    name: String
  },  
});
</script>

<style>
</style>
