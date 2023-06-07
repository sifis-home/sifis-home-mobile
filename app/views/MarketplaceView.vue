<template>
  <Page>

    <ActionBar>
      <Label text="Marketplace" class="font-bold text-lg" />
    </ActionBar>

    <StackLayout>

      <Image
        class="logo"
        src="~/include/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />

      <Label v-if="repository_count != ''" :text="'Total ' + repository_count + ' packages'" class="text-center font-bold text-lg" />
      <ActivityIndicator v-show="loading" style="margin-top: 50px;" :busy=loading></ActivityIndicator>

      <GridLayout rows="*" columns="*">

        <RadListView
          style="margin-top: 50px;"
          for="container in containers"
          class="list-group h-full"
        >

          <v-template>
            <Button class="list-button text-center" textWrap="true" @tap="$event => showContainer(container)">
              <Span :text="container.name + '\n'" />
              <Span class="text-xs" :text="'Last updated: ' + container.updated_at"/>
            </Button>

          </v-template>

        </RadListView>
      </GridLayout>


    </StackLayout>
  </Page>
</template>

  </Page>
</template>

<script>
import Vue from 'nativescript-vue';
import apiMixin from '@/mixins/apiMixin';
import ApplicationView from './ApplicationView.vue';

export default Vue.extend({  

  props: {
    id: Number,
    name: String
  },
  mixins: [apiMixin],

  data() {
    return {
      containers: [],
      loading: true,
      repository_count: '',
    }
  },

  methods: {
    showContainer(container) {
      this.$navigateTo(ApplicationView, {
        props: {
          container: container
        }
      });
    }
  },

  created() {
    if(this.getGithubToken() == "") {
      this.containers = [];
    }
    else {
      this.getGithubContainers().then((response) => {
        this.loading = false;
        this.containers = response;
        this.repository_count = this.containers.length;
      });
    }
  },

});
</script>

<style>
</style>
