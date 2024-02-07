<template>
  <v-dialog v-model="initialvalue.dialog" max-width="350">
    <v-card class="borderCardInfo">
      <v-card-title class="headline">{{
        $t("common.confirmationDeleteTitle")
      }}</v-card-title>
      <v-card-text>{{ $t("common.confirmationDeleteParagraph") }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="initialvalue.dialog = false">{{
          $t(`common.cancel`)
        }}</v-btn>
        <v-btn color="error" :loading="loading" @click="deleteConfirm">{{
          $t(`common.delete`)
        }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      initialvalue: this.value ,
      loading : false 
    }
  },

  methods: {
    deleteConfirm() {
      this.loading = true
      this.$axios.$delete('/admin/' + this.initialvalue.deleteApi)
        .then(() => {
          this.$store.dispatch('showSuccess', this.$t('common.success'))
          this.initialvalue.status = true
          this.initialvalue.dialog = false
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
