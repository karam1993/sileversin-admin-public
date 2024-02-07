<template>
  <div class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="paymentsItems"
      :header="paymentsHeader"
      :loading="loadingItems"
      :filters="paymentsFilter"
      :pagination="paymentsPagination"
      :delete="paymentsDeleteApi"
      :actions="paymentsActions"
      :permissions="paymentsPermissions"
      @applyFilter="getPayments($event)"
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
      paymentsItems : [],
      paymentsHeader : [
        { text: this.$t('payments.amount'), value: 'amount' , align:'center' },
        { text: this.$t('payments.paymentDone_at'), value: 'paymentDone_at' , align:'center' },
        { text: this.$t('payments.paymentDoneBy'), value: 'paymentDoneBy' , align:'center' },
        { text: this.$t('payments.status'), value: 'paymentStatus' , align:'center' } ,
        // { text: this.$t('common.actions'), value: 'actions' , align:'center' }
      ],
      loadingItems : false ,
      paymentsFilter : {
        status : true , // filter is required
        items : [
          { placeHolder : this.$t('payments.uuid') , key: 'filter[uuid]' , value : '' , type : 'text' },
          { placeHolder : this.$t('payments.status') , key: 'filter[paymentStatus]' , value : '' , type : 'autocomplete' , items: 
          [
            { name : this.$t('status.pending') , value : 'pending' },
            { name : this.$t('status.done') , value : 'done' },
            { name : this.$t('status.failed') , value : 'failed' },
            { name : this.$t('status.refund') , value : 'refund' }            
          ] , itemText : 'name' , itemId : 'value' } 
        ]
      },
      paymentsPagination:{
        pagesCounts : 1 ,
        selectedPage : 1 
      },
      paymentsPermissions:{
        show : '' ,
        showAny : '' ,
        add : '' ,
        edit : '' ,
        delete : ''
      },
      paymentsDeleteApi : '' ,
      //   paymentsActions : ['show'], 
      addPermissionDialog : {
        dialog : false ,
        loader : false ,
        selectedItem : null
      }
    }
  },
      
  created() {
    this.getPayments()
  },
  methods: {
    getPayments(query = `?page[number]=${this.paymentsPagination.selectedPage}`) {
      if (this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter) {
        if (query !== '?') {
          query = this.$route.query.queryFilter + `page[number]=${this.paymentsPagination.selectedPage}`
        }
      }
      this.loadingItems = true
      this.$axios
        .$get(`/admin/payment${query}`)
        .then((res) => {
          this.paymentsItems = res.data
          this.paymentsPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    }
  },
  head() {
    return {
      title: this.$t('menu.payment')
    }
  }
}
</script>