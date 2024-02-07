<template>
  <div class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="packetsItems"
      :header="packetsHeader"
      :loading="loadingItems"
      :filters="packetsFilter"
      :pagination="packetsPagination"
      :add="packetAddPath"
      :delete="packetDeleteApi"
      :actions="packetsActions"
      :permissions="packetsPermissions"
      @applyFilter="getPackets($event)"
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
      packetsItems : [],
      packetsHeader : [
        { text: this.$t('packets.packetName'), value: 'packetName' },
        { text: this.$t('packets.price'), value: 'totalPrice' },
        { text: this.$t('packets.desc'), value: 'desc' },
        { text: this.$t('packets.packetStatus'), value: 'status' },
        { text: this.$t('common.actions'), value: 'actions' }
      ],
      loadingItems : false ,
      packetsFilter : {
        status : true , // filter is required
        items : [
          { placeHolder : this.$t('packets.packetName') , key: 'filter[packetName]' , value : '' , type : 'text' },
          { placeHolder : this.$t('packets.packetStatus') , key: 'filter[status]' , value : '' , type : 'autocomplete' , items: [{ name : this.$t('common.active') , value : 'true' } , { name : this.$t('common.notActive') , value : 'false' }] , itemText : 'name' , itemId : 'value' } 
        ]
      },
      packetsPagination:{
        pagesCounts : 1 ,
        selectedPage : 1 
      },
      packetsPermissions:{
        show : '' ,
        showAny : '' ,
        add : '' ,
        edit : '' ,
        delete : ''
      },
      packetAddPath : '/packets/add',
      packetDeleteApi : '' ,
      packetsActions : ['edit' , 'delete'], 
      addPermissionDialog : {
        dialog : false ,
        loader : false ,
        selectedItem : null
      }
    }
  },
    
  created() {
    this.getPackets()
  },
  methods: {
    getPackets(query = `?page[number]=${this.packetsPagination.selectedPage}`) {
      if (this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter) {
        if (query !== '?') {
          query = this.$route.query.queryFilter + `page[number]=${this.packetsPagination.selectedPage}`
        }
      }
      this.loadingItems = true
      this.$axios
        .$get(`/admin/packet${query}`)
        .then((res) => {
          this.packetsItems = res.data
          this.packetsPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    goToEditItem(item) {
      this.$router.push('/packets/' + item.packetID + '/edit')
    },
    deleteItem(item) {
      this.packetDeleteApi = 'packet/' + item.packetID
    }
  },
  head() {
    return {
      title: this.$t('menu.packets')
    }
  }
}
</script>