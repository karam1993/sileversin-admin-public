<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="320"
  >
    <v-card class="borderCardInfo">
      <v-card-title class="text-h5">
        <div v-html="contant.title"></div>
      </v-card-title>
      <v-card-text>
        <div v-html="contant.body"></div>
        <v-row v-if="contant.form">
          <v-col v-for="(input , index) in contant.form" :key="index" cols="12" class="pb-0">
            <div v-if="input.type == 'textarea'">
              <v-textarea v-model="input.value" :label="input.label" rows="4" outlined>
              </v-textarea>
            </div>
            <div v-if="input.type == 'textfield'">
              <v-text-field v-model="input.value" dense :label="input.label" outlined>
              </v-text-field>
            </div>
            <div v-if="input.type == 'autocomplete'">
              <v-autocomplete 
                v-model="input.value" 
                :search-input.sync="searchKey"
                dense 
                outlined
                :label="input.label" 
                :item-value="input.autocompleteOptions.itemValue"
                :item-text="input.autocompleteOptions.itemText"
                :items="input.autocompleteOptions.items"
                @keyup="getItems(input.autocompleteOptions)"
              >
              </v-autocomplete>
            </div>
          </v-col>
        </v-row>
        
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          outlined
          @click="closeDialog(false)"
        >
          <v-icon small >mdi-close-circle-outline </v-icon> <span class="mx-1">{{ $t('common.cancel') }}</span>

        </v-btn>
        <v-btn
          color="success"
          :loading="loading"
          outlined
          @click="closeDialog(true)"
        >
          <v-icon small >mdi-thumb-up-outline </v-icon> <span class="mx-1">{{ $t('common.ok') }}</span>
        </v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script>
export default {

  props: {
    dialog :{
      type : Boolean ,
      default : false 
    },
    loading :{
      type : Boolean ,
      default : false 
    },
    contant : {
      type : Object
    }
  },
  data() {
    return {
      searchKey : null ,
    }
  },
  methods: {
    closeDialog(status) {
      this.$emit('closeConfirmation' , status)
    },
    getItems(options) {
      if (this.timer) {           // delay time befor searching
        clearTimeout(this.timer)  // delay time befor searching
        this.timer = null         // delay time befor searching
      }                           // delay time befor searching
      this.timer = setTimeout(() => {
        this.$axios
          .$get(`/${options.api}${this.searchKey}`)
          .then((res) => {
            options.items = res.data
           
          }).catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
      }, 500)
    }
  }
}
</script>