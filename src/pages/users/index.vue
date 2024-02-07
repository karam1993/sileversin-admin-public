<template>
  <div class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="usersItems"
      :header="usersHeader"
      :loading="loadingItems"
      :filters="usersFilter"
      :pagination="usersPagination"
      :add="userAddPath"
      :delete="userDeleteApi"
      :actions="usersActions"
      :permissions="usersPermissions"
      @applyFilter="getUsers($event)"
      @showNots="goToNotsItem($event)"
      @editItem="goToEditItem($event)"
      @deleteItem="deleteItem($event)"
      @showOrders="showOrders($event)"
      @showAssignments="showAssignments($event)"
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
      usersItems : [],
      usersHeader : [
        { text: this.$t('users.fullname'), value: 'fullname' },
        { text: this.$t('users.mobile'), value: 'mobile' },
        { text: this.$t('users.email'), value: 'email' },
        { text: this.$t('users.lang'), value: 'lang' },
        { text: this.$t('users.roles'), value: 'roles' },
        { text: this.$t('users.userStatus'), value: 'status' , align:'center' },
        { text: this.$t('users.acceptmarketing'), value: 'acceptmarketing' , align:'center' },
        { text: this.$t('users.createAt'), value: 'created_at' },
        { text: this.$t('common.actions'), value: 'actions' }
      ],
      loadingItems : false ,
      usersFilter : {
        status : true , // filter is required
        items : [
          { placeHolder : this.$t('users.roles') , key: 'filter[role]' , value : '' , type : 'autocomplete' , searchable : true , searchKey : '' , items: [] , itemText : 'name' , itemId : 'name' , filter:null } ,
          { placeHolder : this.$t('users.fullname') , key: 'filter[fullname]' , value : '' , type : 'text' },
          { placeHolder : this.$t('users.email') , key: 'filter[email]' , value : '' , type : 'text' },
          { placeHolder : this.$t('users.mobile') , key: 'filter[mobile]' , value : '' , type : 'text' },
          { placeHolder : this.$t('users.userStatus') , key: 'filter[status]' , value : '' , type : 'autocomplete' , items: [{ name : this.$t('common.active') , value : 'true' } , { name : this.$t('common.notActive') , value : 'false' }] , itemText : 'name' , itemId : 'value' } 
        ]
      },
      usersPagination:{
        pagesCounts : 1 ,
        selectedPage : 1 
      },
      usersPermissions:{
        show : '' ,
        showAny : '' ,
        add : '' ,
        edit : '' ,
        delete : ''
      },
      userAddPath : '/users/add',
      userDeleteApi : '' ,
      usersActions : ['delete' ,'nots' , 'show_assignments'], 
      addPermissionDialog : {
        dialog : false ,
        loader : false ,
        selectedItem : null
      },
    }
  },
  
  created() {
    this.getUsers()
  },
  methods: {
    getUsers(query = `?page[number]=${this.usersPagination.selectedPage}`) {
      if (this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter) {
        if (query !== '?') {
          query = this.$route.query.queryFilter + `page[number]=${this.usersPagination.selectedPage}`
        }
      }
      this.loadingItems = true
      this.$axios
        .$get(`/admin/user${query}`)
        .then((res) => {
          this.usersItems = res.data
          console.log(this.usersItems)
          this.usersPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    goToEditItem(item) {
      this.$router.push('/users/' + item.userID + '/edit')
    },
    goToNotsItem(item) {
      this.$router.push('/users/' + item.userID + '/nots')
    },
    deleteItem(item) {
      this.userDeleteApi = 'user/' + item.userID
    },
    showOrders(item) {
      this.$router.push({ path: 'orders', query: { queryFilter: `?filter[userID]=${item.userID}&` } })
    },
    showAssignments(item) {
      this.$router.push({ path: 'assignments', query: { queryFilter: `?filter[userID]=${item.userID}&` } })
    }
  },
  head() {
    return {
      title: this.$t('menu.users')
    }
  }
}
</script>