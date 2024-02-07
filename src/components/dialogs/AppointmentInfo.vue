<template>
  <div>
    <v-dialog
      v-model="dialog"
      max-width="700px"
      persistent
      transition="dialog-transition"
      @click:outside="closeDialog(false)"
    >
      <v-card v-if="appointmentInfo" class="borderCardInfo">
        <v-card-title class="text-h5 justify-space-between " >
          <h5>{{ $t('appointments.appointmentInfo') }}</h5>
          <v-btn
            v-if="!appointmentInfo.order "
            color="error"
            rounded
            outlined
            small
            @click="deleteOrderDialogStatus = true"
          > <v-icon small class="mx-1">mdi-delete-empty-outline</v-icon>{{ $t('common.delete') }}</v-btn>

        </v-card-title>
        <v-card-text >
          <v-simple-table >
            <tbody>
              <tr>
                <td><b>#{{ $t('appointments.id') }}</b></td>
                <td><b>{{ appointmentInfo.appointmentID }}</b></td>
              </tr>
              <tr>
                <td>{{ $t('appointments.status') }}</td>
                <td>{{ $t(`status.${appointmentInfo.appStatus}`) }}</td>
              </tr>
              <tr>
                <td>{{ $t('appointments.serviceArea') }}</td>
                <td><span>{{ appointmentInfo.servicearea.serviceArea_name }}</span></td>
              </tr>
              <tr>
                <td>{{ $t('appointments.apointmentDate') }}</td>
                <td><span>{{ appointmentInfo.appExpectStart.substr(0, 10) }}</span> <v-icon class="mx-1" small >mdi-arrow-right-bold-outline </v-icon> <span> {{ appointmentInfo.appExpectEnd.substr(0, 10) }}</span></td>
              </tr>
              <tr v-if="appointmentInfo.appStartAt">
                <td>{{ $t('appointments.workDate') }}</td>
                <td><span>{{ appointmentInfo.appStartAt.substr(0, 10) }}</span> <v-icon class="mx-1" small >mdi-arrow-right-bold-outline </v-icon> <span> {{ appointmentInfo.appEndtAt.substr(0, 10) }}</span></td>
              </tr>
              <tr v-if=" appointmentInfo.order">
                <td>{{ $t('appointments.userCar') }}</td>
                <td>{{ appointmentInfo.order.car.plateID }}</td>
              </tr>
              <tr v-if="appointmentInfo.order">
                <td>{{ $t('appointments.carInformation') }}</td>
                <td> 
                  <CarPlate :plate="appointmentInfo.order.car.plate" />
                  <v-btn icon :title="$t('appointments.showMap')" color="warning" @click="goToLocation(appointmentInfo.order.geoPoint)"><v-icon>mdi-map</v-icon></v-btn>
                </td>
              </tr>
              <tr v-if="appointmentInfo.order">
                <td>{{ $t('appointments.orderInformation') }}</td>
                <!-- <td> <v-btn icon title="Show Map" color="warning" @click="goToOrderInfo"><v-icon>mdi-map</v-icon></v-btn></td> -->
                <td>
                  <nuxt-link :to="`/orders/${appointmentInfo.order.orderID}/show`">{{ appointmentInfo.order.uuid }}</nuxt-link>
                </td>
              </tr>
                
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="error"
            outlined
            
            @click="closeDialog(false)"
          >
            {{ $t('common.cancel') }}
          </v-btn>
        </v-card-actions>
      </v-card>
      <v-card v-else >
        <v-card-text class="py-3">
          <v-skeleton-loader
            type="card-avatar"
          ></v-skeleton-loader>
        </v-card-text>
      </v-card>

      <ConfirmMessage :dialog="deleteOrderDialogStatus" :loading="loaderDeleteOrder" :contant="contantTextDeleteOrder" @closeConfirmation="closeConfirmationDeleteOrder($event)" />

    </v-dialog>
  </div>
</template>
<script>
import Rules from '~/apps/validation/index'
import CarPlate from  '~/components/common/CarPlate'

import ConfirmMessage from  '~/components/common/dialog/ConfirmMessage'

export default {
  components :{
    ConfirmMessage , CarPlate
  },
  mixins: [Rules] ,
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    appointmentId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading : false ,
      appointmentInfo: null,
      deleteOrderDialogStatus : false ,
      loaderDeleteOrder : false ,
      contantTextDeleteOrder : {
        title : `<h5>${this.$t('confirm.deleteAppointment')}</h5>` ,
        body : `<p class='mb-0'>${this.$t('confirm.deleteAppointmentText')}</p>` 
      }
     
    }
  },
  created() {
    this.getAppointmentInfo()
  },
  methods: {
    getAppointmentInfo() {
      this.$axios.$get(`/admin/appointment/${this.appointmentId}`).then((res) => {
        this.appointmentInfo = res.data
      })
    },
    closeDialog(status) {
      this.$emit('closeDialog' , status)
    },
    goToLocation(coordinates ) {
      const urlSuffix = coordinates .latitude + ', ' + coordinates .longitude

      window.open(
        'https://www.google.com/maps/search/?api=1&query=' + urlSuffix,
        '_blank'
      )
    },
    closeConfirmationDeleteOrder(status) {
      if (status) {
        this.loaderDeleteOrder = true
        this.$axios.$delete(`/admin/appointment/${this.appointmentInfo.appointmentID}`).then(() => {
          this.deleteOrderDialogStatus = false
          this.$store.dispatch('showSuccess', this.$t('common.success'))
          this.$emit('updateCalendar' , true)
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loaderDeleteOrder = false
        })
      }
      else {
        this.deleteOrderDialogStatus = false
      }
    }
  }
}
</script>