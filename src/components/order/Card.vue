<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="344"
    >
      <v-img
        :src="order.car.url ? order.car.url : '/images/no-car.png'"
        height="150px"
      ></v-img>
     
      <v-card-title class="justify-space-between">
        <div>
          <h5>{{ order.car.brandmodel.brand.brandName + ' - ' + order.car.brandmodel.modelName }}</h5>
        </div>
        <div>
          <v-chip small :color="getColor(order.status)">{{ $t(`status.${order.status}`) }}</v-chip>
        </div>
      </v-card-title>

      <v-card-subtitle>
        <p class="mb-1">
          <span v-if="order.appointment">{{ order.appointment.appExpectStart.substr(0, 10) }}</span> <span
            v-if="order.appointment"
            class="mx-1"
            outlined
            small
            color="primary"
          >  {{ order.appointment.appExpectStart.substr(10, 6) }}<v-icon class="mx-1" small >mdi-arrow-right-bold-outline </v-icon> <span> {{ order.appointment.appExpectEnd.substr(10, 6) }}</span> </span>
        </p>
        <p>
          <b>{{ $t('users.note') }} :</b> <span v-text="order.serviceNote ? order.serviceNote : $t('common.noDataAvailable') "></span>
        </p>
        <div class="mb-0 d-flex justify-space-between">
          <CarPlate :plate="order.car.plate" />
          <v-btn text small color="warning" @click="goToLocation(order.geoPoint)"><v-icon small>mdi-map</v-icon>{{ $t('orders.showCarLocation') }}</v-btn> 
        </div>
      </v-card-subtitle>

      <v-card-actions>
        <v-btn
          color="warning"
          text
          @click="showMore(order.orderID)"
          v-text="!show ? $t('common.showMore') : $t('common.showLess')"
        >
        </v-btn>

        <v-spacer></v-spacer>

        <v-btn
          icon
          @click="showMore(order.orderID)"
        >
          <v-icon>{{ show ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
        </v-btn>
      </v-card-actions>

      <v-expand-transition>
        <div v-show="show">
          <v-divider></v-divider>

          <v-card-text>
            <v-skeleton-loader
              v-if="showMoreLoading"
              type="article"
            ></v-skeleton-loader>
            <div v-else>
              <div v-if="orderMorInfo.service.length != 0">
                <p><b> {{ $t('users.servise') }}: </b>{{ orderMorInfo.service[0]['serviceName'] }}</p>
              </div>
              
              <div v-if="orderMorInfo.invoice">
                <table class="attributeTable">
                  <th>{{ $t('orders.attribute') }} <nuxt-link :title="$t('common.showInfo')" style="text-decoration-line: none;" class="mx-1" :to="`/orders/${orderMorInfo.orderID}/show`"><v-icon color="warning">mdi-information-variant-circle-outline</v-icon></nuxt-link> </th>
                  <th>{{ $t('orders.value') }}</th>
                  <tr>
                    <td>{{ $t('orders.paymentType') }}</td>
                    <td>
                      <v-chip v-if="orderMorInfo.paymentType == 'CREDITCARD'" small color="success">
                        <v-icon >mdi-credit-card-check-outline</v-icon>
                        <span class="mx-1"> {{ $t(`orders.${orderMorInfo.paymentType}`) }}</span>
                      </v-chip>
                      <v-chip v-else-if="orderMorInfo.paymentType == 'CASH'" small color="warning">
                        <v-icon >mdi-cash-check</v-icon>
                        <span class="mx-1"> {{ $t(`orders.${orderMorInfo.paymentType}`) }}</span>
                      </v-chip>
                      <div v-else>
                        <span class="info--text">{{ orderMorInfo.paymentType }}</span>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>{{ $t('orders.price') }}</td>
                    <td>₺{{ orderMorInfo.invoice.price }}</td>
                  </tr>
                  <tr>
                    <td>{{ $t('orders.totalPrice') }}</td>
                    <td>₺{{ orderMorInfo.invoice.totalPrice }}</td>
                  </tr>
                  <tr v-if="orderMorInfo.invoice.fixedDiscount">
                    <td>{{ $t('orders.fixedDiscount') }}</td>
                    <td>₺{{ orderMorInfo.invoice.fixedDiscount }}</td>
                  </tr>
                  <tr v-if="orderMorInfo.invoice.percentageDiscount">
                    <td>{{ $t('orders.percentageDiscount') }}</td>
                    <td>₺{{ orderMorInfo.invoice.percentageDiscount }}</td>
                  </tr>
                  <tr>
                    <td><b>{{ $t('orders.totalPayment') }}</b></td>
                    <td><b>₺{{ orderMorInfo.invoice.totalPayment }}</b></td>
                  </tr>
                  <tr>
                    <td><b>{{ $t('orders.paymentStatus') }}</b></td>
                    <td><v-chip small :color="getColor(orderMorInfo.invoice.invoiceStatus)" class="d-inline-block" style="text-transform: capitalize;"><span >{{ $t('status.'+orderMorInfo.invoice.invoiceStatus) }}</span></v-chip></td>
                  </tr>
                
                </table>
              </div>
              <div v-if="orderMorInfo.rating" class="mt-2">

                <v-rating
                  :value="orderMorInfo.rating.theRate"
                  color="amber"
                  dense
                  half-increments
                  readonly
                  size="14"
                ></v-rating>
                <p v-if="orderMorInfo.comment" class="mb-0 mt-1 text-caption">
                  {{ orderMorInfo.comment.comment }}
                </p> 
              </div>
            </div>

          </v-card-text>
        </div>
      </v-expand-transition>
    </v-card>
  </div>
</template>

<script>
import CarPlate from  '~/components/common/CarPlate'

export default {
  components: {
    CarPlate
  },
  props: {
    order: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      show: false ,
      showMoreLoading : false ,
      orderMorInfo : {
        car : null,
        service : [] 
      }
    }
  },
  methods: {
    reserve () {
      this.loading = true

      setTimeout(() => (this.loading = false), 2000)
    },
    goToLocation(coordinates ) {
      const urlSuffix = coordinates .latitude + ', ' + coordinates .longitude

      window.open(
        'https://www.google.com/maps/search/?api=1&query=' + urlSuffix,
        '_blank'
      )
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
    showMore(orderID) {
      this.show = !this.show
      
      if (!this.show) return
      this.showMoreLoading = true
      this.$axios
        .$get(`/admin/order/${orderID}`)
        .then((res) => {
          this.orderMorInfo = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.showMoreLoading = false
        })
    }
  }
}
</script>