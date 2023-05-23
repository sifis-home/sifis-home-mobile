<template>
  <Page>

    <ActionBar>
      <Label text="Device view" class="font-bold text-lg" />
    </ActionBar>

    <StackLayout>

      <Label text="Marketplace: list of repositories" class="text-center font-bold text-lg" />

      <Image
        class="logo"
        src="~/include/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />

      <Label v-if="repository_name != ''" :text="repository_name" class="text-center font-bold text-lg" />
      <Label v-if="repository_count != ''" :text="'Repositories ' + repository_count" class="text-center font-bold text-lg" />
      <Label v-if="repository_digest != ''" :text="repository_digest" class="text-center font-bold text-lg" />
      <ActivityIndicator v-show="loading" style="margin-top: 50px;" :busy=loading></ActivityIndicator>

      <GridLayout rows="*" columns="*">

        <RadListView
          style="margin-top: 50px;"
          for="container in containers"
          class="list-group h-full"

        >

          <v-template>
            <Button class="list-button" textWrap="true" @tap="$event => showContainer(container)">
                <FormattedString>
                  <Span :text="container.name" />
                  <Span text="\n" />
                  <Span :text="container.updated_at"/>
                  <Span text="\n" />
                  <Span :text="container.repository.description" />
                </FormattedString>
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
      repository_name: '',
      repository_count: '',
      repository_digest: '',
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
    this.loading = true;
    this.getGithubContainers().then((response) => {
      console.log('getGithubContainers OK');
      this.loading = false;
      console.log(response);
      this.containers = response;
    });
  },

});
</script>

<style>
</style>
