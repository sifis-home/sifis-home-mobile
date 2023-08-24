<!--
UC 11 – Control statistics and analytics
-->

<template>
  <Page>
    <ActionBar title="Statistics & Analytics" />

    <ScrollView orientation="vertical">
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

      <ListView for="log in logs">
        <v-template>
          <StackLayout orientation="vertical">

            <StackLayout orientation="horizontal" style = "margin-left: 40px; margin-right: 40px; margin-top: 30px;">

              <Button class="fas" style="text-align: left; color: red;" v-if="log.priority == 'severe'" width="30%" text.decode="&#xf06a;" />
              <Button class="fas" style="text-align: left; color: red;" v-else-if="log.priority == 'high'" width="30%" text.decode="&#xf06a;" />
              <Button class="fas" style="text-align: left; color: orange;" v-else-if="log.priority == 'medium'" width="30%" text.decode="&#xf06a;" />
              <Button class="fas" style="text-align: left; color: grey;" v-else-if="log.priority == 'low'" width="30%" text.decode="&#xf06a;" />

              <Label class="text-xs" style="text-align: right;" :text="log.category + ' /'" width="20%"/>
              <Label class="text-xs" style="text-align: left;" :text="' ' + log.type" width="20%"/>
              <Label class="text-xs" style="text-align: right;" :text="formatDate(log.createdAt)" width="30%"/>
            </StackLayout>

            <Label style="margin-left: 40px; margin-right: 40px; margin-bottom: 30px; line-height: 1;" textWrap="true" class="text-sm" :text="log.message"  />
          </StackLayout>
        </v-template>

      </ListView>

    </StackLayout>
    </ScrollView>

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


    formatDate(timestamp) {
      const date = new Date(timestamp);
      date.setHours(date.getHours() - 1);

      // Make a fuzzy time
      var delta = Math.round((+new Date - date) / 1000);

      var minute = 60,
          hour = minute * 60,
          day = hour * 24,
          week = day * 7;

      var fuzzy;

      if (delta < 30) {
          fuzzy = 'just now';
      } else if (delta < minute) {
          fuzzy = delta + ' seconds ago';
      } else if (delta < 2 * minute) {
          fuzzy = 'a minute ago'
      } else if (delta < hour) {
          fuzzy = Math.floor(delta / minute) + ' minutes ago';
      } else if (Math.floor(delta / hour) == 1) {
          fuzzy = '1 hour ago.'
      } else if (delta < day) {
          fuzzy = Math.floor(delta / hour) + ' hours ago';
      } else {
          return ('0' + date.getDate()).slice(-2) + '/'
                      + ('0' + (date.getMonth()+1)).slice(-2) + '/'
                      + date.getFullYear();
      }
      return fuzzy
  },

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