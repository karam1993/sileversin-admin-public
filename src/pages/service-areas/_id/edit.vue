<template>
  <div v-permissions="''" class="d-flex flex-grow-1 flex-column">
    <v-card class="borderCardInfo">
      <v-skeleton-loader
        v-if="loadingData"
        type="article"
      ></v-skeleton-loader>
      <v-card-text v-else>
        <v-form ref="form" >
          <v-row>
            <v-col cols="12" md="6" class="py-1">
              <v-text-field
                v-model="serviceAreasInfo.serviceArea_name"
                :rules="[required]"
                :label="$t('users.fname')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-text-field
                v-model="serviceAreasInfo.appointment_per_day"
                :rules="[required , number]"
                :label="$t('serviceArea.appointment_per_day')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-autocomplete
                v-model="selectedServices"
                :rules="[requiredArray]"
                multiple
                chips
                small-chips 
                :items="activeServices"
                :label="$t('packets.services')"
                item-text="serviceName"
                item-value="serviceID"
                outlined
                dense
              ></v-autocomplete>
            </v-col>
            <v-col cols="6" class="py-1">
              <v-switch
                v-model="serviceAreasInfo.status"
                inset
                class="mt-1"
                color="primary"
                :label="$t('serviceArea.serviceAreaStatus')"
              ></v-switch>
            </v-col>
            <v-col cols="12" class="py-1">
              <v-autocomplete
                v-model="selectedDays"
                :rules="[requiredArray]"
                multiple
                chips
                small-chips 
                :items="days"
                :label="$t('serviceArea.days')"
                item-text="name"
                item-value="value"
                outlined
                dense
              ></v-autocomplete>
            </v-col>
            <v-col v-if="isRenderDaysWork" cols="12" class="pb-0 pt-0">
              <v-row no-gutters>
                <v-col
                  v-for="(item, index) in workinghours"
                  :key="index"
                  cols="12"
                  class="mb-2"
                  sm="6"
                  md="4"
                  lg="3"
                  xl="2"
                >
                  <v-card
                    class="mx-1 mb-2"
                    style="border: 1px solid #9e9e9e ; height: 100%;"
                  >
                    <v-card-title class="py-0 pt-1 mb-1">
                      <h5 class="text-capitalize">
                        {{ item.day }}
                        <v-btn
                          small
                          icon
                          title="Copy"
                          @click="copyTimeContent(item)"
                        >
                          <v-icon
                            color="secondary"
                            small
                          >mdi-content-copy</v-icon></v-btn>
                      </h5>
                    </v-card-title>
                    <v-card-text class="pb-0">
                      <v-row no-gutters>
                        <v-col cols="6">
                          <div class="pr-1">
                            <v-menu
                              :ref="'from' + item.day"
                              v-model="item.isFromPickerActive"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="item.newFromTime"
                                  label="From"
                                  dense
                                  outlined
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-time-picker
                                v-if="item.isFromPickerActive"
                                v-model="item.newFromTime"
                                format="24hr"
                                full-width
                                @click:minute="selectInputFromTime(index, item)"
                              ></v-time-picker>
                            </v-menu>
                          </div>
                        </v-col>
                        <v-col cols="6">
                          <div class="pl-1">
                            <v-menu
                              :ref="'to' + item.day"
                              v-model="item.isToPickerActive"
                              :close-on-content-click="false"
                              :nudge-right="40"
                              transition="scale-transition"
                              offset-y
                              max-width="290px"
                              min-width="290px"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="item.newToTime"
                                  label="To"
                                  dense
                                  outlined
                                  readonly
                                  v-bind="attrs"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-time-picker
                                v-if="item.isToPickerActive"
                                v-model="item.newToTime"
                                format="24hr"
                                full-width
                                @click:minute="selectInputToTime(index, item)"
                              ></v-time-picker>
                            </v-menu>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-text class="pt-0 text-center">
                      <div
                        v-for="(time, indexTime) in item.workinghours"
                        :key="indexTime"
                        class="d-inline-block mr-1"
                      >
                        <v-chip
                          class="mb-1"
                          color="primary"
                          style="font-size: 12px;"
                          close
                          @click:close="removeTime(index, indexTime)"
                        >
                          {{ time }}
                        </v-chip>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :loading="loadingSave" color="primary" @click="save">
          {{ $t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
    
  </div>
</template>
<script>
import Rules from '~/apps/validation/index'

export default {
  mixins: [Rules] ,
  data() {
    return {
      loadingData : true ,
      loadingSave : false ,
      isRenderDaysWork: true,
      workinghours : [] ,

      serviceAreasInfo : {} ,
      activeServices : [] ,
      selectedServices : [],
      days : [
        { name : this.$t('days.monday') , value : 'monday' } ,
        { name : this.$t('days.tuesday') , value : 'tuesday' } ,
        { name : this.$t('days.wednesday') , value : 'wednesday' } ,
        { name : this.$t('days.thursday') , value : 'thursday' } ,
        { name : this.$t('days.friday') , value : 'friday' } ,
        { name : this.$t('days.saturday') , value : 'saturday' } ,
        { name : this.$t('days.sunday') , value : 'sunday' } 
        
      ],
      selectedDays : [] 
    }
  },
  watch: {
    selectedDays: function (days) {

      console.log(days , this.workinghours)
     
      let workinghours = [] 
      
      workinghours = this.workinghours
      this.workinghours = []

      for (let index = 0; index < days.length; index++) {

        const indexOfDay = workinghours.map((x) => {return x.day }).indexOf(days[index])
        const findDayByIndex = workinghours[indexOfDay]
        const obj = {
          day: days[index],
          workinghours: findDayByIndex ?  findDayByIndex.workinghours : [] ,
          newFromTime: '',
          newToTime: '',
          isFromPickerActive: false,
          isToPickerActive: false
        }

        this.workinghours.push(obj)
      }

      // console.log(days , this.workinghours)
    }
  },

  created() {
    this.getserviceAreasInfo()
    this.getServices()
  },
  methods: {
    getServices() {
      this.$axios
        .$get('/admin/service?filter[status]=true&page[size]=1000000')
        .then((res) => {
          this.activeServices = res.data
        })
    },
    getserviceAreasInfo() {
      this.loadingData = true
      this.$axios
        .$get(`/admin/servicearea/${this.$route.params.id}`)
        .then((res) => {
          this.serviceAreasInfo  = res.data
          this.selectedServices =  this.serviceAreasInfo.services.map((item) => item.serviceID)

          this.reBuildWorkinghours(this.serviceAreasInfo.workinghours)

        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loadingData = false
        })
    },
    selectInputFromTime(index, item) {
      this.isRenderDaysWork = false
      this.workinghours[index]['isFromPickerActive'] = false
      this.$nextTick(() => {
        this.isRenderDaysWork = true
      })
      if (item.newFromTime && item.newToTime) {
        this.workinghours[index]['workinghours'].push(
          item.newFromTime + '-' + item.newToTime
        )
        item.newFromTime = ''
        item.newToTime = ''
      }
    },
    selectInputToTime(index, item) {
      this.isRenderDaysWork = false
      this.workinghours[index]['isToPickerActive'] = false
      this.$nextTick(() => {
        this.isRenderDaysWork = true
      })
      if (item.newFromTime && item.newToTime) {
        this.workinghours[index]['workinghours'].push(
          item.newFromTime + '-' + item.newToTime
        )
        item.newFromTime = ''
        item.newToTime = ''
      }
    },
    removeTime(index, indexTime) {
      this.workinghours[index]['workinghours'].splice(
        indexTime,
        1
      )
    },
    copyTimeContent(item) {
      for (
        let index = 0;
        index < this.workinghours.length;
        index++
      ) {
        this.workinghours[index]['workinghours'] = [
          ...item.workinghours
        ]
      }
    },
    reBuildWorkinghours(workinghours) {

      this.selectedDays = Object.keys(workinghours) 
      const workinghoursArr = [] 
      const days =  Object.keys(workinghours) 

      for (let index = 0; index < days.length; index++) {
        const obj = { 'day' : days[index] , 'workinghours' : workinghours[days[index]] }

        workinghoursArr.push(obj)
      }
      this.workinghours = workinghoursArr
    },  
    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true

        const serviceCar = { ...this.serviceAreasInfo }
        
        serviceCar.workinghours = this.workinghours
        serviceCar.services = this.selectedServices
        
        this.$axios
          .$put(`/admin/servicearea/${this.$route.params.id}`, serviceCar)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.changePasswordStatus = false
            this.getserviceAreasInfo()
          })
          .catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
          .finally(() => {
            this.loadingSave = false
            
          })
      } else {
        this.$store.dispatch('showError', this.$t('rules.dataNotValid'))
      }
    }
  }

}
</script>