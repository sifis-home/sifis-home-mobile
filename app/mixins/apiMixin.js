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
    onError(error) {
      console.log('ON ERROR');
      console.log(error);
      // NOP
    },
  },
};
