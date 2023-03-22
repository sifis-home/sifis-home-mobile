import axios from 'axios';
import { SecureStorage } from '@nativescript/secure-storage';
import { Device } from '@nativescript/core/platform';

const tokenName = 'sifis-token';

export default {
  data() {
    return {
      secureStorage: new SecureStorage(),
      token: '',
      dockerhub_token: '',
      repository_count: 0,
      repositories: '',
    };
  },
  methods: {
    getToken() {
      return this.token;
    },
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
          this.repository_count = response.data.count;
          this.repositories = response.data.results;
          return this.repositories;
        })
        .catch((error) => this.onError(error));
    },
    getRepository(repoName) {
      return axios
        .get(
          'https://hub.docker.com/v2/namespaces/sifishome/repositories/' +
            repoName +
            '/tags'
        )
        .then((response) => {
          console.log('getRepository');
          console.log(response.data);
          return this.response.data;
        })
        .catch((error) => this.onError(error));
    },

    apiLogin(username, password) {
      return axios
        .post('https://yggio.sifis-home.eu/api/auth/local', {
          username: username,
          password: password,
        })
        .then((response) => {
          let returned_token = response.data.token;
          this.token = returned_token;
          /*
          this.secureStorage.setSync({
            key: tokenName,
            value: response.data.token,
          });*/
          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + returned_token;
          return returned_token;
        })
        .catch((error) => this.onError(error));
    },

    onError(error) {
      console.log('ON ERROR');
      console.log(error);
      // NOP
    },
  },
};
