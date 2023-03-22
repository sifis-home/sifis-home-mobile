<template>
  <Page>
    <ActionBar>
      <Label text="Device view" class="font-bold text-lg" />
    </ActionBar>

    <StackLayout class="m-16">

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

      <RadListView
        style="margin-top: 50px;"
        for="repository in repositories"
        class="list-group h-full"

      >

        <v-template>
          <Button class="list-button" textWrap="true" @tap="$event => getRepository(repository.name)">
              <FormattedString>
                <Span :text="repository.name" />
                <Span text="\n" />
                <Span :text="repository.last_updated"/>
                <Span text="\n" />
                <Span :text="repository.status_description" />
              </FormattedString>
          </Button>

        </v-template>

      </RadListView>


    </StackLayout>
  </Page>
</template>

  </Page>
</template>

<script lang="ts">
import Vue from 'nativescript-vue';
import ApiMixin from '@/mixins/apiMixin';

export default Vue.extend({  

  props: {
    id: Number,
    name: String
  },
  mixins: [ApiMixin],

  data() {
    return {
      repositories: [],
      loading: true,
      repository_name: '',
      repository_count: '',
      repository_digest: '',
    }
  },

  methods: {
    getRepository(event) {
      console.log("GET REPOSITORY " + event);
      this.loading = true;
      this.repository_name = event;
      this.repository_count = '';
      this.repository_digest = '';
      this.getDockerRepository(event).then((response) => {
        console.log("Done");
        console.log(response.count);
        this.repository_count = response.count;
        if(response.count > 0) {
          this.repository_digest = response.results[0].digest;
        }
        this.loading = false;
      });
    }
  },


  created() {
    console.log("Marketplace Created");
    this.loading = true;

    this.dockerLogin().then((response) => {
      console.log('dockerLogin OK');
      this.getDockerRepositories().then((response) => {
        console.log('getRepositories OK');
        this.loading = false;
        console.log(response);
        this.repositories = response;
      });

    });
  },

});
</script>

<style>
</style>
