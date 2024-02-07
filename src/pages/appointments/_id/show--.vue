<template>
  <div v-permissions="''" class="d-flex flex-grow-1 flex-column">

    <v-card class="mb-6">
      <v-skeleton-loader
        v-if="loadingData"
        type="article"
      ></v-skeleton-loader>

      <div v-else>
        <v-expansion-panels>
          <v-expansion-panel >
            <v-expansion-panel-header class="d-inline-block" style="text-align-last: justify;">
              <h3 class="d-inline-block">Appointment Information</h3>
              <v-chip color="primary" ><b>{{ $t('status.' +appointmentsInfo.appStatus ) }}</b></v-chip>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <div>

                <p style="text-align-last: justify;" class="mb-1"><b class="d-inline-block">Expect Start</b> <span class="d-inline-block" v-text="appointmentsInfo.appExpectStart ? appointmentsInfo.appExpectStart : $t('common.noDataAvailable')"></span></p>
                <p style="text-align-last: justify;" class="mb-1"><b class="d-inline-block">Expect End</b> <span class="d-inline-block" v-text="appointmentsInfo.appExpectEnd ? appointmentsInfo.appExpectEnd : $t('common.noDataAvailable')"></span></p>
                <p style="text-align-last: justify;" class="mb-1"><b class="d-inline-block">Start At</b> <span class="d-inline-block" v-text="appointmentsInfo.appStartAt?appointmentsInfo.appStartAt : $t('common.noDataAvailable')"></span></p>
                <p style="text-align-last: justify;" class="mb-1"><b class="d-inline-block">End At</b> <span class="d-inline-block" v-text="appointmentsInfo.appEndtAt ? appointmentsInfo.appEndtAt : $t('common.noDataAvailable')"></span></p>
                <p style="text-align-last: justify;" class="mb-1"><b class="d-inline-block">Open Location</b> <v-btn color="warning" class="d-inline-block" @click="openGoogleMap(appointmentsInfo.order.geoPoint)">Google Map</v-btn></p>
              
              </div>
            </v-expansion-panel-content>
            
          </v-expansion-panel>
        </v-expansion-panels>
        
      </div>
      
      <!-- {{ appointmentsInfo }} -->
    
    </v-card>
    <div style="height: 100%;">
      <MglMap
        :access-token="access_token"
        :map-style.sync="mapStyle"
        :center="coordinates"
        :zoom="16"
        :hash="true"
      >
        <MglGeolocateControl
          :position="'top-left'" 
          :track-user-location="true" 
          :show-user-heading="true" 
          :position-options="{enableHighAccuracy:false, timeout:6000}" 
        />
        <MglMarker :coordinates="coordinates" />
      </MglMap>

    </div>

  </div>
</template>

<script>

// import VueMapbox from 'vue-mapbox'
// import Mapbox from 'mapbox-gl'
import { MglMap, MglMarker , MglGeolocateControl } from 'vue-mapbox'

export default {
  components: {
    // VueMapbox , Mapbox
    MglMap, MglMarker , MglGeolocateControl
  },
  data() {
    return {
      mapStyle: 'mapbox://styles/mapbox/streets-v12',
      coordinates: [28.784875619371 , 41.104900401784] ,
      access_token:'pk.eyJ1IjoieWFtZW5zYXdhbiIsImEiOiJjbGExNXB0azMwNDhkM3Fwa2ZiYXh3bWtmIn0.FPrQewrBK1-cyz7E9fAeRg' ,

      appointmentsInfo : null ,
      loadingData : false
    }
  },
  created() {
    this.getAppointmentsInfo()
  },
  methods: {
    getAppointmentsInfo() {
      this.loadingData = true
      this.$axios
        .$get(`/admin/appointment/${this.$route.params.id}`)
        .then((res) => {
          this.appointmentsInfo = res.data
          this.appointmentsPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingData = false
        })
    },
    openGoogleMap(coordinates ) {
      const urlSuffix = coordinates .latitude + ', ' + coordinates .longitude

      window.open(
        'https://www.google.com/maps/search/?api=1&query=' + urlSuffix,
        '_blank'
      )
    }
  }
}
</script>