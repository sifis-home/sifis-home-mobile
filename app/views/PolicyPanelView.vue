<template>
  <Page>
    <ActionBar>
      <NavigationButton
        text="Home"
        android.systemIcon="ic_menu_back"
        @tap="$navigateBack"
      />
      <Label text="Policy Definition Panel" />
    </ActionBar>

    <WebView :src="webUrl" />
  </Page>
</template>

<script>
import apiMixin from '@/mixins/apiMixin';

export default {
  mixins: [apiMixin],

  data() {
    return {
      webUrl: '',
    };
  },
  created() {
    this.webUrl = this.getPolicyAddress();
  },
};
</script>

<style scoped></style>
