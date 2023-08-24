<!--

UC 04 – Get notification about software intrusion
> * Which json schema is used for software intrusion?

-->

<template>
  <StackLayout>
    <Label
      v-show="alertText != ''"
      :text="alertText"
      class="text-center alert"
      textWrap="true"
      style="padding: 30px"
    ></Label>
  </StackLayout>
</template>

<script>
import ApiMixin from '@/mixins/apiMixin';

export default {
  name: 'HeaderView',
  mixins: [ApiMixin],

  data() {
    return {
      timer: '',
      alertText: '',
      active_alert: 0,
      previous_alert: 0,
    };
  },
  methods: {
    checkAlerts() {
      this.getDhtAll().then((response) => {
        global.myDht = response;
        let new_text = '';
        if (!response) {
          this.alertText = 'Error connecting to: ' + this.getDHTAddress();
          this.active_alert |= 0x10000;
        } else {
          this.active_alert = 0;
          this.alertText = '';
          response.forEach((dht_topic) => {
            // UC 03 - Being alerted if motion sensors detect people presence
            if (dht_topic.topic_name == 'domo_window_sensor') {
              if (dht_topic.value.status == 0) {
                if (this.alertText != '') {
                  this.alertText += '\n';
                }
                this.alertText +=
                  dht_topic.value.name +
                  ' / ' +
                  dht_topic.value.area_name +
                  ' active';
                this.active_alert |= 0x1;
              } else {
                this.active_alert &= ~0x1;
              }
            }

            // UC 03 - Being alerted if motion sensors detect people presence
            if (dht_topic.topic_name == 'domo_pir_sensor') {
              if (dht_topic.value.status == 1) {
                if (this.alertText != '') {
                  this.alertText += '\n';
                }
                this.alertText +=
                  dht_topic.value.name +
                  ' / ' +
                  dht_topic.value.area_name +
                  ' active';
                this.active_alert |= 0x10;
              } else {
                this.active_alert &= ~0x10;
              }
            }

            // UC 03 - Being alerted if motion sensors detect people presence
            if (dht_topic.topic_name == 'domo_door_sensor') {
              if (dht_topic.value.status == 0) {
                if (this.alertText != '') {
                  this.alertText += '\n';
                }
                this.alertText +=
                  dht_topic.value.name +
                  ' / ' +
                  dht_topic.value.area_name +
                  ' active';
                this.active_alert |= 0x100;
              } else {
                this.active_alert &= ~0x100;
              }
            }

            // UC 04 – Get notification about software intrusion
            if (dht_topic.topic_name == 'software_intrusion') {
              if (dht_topic.value.status == 1) {
                if (this.alertText != '') {
                  this.alertText += '\n';
                }
                this.alertText += 'Software intrusion detected';
                this.active_alert |= 0x1000;
              } else {
                this.active_alert &= ~0x1000;
              }
            }

            // UC 19 – Being alerted if a device is generating anomalous traffic
            if (dht_topic.topic_name == 'anomalous_traffic') {
              if (this.alertText != '') {
                this.alertText += '\n';
              }
              if (dht_topic.value.status == 1) {
                this.alertText += 'Device is generating anomalous traffic';
                this.active_alert |= 0x10000;
              } else {
                this.active_alert &= ~0x10000;
              }
            }
          });
        }
      });

      if (this.active_alert > 0) {
        this.setAlert(this.active_alert);
        this.setAlertText(this.alertText);
        if (this.active_alert != this.previous_alert) {
          this.previous_alert = this.active_alert;
          this.setAlert(this.active_alert);
          this.setAlertText(this.alertText);
          /*alert(this.alertText).then(function () {
            // NOP
          });*/
        }
      } else {
        this.previous_alert = 0;
        this.alertText = '';
        this.setAlert(this.active_alert);
        this.setAlertText(this.alertText);
      }
    },
  },
  created() {
    this.active_alert = this.getAlert();
    this.alertText = this.getAlertText();
    this.previous_alert = this.active_alert;
    this.checkAlerts();
    this.timer = setInterval(this.checkAlerts, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped></style>
