<template>
  <v-dialog v-model="model_Dialog" max-width="360">
    <v-card class="borderCardInfo">
      <v-card-title>
        <h3>{{ $t('serviceCars.printUUID') }}</h3>
      </v-card-title>
      <v-card-text id="QrCodeImage" class="text-center">
        <VueQrcode
            width="280"
          :value="uuid"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn outlined color="primary" @click="printQrCode">{{ $t('common.print') }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
  
<script>
import VueQrcode from 'vue-qrcode'

export default {
  components :{
    VueQrcode
  },
  
  model:{
    event: 'update_dialog',
    prop: 'dialog'
  },
  
  props:{
    dialog:{
      type: Boolean,
      required: true
    },
    uuid :{
      type: String,
      default: null
    }
  },
  
  data() {
    return {
      //   dialog : true
    }
  },
  
  computed: {
    model_Dialog:{
      get() {
        return this.dialog
      },
      set(val) {
        this.$emit('update_dialog', val)
      }
    }
  },
  methods: {
    printQrCode() {
      const divContents = document.getElementById('QrCodeImage').innerHTML

      const a = window.open('', '')

      a.document.write('<html> <body style="text-align: center;">')
      a.document.write(divContents)
      a.document.write('</body ></html>')
      a.document.close()
      a.print()
    }
  }
}
</script>