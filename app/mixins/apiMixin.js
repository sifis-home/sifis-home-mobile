import axios from 'axios';
import { getString, setString } from '@nativescript/core/application-settings';
import { Http, HttpResponse } from '@nativescript/core';

const tokenName = 'sifis-token';
const yggioUrl = 'https://yggio.sifis-home.eu/';

export default {
  data() {
    return {
      yggio_token: '',
      github_token: '',
      /* To access sifis-home containers, application needs token with read:packages scope https://github.com/settings/tokens/new */
    };
  },

  methods: {
    checkIsLoggedIn() {
      this.yggio_token = getString(tokenName);
      if (this.yggio_token) {
        axios.defaults.headers.common['Authorization'] =
          'Bearer ' + this.yggio_token;
      }
    },

    apiLogin(username, password) {
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
        .catch((error) => this.onError(error));
    },

    apiLogout() {
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
        .catch((error) => this.onError(error));
    },

    getUserRoles() {
      return axios
        .get(yggioUrl + 'auth/realms/yggio/account')
        .then((response) => {
          //console.log(response.data);
          return response.data;
        })
        .catch((error) => this.onError(error));
    },

    getOrganization() {
      return axios
        .get(yggioUrl + 'api/organizations')
        .then((response) => {
          //console.log('Get organizations');
          //console.log(response);
          return response.data[0];
        })
        .catch((error) => this.onError(error));
    },

    getUserByUsername(username) {
      return axios
        .get(yggioUrl + 'api/users/' + username)
        .then((response) => {
          //console.log(response.data);
          return response.data;
        })
        .catch((error) => this.onError(error));
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
        .catch((error) => this.onError(error));
    },

    getDhtAll() {
      console.log('getDhtAll: ');

      Http.request({
        url: 'http://sifis-device2.iit.cnr.it:8000/dht/get_all',
        method: 'GET',
        headers: { Authorization: 'Bearer ' + this.yggio_token },
      }).then(
        (response) => {
          console.log('Http GET Result: ' + response);
        },
        (e) => {
          console.log(e);
        }
      );
      /*      
      return axios
        .get('http://sifis-device2.iit.cnr.it:8000/dht/get_all')
        .then((response) => {
          console.log(response.data);

          return response.data;
        })
        .catch((error) => this.onError(error));
        */
    },

    getGithubToken() {
      return this.github_token;
    },

    getGithubContainers() {
      return axios
        .get(
          'https://api.github.com/orgs/sifis-home/packages?package_type=container',
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
        .catch((error) => this.onError(error));
    },

    onError(error) {
      console.log('Catch Error: ' + error);
      // NOP
    },
  },
};
