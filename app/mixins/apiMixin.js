import axios from 'axios';
import { SecureStorage } from '@nativescript/secure-storage';
import { Device } from '@nativescript/core/platform';

const tokenName = 'sifis-token';

export default {
  data() {
    return {
      secureStorage: new SecureStorage(),
      token: '',
    };
  },
  methods: {
    getToken() {
      return this.token;
    },
    apiLogin(username, password) {
      return axios
        .post('auth/local', { username: username, password: password })
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
