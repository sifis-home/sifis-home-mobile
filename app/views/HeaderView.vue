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
      let alertTime = this.getAlertTime();
      if (alertTime == 0) {
        alertTime = Date.now();
        this.setAlertTime(alertTime);
      }

      this.getDhtAll().then((response) => {
        let notification_message = false;
        let new_text = '';
        if (!response) {
          //this.alertText = 'Error connecting to: ' + this.getDHTAddress();
          //this.active_alert |= 0x10000;
        } else {
          this.active_alert = 0;
          this.alertText = '';
          response.forEach((dht_topic) => {
            // UC 03 - Being alerted if motion sensors detect people presence
            if (dht_topic.topic_name == 'domo_window_sensor') {
              if (dht_topic.value.status == 0) {
                this.active_alert |= 0x1;
                if (this.active_alert != this.previous_alert) {
                  if (this.alertText != '') {
                    this.alertText += '\n';
                  }
                  this.alertText +=
                    dht_topic.value.name +
                    ' / ' +
                    dht_topic.value.area_name +
                    ' active';
                }
              } else {
                this.active_alert &= ~0x1;
              }
            }

            // UC 03 - Being alerted if motion sensors detect people presence
            if (dht_topic.topic_name == 'domo_pir_sensor') {
              if (dht_topic.value.status == 1) {
                this.active_alert |= 0x10;
                if (this.active_alert != this.previous_alert) {
                  if (this.alertText != '') {
                    this.alertText += '\n';
                  }
                  this.alertText +=
                    dht_topic.value.name +
                    ' / ' +
                    dht_topic.value.area_name +
                    ' active';
                }
              } else {
                this.active_alert &= ~0x10;
              }
            }

            // UC 03 - Being alerted if motion sensors detect people presence
            if (dht_topic.topic_name == 'domo_door_sensor') {
              if (dht_topic.value.status == 0) {
                this.active_alert |= 0x100;
                if (this.active_alert != this.previous_alert) {
                  if (this.alertText != '') {
                    this.alertText += '\n';
                  }
                  this.alertText +=
                    dht_topic.value.name +
                    ' / ' +
                    dht_topic.value.area_name +
                    ' active';
                }
              } else {
                this.active_alert &= ~0x100;
              }
            }

            // UC 04 – Get notification about software intrusion
            // UC 19 – Being alerted if a device is generating anomalous traffic
            if (dht_topic.topic_name == 'SIFIS:notification_message') {
              notification_message = true;
              if (dht_topic.value.message != '') {
                this.active_alert |= 0x1000;
                if (this.active_alert != this.previous_alert) {
                  if (this.alertText != '') {
                    this.alertText += '\n';
                  }
                  this.alertText += dht_topic.value.message;
                }
              } else {
                this.active_alert &= ~0x1000;
              }
            }
          });

          if (!notification_message) {
            this.active_alert &= ~0x1000;
          }
        }
      });

      if (this.active_alert > 0) {
        let alertTime = this.getAlertTime();
        if (alertTime == 0) {
          alertTime = Date.now();
          this.setAlertTime(alertTime);
        }
        if (Date.now() - alertTime > 15000) {
          // 15 seconds passed
          this.alertText = '';
        }

        this.setAlert(this.active_alert);
        this.setAlertText(this.alertText);
        if (this.active_alert != this.previous_alert) {
          this.setAlertTime(Date.now());
          this.previous_alert = this.active_alert;
          /*alert(this.alertText).then(function () {
            // NOP
          });*/
        }
      } else {
        this.previous_alert = 0;
        this.alertText = '';
        this.setAlert(this.active_alert);
        this.setAlertText(this.alertText);
        this.setAlertTime(Date.now());
      }
    },
  },
  created() {
    this.active_alert = this.getAlert();
    this.alertText = this.getAlertText();
    this.previous_alert = this.active_alert;
    this.checkAlerts();
    this.timer = setInterval(this.checkAlerts, 2000);
    //this.checktimer = setInterval(this.alertTimer, 15000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped></style>
