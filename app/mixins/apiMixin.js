import axios from 'axios';
import { SecureStorage } from '@nativescript/secure-storage';
import { Device } from '@nativescript/core/platform';

const tokenName = 'sifis-token';

export default {
  data() {
    return {
      secureStorage: new SecureStorage(),
    };
  },
  methods: {
    apiLogin(username, password) {
      return axios
        .post('login', { username: username, password: password })
        .then((response) => {
          this.secureStorage.setSync({
            key: tokenName,
            value: response.data.token,
          });
          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + response.data.token;
          return response.data;
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
