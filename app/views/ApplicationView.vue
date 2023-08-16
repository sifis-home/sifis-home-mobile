<!--
UC 08 – Install third party applications
 * json schema missing (as Håkan pointed out)
-->

<template>
  <Page>
    <ActionBar title="Application view" />

    <StackLayout class="m-16">
      <HeaderView />

      <Image
        class="logo"
        :src="container.owner.avatar_url"
        height="120"
        verticalAlignment="center"
      />

      <Label :text="container.name" class="text-center font-bold text-lg" />
      <Label :text="description" class="text-center text-sm" />

      <ActivityIndicator v-show="loading" style="margin-top: 50px;" :busy=loading />

      <Label v-show="!loading" :text="'Software quality: ' + (quality*10) + '%'" class="text-center text-sm" style="margin-top: 20px;"/>

      <Label v-show="quality >= 8" text="Good" class="text-center text-sm" style="color: green" />
      <Label v-show="quality < 8 && quality > 6" text="Wanring" class="text-center text-sm" style="color: orange" />
      <Label v-show="quality < 6 && !loading" text="Danger" class="text-center text-sm" style="color: red" />


<!--      <TextView :text="container.repository.description + '\n\n' + container.repository.html_url + '\n\nCreated: ' + container.created_at + '\nLast updated: ' + container.updated_at" editable=false fontSize="12" />-->

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
import apiMixin from '@/mixins/apiMixin';
import HeaderView from './HeaderView.vue';

export default Vue.extend({  
  components: {
    HeaderView,
  },
  props: {
    container: [Array, Object],
  },
  mixins: [apiMixin],

  data() {
    return {
      installing: false,
      installed: false,
      loading: true,
      description: '',
      manifest: '',
      quality: 0,
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
  },

  created() {
    this.loading=true;
    this.getGithubLabels(this.container.name).then((response) => {
      this.loading=false;
      console.log(this.container.name);
      console.log(response.manifest['\"app_name\"']);
      console.log(response.manifest["api_labels"]);
      console.log(response['software.quality']);
      this.manifest = response['manifest'];
      this.description = response['org.opencontainers.image.description'];
      this.quality = response['software.quality'];
      });
  },


});
</script>

<style>
</style>
