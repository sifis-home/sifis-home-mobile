import axios from 'axios';
import { SecureStorage } from '@nativescript/secure-storage';
import { Device } from '@nativescript/core/platform';

const tokenName = 'sifis-token';
const yggioUrl = 'https://yggio.sifis-home.eu/';
const packageUrl = 'https://hub.docker.com/v2/'
const dhtUrl = 'http://sifis-device2.iit.cnr.it:8000/dht/';

export default {
  data() {
    return {
      secureStorage: new SecureStorage(),
      yggio_token: '',
      dockerhub_token: '',
    };
  },
  methods: {


    // Yggio related functionality
    checkIsLoggedIn() {
      console.log("checkIsLoggedIn");
      const local_token = this.secureStorage.getSync({ key: tokenName });

      // Todo: verify token, check that user has really logged in
      if (local_token) {
        console.log(local_token);
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + local_token;
        this.yggio_token = local_token;
      }
    },
    getUserData() {
      return axios.get(yggioUrl + 'api/users/me').then(response => {
        return (response.data);
      }).catch(error => this.onError("getUserData", error));
    },

    getUserRoles(/*organization, user_id, token*/) {
      console.log("getUserRoles");
      return axios.get(yggioUrl + 'auth/realms/yggio/account').then(response => {
        console.log(response.data);
        return (response.data);
      }).catch(error => this.onError("getUserRoles", error));
    },
      
    getOrganization() {
      return axios.get(yggioUrl + 'api/organizations').then(response => {
        console.log("Get organizations");
        console.log(response);
        console.log(response);
        return (response.data[0]);
      }).catch(error => this.onError("getOrganization", error));
    },

    getUserByUsername(username) {
      console.log('getUserByUsername: ' + yggioUrl + 'api/users/' + username);

      return axios.get(yggioUrl + 'api/users/' + username).then(response => {
        console.log(response.data);

        return (response.data);
      }).catch(error => this.onError("getUserByUsername", error));
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
      return axios.get(yggioUrl + 'api/users/seek?userIds[]=' + userIds).then(response => {
        console.log("Then");
        console.log(response.data);
        return (response.data);
      }).catch(error => this.onError("getUsers", error));
    },

    apiLogout() {
      axios.defaults.headers.common['Authorization'] = '';
      this.secureStorage.setSync({ key: tokenName, value: '' });
    },

    apiLogin(username, password) {
      return axios
        .post(yggioUrl + 'api/auth/local', {
          username: username,
          password: password,
        })
        .then((response) => {
          let returned_token = response.data.token;
          this.secureStorage.setSync({
            key: tokenName,
            value: response.data.token,
          });
          console.log("Api login done");
          console.log(returned_token);
          this.yggio_token = returned_token;
          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + returned_token;
          return returned_token;
        })
        .catch((error) => this.onError("apiLogin", error));
    },

    // DHT related functionality
    async getDhtAll() {
      console.log('getDhtAll *http://sifis-device2.iit.cnr.it:8000/dht/get_all*');
    
      return axios.get('http://sifis-device2.iit.cnr.it:8000/dht/get_all').then(response => {
        console.log(response.data);
        return (response.data);
      }).catch(error => this.onError("getDhtAll", error));

      /*
      try{
        const {data} =  await get(dhtUrl + 'get_all', { headers: {
          'Content-Type': "application/json",
          'Accept': "application/json",
          }});
          console.log(data);      
        }catch(e){
          console.log(e.response.data);
        }       
*/
    },

    // Dockerhub related functionality =>
    getDockerToken() {
      return this.dockerhub_token;
    },

    dockerLogin() {
      return axios
        .post(packageUrl + 'users/login', {
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
        .catch((error) => this.onError("dockerLogin", error));
    },

    getDockerRepositories() {
      return axios
        .get(packageUrl + 'repositories/sifishome')
        .then((response) => {
          console.log('getDockerRepositories');
          console.log(response.data.count);
          return response.data.results;
        })
        .catch((error) => this.onError("getDockerRepositories", error));
    },

    getDockerRepository(repoName) {
      return axios
        .get(
          packageUrl + 'namespaces/sifishome/repositories/' +
            repoName +
            '/tags'
        )
        .then((response) => {
          console.log('getDockerRepository');
          console.log(response.data);
          return response.data;
        })
        .catch((error) => this.onError("getDockerRepository", error));
    },
    /* <= End of dockerhub stuff */

    onError(function_name, error) {
      console.log("onError!");
      console.log("Caught error from: " + function_name + ":" + error);
      return null;
      // NOP
    },
  },
};
