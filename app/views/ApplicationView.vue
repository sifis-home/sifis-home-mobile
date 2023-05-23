<template>
  <Page>
    <ActionBar>
      <Label text="Application view" class="font-bold text-lg" />
    </ActionBar>

    <StackLayout class="m-16">

      <Image
        class="logo"
        :src="container.owner.avatar_url"
        height="120"
        verticalAlignment="center"
      />

      <Label :text="container.name" class="text-center font-bold text-lg" />
      <Label :text="container.repository.full_name" class="text-center  text-md" />

      <TextView :text="container.repository.description" editable=false />
      <TextView :text="container.repository.html_url" editable=false />

    </StackLayout>
  </Page>
</template>

  </Page>
</template>

<script>
import Vue from 'nativescript-vue';

export default Vue.extend({  

  props: {
    container: Array,
  },

});
</script>

<style>
</style>
