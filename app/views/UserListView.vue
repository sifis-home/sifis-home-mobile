<template>
  <Page>

    <ActionBar>
      <Label text="User List" class="font-bold text-lg" />
    </ActionBar>

    <StackLayout>

      <Image
        class="logo"
        src="~/include/sifis-home-logo.png"
        height="120"
        verticalAlignment="center"
      />
      <Button text="Add new" @tap="userAdd" />

      <StackLayout class="input-field">
        <ListView for="(user, index) in users" separatorColor="transparent" @itemTap="loadDevice" class="list-group h-full">
          <v-template>
            <StackLayout class="m-0 p-0">
              <GridLayout class="listview--item" rows="auto" columns="auto, *">
              <!-- <Label row="0" col="0" :text="index" class="h2 m-l-4" />-->
                <Label row="0" col="2" :text="index+1 + ': ' + user.username" class="h2 m-l-4 text-black" @tap="getUserData(user._id)" /> <!-- colSpan="2"  -->

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

export default Vue.extend({
  mixins: [apiMixin],

  props: {
    users: Array,
    organization: String,
    token: String,
  },

  methods: {
    getUserData(user__id) {
      //this.getUserRoles(this.organization, user__id, this.token).then((resp) => {
      //  console.log(resp);
      //});
      alert(user__id);
    },
    userAdd() {
      console.log("User add");
      this.$navigateTo(UserAddView);
    },

  },

});
</script>

<style>
</style>
