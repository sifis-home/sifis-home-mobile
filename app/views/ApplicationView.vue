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
              v-if="safety_risk[0]"
              :text="'Safety risks'"
              style="margin-top: 20px"
              class="font-bold text-sm"
          />
          <Label
              v-for="(risk, index) in safety_risk"
              :key="index"
              :text="`${risk}: ${safety_risk_description[index]}`"
              textWrap="true"
              lineHeight="2"
              class="text-xs"
          />

          <Label
              v-if="privacy_risk[0]"
              :text="'Privacy risks'"
              style="margin-top: 20px"
              class="font-bold text-sm"
          />
          <Label
              v-for="(risk, index) in privacy_risk"
              :key="index"
              :text="`${risk}: ${privacy_risk_description[index]}`"
              textWrap="true"
              lineHeight="2"
              class="text-xs"
          />

          <Label
              v-if="financial_risk[0]"
              :text="'Financial risks'"
              style="margin-top: 20px"
              class="font-bold text-sm"
          />
          <Label
              v-for="(risk, index) in financial_risk"
              :key="index"
              :text="`${risk}: ${financial_risk_description[index]}`"
              textWrap="true"
              lineHeight="2"
              class="text-xs"
          />

          <ActivityIndicator
              v-show="loading"
              style="margin-top: 50px"
              :busy="loading"
          />

          <StackLayout
              v-show="quality > 0"
              orientation="horizontal"
              style="margin-left: 0px; margin-right: 0px; margin-top: 30px"
          >
            <Button
                class="fas button-icon"
                style="text-align: center; color: red"
                v-if="quality < 60 && !loading && quality > 0"
                width="15%"
                text.decode="&#xf06a;"
            />
            <Button
                class="fas button-icon"
                style="text-align: center; color: orange"
                v-else-if="quality > 60 && quality < 80"
                width="15%"
                text.decode="&#xf06a;"
            />
            <Button
                class="fas button-icon"
                style="text-align: center; color: green"
                v-else-if="quality >= 80"
                width="15%"
                text.decode="&#xf06a;"
            />
            <Label
                class="text-sm"
                style="text-align: center; vertical-align: middle"
                :text="'Software quality: ' + quality + ' %'"
                width="70%"
            />
            <Button
                class="fas button-icon"
                style="text-align: center; color: red"
                v-if="quality < 60 && !loading && quality > 0"
                width="15%"
                text.decode="&#xf06a;"
            />
            <Button
                class="fas button-icon"
                style="text-align: center; color: orange"
                v-else-if="quality > 60 && quality < 80"
                width="15%"
                text.decode="&#xf06a;"
            />
            <Button
                class="fas button-icon"
                style="text-align: center; color: green"
                v-else-if="quality >= 80"
                width="15%"
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
import { Dialogs } from '@nativescript/core';

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
      safety_risk: [],
      safety_risk_description: [],
      privacy_risk: [],
      privacy_risk_description: [],
      financial_risk: [],
      financial_risk_description: [],
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

      // Generate a random request_id in uuid v1 format
      const request_id = this.generateUuid();
      console.log('UUID: ' + request_id);

      const command = {
        operation: 'pull_image',
        requestor_id: 4,
        request_id: request_id,
        image_name: 'ghcr.io/sifis-home/' + this.container_name + ':latest',
      };

      this.postDhtSensor(
          'SIFIS:app_manager',
          'application_manager_uuid',
          command
      ).then((response) => {
        let maxAttempts = 30;
        let attempts = 0;

        const checkInstallationResults = () => {
          if (attempts < maxAttempts) {
            setTimeout(() => {
              // Make a GET request to check installation results
              console.log('Make a GET request to check installation results');
              this.getDhtTopicNameUuid(
                  'SIFIS:mobile-application',
                  'installation-results'
              ).then((response) => {
                if (!response) {
                  this.error = 'Error connecting to:\n' + this.getDHTAddress();
                } else {
                  if (response.value.request_id === request_id) {
                    // The request_id in the response matches the original request_id
                    console.log(
                        'The request_id in the response matches the original request_id'
                    );

                    if (response.value.result === 'not-compliant') {
                      console.log('Display popup with description and options');
                      // Display popup with description and options
                      this.showPopup(
                          response.value.description,
                          () => {
                            // User chose to install anyway
                            this.installAnyway(request_id);
                          },
                          () => {
                            // User chose to abort
                            this.abortInstallation(request_id);
                          }
                      );
                    } else {
                      // The application is installed. The install flow ends here
                      console.log('The application is installed');
                      this.installed = true;
                      this.installing = false;
                    }
                  } else {
                    // Request_id in the response does not match the original request_id
                    attempts++;
                    checkInstallationResults();
                  }
                }
              });
            }, 500);
          } else {
            // Max attempts reached. Show an alert and exit the method
            console.log(
                'Max attempts reached while checking SIFIS:mobile-application / installation-results'
            );
            Dialogs.alert('Error while installing the application').then(() => {
              console.log('Alert dialog closed.');
            });
            this.installing = false;
          }
        };

        // Start checking installation results
        checkInstallationResults();
      });
      console.log('end install');
    },

    showPopup(description, installAnywayCallback, abortCallback) {
      // Display the popup with description and options to install anyway or abort
      Dialogs.confirm({
        title: 'Installation Not Compliant',
        message: description,
        okButtonText: 'Install Anyway',
        cancelButtonText: 'Abort',
      }).then((result) => {
        console.log('Showing the dialog...');
        if (result) {
          // User chose to Install Anyway
          installAnywayCallback();
        } else {
          // User chose to Abort
          abortCallback();
        }
      });
    },

    installAnyway(request_id) {
      console.log('Install anyway selected');
      this.sendDecisionAndGetConfirmation('install_anyway', 'installed');
    },

    abortInstallation(request_id) {
      console.log('Abort installation selected');
      this.sendDecisionAndGetConfirmation('abort', 'aborted');
    },

    generateNewCommand(operation, request_id) {
      const command = {
        operation: operation,
        requestor_id: 4,
        request_id: request_id,
        image_name: 'ghcr.io/sifis-home/' + this.container_name + ':latest',
      };
      return command;
    },

    sendDecisionAndGetConfirmation(operation, expected_confirmation) {
      const request_id = this.generateUuid();
      console.log('UUID: ' + request_id);
      const command = this.generateNewCommand(operation, request_id);

      console.log('command: ');
      this.postDhtSensor(
          'SIFIS:app_manager',
          'application_manager_uuid',
          command
      ).then((response) => {
        let maxAttempts = 30;
        let attempts = 0;
        const checkInstallationResults = (expected_value) => {
          if (attempts < maxAttempts) {
            setTimeout(() => {
              // Make a GET request to check installation results
              console.log('Make a GET request to check installation results');
              this.getDhtTopicNameUuid(
                  'SIFIS:mobile-application',
                  'installation-results'
              ).then((response) => {
                if (!response) {
                  this.error = 'Error connecting to:\n' + this.getDHTAddress();
                } else {
                  console.log(response.value);

                  if (response.value.request_id === request_id) {
                    // The request_id in the response matches the original request_id
                    console.log(
                        'The request_id in the response matches the original request_id'
                    );

                    if (response.value.result === expected_confirmation) {
                      console.log('The confirmation is received and matches');
                      //
                      if (response.value.result === 'installed') {
                        this.installed = true;
                      }
                      this.installing = false;
                    } else {
                      //
                      console.log(
                          'The confirmation is received and DOES NOT match'
                      );
                      this.installing = false;
                    }
                  } else {
                    // Request_id in the response does not match the original request_id
                    attempts++;
                    checkInstallationResults();
                  }
                }
              });
            }, 500);
          } else {
            // Max attempts reached. Show an alert and exit the method
            console.log(
                'Max attempts reached while checking SIFIS:mobile-application / installation-results'
            );
            Dialogs.alert('Error while installing the application').then(() => {
              console.log('Alert dialog closed.');
            });
            this.installing = false;
          }
        };

        // Start checking installation results
        checkInstallationResults();
      });
    },

    generateUuid() {
      var uuidValue = '',
          k,
          randomValue;
      for (k = 0; k < 32; k++) {
        randomValue = (Math.random() * 16) | 0;

        if (k == 8 || k == 12 || k == 16 || k == 20) {
          uuidValue += '-';
        }
        uuidValue += (
            k == 12 ? 4 : k == 16 ? (randomValue & 3) | 8 : randomValue
        ).toString(16);
      }
      return uuidValue;
    },
  },

  created() {
    this.loading = true;
    this.getDhtTopic('SIFIS:container_list').then((response) => {
      console.log('getDhtTopic response: ' + response);
      response[0].value.containers.forEach((container) => {
        if (
            container === 'ghcr.io/sifis-home/' + this.container_name ||
            container ===
            'ghcr.io/sifis-home/' + this.container_name + ':latest' ||
            container === this.container_name
        ) {
          this.installed = true;
        }
      });
    });

    this.getGithubLabels(this.container_name).then((response) => {
      //console.log('getGithubLabels response: ' + response);
      this.loading = false;

      // Get the app description
      this.description = response['org.opencontainers.image.description'];

      // Get the software quality result
      this.quality = response['software.quality'];

      // Get the manifest
      this.manifest = JSON.parse(response['manifest']);
      //console.log('manifest: ' + JSON.stringify(this.manifest, null, 2));

      // Get the number of API labels composing the manifest
      let number_of_api_labels = 0;
      try {
        number_of_api_labels = Object.keys(this.manifest.api_labels).length;
        console.log('Number of API labels: ' + number_of_api_labels);
      } catch (error) {
        console.log('No API label is present in the manifest ' + error);
        return;
      }

      // Extract the risks from each API label
      // We are going to show only the risk name and description of each risk
      // found in the API labels. Only unique risks will be shown, i.e.,
      // if a risk is present in two API labels, we list the risk only once.
      for (let i = 0; i < number_of_api_labels; i++) {
        let security_label = this.manifest.api_labels[i].security_label;

        security_label.safety.forEach((risk) => {
          if (!this.safety_risk.includes(risk.name)) {
            this.safety_risk.push(risk.name);
            this.safety_risk_description.push(risk.description);
          }
        });

        security_label.privacy.forEach((risk) => {
          if (!this.privacy_risk.includes(risk.name)) {
            this.privacy_risk.push(risk.name);
            this.privacy_risk_description.push(risk.description);
          }
        });

        security_label.financial.forEach((risk) => {
          if (!this.financial_risk.includes(risk.name)) {
            this.financial_risk.push(risk.name);
            this.financial_risk_description.push(risk.description);
          }
        });
      }
    });
  },
});
</script>

<style></style>
