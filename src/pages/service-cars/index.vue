<template>
  <div class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="serviceCarsItems"
      :header="serviceCarsHeader"
      :loading="loadingItems"
      :filters="serviceCarsFilter"
      :pagination="serviceCarsPagination"
      :add="serviceCarAddPath"
      :delete="serviceCarDeleteApi"
      :actions="serviceCarsActions"
      :permissions="serviceCarsPermissions"
      @applyFilter="getServiceCars($event)"
      @editItem="goToEditItem($event)"
      @printQrCode="openQrCode($event)"
      @deleteItem="deleteItem($event)"
    />
    <QrCodePrint v-model="qrCodePrintDialog" :uuid="uuidValue" />
  </div>
</template>
      
<script>
import DataTable from '~/components/elements/DataTable.vue'
import QrCodePrint from '~/components/dialogs/QrCodePrint'
    
export default {
  components:{
    DataTable , QrCodePrint
  },
  data() {
    return {
      serviceCarsItems : [],
      serviceCarsHeader : [
        { text: this.$t('serviceCars.plateID'), value: 'plateID' },
        { text: this.$t('serviceCars.uuid'), value: 'uuid' },
        { text: this.$t('serviceCars.servicearea'), value: 'servicearea.serviceArea_name' },
        { text: this.$t('serviceCars.color'), value: 'color.colorName' },
        { text: this.$t('serviceCars.serviceCarsStatus'), value: 'status' },
        { text: this.$t('common.actions'), value: 'actions' }
      ],
      loadingItems : false ,
      serviceCarsFilter : {
        status : true , // filter is required
        items : [
          { placeHolder : this.$t('serviceCars.plateID') , key: 'filter[plateID]' , value : '' , type : 'text' },
          { placeHolder : this.$t('serviceCars.serviceCarsStatus') , key: 'filter[status]' , value : '' , type : 'autocomplete' , items: [{ name : this.$t('common.active') , value : 'true' } , { name : this.$t('common.notActive') , value : 'false' }] , itemText : 'name' , itemId : 'value' }
        ]
      },
      serviceCarsPagination:{
        pagesCounts : 1 ,
        selectedPage : 1 
      },
      serviceCarsPermissions:{
        show : '' ,
        showAny : '' ,
        add : '' ,
        printQr : '' ,
        edit : '' ,
        delete : ''
      },
      serviceCarAddPath : '/service-cars/add',
      serviceCarDeleteApi : '' ,
      serviceCarsActions : ['edit' , 'delete' , 'print-qr'], 
      addPermissionDialog : {
        dialog : false ,
        loader : false ,
        selectedItem : null
      },
      uuidValue : null ,
      qrCodePrintDialog : false 
    }
  },
      
  created() {
    this.getServiceCars()
  },
  methods: {
    getServiceCars(query = `?page[number]=${this.serviceCarsPagination.selectedPage}`) {
      if (this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter) {
        if (query !== '?') {
          query = this.$route.query.queryFilter + `page[number]=${this.serviceCarsPagination.selectedPage}`
        }
      }
      this.loadingItems = true
      this.$axios
        .$get(`/admin/service-car${query}`)
        .then((res) => {
          this.serviceCarsItems = res.data
          this.serviceCarsPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    goToEditItem(item) {
      this.$router.push('/service-cars/' + item.serviceCarID + '/edit')
    },
    deleteItem(item) {
      this.serviceCarDeleteApi = 'service-car/' + item.serviceCarID
    },
    openQrCode(item) {
      this.qrCodePrintDialog = true
      this.uuidValue = item.uuid
    }
  },
  head() {
    return {
      title: this.$t('menu.serviceCars')
    }
  }
}
</script>