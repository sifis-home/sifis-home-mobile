<!--
UC 11 – Control statistics and analytics
-->

<template>
  <Page>
    <ActionBar title="Statistics & Analytics" />

    <StackLayout>
      <HeaderView />

      <Image
        class="logo"
        src="~/include/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />

      <ActivityIndicator v-show="loading" style="margin-top: 50px;" :busy=loading />

      <TextView v-show="error" :text="error" class="text-center" editable=false fontSize="16" style="color: red; margin-top:20px" />

      <GridLayout rows="*" columns="*">
        <RadListView
          style="margin-top: 50px;"
          for="log in logs"
          class="list-group">

          <v-template>
            <Button class="list-button text-center" textWrap="true">
            <Span :text="log.message + '\n' + log.type + ' (' + log.priority + '/' + log.category + ')'" class="text-sm"/>
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
import ApiMixin from '@/mixins/apiMixin';
import HeaderView from './HeaderView.vue';

export default Vue.extend({
  mixins: [ApiMixin],
  components: {
    HeaderView,
  },
  data() {
    return {
      loading: true,
      logs: {},
      error: '',
    };
  },
  created() {

    this.getLogs().then((response) => {
      console.log("Then");
      console.log("*" + response[0] + "*");
      if(!response) {
        this.error = 'Error fetching logs';
      }
      else {
        this.logs = response;
        this.loading = false;
      }
    });
  },
  methods: {
    loadDevice(device) {
      this.$navigateTo(DeviceView, {
        props: {
          id: device.topic_uuid,
          name: device.topic_name,
          value: device.value,
        }
      });     
    },
},
});
</script>

<style scoped>
</style>