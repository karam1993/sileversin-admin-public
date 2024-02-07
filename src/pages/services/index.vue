<template>
  <div class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="servicesItems"
      :header="servicesHeader"
      :loading="loadingItems"
      :filters="servicesFilter"
      :pagination="servicesPagination"
      :add="serviceAddPath"
      :delete="serviceDeleteApi"
      :actions="servicesActions"
      :permissions="servicesPermissions"
      @applyFilter="getServices($event)"
      @editItem="goToEditItem($event)"
      @deleteItem="deleteItem($event)"
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
      servicesItems : [],
      servicesHeader : [
        { text: this.$t('services.serviceName'), value: 'serviceName' },
        { text: this.$t('services.price'), value: 'netprice' },
        { text: this.$t('services.desc'), value: 'description' },
        { text: this.$t('services.serviceStatus'), value: 'status' },
        { text: this.$t('common.actions'), value: 'actions' }
      ],
      loadingItems : false ,
      servicesFilter : {
        status : true , // filter is required
        items : [
          { placeHolder : this.$t('services.serviceName') , key: 'filter[serviceName]' , value : '' , type : 'text' },
          { placeHolder : this.$t('services.desc') , key: 'filter[description]' , value : '' , type : 'text' },
          { placeHolder : this.$t('services.serviceStatus') , key: 'filter[status]' , value : '' , type : 'autocomplete' , items: [{ name : this.$t('common.active') , value : 'true' } , { name : this.$t('common.notActive') , value : 'false' }] , itemText : 'name' , itemId : 'value' } 
        ]
      },
      servicesPagination:{
        pagesCounts : 1 ,
        selectedPage : 1 
      },
      servicesPermissions:{
        show : '' ,
        showAny : '' ,
        add : '' ,
        edit : '' ,
        delete : ''
      },
      serviceAddPath : '/services/add',
      serviceDeleteApi : '' ,
      servicesActions : ['edit' , 'delete'], 
      addPermissionDialog : {
        dialog : false ,
        loader : false ,
        selectedItem : null
      }
    }
  },
      
  created() {
    this.getServices()
  },
  methods: {
    getServices(query = `?page[number]=${this.servicesPagination.selectedPage}`) {
      if (this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter) {
        if (query !== '?') {
          query = this.$route.query.queryFilter + `page[number]=${this.servicesPagination.selectedPage}`
        }
      }
      this.loadingItems = true
      this.$axios
        .$get(`/admin/service${query}`)
        .then((res) => {
          this.servicesItems = res.data
          this.servicesPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    goToEditItem(item) {
      this.$router.push('/services/' + item.serviceID + '/edit')
    },
    deleteItem(item) {
      this.serviceDeleteApi = 'service/' + item.serviceID
    }
  },
  head() {
    return {
      title: this.$t('menu.services')
    }
  }
}
</script>