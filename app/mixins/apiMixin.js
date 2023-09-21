import axios from 'axios';
import {
  getString,
  setString,
  getNumber,
  setNumber,
} from '@nativescript/core/application-settings';
import { Http, HttpResponse } from '@nativescript/core';
/*import * as Https from '@nativescript-community/https';
import { knownFolders } from '@nativescript/core';
*/

const yggioUrl = 'https://yggio.sifis-home.eu/';
const yggioToken = 'sifis-token';
const dhtToken = 'dht-address';

const localDhtToken = 'local-dht-address';
const remoteDhtToken = 'remote-dht-address';
const dhtSelectionToken = 'dht-selection';
const alertStatus = 'alert-status';
const alertText = 'alert-text';
const alertJson = 'alert-json';
const alertTime = 'alert-time';

const dhtPortToken = 'dht-port';
const policyPortToken = 'policy-port';
const privacyPortToken = 'privacy-port';

/* To access sifis-home containers, application needs token with read:packages scope https://github.com/settings/tokens/new */
const githubToken = '';

const centriaToken =
  '6c32fb013d1cd883aa01b2acb42f51501e74ac5e59ba14f21d8cd00915f2ee81';

export default {
  methods: {
    initializeApp() {
      //this.loadJsonSchemas();
      this.initYggioToken();
    },

    loadJsonSchemas() {
      return axios
        .get('https://api.github.com/repos/sifis-home/json-schemas/contents')
        .then((response) => {
          console.log('loadJsonSchemas');
          //console.log(response.data);
          //return response.data;
        })
        .catch((error) => this.onError('loadJsonSchemas', error));
    },

    // Initialize Yggio token from local storage
    initYggioToken() {
      let yggio_token = getString(yggioToken);
      if (yggio_token) {
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + yggio_token;
      }
    },

    // perform login to yggio.sifis-home.eu
    yggioLogin(username, password) {
      return axios
        .post(yggioUrl + 'api/auth/local', {
          username: username,
          password: password,
        })
        .then((response) => {
          let returned_token = response.data.token;
          setString(yggioToken, returned_token);
          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + returned_token;
          return returned_token;
        })
        .catch((error) => this.onError('yggioLogin', error));
    },

    yggioCreateUser(organization, username, password) {
      return axios
        .post(yggioUrl + 'api/organizations/' + organization + '/members', {
          username: username,
          password: password,
        })
        .then((response) => {
          console.log('User created');
          console.log(response.data);
        })
        .catch((error) => this.onError('yggioCreateUser', error));
    },

    // perform logout from yggio.sifis-home.eu
    yggioLogout() {
      axios.defaults.headers.common['Authorization'] = '';
      setString(yggioToken, '');
    },

    getUserData() {
      return axios
        .get(yggioUrl + 'api/users/me')
        .then((response) => {
          return response.data;
        })
        .catch((error) => this.onError('getUserData', error));
    },

    /* TODO: Not used */
    getUserRoles() {
      console.log('getUserRoles');
      return axios
        .get(yggioUrl + 'auth/realms/yggio/account')
        .then((response) => {
          //console.log(response.data);
          return response.data;
        })
        .catch((error) => this.onError('getUserRoles', error));
    },

    getOrganization() {
      return axios
        .get(yggioUrl + 'api/organizations')
        .then((response) => {
          return response.data[0];
        })
        .catch((error) => this.onError('getOrganization', error));
    },

    getLogs() {
      return axios
        .get(yggioUrl + 'api/logs?resourceType=device&limit=50')
        .then((response) => {
          return response.data;
        })
        .catch((error) => this.onError('getLogs', error));
    },

    /* TODO: not used */
    getUserByUsername(username) {
      return axios
        .get(yggioUrl + 'api/users/' + username)
        .then((response) => {
          console.log(response.data);
          return response.data[0];
        })
        .catch((error) => this.onError('getUserByUsername', error));
    },

    getUsers(user_list) {
      let userIds = '';
      user_list.forEach((userID) => {
        if (userIds != '') {
          userIds += '&';
        }
        userIds += 'userIds[]=' + userID;
      });
      return axios
        .get(yggioUrl + 'api/users/seek?userIds[]=' + userIds)
        .then((response) => {
          //console.log(response.data);
          return response.data;
        })
        .catch((error) => this.onError('getUsers', error));
    },

    getDHTAddress() {
      return this.getServerAddress() + ':' + this.getDHTPort() + '/dht';
    },

    getPolicyAddress() {
      return this.getServerAddress() + ':' + this.getPolicyPort();
    },

    getPrivacyAddress() {
      return this.getServerAddress() + ':' + this.getPrivacyPort();
    },

    getServerAddress() {
      if (getNumber(dhtSelectionToken, 1) == 0) {
        return getString(localDhtToken, 'https://127.0.0.1');
      }
      return getString(remoteDhtToken, 'https://yggio.sifis-home.eu');
    },

    getDHTPort() {
      return getNumber(dhtPortToken, 3000);
    },
    getPolicyPort() {
      return getNumber(policyPortToken, 9000);
    },
    getPrivacyPort() {
      return getNumber(privacyPortToken, 11000);
    },

    setDHTAddress(
      localServerAddress,
      remoteServerAddress,
      serverSelection,
      dhtPort,
      policyPort,
      privacyPort
    ) {
      setString(localDhtToken, localServerAddress);
      setString(remoteDhtToken, remoteServerAddress);
      setNumber(dhtSelectionToken, serverSelection);
      setNumber(dhtPortToken, dhtPort);
      setNumber(policyPortToken, policyPort);
      setNumber(privacyPortToken, privacyPort);
    },

    setAlert(alert_status) {
      setNumber(alertStatus, alert_status);
    },
    getAlert() {
      return getNumber(alertStatus, 0);
    },

    setAlertTime(time) {
      setNumber(alertTime, time);
    },
    getAlertTime() {
      return getNumber(alertTime, 0);
    },

    setAlertText(alert_text) {
      setString(alertText, alert_text);
      //setString(alertText, JSON.stringify(alert_text));
    },
    getAlertText() {
      return getString(alertText, '');
      //return JSON.parse(getString(alertText, "{}"));
    },

    setAlertJSON(alert_text) {
      setString(alertJson, JSON.stringify(alert_text));
    },
    getAlertJSON() {
      return JSON.parse(getString(alertJson, '{}'));
    },

    getDHTConfig() {
      let dhtConfig = [];
      dhtConfig.push(getString(localDhtToken, 'https://127.0.0.1'));
      dhtConfig.push(getString(remoteDhtToken, 'https://yggio.sifis-home.eu'));
      dhtConfig.push(getNumber(dhtSelectionToken, 1));
      dhtConfig.push(getNumber(dhtPortToken, 3000));
      dhtConfig.push(getNumber(policyPortToken, 9000));
      dhtConfig.push(getNumber(privacyPortToken, 11000));
      return dhtConfig;
    },

    getDhtAll() {
      let dht_address = this.getDHTAddress();
      return axios
        .get(dht_address + '/get_all')
        .then((response) => {
          //console.log('Response: ' + response.data);
          return response.data;
        })
        .catch((error) => this.onError('getDhtAll from:' + dht_address, error));
    },

    getDhtTopic(topic_name) {
      let dht_address = this.getDHTAddress();
      return axios
        .get(dht_address + '/topic_name/' + topic_name)
        .then((response) => {
          return response.data;
        })
        .catch((error) =>
          this.onError('getDhtTopic from:' + dht_address, error)
        );
    },

    getDhtDevices() {
      let dht_address = this.getDHTAddress();
      return axios
        .get(dht_address + '/get_all')
        .then((response) => {
          let sensors = [];
          response.data.forEach((the_sensor) => {
            if (
              the_sensor.topic_name == 'domo_window_sensor' ||
              the_sensor.topic_name == 'domo_door_sensor' ||
              the_sensor.topic_name == 'domo_pir_sensor' ||
              the_sensor.topic_name == 'domo_light' ||
              the_sensor.topic_name == 'domo_switch' ||
              the_sensor.topic_name == 'SIFIS::RiotsThermostat' ||
              the_sensor.topic_name.startsWith('shelly')
            ) {
              sensors.push(the_sensor);
            }
          });
          return sensors;
        })
        .catch((error) => this.onError('getDhtDevices', error));
    },

    getDhtSensors() {
      let dht_address = this.getDHTAddress();
      return axios
        .get(dht_address + '/get_all')
        .then((response) => {
          let sensors = [];
          response.data.forEach((the_sensor) => {
            if (
              the_sensor.topic_name == 'domo_window_sensor' ||
              the_sensor.topic_name == 'domo_door_sensor' ||
              the_sensor.topic_name == 'domo_pir_sensor' ||
              the_sensor.topic_name == 'domo_light' ||
              the_sensor.topic_name == 'domo_switch'
            ) {
              sensors.push(the_sensor);
            }
          });
          return sensors;
        })
        .catch((error) => this.onError('getDhtSensors', error));
    },

    getDhtTopicNameUuid(topic_name, topic_uuid) {
      let dht_address = this.getDHTAddress();

      return axios
        .get(
          dht_address +
            '/topic_name/' +
            topic_name +
            '/topic_uuid/' +
            topic_uuid
        )
        .then((response) => {
          return response.data;
        })
        .catch((error) => this.onError('getDhtTopicNameUuid', error));
    },

    deleteDhtSensor(topic_name, topic_uuid) {
      let dht_address = this.getDHTAddress();
      return axios
        .delete(
          dht_address +
            '/topic_name/' +
            topic_name +
            '/topic_uuid/' +
            topic_uuid
        )
        .then((response) => {
          return response.data;
        })
        .catch((error) => this.onError('deleteDhtSensor', error));
    },

    pubDhtSensor(command) {
      let dht_address = this.getDHTAddress();
      return axios
        .post(dht_address + '/pub', command)
        .then((response) => {
          return response.data;
        })
        .catch((error) => this.onError('pubDhtSensor: ' + dht_address, error));
    },

    postDhtSensor(topic_name, topic_uuid, command) {
      let dht_address = this.getDHTAddress();
      return axios
        .post(
          dht_address +
            '/topic_name/' +
            topic_name +
            '/topic_uuid/' +
            topic_uuid,
          command
        )
        .then((response) => {
          return response.data;
        })
        .catch((error) => this.onError('postDhtSensor', error));
    },

    getGithubToken() {
      return githubToken;
    },

    getGithubContainers(filter = '') {
      return axios
        .get(
          'https://api.github.com/orgs/sifis-home/packages?package_type=container&per_page=100&sort=updated',
          {
            headers: {
              Authorization: 'Bearer ' + githubToken,
            },
          }
        )
        .then((response) => {
          let repositories = [];
          response.data.forEach((the_repo) => {
            if (filter == '' || the_repo.repository.name == filter) {
              repositories.push(the_repo);
            }
          });
          return repositories;
        })
        .catch((error) => this.onError('getGithubContainers', error));
    },

    getGithubLabels(container) {
      console.log('getGithubLabels: ' + container);
      return axios
        .get(
          'https://ghcr.io/token?scope=repository:sifis-home/' +
            container +
            ':pull'
        )
        .then((response) => {
          let gh_token = response.data.token;
          return axios
            .get(
              'https://ghcr.io/v2/sifis-home/' +
                container +
                '/manifests/latest',
              {
                headers: {
                  Authorization: 'Bearer ' + gh_token,
                },
              }
            )
            .then((response) => {
              let gh_digest = response.data.config.digest;
              return axios
                .get(
                  'https://ghcr.io/v2/sifis-home/' +
                    container +
                    '/blobs/' +
                    gh_digest,
                  {
                    headers: {
                      Authorization: 'Bearer ' + gh_token,
                    },
                  }
                )
                .then((response) => {
                  return response.data.config.Labels;
                })
                .catch((error) => this.onError('getGithubLabels', error));
            })
            .catch((error) => this.onError('getGithubLabels', error));
        })
        .catch((error) => this.onError('getGithubLabels', error));
    },

    getDeviceInfo() {
      return axios
        .get('https://mobileapi.seculab.fi/v1/device/info')
        .then((response) => {
          return response.data;
        })
        .catch((error) => this.onError('getDeviceInfo', error));
    },

    getDeviceStatus() {
      return axios
        .get('https://mobileapi.seculab.fi/v1/device/status', {
          headers: {
            'x-api-key': centriaToken,
          },
        })
        .then((response) => {
          //console.log('Device Status');
          return response.data;
        })
        .catch((error) => this.onError('getDeviceStatus', error));
    },

    resetDevice() {
      return axios
        .get(
          'https://mobileapi.seculab.fi/v1/command/factory_reset?confirm=I%20really%20want%20to%20perform%20a%20factory%20reset',
          {
            headers: {
              'x-api-key': centriaToken,
            },
          }
        )
        .then((response) => {
          return response.data;
        })
        .catch((error) => this.onError('resetDevice', error));
    },

    restartDevice() {
      return axios
        .get('https://mobileapi.seculab.fi/v1/command/restart', {
          headers: {
            'x-api-key': centriaToken,
          },
        })
        .then((response) => {
          return response.data;
        })
        .catch((error) => this.onError('restartDevice', error));
    },

    onError(function_name, error) {
      console.log('Catch Error from ' + function_name + ':' + error);
      return null;
      // NOP
    },
  },
};
