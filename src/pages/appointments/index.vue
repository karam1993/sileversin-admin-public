<template>
  <div class="d-flex flex-grow-1 flex-column">
    <v-expansion-panels class="mb-2 borderCardInfo">
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3 class="primary--text">{{ $t('common.filter') }}</h3>
          <!-- <v-btn color="success">Next Data</v-btn>
          <v-btn color="success">Previous Data</v-btn> -->
          
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row>
            <v-col class="pt-1 pb-0" cols="12" md="6">
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="selectedDay"
                    label="Select Day"
                    prepend-icon="mdi-calendar"
                    readonly
                    outlined
                    dense
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="selectedDay"
                  @input="menu = false , getAppointments() , focus = selectedDay "
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col class="pt-1 pb-0" cols="12" md="6">
              <v-autocomplete
                v-model="selectedStatus"
                :items="status"
                :label="$t('appointments.appStatus')"
                item-text="name"
                item-value="value"
                outlined
                clearable
                dense
                @input=" getAppointments()"
              ></v-autocomplete>
            </v-col>
      
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <AddAppointment />
    <v-card class="mb-2 borderCardInfo">
      <v-card-text>
        <v-sheet height="700">
          <v-calendar
            v-if="!loadingItems"
            ref="calendar"
            v-model="focus"
            :now="selectedDay"
            :weekdays="[1, 2, 3, 4, 5, 6, 0]"
            :value="selectedDay"
            :events="events"
            class="calendarAppointments"
            color="primary"
            type="day"
            @click:event="showEvent"
          >
          </v-calendar>
        </v-sheet>
        
      </v-card-text>
    </v-card>
    
  </div>
</template>
      
<script>
   import AddAppointment from '~/components/dialogs/AddAppointment'

export default {

  data() {
    return {
      appointmentsItems : [],
      events: [],
      focus : '' ,
      selectedDay: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      selectedStatus : null ,
      menu: false,
      status:[
        { name : this.$t('status.free') , value : 'free' }   ,
        { name : this.$t('status.active') , value : 'active' },
        { name : this.$t('status.pre-process') , value : 'pre-process' }   ,
        { name : this.$t('status.pending') , value : 'pending' }   ,
        { name : this.$t('status.processing') , value : 'processing' }   ,
        { name : this.$t('status.done') , value : 'done' },
        { name : this.$t('status.reserved') , value : 'reserved' }   ,
        { name : this.$t('status.cancelled') , value : 'cancelled' }
      ],
      loadingItems : false ,
      appointmentId : null ,
      dialogAppointmentInfo : false
      
    }
  },
  components: {
    AddAppointment
  },
  watch: { 
    '$route.query': {
      handler: function(search) {
        console.log(search)
        this.selectedStatus = search['filter[appStatus]'] 
        this.selectedDay = this.focus =  search['filter[day]'] || ''
      },
      deep: true,
      immediate: true
    }
  },
      
  created() {
    this.getAppointments()
  },
  methods: {
    getAppointments() {
      this.$router.push({ path: '/appointments', query: { 'filter[appStatus]': this.selectedStatus , 'filter[day]' : this.selectedDay } })
      const query = `?filter[appStatus]=${this.selectedStatus || ''}&filter[day]=${this.selectedDay}`

      this.loadingItems = true
      this.$axios
        .$get(`/admin/appointment${query}`)
        .then((res) => {
          this.appointmentsItems = res.data
          this.events = []
          for (let index = 0; index < this.appointmentsItems.length; index++) {
            const obj = { 
              'id' : this.appointmentsItems[index]['appointmentID'] ,
              'color' : this.getColor(this.appointmentsItems[index]['appStatus']) ,
              'name': this.$t(`status.${this.appointmentsItems[index]['appStatus']}`),
              'start': this.appointmentsItems[index]['appExpectStart'],
              'end': this.appointmentsItems[index]['appExpectEnd'] } 

            this.events.push(obj)
          }
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
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
    showEvent (event) {
      this.$router.push(`/appointments/${event.event.id}/show`)

    },
  },
  head() {
    return {
      title: this.$t('menu.appointment')
    }
  }
}
</script>
<style>
.calendarAppointments.theme--light.v-calendar-events .v-event-more{
  background-color: #324376;
  color: #fff;
}
</style>