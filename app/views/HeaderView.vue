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
      this.getDhtAll().then(function () {
        response.data.forEach((dht_topic) => {
          // UC 03 - Being alerted if motion sensors detect people presence
          if (dht_topic.topic_name == 'domo_window_sensor') {
            if (dht_topic.value.status == 0) {
              this.alertText =
                'Domo Window Sensor ' + dht_topic.value.area_name + ' active';
              this.active_alert |= 0x1;
            } else {
              this.active_alert &= ~0x1;
            }
          }

          // UC 03 - Being alerted if motion sensors detect people presence
          if (dht_topic.topic_name == 'domo_pir_sensor') {
            if (dht_topic.value.status == 1) {
              this.alertText =
                'Domo PIR server ' + dht_topic.value.area_name + ' active';
              this.active_alert |= 0x10;
            } else {
              this.active_alert &= ~0x10;
            }
          }

          // UC 03 - Being alerted if motion sensors detect people presence
          if (dht_topic.topic_name == 'domo_door_sensor') {
            if (dht_topic.value.status == 0) {
              this.alertText =
                'Domo Door Sensor ' + dht_topic.value.area_name + ' active';
              this.active_alert |= 0x100;
            } else {
              this.active_alert &= ~0x100;
            }
          }

          // UC 04 – Get notification about software intrusion
          if (dht_topic.topic_name == 'software_intrusion') {
            if (dht_topic.value.status == 1) {
              this.alertText = 'Software intrusion detected';
              this.active_alert |= 0x1000;
            } else {
              this.active_alert &= ~0x1000;
            }
          }

          // UC 19 – Being alerted if a device is generating anomalous traffic
          if (dht_topic.topic_name == 'anomalous_traffic') {
            if (dht_topic.value.status == 1) {
              this.alertText = 'Device is generating anomalous traffic';
              this.active_alert |= 0x10000;
            } else {
              this.active_alert &= ~0x10000;
            }
          }
        });
      });

      if (this.active_alert > 0 && this.active_alert != this.previous_alert) {
        this.previous_alert = this.active_alert;
        alert(this.alertText).then(function () {
          // NOP
        });
      } else if (this.active_alert == 0) {
        this.previous_alert = this.active_alert;
        this.alertText = '';
      }
    },
  },
  created() {
    this.timer = setInterval(this.checkAlerts, 5000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped></style>
