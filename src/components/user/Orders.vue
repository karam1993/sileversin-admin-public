<template>
  <v-card elevation="0" color="#f9f9f9">
    <v-card-text>
      <v-row v-if="ordersUser.length > 0 ">
        <v-col cols="12" md="4" v-for="(order, index) in ordersUser" :key="index">
          <Order :order="order" />
        </v-col>
      </v-row>
      <p v-else class="mb-0 text-center">{{ $t('common.noDataAvailable') }}</p>
    </v-card-text>
  </v-card>
</template>

<script>
import Order from '~/components/order/Card.vue'  

export default  {
  components:{
    Order
  },

  props: {
    ordersUser: {
      type: Array,
      default: () => ([])
    }
  }

}
</script>
