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
      <Label :text="container.repository.full_name" class="text-center text-md" />

      <TextView :text="container.repository.description + '\n\n' + container.repository.html_url + '\n\nCreated: ' + container.created_at + '\nLast updated: ' + container.updated_at" editable=false fontSize="12" />

      <Button v-show="!installed && !installing" class="list-button" text="Install this application" @tap="install" />

      <ActivityIndicator v-show="installing" style="margin-top: 50px;" :busy=installing />
      <Label text="Installing application ..." v-show="installing" class="text-center  text-md"/>
      <Label text="Application installed" v-show="installed" class="text-center font-bold font-green text-md"/>

    </StackLayout>
  </Page>
</template>
        alert({
          title: 'Installing',
          okButtonText: 'Ok',
          message: 'Installing application ...',
        });

  </Page>
</template>

<script>
import Vue from 'nativescript-vue';

export default Vue.extend({  

  props: {
    container: Array,
  },

  data() {
    return {
      installing: false,
      installed: false,
    }
  },

  methods: {
    install() {
        this.installing = true,
        this.myTimeout = setTimeout(() => {
          this.installing = false;
          this.installed = true;
        }, 2000);
    }
  }

});
</script>

<style>
</style>
