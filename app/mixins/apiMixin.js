import axios from 'axios';
import { getString, setString } from '@nativescript/core/application-settings';
import { Http, HttpResponse } from '@nativescript/core';
import * as Https from '@nativescript-community/https';

import { knownFolders } from '@nativescript/core';

const tokenName = 'sifis-token';
const yggioUrl = 'https://yggio.sifis-home.eu/';

export default {
  data() {
    return {
      yggio_token: '',
      github_token: '',
      centria_token: '',
      /* To access sifis-home containers, application needs token with read:packages scope https://github.com/settings/tokens/new */
    };
  },

  methods: {

    // Initialize Yggio token from local storage
    initYggioToken() {
      this.yggio_token = getString(tokenName);
      if (this.yggio_token) {
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + this.yggio_token;
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
          setString(tokenName, returned_token);
          this.yggio_token = returned_token;
          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + returned_token;
          return returned_token;
        })
        .catch((error) => this.onError("yggioLogin", error));
    },

    // perform logout from yggio.sifis-home.eu
    yggioLogout() {
      axios.defaults.headers.common['Authorization'] = '';
      this.yggio_token = '';
      setString(tokenName, '');
    },

    getUserData() {
      return axios
        .get(yggioUrl + 'api/users/me')
        .then((response) => {
          return response.data;
        })
        .catch((error) => this.onError("getUserData", error));
    },

    getUserRoles() {
      return axios
        .get(yggioUrl + 'auth/realms/yggio/account')
        .then((response) => {
          //console.log(response.data);
          return response.data;
        })
        .catch((error) => this.onError("getUserRoles", error));
    },

    getOrganization() {
      return axios
        .get(yggioUrl + 'api/organizations')
        .then((response) => {
          //console.log('Get organizations');
          //console.log(response);
          return response.data[0];
        })
        .catch((error) => this.onError("getOrganization", error));
    },

    getUserByUsername(username) {
      return axios
        .get(yggioUrl + 'api/users/' + username)
        .then((response) => {
          //console.log(response.data);
          return response.data;
        })
        .catch((error) => this.onError("getUserByUsername", error));
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
          return response.data;
        })
        .catch((error) => this.onError("getUsers", error));
    },

    getDhtAll() {
      console.log('getDhtAll: ');

      let dir = knownFolders.currentApp().getFolder('assets')
      let certificate = dir.getFile('ca-sifis.crt').path
      console.log(certificate);
      //Https.enableSSLPinning({ host: 'sifis-device1.iit.cnr.it', certificate })
      Https.enableSSLPinning({ host: 'sifis-device1.iit.cnr.it:8000', certificate, allowInvalidCertificates: true, validatesDomainName: false })
            Https.request({
        url: 'https://sifis-device1.iit.cnr.it:8000/dht/get_all',
        method: 'GET',
    })
        .then(function (response) {
            console.log('Https.request response', response);
        })
        .catch(function (error) {
            console.error('Https.request error', error);
        });

      Http.request({
        url: 'https://146.48.62.97:8000/dht/get_all',
        method: 'GET',
        headers: { Authorization: 'Bearer ' + this.yggio_token },
      }).then(
        (response) => {
          console.log('Http GET Result: ');
          console.log(`Response Status Code: ${response.statusCode}`)
          console.log(`Response Headers:`, response.headers)
          console.log(`Response Content: ${response.content}`)
          //  return response.data;
        },
        (e) => {
          console.log(e);
        }
      );
      return axios
        .get('https://146.48.62.97:8000/dht/get_all')
        .then((response) => {
          console.log(response.data);
          return response.data;
        })
        .catch((error) => this.onError("getDhtAll", error));
    },

    getGithubToken() {
      return this.github_token;
    },

    getGithubContainers() {
      return axios
        .get(
          'https://api.github.com/orgs/sifis-home/packages?package_type=container&per_page=100&sort=updated',
          {
            headers: {
              Authorization: 'Bearer ' + this.github_token,
            },
          }
        )
        .then((response) => {
          //console.log('getGithubContainers');
          //console.log(response.data);
          return response.data;
        })
        .catch((error) => this.onError("getGithubContainers", error));
    },

    getDeviceInfo() {
      return axios
        .get('https://mobileapi.seculab.fi/v1/device/info')
        .then((response) => {
          console.log('Device Info');
          console.log(response.data);
          return response.data;
        })
        .catch((error) => this.onError(error));
    },

        
    getDeviceStatus() {
      return axios
        .get(
          'https://mobileapi.seculab.fi/v1/device/status',
          {
            headers: {
              'x-api-key': this.centria_token,
            },
          }
        )
        .then((response) => {
          console.log('Device Status');
          console.log(response.data);
          return response.data;
        })
        .catch((error) => this.onError(error));
    },
     
    onError(error) {
      console.log('Catch Error: ' + error);
      // NOP
    },
  },
};
