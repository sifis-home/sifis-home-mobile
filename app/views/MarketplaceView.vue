<template>
  <Page>

    <ActionBar>
      <NavigationButton
        text="Home"
        android.systemIcon="ic_menu_back"
        @tap="$navigateBack"
      />
      <Label text="Marketplace" />
    </ActionBar>

    <ScrollView orientation="vertical">

      <StackLayout>
        <HeaderView />

        <Image
          class="logo"
        src="~/sifis-home-logo.png"
          height="120"
          verticalAlignment="center"
        />

        <ActivityIndicator v-show="loading" style="margin-top: 50px;" :busy=loading></ActivityIndicator>

        <Label :text="'Installed applications (' + installed_count + ')'" style="margin-top: 20px;" class="text-center font-bold text-sm" />
        <StackLayout>
            <template v-for="app in installed_apps">
                <Button class="list-button text-center" textWrap="true" @tap="$event => showContainer(app)">
                  <Span :text="app" class="text-sm"/>
                </Button>
            </template>
        </StackLayout>
  
        <Label v-show="repository_count>0" :text="'Available applications (' + repository_count + ')'" style="margin-top: 20px;" class="text-center font-bold text-sm" />
        <StackLayout>
            <template v-for="container in containers">
                <Button class="list-button text-center" textWrap="true" @tap="$event => showContainer(container.name)">
                  <Span :text="container.name" class="text-sm"/>
                    <!--<Span class="text-xs" :text="'Last updated: ' + container.updated_at"/>-->
                </Button>
            </template>
        </StackLayout>


      </StackLayout>
    </ScrollView>
  </Page>
</template>

  </Page>
</template>

<script>
import Vue from 'nativescript-vue';
import apiMixin from '@/mixins/apiMixin';
import ApplicationView from './ApplicationView.vue';
import HeaderView from './HeaderView.vue';

export default Vue.extend({  
  components: {
    HeaderView,
  },
  props: {
    id: Number,
    name: String
  },
  mixins: [apiMixin],

  data() {
    return {
      containers: [],
      installed_apps: [],
      installed_count: 0,
      loading: true,
      repository_count: '',
    }
  },

  methods: {
    showContainer(container) {
      let container_name = container;
      if(container_name.startsWith('ghcr.io/sifis-home/')) {
        container_name = container_name.substring(
            container_name.indexOf("ghcr.io/sifis-home/") + 19, 
            container_name.lastIndexOf(":")
        );
      }
      console.log("Shwo container: " + container_name);

      this.$navigateTo(ApplicationView, {
        props: {
          container_name: container_name
        }
      });
    }
  },

  created() {
    this.getDhtTopic("SIFIS:container_list").then((response) => {
      response[0].value.containers.forEach((container) => {
        let container_name = container;
        if(container_name.startsWith('ghcr.io/sifis-home/')) {          
          container_name = container_name.substring(19);
        }
        if(container_name.endsWith(':latest')) {          
          container_name = container_name.substring(0, container_name.lastIndexOf(":"));
        }
        if (!this.installed_apps.includes(container_name)) {
          this.installed_apps.push(container_name)
        }
      });
      this.installed_count = this.installed_apps.length;
    });

    if(this.getGithubToken() == "") {
      this.containers = [];
    }
    else {
      this.getGithubContainers("third-party-application").then((response) => {
        this.loading = false;
        response.forEach((container) => {
          if (!this.installed_apps.includes(container.name)) {
            this.containers.push(container)
          }
        });
        //this.containers = response;
        this.repository_count = this.containers.length;
      });
    }
  },

});
</script>

<style>
</style>
