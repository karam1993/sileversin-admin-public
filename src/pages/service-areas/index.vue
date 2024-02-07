<template>
  <div class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="serviceAreasItems"
      :header="serviceAreasHeader"
      :loading="loadingItems"
      :filters="serviceAreasFilter"
      :pagination="serviceAreasPagination"
      :add="serviceAreaAddPath"
      :delete="serviceAreaDeleteApi"
      :actions="serviceAreasActions"
      :permissions="serviceAreasPermissions"
      @applyFilter="getServiceAreas($event)"
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
      serviceAreasItems : [],
      serviceAreasHeader : [
        { text: this.$t('serviceArea.serviceArea_name'), value: 'serviceArea_name' },
        { text: this.$t('serviceArea.serviceAreaStatus'), value: 'status' },
        { text: this.$t('common.actions'), value: 'actions' }
      ],
      loadingItems : false ,
      serviceAreasFilter : {
        status : false , // filter is required
        items : []
      },
      serviceAreasPagination:{
        pagesCounts : 1 ,
        selectedPage : 1 
      },
      serviceAreasPermissions:{
        show : '' ,
        showAny : '' ,
        add : '' ,
        edit : '' ,
        delete : ''
      },
      serviceAreaAddPath : '/service-areas/add',
      serviceAreaDeleteApi : '' ,
      serviceAreasActions : ['edit' , 'delete'], 
      addPermissionDialog : {
        dialog : false ,
        loader : false ,
        selectedItem : null
      }
    }
  },
    
  created() {
    this.getServiceAreas()
  },
  methods: {
    getServiceAreas(query = `?page[number]=${this.serviceAreasPagination.selectedPage}`) {
      if (this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter) {
        if (query !== '?') {
          query = this.$route.query.queryFilter + `page[number]=${this.serviceAreasPagination.selectedPage}`
        }
      }
      this.loadingItems = true
      this.$axios
        .$get(`/admin/servicearea${query}`)
        .then((res) => {
          this.serviceAreasItems = res.data
          this.serviceAreasPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    goToEditItem(item) {
      this.$router.push('/service-areas/' + item.serviceAreaID + '/edit')
    },
    deleteItem(item) {
      this.serviceAreaDeleteApi = 'servicearea/' + item.serviceAreaID  
    }
  },
  head() {
    return {
      title: this.$t('menu.serviceArea')
    }
  }
}
</script>