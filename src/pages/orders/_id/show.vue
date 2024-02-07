<template>
  <div v-permissions="''" class="d-flex flex-grow-1 flex-column">
    <v-skeleton-loader
      v-if="loadingData"
      class="borderCardInfo"
      type="article"
    ></v-skeleton-loader>
    <div v-else class="mb-6">
      <v-row>
        <v-col cols="12" class="pb-0">
          <v-card class="borderCardInfo" >
            <v-card-title border="left" primary-title>
              <v-icon color="info" class="mx-1">mdi-information-variant-circle-outline</v-icon>  <span class="info--text">{{ $t('orders.orderInfo') }}</span>
            </v-card-title>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card style="height: 100%;" class="borderCardInfo">
            <v-card-title primary-title>
              {{ $t('orders.basicInfo') }}
            </v-card-title>
            <v-card-text>
              <table class="attributeTable">
                <tr>
                  <th>{{ $t('orders.attribute') }}</th>
                  <th>{{ $t('orders.value') }}</th>
                </tr>
                <tr>
                  <td>#{{ $t('orders.id') }}</td>
                  <td>{{ orderInfo.orderID }}</td>
                </tr>
                <tr v-if=" orderInfo.service[0]">
                  <td>{{ $t('orders.servise') }}</td>
                  <td>{{ orderInfo.service[0]['serviceName'] }}</td>
                </tr>
                <tr>
                  <td> {{ $t('orders.appointment') }}</td>
                  <td><span v-if="orderInfo.appointment">{{ orderInfo.appointment.appExpectStart.substr(0, 10) }}</span> <v-chip v-if="orderInfo.appointment" small color="primary">  {{ orderInfo.appointment.appExpectStart.substr(10, 6) }}<v-icon class="mx-1" small >mdi-arrow-right-bold-outline </v-icon> <span> {{ orderInfo.appointment.appExpectEnd.substr(10, 6) }}</span> </v-chip></td>
                </tr>
                <tr>
                  <td>{{ $t('orders.executionDate') }}</td>
                  <td><span v-if="orderInfo.appointments">{{ orderInfo.appointments.appStartAt.substr(0, 10) }}</span> <v-chip v-if="orderInfo.appointments" small color="primary">  {{ orderInfo.appointments.appStartAt.substr(10, 6) }}<v-icon class="mx-1" small >mdi-arrow-right-bold-outline </v-icon> <span> {{ orderInfo.appointments.appEndtAt.substr(10, 6) }}</span> </v-chip></td>
                </tr>
                <tr>
                  <td>{{ $t('orders.status') }}</td>
                  <td><v-chip small :color="getColor(orderInfo.status)">{{ $t('status.' + orderInfo.status) }}</v-chip></td>
                </tr>
                <tr v-if="orderInfo.assignment">
                  <td>{{ $t('orders.assignment') }}</td>
                  <td><nuxt-link :to="`/assignments/${orderInfo.assignment.assignmentID}/show`">{{ $t('orders.showAssignmentInfo') }}</nuxt-link></td>
                </tr>
              </table>

            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card style="height: 100%;" class="borderCardInfo">
            <v-card-title primary-title>
              {{ $t('orders.carInfo') }}
            </v-card-title>
            <v-card-text >
              <table class="attributeTable">
                <tr>
                  <th>{{ $t('orders.attribute') }} </th>
                  <th>{{ $t('orders.value') }}</th>
                </tr>
                <tr>
                  <td>{{ $t('orders.plate') }}</td>
                  <td><CarPlate :plate="orderInfo.car.plate" />  </td>
                </tr>
                <tr>
                  <td>{{ $t('orders.model') }}</td>
                  <td> {{ orderInfo.car.brandmodel.brand.brandName + ' - ' + orderInfo.car.brandmodel.modelName }} <v-chip class="mx-1" small color="primary">{{ orderInfo.car.brandmodel.segment.segment_name }}</v-chip> </td>
                </tr>
                <tr>
                  <td>{{ $t('orders.color') }}</td>
                  <td> 
                    <v-icon
                      small
                      style="border: 1px solid #eee; border-radius: 50%; padding:2px;background-color: #fff;"
                      :color="'#' + orderInfo.car.color.colorCode"
                    >mdi-palette</v-icon>  {{ orderInfo.car.color.colorName }}
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('orders.image') }}</td>
                  <td> <v-btn
                    v-if="orderInfo.car.url"
                    small
                    class="carShowBtn"
                    color="primary"
                    icon
                    @click="showCarImageDialog = true"
                  ><v-icon small >mdi-eye</v-icon></v-btn> <span v-text="orderInfo.car.url ? 'Preview Car Image': $t('common.noImage')">  </span></td>
                </tr>
                <tr>
                  <td>{{ $t('orders.map') }}</td>
                  <td> <v-btn small icon color="warning" @click="goToLocation(orderInfo.geoPoint)"><v-icon small>mdi-map</v-icon></v-btn> {{ $t('orders.showCarLocation') }}</td>
                </tr>
              </table>
            </v-card-text>
          </v-card>
          <ImagePreview v-if="showCarImageDialog" :dialog="showCarImageDialog" :image="orderInfo.car.url || '/images/no-car.png'" @closeCarImage="showCarImageDialog = false" />
        </v-col>
        <v-col v-if="orderInfo.user" cols="12" md="6">
          <v-card style="height: 100%;" class="borderCardInfo">
            <v-card-title primary-title>
              
              {{ $t('orders.userInfo') }}
            </v-card-title>
            <v-card-text >
              <table class="attributeTable">
                <tr>
                  <th>{{ $t('orders.attribute') }} </th>
                  <th>{{ $t('orders.value') }}</th>
                </tr>
                <tr>
                  <td>{{ $t('orders.fullName') }}</td>
                  <td><nuxt-link :to="`/users/${ orderInfo.user.userID }/edit`">{{ orderInfo.user.fullname  }}</nuxt-link></td>
                </tr>
                <tr>
                  <td>{{ $t('orders.email') }}</td>
                  <td><a :href="'mailto:' + orderInfo.user.email ">{{ orderInfo.user.email }}</a></td>
                </tr>
                <tr>
                  <td>{{ $t('orders.phoneNumber') }}</td>
                  <td><a :href="'tel:0' + orderInfo.user.mobile ">{{ orderInfo.user.mobile }}</a></td>
                </tr>
              </table>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col v-if="orderInfo.invoice" cols="12" md="6">
          <v-card style="height: 100%;" class="borderCardInfo">
            <v-card-title primary-title class="justify-space-between">
              
              {{ $t('orders.invoiceInfo') }}
              <v-menu
                bottom
                left
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>

                <v-list>
                  <v-list-item @click="orderCancel">
                    <v-list-item-title><v-icon color="error">mdi-delete-forever-outline</v-icon>{{ $t('orders.orderCancel') }} </v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="orderInfo.invoice.successpayment" @click="orderRefunf">
                    <v-list-item-title><v-icon color="warning"> mdi-cash-refund</v-icon> {{ $t('orders.refundMoney') }}</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="makeItPaid">
                    <v-list-item-title><v-icon color="info">mdi-contactless-payment-circle</v-icon>{{ $t('orders.makeItPaid') }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-title>
            <v-card-text >
              <table class="attributeTable">
                <th>{{ $t('orders.attribute') }} </th>
                <th>{{ $t('orders.value') }}</th>
                <tr>
                  <td>{{ $t('orders.paymentType') }}</td>
                  <td>
                    <v-chip small color="success" v-if="orderInfo.paymentType == 'CREDITCARD'">
                      <v-icon  >mdi-credit-card-check-outline</v-icon>
                      <span class="mx-1"> {{ $t(`orders.${orderInfo.paymentType}`)}}</span>
                    </v-chip>
                    <v-chip small color="warning" v-else-if="orderInfo.paymentType == 'CASH'">
                      <v-icon >mdi-cash-check</v-icon>
                      <span class="mx-1"> {{ $t(`orders.${orderInfo.paymentType}`)}}</span>
                    </v-chip>
                    <div v-else>
                      <span class="info--text">{{ orderInfo.paymentType }}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>{{ $t('orders.price') }}</td>
                  <td>₺{{ orderInfo.invoice.price }}</td>
                </tr>
                <tr>
                  <td>{{ $t('orders.totalPrice') }}</td>
                  <td>₺{{ orderInfo.invoice.totalPrice }}</td>
                </tr>
                <tr v-if="orderInfo.invoice.fixedDiscount">
                  <td>{{ $t('orders.fixedDiscount') }}</td>
                  <td>₺{{ orderInfo.invoice.fixedDiscount }}</td>
                </tr>
                <tr v-if="orderInfo.invoice.percentageDiscount">
                  <td>{{ $t('orders.percentageDiscount') }}</td>
                  <td>₺{{ orderInfo.invoice.percentageDiscount }}</td>
                </tr>
                <tr>
                  <td><b>{{ $t('orders.totalPayment') }}</b></td>
                  <td><b>₺{{ orderInfo.invoice.totalPayment }}</b></td>
                </tr>
                <tr>
                  <td><b>{{ $t('orders.paymentStatus') }}</b></td>
                  <td><v-chip small color="success" class="d-inline-block" style="text-transform: capitalize;"><span >{{ $t('status.'+orderInfo.invoice.invoiceStatus) }}</span></v-chip></td>
                </tr>
                
              </table>
            </v-card-text>
          </v-card>
          <ConfirmMessage :dialog="deleteOrderDialogStatus" :loading="loaderDeleteOrder" :contant="contantTextDeleteOrder" @closeConfirmation="closeConfirmationDeleteOrder($event)" />
          <ConfirmMessage :dialog="refundOrderDialogStatus" :loading="loaderRefundOrder" :contant="contantTextRefundOrder" @closeConfirmation="closeConfirmationDeleteRefund($event)" />
          <ConfirmMessage :dialog="makePaidOrderDialogStatus" :loading="loaderMakePaidOrder" :contant="contantTextMakePaidOrder" @closeConfirmation="closeConfirmationDeleteMakePaid($event)" />

        </v-col>
      </v-row>
    </div>    

  </div>
</template>
  
<script>
import CarPlate from  '~/components/common/CarPlate'
import ImagePreview from  '~/components/common/ImagePreview'
import ConfirmMessage from  '~/components/common/dialog/ConfirmMessage'

export default {
  components: {
    CarPlate , ImagePreview  , ConfirmMessage
  },

  data() {
    return {
      orderInfo : null ,
      loadingData : false ,
      showCarImageDialog : false ,

      deleteOrderDialogStatus : false ,
      loaderDeleteOrder : false ,
      contantTextDeleteOrder : {
        title : `<h5>${this.$t('confirm.deleteOrder')}</h5>` ,
        body : `<p class='mb-0'>${this.$t('confirm.deleteOrderText')}</p>` 
      },

      refundOrderDialogStatus : false ,
      loaderRefundOrder : false ,
      contantTextRefundOrder : {
        title : `<h5>${this.$t('confirm.refundOrder')}</h5>` ,
        body : `<p class='mb-0'>${this.$t('confirm.refundOrderText')}</p>` ,
        form :[
          { name :  'amount' , type : 'textfield' , label : 'Amount' , value : '' }
        ]
      },
      makePaidOrderDialogStatus : false ,
      loaderMakePaidOrder : false ,
      contantTextMakePaidOrder : {
        title : `<h5>${this.$t('confirm.makeOrder')}</h5>` ,
        body : `<p class='mb-0'>${this.$t('confirm.makeOrderText')}</p>` 
      }
      
    }
  },
  watch :{
    
  },
  created() {
    this.getOrderInfo()
  },
  methods: {
    getOrderInfo() {
      this.loadingData = true
      this.$axios
        .$get(`/admin/order/${this.$route.params.id}`)
        .then((res) => {
          this.orderInfo = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingData = false
        })
    },
    getColor(status) {
      if (status === 'free') {
        return 'info'
      }
      else if (status === 'done') {
        return 'success'
      }
      else if (status === 'reserved') {
        return 'waiting'
      }
      else if (status === 'active') {
        return 'warning'
      }
      else if (status === 'refund') {
        return 'warning'
      }
      else if (status === 'pending') {
        return 'info'
      }
      else if (status === 'cancelled') {
        return 'error'
      } else {
        return 'light'
      }
    },
    orderCancel() {
      this.deleteOrderDialogStatus = true
    },
    orderRefunf() {
      this.refundOrderDialogStatus = true
    },
    makeItPaid() {
      this.makePaidOrderDialogStatus = true
    },
    closeConfirmationDeleteOrder(status) {
      if (status) {
        this.loaderDeleteOrder = true
        this.$axios.$delete(`/admin/order/${this.$route.params.id}`).then(() => {
          this.deleteOrderDialogStatus = false
          this.$store.dispatch('showSuccess', this.$t('common.success'))
          this.getOrderInfo()
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loaderDeleteOrder = false
        })
      }
      else {
        this.deleteOrderDialogStatus = false
      }
    },
    closeConfirmationDeleteRefund(status) {
      if (status) {
        this.loaderRefundOrder = true

        const index = this.contantTextRefundOrder.form.findIndex( (object) => {
          return object.name === 'amount'
        })

        const data = {
          form : { 'amount' : this.contantTextRefundOrder.form[index]['value'] , '_method': 'DELETE' }
        }

        this.$axios.$post(`/admin/payment/${this.orderInfo.invoice.successpayment.paymentID}` , data.form).then(() => {
          this.refundOrderDialogStatus = false
          this.$store.dispatch('showSuccess', this.$t('common.success'))
          this.contantTextRefundOrder.form[index]['value'] = null
          this.getOrderInfo()
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loaderRefundOrder = false
        })
      }
      else {
        this.refundOrderDialogStatus = false
      }
    },
    closeConfirmationDeleteMakePaid(status) {
      if (status) {
        this.loaderMakePaidOrder = true
        this.$axios.$put(`/admin/order/${this.$route.params.id}`).then(() => {
          this.makePaidOrderDialogStatus = false
          this.$store.dispatch('showSuccess', this.$t('common.success'))
          this.getOrderInfo()
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loaderMakePaidOrder = false
        })
      }
      else {
        this.makePaidOrderDialogStatus = false
      }
    },
    goToLocation(coordinates ) {
      const urlSuffix = coordinates .latitude + ', ' + coordinates .longitude

      window.open(
        'https://www.google.com/maps/search/?api=1&query=' + urlSuffix,
        '_blank'
      )
    }
  }
}
</script>