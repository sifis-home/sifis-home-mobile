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

/* To access sifis-home containers, application needs token with read:packages scope https://github.com/settings/tokens/new */
const githubToken = '';

/* Token to access Sifis-mobile API */
const centriaToken =
  '';

export default {
  methods: {
    initializeApp() {
      this.loadJsonSchemas();
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
          console.log('Get organizations');
          //console.log(response.data[0]);
          return response.data[0];
        })
        .catch((error) => this.onError('getOrganization', error));
    },

    getLogs() {
      return axios
        .get(yggioUrl + 'api/logs?resourceType=device&limit=20')
        .then((response) => {
          console.log('Get logs');
          //console.log(response.data[0]);
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
      if (getNumber(dhtSelectionToken) == 0) {
        return getString(localDhtToken);
      }
      return getString(remoteDhtToken);
    },

    setDHTAddress(localServerAddress, remoteServerAddress, serverSelection) {
      setString(localDhtToken, localServerAddress);
      setString(remoteDhtToken, remoteServerAddress);
      setNumber(dhtSelectionToken, serverSelection);
    },

    getDHTConfig() {
      let dhtConfig = [];
      dhtConfig.push(getString(localDhtToken));
      dhtConfig.push(getString(remoteDhtToken));
      dhtConfig.push(getNumber(dhtSelectionToken));
      return dhtConfig;
    },

    getDhtAll() {
      let dht_address = this.getDHTAddress();
      return axios
        .get(dht_address + '/get_all')
        .then((response) => {
          return response.data;
        })
        .catch((error) => this.onError('getDhtAll', error));
    },

    getDhtSensors() {
      let dht_address = this.getDHTAddress();
      return axios
        .get(dht_address + '/get_all')
        .then((response) => {
          let sensors = [];
          response.data.forEach((the_sensor) => {
            if (
              the_sensor.topic_name.startsWith('domo_') ||
              the_sensor.topic_name.startsWith('shelly_') ||
              the_sensor.topic_name.startsWith('riots_')
            ) {
              sensors.push(the_sensor);
            }
          });
          return sensors;
        })
        .catch((error) => this.onError('getDhtAll', error));
    },

    getDhtSensor(topic_name, topic_uuid) {
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
        .catch((error) => this.onError('getDhtSensor', error));
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

    postDhtSensor(command) {
      let dht_address = this.getDHTAddress();
      console.log('Posting DHT sensor');

      return axios
        .post(dht_address + '/pub', {
          command,
        })
        .then((response) => {
          console.log('postDhtSensor done');
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
