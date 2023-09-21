<template>
  <Page>

   <ActionBar title="User list" />

    <StackLayout>
      <HeaderView />

      <Image
        class="logo"
        src="~/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />
      <Button text="Add new" @tap="userAdd" />

      <StackLayout class="input-field">
        <ListView for="(user, index) in users" class="list-group">
          <v-template>
            <StackLayout class="m-0 p-0">
              <GridLayout class="listview--item" rows="auto" columns="auto, *">
              <!-- <Label row="0" col="0" :text="index" class="h2 m-l-4" />-->
                <Label row="0" col="2" :text="index+1 + ': ' + user.username" class="h2 m-l-4 text-black" @tap="getUserData(user.username)" /> <!-- colSpan="2"  -->

              </GridLayout>
            </StackLayout>
          </v-template>
        </ListView>
      </StackLayout>
    </StackLayout>
  </Page>
</template>

  </Page>
</template>

<script>
import Vue from 'nativescript-vue';
import apiMixin from '@/mixins/apiMixin';
import UserAddView from './UserAddView.vue';
import HeaderView from './HeaderView.vue';

export default Vue.extend({
  mixins: [apiMixin],
  components: {
    HeaderView,
  },
  props: {
    users: Array,
    organization: String,
    token: String,
  },

  methods: {
    getUserData(username) {
      /*
      this.getUserByUsername(username).then((resp) => {
        console.log(resp);
      });

     this.getUserRoles(this.organization, user__id, this.token).then((resp) => {
        console.log(resp);
      });*/

      alert(username);
    },
    userAdd() {
      console.log("User add");
      this.$navigateTo(UserAddView, {
        transition: {
          name: 'fade',
          duration: 225,
          curve: 'easeIn',
        },
        props: {
          organization: this.organization,
        },
      });
    },

  },

});
</script>

<style>
</style>
