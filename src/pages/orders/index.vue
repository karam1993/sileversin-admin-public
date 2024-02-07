<template>
  <div class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="ordersItems"
      :header="ordersHeader"
      :loading="loadingItems"
      :filters="ordersFilter"
      :pagination="ordersPagination"
      :delete="orderDeleteApi"
      :actions="ordersActions"
      :permissions="ordersPermissions"
      @applyFilter="getOrders($event)"
      @showItem="goToShowItem($event)"
    />
  </div>
</template>
        
<script>
import DataTable from '~/components/elements/DataTable.vue'
      
export default {
  components:{
    DataTable
  },
  data() {
    return {
      ordersItems : [],
      ordersHeader : [
        // { text: this.$t('orders.uuid'), value: 'uuid' },
        { text: this.$t('orders.carPlate'), value: 'car.plate' },
        { text: this.$t('orders.carModel'), value: 'car.brandmodel.brand.brandName' },
        { text: this.$t('orders.paymentType'), value: 'paymentType' },
        { text: this.$t('orders.orderStatus'), value: 'orderStatus' },
        { text: this.$t('orders.appointmentDate'), value: 'appointmentDateTime' },
        { text: this.$t('common.actions'), value: 'actions' }
      ],
      loadingItems : false ,
      ordersFilter : {
        status : true , // filter is required
        items : [
          { placeHolder : this.$t('orders.uuid') , key: 'filter[uuid]' , value : '' , type : 'text' } ,
          { placeHolder : this.$t('orders.carPlate') , key: 'filter[plateID]' , value : '' , type : 'text' } ,
          { placeHolder : this.$t('orders.appointmentDate') , key: 'filter[appDay]' , value : '' , type : 'date' } ,
          { placeHolder : this.$t('orders.user') , key: 'filter[userID]' , value : '' , type : 'autocomplete' , searchable : true , searchKey : '' , items: [] , itemText : 'fullname' , itemId : 'userID' } ,
          { placeHolder : this.$t('orders.status') , key: 'filter[status]' , value : '' , type : 'autocomplete' , items: [
            { name : this.$t('status.active') , value : 'active' },  
            { name : this.$t('status.pending') , value : 'pending' },  
            { name : this.$t('status.cancelled') , value : 'cancelled' },
            { name : this.$t('status.processing') , value : 'processing' },
            { name : this.$t('status.done') , value : 'done' },
            { name : this.$t('status.pre-process') , value : 'pre-process' }            
          ] , itemText : 'name' , itemId : 'value' }          
        ]
      },
      ordersPagination:{
        pagesCounts : 1 ,
        selectedPage : 1 
      },
      ordersPermissions:{
        show : '' ,
        showAny : '' ,
        add : '' ,
        edit : '' ,
        delete : ''
      },
      orderAddPath : '/appointments/add',
      orderDeleteApi : '' ,
      ordersActions : ['show'], 
      addPermissionDialog : {
        dialog : false ,
        loader : false ,
        selectedItem : null
      }
    }
  },
        
  created() {
    this.getOrders()
  },
  methods: {
    getOrders(query = `?page[number]=${this.ordersPagination.selectedPage}`) {
      if (this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter) {
        if (query !== '?') {
          query = this.$route.query.queryFilter + `page[number]=${this.ordersPagination.selectedPage}`
        }
      }
      this.loadingItems = true
      this.$axios
        .$get(`/admin/order${query}`)
        .then((res) => {
          this.ordersItems = res.data
          this.ordersPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    goToShowItem(item) {
      this.$router.push('/orders/' + item.orderID + '/show')
    }
  },
  head() {
    return {
      title: this.$t('menu.order')
    }
  }
}
</script>