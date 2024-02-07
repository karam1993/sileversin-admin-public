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
            <v-card-title border="left" primary-title class="justify-space-between">
              <div>
                <v-icon color="info" class="mx-1">mdi-information-variant-circle-outline</v-icon>  <span class="info--text">{{ $t('assignments.assignmentInfo') }}</span>
              </div>
            </v-card-title>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card style="height: 100%;" class="borderCardInfo">
            <v-card-title primary-title class="justify-space-between">
              {{ $t('assignments.basicInfo') }}
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
                  <v-list-item @click="changeAssignmentDialogStatus = true">
                    <v-list-item-title><v-icon color="warning">mdi-swap-horizontal</v-icon>{{ $t('assignments.changeAssignment') }}</v-list-item-title>
                  </v-list-item>
                              
                  <v-list-item @click="deleteAssignmentDialogStatus = true">
                    <v-list-item-title><v-icon color="error">mdi-delete-forever-outline</v-icon>{{ $t('assignments.deleteAssignment') }} </v-list-item-title>
                  </v-list-item>

                </v-list>
              </v-menu>
            </v-card-title>
            <v-card-text>
              <table class="attributeTable">
                <tr>
                  <th>{{ $t('assignments.attribute') }}</th>
                  <th>{{ $t('assignments.value') }}</th>
                </tr>
                <tr>
                  <td>#{{ $t('assignments.id') }}</td>
                  <td>{{ assignmentInfo.assignmentID }}</td>
                </tr>
                <tr>
                  <td>{{ $t('assignments.status') }}</td>
                  <td><v-chip small :color="getColor(assignmentInfo.assignmentStatus)">{{ $t('status.' + assignmentInfo.assignmentStatus) }}</v-chip></td>
                </tr>
                <tr v-if="assignmentInfo.assignmentDoneAt">
                  <td> {{ $t('assignments.assignmentDoneAt') }}</td>
                  <td><span >{{ assignmentInfo.assignmentDoneAt.substr(0, 10) }}</span> <v-chip small color="primary">  {{ assignmentInfo.assignmentDoneAt.substr(10, 6) }}</v-chip></td>
                </tr>
                <tr v-if="assignmentInfo.assignmentCancelledAt">
                  <td> {{ $t('assignments.assignmentCancelledAt') }}</td>
                  <td><span >{{ assignmentInfo.assignmentCancelledAt.substr(0, 10) }}</span> <v-chip small color="primary">  {{ assignmentInfo.assignmentCancelledAt.substr(10, 6) }}</v-chip></td>
                </tr>
                <tr v-if="assignmentInfo.assignmentCancelledAt">
                  <td> {{ $t('assignments.assignmentCancelled_reason') }}</td>
                  <td><span >{{ assignmentInfo.assignmentCancelled_reason }}</span></td>
                </tr>
                <tr>
                  <td>{{ $t('assignments.carServicePlate') }}</td>
                  <td><nuxt-link :to="`/service-cars/${assignmentInfo.serviceCar.serviceCarID}/edit`">{{ assignmentInfo.serviceCar.plateID }}</nuxt-link></td>
                </tr>
              </table>

            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card style="height: 100%;" class="borderCardInfo">
            <v-card-title primary-title>
              {{ $t('assignments.empInfo') }}
            </v-card-title>
            <v-card-text v-if="assignmentInfo.user">
              <table class="attributeTable">
                <tr>
                  <th>{{ $t('assignments.attribute') }} </th>
                  <th>{{ $t('assignments.value') }}</th>
                </tr>
                <tr>
                  <td>{{ $t('assignments.fullName') }}</td>
                  <td>{{ assignmentInfo.user.fullname }}</td>
                </tr>
                <tr>
                  <td>{{ $t('assignments.email') }}</td>
                  <td><a :href="'mailto:' + assignmentInfo.user.email ">{{ assignmentInfo.user.email }}</a></td>
                </tr>
                <tr>
                  <td>{{ $t('assignments.phoneNumber') }}</td>
                  <td><a :href="'tel:0' + assignmentInfo.user.mobile ">{{ assignmentInfo.user.mobile }}</a></td>
                </tr>
                <tr v-if="assignmentInfo.user">
                  <td> {{ $t('assignments.loggedIn') }}</td>
                  <td> <v-chip small color="primary">  {{ assignmentInfo.user.login_at }}</v-chip></td>
                </tr>
              </table>
            </v-card-text>
            <v-card-text v-else>
              <p class="mb-0 text-center">{{ $t('common.noDataAvailable') }}</p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card style="height: 100%;" class="borderCardInfo">
            <v-card-title primary-title>
              {{ $t('assignments.images') }}
            </v-card-title>
            <v-card-text v-if="assignmentInfo.images.length != 0">
              <div class="d-flex">
                <div style="width: 80px;" >
                  <div v-for="(item, index) in assignmentInfo.images" :key="index" class="imageGallary" @click="selectedImage = item.url ">
                    <v-img
                      height="70"
                      width="80"
                      wid
                      :src="item.url"
                      :lazy-src="item.url"
                    ></v-img>
                  </div>
                </div>
                <div class="previewImage" style="width:calc(100% - 90px)">
                  <v-img :lazy-src="selectedImage" :src="selectedImage"></v-img>
                </div>
              </div>

            </v-card-text>
            <v-card-text v-else>
              <p class="mb-0 text-center">{{ $t('common.noDataAvailable') }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <ConfirmMessage :dialog="deleteAssignmentDialogStatus" :loading="loaderDeleteAssignment" :contant="contantTextDeleteAssignment" @closeConfirmation="closeConfirmationDeleteAssignment($event)" />
      <ConfirmMessage :dialog="changeAssignmentDialogStatus" :loading="loaderChangeAssignment" :contant="contantTextChangeAssignment" @closeConfirmation="closeConfirmationChangeAssignment($event)" />

    </div>    

  </div>
</template>
<script>
import ConfirmMessage from  '~/components/common/dialog/ConfirmMessage'

export default {
  components: {
    ConfirmMessage
  },
  data() {
    return {
      assignmentInfo : null ,
      loadingData : false   ,
      selectedImage : null ,
      deleteAssignmentDialogStatus : false ,
      loaderDeleteAssignment : false ,
      contantTextDeleteAssignment : {
        title : `<h5>${this.$t('confirm.deleteAssignment')}</h5>` ,
        body : `<p class='mb-0'>${this.$t('confirm.deleteAssignmentText')}</p>` ,
        form :[
          { name :  'assignmentCancelled_reason' , type : 'textarea' , label : 'Reason' , value : '' }
        ]
      },

      changeAssignmentDialogStatus : false ,
      loaderChangeAssignment : false ,
      contantTextChangeAssignment : {
        title : `<h5>${this.$t('confirm.changeAssignment')}</h5>` ,
        body : `<p class='mb-0'>${this.$t('confirm.changeAssignmentText')}</p>` ,
        form :[
          { 
            name :  'serviceCarID' , type : 'autocomplete' , label : 'Service Car Plate' , value : '' , autocompleteOptions : 
            {
              api : 'admin/service-car?filter[status]=true&filter[plateID]=', 
              itemText : 'plateID' ,
              itemValue : 'serviceCarID' ,
              items : [] ,
              searcheble : true
            } 
          }
        ]
      }
    }
  },
  created() {
    this.getAssignmentInfo()
  },
  methods: {
    getAssignmentInfo() {
      this.loadingData = true
      this.$axios
        .$get(`/admin/assignment/${this.$route.params.id}`)
        .then((res) => {
          this.assignmentInfo = res.data
          this.selectedImage = this.assignmentInfo['images'].length !== 0 ?  this.assignmentInfo['images'][0]['url'] : null
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
    closeConfirmationDeleteAssignment(status) {
      if (status) {
        this.loaderDeleteAssignment = true
        const index = this.contantTextDeleteAssignment.form.findIndex( (object) => {
          return object.name === 'assignmentCancelled_reason'
        })
        const data = {
          form : { 'assignmentCancelled_reason' : this.contantTextDeleteAssignment.form[index]['value'] , '_method': 'DELETE' }
        }

        this.loaderDeleteAssignment = true
        this.$axios.$post(`/admin/assignment/${this.assignmentInfo.assignmentID}` , data.form).then(() => {
          this.deleteAssignmentDialogStatus = false
          this.$store.dispatch('showSuccess', this.$t('common.success'))
          this.contantTextDeleteAssignment.form[index]['value'] = null
          this.getAssignmentInfo()
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loaderDeleteAssignment = false
        })
      }
      else {
        this.deleteAssignmentDialogStatus = false
      }
    },
    closeConfirmationChangeAssignment(status) {
      if (status) {
        this.loaderChangeAssignment = true
        const index = this.contantTextChangeAssignment.form.findIndex( (object) => {
          return object.name === 'serviceCarID'
        })
        const data = {
          form : { 'serviceCarID' : this.contantTextChangeAssignment.form[index]['value'] }
        }

        this.loaderChangeAssignment = true
        this.$axios.$put(`/admin/assignment/${this.assignmentInfo.assignmentID}` , data.form).then(() => {
          this.getAssignmentInfo()
          this.changeAssignmentDialogStatus = false
          this.$store.dispatch('showSuccess', this.$t('common.success'))
          this.contantTextChangeAssignment.form[index]['value'] = null
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loaderChangeAssignment = false
        })
      }
      else {
        this.changeAssignmentDialogStatus = false
      }
    }
  }
}
</script>

<style >
  .imageGallary{
    border: 2px solid #e9e9e9 ;
    border-radius: 6px;
    padding: 3px;
    overflow: hidden;
    margin-bottom: 7px;
    cursor: pointer;
  }
  .imageGallary:last-of-type{
    margin-bottom: 0;
  }
  .imageGallary .v-image{
    border-radius: 4px;
  }
  .previewImage{
    border: 2px solid #e9e9e9 ;
    border-radius: 6px;
    padding: 3px;
    margin-left: 10px;
  }
  .previewImage .v-image{
    border-radius: 4px;
  }
</style>