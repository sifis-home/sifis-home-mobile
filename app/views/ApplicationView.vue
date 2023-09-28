<template>
  <Page>
    <ActionBar>
      <NavigationButton
        text="Back"
        android.systemIcon="ic_menu_back"
        @tap="$navigateBack"
      />
      <Label text="Application view" />
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

        <StackLayout class="m-16">
          <Label
            :text="getContainerNameWithoutPrefixAndSuffix(container_name)"
            class="font-bold text-lg"
          />
          <Label :text="description" class="text-sm" />
          <Label :text="api_labels.api_description" class="text-sm" />

          <Label
            :text="behavior_label.device_type"
            textWrap="true"
            class="text-sm"
          />
          <Label
            :text="behavior_label.action"
            textWrap="true"
            class="text-sm"
          />

          <Label
            v-if="safety_risk.name"
            :text="'Safety risk: ' + safety_risk.risk_score"
            style="margin-top: 20px"
            class="font-bold text-sm"
          />
          <Label
            v-if="safety_risk.name"
            :text="safety_risk.name + ': ' + safety_risk.description"
            textWrap="true"
            lineHeight="2"
            class="text-xs"
          />

          <Label
            v-if="privacy_risk.name"
            :text="'Privacy risk'"
            style="margin-top: 20px"
            class="font-bold text-sm"
          />
          <Label
            v-if="privacy_risk.name"
            :text="privacy_risk.name + ': ' + privacy_risk.description"
            textWrap="true"
            lineHeight="2"
            class="text-xs"
          />

          <Label
            v-if="financial_risk.name"
            :text="'Financial risk: ' + financial_risk.risk_score"
            style="margin-top: 20px"
            class="font-bold text-sm"
          />
          <Label
            v-if="financial_risk.name"
            :text="financial_risk.name + ': ' + financial_risk.description"
            textWrap="true"
            lineHeight="2"
            class="text-xs"
          />

          <ActivityIndicator
            v-show="loading"
            style="margin-top: 50px"
            :busy="loading"
          />

          <!--
      <Label v-show="!loading && quality" :text="'Software quality: ' + (quality) + '%'" class="text-center text-sm" style="margin-top: 20px;"/>
      <Span class="fas" text.decode="&#xf2db;"></Span>
      <Span :text="' Software quality: ' + quality + '%\n'" fontAttributes="Bold"></Span>
      <Label v-if="quality >= 80" text="Good" class="text-center text-sm" style="color: green" />
      <Label v-else-if="quality < 80 && quality > 60" text="Warning" class="text-center text-sm" style="color: orange" />
      <Label v-else-if="quality < 60 && !loading && quality > 0" text="Danger" class="text-center text-sm" style="color: red" />

-->
          <StackLayout
            v-show="quality > 0"
            orientation="horizontal"
            style="margin-left: 40px; margin-right: 40px; margin-top: 30px"
          >
            <Button
              class="fas button-icon"
              style="text-align: center; color: red"
              v-if="quality < 60 && !loading && quality > 0"
              width="20%"
              text.decode="&#xf06a;"
            />
            <Button
              class="fas button-icon"
              style="text-align: center; color: orange"
              v-else-if="quality > 60 && quality < 80"
              width="20%"
              text.decode="&#xf06a;"
            />
            <Button
              class="fas button-icon"
              style="text-align: center; color: grey"
              v-else-if="quality >= 80"
              width="20%"
              text.decode="&#xf06a;"
            />
            <Label
              class="text-sm"
              style="text-align: center; vertical-align: middle"
              :text="'Software quality: ' + quality + ' %'"
              width="60%"
            />
            <Button
              class="fas button-icon"
              style="text-align: center; color: red"
              v-if="quality < 60 && !loading && quality > 0"
              width="20%"
              text.decode="&#xf06a;"
            />
            <Button
              class="fas button-icon"
              style="text-align: center; color: orange"
              v-else-if="quality > 60 && quality < 80"
              width="20%"
              text.decode="&#xf06a;"
            />
            <Button
              class="fas button-icon"
              style="text-align: center; color: grey"
              v-else-if="quality >= 80"
              width="20%"
              text.decode="&#xf06a;"
            />
          </StackLayout>

          <!--      <TextView :text="container.repository.description + '\n\n' + container.repository.html_url + '\n\nCreated: ' + container.created_at + '\nLast updated: ' + container.updated_at" editable=false fontSize="12" />-->

          <Button
            v-show="!installed && !installing"
            class="list-button"
            text="Install this application"
            @tap="install"
          />

          <Button
            v-show="installed"
            class="list-button"
            text="Remove this application"
            @tap="remove"
          />

          <ActivityIndicator
            v-show="installing"
            style="margin-top: 50px"
            :busy="installing"
          />
          <Label
            text="Installing application ..."
            v-show="installing"
            class="text-center text-md"
          />
          <Label
            text="Application installed"
            v-show="installed"
            class="text-center font-bold font-green text-md"
          />
        </StackLayout>
      </StackLayout>
    </ScrollView>
  </Page>
</template>

<script>
import Vue from 'nativescript-vue';
import apiMixin from '@/mixins/apiMixin';
import HeaderView from './HeaderView.vue';

export default Vue.extend({
  components: {
    HeaderView,
  },
  props: {
    container_name: String,
  },
  mixins: [apiMixin],

  data() {
    return {
      installing: false,
      installed: false,
      loading: true,
      description: '',
      manifest: {},
      api_labels: '',
      behavior_label: '',
      safety_risk: '',
      privacy_risk: '',
      financial_risk: '',
      quality: 0,
    };
  },

  methods: {
    isObject(data) {
      return data !== null && (typeof data === 'object' || Array.isArray(data));
    },
    remove() {
      this.installing = true;
      let topic_name = 'SIFIS:app_manager';
      let topic_uuid = 'application_manager_uuid';
      let command = {
        operation: 'remove_image',
        requestor_id: 4,
        request_id: 2,
        image_name: 'ghcr.io/sifis-home/' + this.container_name + ':latest',
      };
      this.postDhtSensor(topic_name, topic_uuid, command).then((response) => {
        this.installing = false;
        this.installed = false;
      });
    },
    install() {
      this.installing = true;

      let topic_name = 'SIFIS:app_manager';
      let topic_uuid = 'application_manager_uuid';
      let command = {
        operation: 'pull_image',
        requestor_id: 4,
        request_id: 2,
        image_name: 'ghcr.io/sifis-home/' + this.container_name + ':latest',
      };

      this.postDhtSensor(topic_name, topic_uuid, command).then((response) => {
        console.log(
          'Command Sent, response: *' + JSON.stringify(response) + '*'
        );
        this.installing = false;
        this.installed = true;
      });
      /*
        this.myTimeout = setTimeout(() => {
          this.installing = false;
          this.installed = true;
        }, 2000);
*/
    },
  },

  created() {
    this.loading = true;
    this.getDhtTopic('SIFIS:container_list').then((response) => {
      response[0].value.containers.forEach((container) => {
        if (
          container == 'ghcr.io/sifis-home/' + this.container_name ||
          container ==
            'ghcr.io/sifis-home/' + this.container_name + ':latest' ||
          container == this.container_name
        ) {
          this.installed = true;
        }
      });
    });

    this.getGithubLabels(this.container_name).then((response) => {
      this.loading = false;
      this.manifest = JSON.parse(response['manifest']);
      this.api_labels = this.manifest.api_labels[0];
      this.behavior_label = this.api_labels.behavior_label;
      let security_label = this.api_labels.security_label;
      this.safety_risk = security_label.safety[0];
      this.privacy_risk = security_label.privacy[0];
      this.financial_risk = security_label.financial[0];
      this.description = response['org.opencontainers.image.description'];
      this.quality = response['software.quality'];
    });
  },
});
</script>

<style></style>
