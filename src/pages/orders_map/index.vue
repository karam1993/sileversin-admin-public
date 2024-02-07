<template>
  <!-- <div style="height: 1000px"> -->
  <GmapMap
    :center="center"
    :markers="[]"
    
    :zoom="13"
    :options="{
      zoomControl: true,
      scaleControl: false,
      clickableIcons:false ,
      rotateControl: false,
      fullscreenControl: true,
      disableDefaultUi: false
    }"
    style="width: 100%; height: 100% "
  >

    <GmapCustomMarker v-for="(location, index) in ordersLocations" :key="index" :marker="location.geoPoint">

      <v-tooltip right content-class="tooltipOrderInfo" >
        <template v-slot:activator="{ on, attrs }">

          <div
            v-bind="attrs"
            class="carIcon"
            v-on="on"
            @click="showOrderInfo(location)"
          >
            <v-icon :color="'#'+location.car.color.colorCode">mdi-car</v-icon>
          </div>
        </template>
        <p class="pt-1 mb-0"><CarPlate :plate="location.car.plate" /></p>
         <p class="my-1"><v-chip small color="primary">{{ location.car.brandmodel.brand.brandName + ' - ' + location.car.brandmodel.modelName }}</v-chip><v-chip class="ml-1" small :color="returnColorStatus(location.status)">{{ $t('status.' + location.status) }}</v-chip></p>
      </v-tooltip>
      
    </GmapCustomMarker>
  </GmapMap>
  
  <!-- </div> -->
</template>

<script>
import GmapCustomMarker from 'vue2-gmap-custom-marker'
import CarPlate from  '~/components/common/CarPlate'

export default {
  components: {
    GmapCustomMarker , CarPlate

  },
  
  data() {
    return {
      ordersLocations : [] ,
      center: {
        lat: 41.09181061908,
        lng: 28.801342718403
      }
    }
  },
  created() {
    this.getOrders()
  },
  methods: {
    getOrders(query = '?page[size]=2500&') {
      this.$axios
        .$get(`/admin/order${query}`)
        .then((res) => {
          this.formatLocations(res.data)
        })
    },
    formatLocations(list) {
      this.ordersLocations = [] 
      for (let index = 0; index < list.length; index++) {
        const obj = { 
          geoPoint : { lat:list[index]['geoPoint']['latitude'] , lng : list[index]['geoPoint']['longitude'] } ,
          status : list[index]['status'],
          car : list[index]['car']
            
        }

        this.ordersLocations.push(obj)
      }

    },
    returnColorStatus(status)
    {
      if (status === 'pre-process') {
        return 'warning'
      } else if (status === 'cancelled') {
        return 'error'
      } else if (status === 'done') {
        return 'success'
      } else {
        return 'info'
      }
    },
    showOrderInfo(order) {
      console.log(order)
    }
  }
}
</script>
<style>
.carIcon{
    background-color: #212121;
    padding: 5px;
    border-radius: 50%;
    cursor: pointer;

}
.tooltipOrderInfo{
    background-color: #fff !important
}
</style>