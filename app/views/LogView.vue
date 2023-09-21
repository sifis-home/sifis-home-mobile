<!--
UC 11 – Control statistics and analytics
-->

<template>
  <Page>

    <ActionBar>
      <NavigationButton
        text="Home"
        android.systemIcon="ic_menu_back"
        @tap="$navigateBack"
      />
      <Label text="Statistics & Analytics" />
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

      <ActivityIndicator v-show="loading" style="margin-top: 50px;" :busy=loading />

      <TextView v-if="error" :text="error" class="text-center log-item" editable=false fontSize="16" style="color: red; margin-top:20px" />
      <Label v-else class="log-item" text=" " />

        <StackLayout>
            <template v-for="log in logs">
              <StackLayout orientation="vertical" class="log-item">

                <StackLayout orientation="horizontal" style = "margin-left: 30px; margin-right: 30px; margin-top: 30px;">

                  <Button class="button-icon fas" style="text-align: left; color: red;" v-if="log.priority == 'severe'" width="30%" text.decode="&#xf06a;" />
                  <Button class="button-icon fas" style="text-align: left; color: red;" v-else-if="log.priority == 'high'" width="30%" text.decode="&#xf06a;" />
                  <Button class="button-icon fas" style="text-align: left; color: orange;" v-else-if="log.priority == 'medium'" width="30%" text.decode="&#xf06a;" />
                  <Button class="button-icon fas" style="text-align: left; color: grey;" v-else-if="log.priority == 'low'" width="30%" text.decode="&#xf06a;" />

                  <Label class="text-xs" style="text-align: right;" :text="log.category + ' /'" width="20%"/>
                  <Label class="text-xs" style="text-align: left;" :text="' ' + log.type" width="20%"/>
                  <Label class="text-xs" style="text-align: right;" :text="formatDate(log.createdAt)" width="30%"/>
                </StackLayout>

                <Label style="margin-left: 30px; margin-right: 10px; margin-bottom: 30px; line-height: 1;" textWrap="true" class="text-sm" :text="log.message"  />
              </StackLayout>
            </template>
        </StackLayout>

<!--
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
-->

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
    this.loading = true;
    this.checkLogs();
    this.timer = setInterval(this.checkLogs, 2000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },

  methods: {

    checkLogs() {
      this.getLogs().then((response) => {
        if(!response) {
          this.error = 'Error fetching logs';
        }
        else {
          this.error = '';
          this.logs = response;
          this.loading = false;
        }
      });
    },

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

.log-item{
    padding: 5 18;
    border-color: #332;
    border-width: 0 0 1 0;
}

</style>