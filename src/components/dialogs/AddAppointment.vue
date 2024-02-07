<template>
  <div>
    <v-row>
      <v-col cols="12" class="pt-0">
        <v-btn outlined color="primary" @click="dialog = true"><v-icon class="mr-1">mdi-plus-circle-outline</v-icon>{{ $t('appointments.addAppointment') }}</v-btn>
      </v-col>
    </v-row>
    <v-dialog
      v-model="dialog"
      max-width="700px"
      transition="dialog-transition"
    >
      <v-card class="borderCardInfo">
        <v-card-title class="text-h5">
          {{ $t('appointments.setNewAppointments') }}
        </v-card-title>
        <v-card-text>
          <v-form ref="form" >
            <v-row>
              <v-col cols="12" class="pb-0">
                <v-autocomplete
                  v-model="serviceArea"
                  :items="serviceAreasList"
                  :rules="[required]"
                  item-text="serviceArea_name"
                  :label="$t('serviceCars.serviceAreaName')"
                  item-value="serviceAreaID"
                  outlined
                  dense
                >
                </v-autocomplete>
              </v-col>
              <v-col cols="6">
                <v-date-picker v-model="date"></v-date-picker>
              </v-col>
              <v-col v-if="dialog" cols="6">
                <v-time-picker
                  v-model="time"
                  format="24hr"
                  :rules="[required]"
                  :allowed-minutes="m => m % 60 === 0"
                  @click:hour="setMin"
                ></v-time-picker>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            outlined
            @click="dialog = false"
          >
            {{ $t('common.cancel') }}
          </v-btn>
          <v-btn
            color="primary"
            outlined
            :loading="loading"
            @click="submit"
          >
            {{ $t('common.create') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Rules from '~/apps/validation/index'

export default {
  mixins: [Rules] ,
  data() {
    return {
      dialog : false ,
      date : (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      time : null ,
      loading : false ,
      serviceAreasList : [] ,
      serviceArea: null 
    }
  },
  created() {
    this.getServiceAreas()
  },
  methods: {
    setMin(hour) {
      this.time = hour + ':00'
    },
    getServiceAreas() {
      this.$axios.$get('/admin/servicearea').then((res) => {
        this.serviceAreasList = res.data
      })
    },
    submit() {
      if (this.time && this.$refs.form.validate()) {
        this.loading = true
        const dataForm = {
          serviceAreaID: this.serviceArea,
          appointments: [
            {
              appExpectStart: (this.date + ` ${ parseInt(this.time ) < 10 ? '0' : ''}${ this.time }`).substr(0, 13)
            }
          ]
        }

        this.$axios
          .$post('/admin/appointment' , dataForm)
          .then((res) => {
            this.$store.dispatch('showSuccess' , res.message)
            this.$emit('updateAppointments' , true)
            this.dialog = false
            this.time = null
          }).catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.$store.dispatch('showError', this.$t('rules.dataNotValid'))
      }
    }
  }
}
</script>