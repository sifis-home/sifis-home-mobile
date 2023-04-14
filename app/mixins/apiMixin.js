import axios from 'axios';
import { SecureStorage } from '@nativescript/secure-storage';
import { Device } from '@nativescript/core/platform';

const tokenName = 'sifis-token';

export default {
  data() {
    return {
      secureStorage: new SecureStorage(),
      dockerhub_token: '',
    };
  },
  methods: {

    checkIsLoggedIn() {
      const local_token = this.secureStorage.getSync({ key: tokenName });
      // Todo: verify token, check that user has really logged in
      if (local_token) {
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + local_token;
      }
    },
    getUserData() {
      return axios.get('https://yggio.sifis-home.eu/api/users/me').then(response => {
        return (response.data);
      }).catch(error => this.onError(error));
    },

    getUserRoles(/*organization, user_id, token*/) {
      console.log("getUserRoles");
      return axios.get('https://yggio.sifis-home.eu/auth/realms/yggio/account').then(response => {
        console.log(response.data);
        return (response.data);
      }).catch(error => this.onError(error));
    },
      
    getOrganization() {
      return axios.get('https://yggio.sifis-home.eu/api/organizations').then(response => {
        console.log("Get organizations");
        console.log(response);
        console.log(response);
        return (response.data[0]);
      }).catch(error => this.onError(error));
    },

    getUserByUsername(username) {
      console.log("getUserByUsername: https://yggio.sifis-home.eu/api/users/" + username);

      return axios.get('https://yggio.sifis-home.eu/api/users/' + username).then(response => {
        console.log(response.data);

        return (response.data);
      }).catch(error => this.onError(error));
    },


    
    getUsers(user_list) {
      let userIds = "";
      user_list.forEach(userID => {
        if(userIds != "") {
          userIds += "&"
        }
        userIds += "userIds[]=" + userID;
      });
      console.log("Seek users");
      return axios.get('https://yggio.sifis-home.eu/api/users/seek?userIds[]=' + userIds).then(response => {
        console.log("Then");
        console.log(response.data);
        return (response.data);
      }).catch(error => this.onError(error));
    },


    apiLogout() {
      axios.defaults.headers.common['Authorization'] = '';
      this.secureStorage.setSync({ key: tokenName, value: '' });
    },

    apiLogin(username, password) {
      return axios
        .post('https://yggio.sifis-home.eu/api/auth/local', {
          username: username,
          password: password,
        })
        .then((response) => {
          let returned_token = response.data.token;
          this.secureStorage.setSync({
            key: tokenName,
            value: response.data.token,
          });
          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + returned_token;
          return returned_token;
        })
        .catch((error) => this.onError(error));
    },

    /* Start of Dockerhub stuff => */
    getDockerToken() {
      return this.dockerhub_token;
    },
    dockerLogin() {
      return axios
        .post('https://hub.docker.com/v2/users/login', {
          username: 'sifishome',
          password: 'dckr_pat_TYDAIOs8Z8JGybpEb4YcWuOvyxI',
        })
        .then((response) => {
          console.log('Login done');
          // console.log(response);
          this.dockerhub_token = response.data.token;
          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + response.data.token;
          return response.data.token;
        })
        .catch((error) => this.onError(error));
    },
    getDockerRepositories() {
      return axios
        .get('https://hub.docker.com/v2/repositories/sifishome')
        .then((response) => {
          console.log('getDockerRepositories');
          console.log(response.data.count);
          return response.data.results;
        })
        .catch((error) => this.onError(error));
    },
    getDockerRepository(repoName) {
      return axios
        .get(
          'https://hub.docker.com/v2/namespaces/sifishome/repositories/' +
            repoName +
            '/tags'
        )
        .then((response) => {
          console.log('getDockerRepository');
          console.log(response.data);
          return response.data;
        })
        .catch((error) => this.onError(error));
    },
    /* <= End of dockerhub stuff */

    onError(error) {
      console.log('ON ERROR');
      console.log(error);
      // NOP
    },
  },
};
