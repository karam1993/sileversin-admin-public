<template>
  <div class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="assignmentsItems"
      :header="assignmentsHeader"
      :loading="loadingItems"
      :filters="assignmentsFilter"
      :pagination="assignmentsPagination"
      :delete="assignmentDeleteApi"
      :actions="assignmentsActions"
      :permissions="assignmentsPermissions"
      @applyFilter="getAssignments($event)"
      @editItem="goToEditItem($event)"
      @deleteItem="deleteItem($event)"
      @showItem="showItem($event)"
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
      assignmentsItems : [],
      assignmentsHeader : [
        { text: this.$t('assignments.serviceCar'), value: 'serviceCar.plateID' },
        { text: this.$t('assignments.employee'), value: 'user.fullname' },
        { text: this.$t('assignments.userInfo'), value: 'userOrder' },
        
        { text: this.$t('assignments.status'), value: 'assignmentStatus' },
        { text: this.$t('assignments.assignmentDoneAt'), value: 'assignmentDoneAt' },
        { text: this.$t('assignments.assignmentCancelledAt'), value: 'assignmentCancelledAt' },
        { text: this.$t('assignments.assignmentCancelled_reason'), value: 'assignmentCancelled_reason' },
        { text: this.$t('common.actions'), value: 'actions' }
      ],
      loadingItems : false ,
      assignmentsFilter : {
        status : true , // filter is required
        items : [
          { placeHolder : this.$t('assignments.assignmentableID') , key: 'filter[assignmentID]' , value : '' , type : 'text' } ,
          { placeHolder : this.$t('assignments.status') , key: 'filter[assignmentStatus]' , value : '' , type : 'autocomplete' , items: 
          [
            { name : this.$t('status.active') , value : 'active' },
            { name : this.$t('status.done') , value : 'done' },
            { name : this.$t('status.cancelled') , value : 'cancelled' },
            { name : this.$t('status.pending') , value : 'pending' }            
          ] , itemText : 'name' , itemId : 'value' } ,
          { placeHolder : this.$t('orders.user') , key: 'filter[userID]' , value : '' , type : 'autocomplete' , searchable : true , searchKey : '' , items: [] , itemText : 'fullname' , itemId : 'userID' , filter:'&filter[role]=employee' } ,
          { placeHolder : this.$t('orders.serviceCar') , key: 'filter[serviceCarID]' , value : '' , type : 'autocomplete' , searchable : true , searchKey : '' , items: [] , itemText : 'plateID' , itemId : 'serviceCarID' , filter:'&filter[status]=true' } 
          
        ]
      },
      assignmentsPagination:{
        pagesCounts : 1 ,
        selectedPage : 1 
      },
      assignmentsPermissions:{
        show : '' ,
        showAny : '' ,
        add : '' ,
        edit : '' ,
        delete : ''
      },
      //   assignmentAddPath : '/assignments/add',
      assignmentDeleteApi : '' ,
      assignmentsActions : ['show'], 
      addPermissionDialog : {
        dialog : false ,
        loader : false ,
        selectedItem : null
      }
    }
  },
    
  created() {
    this.getAssignments()
  },
  methods: {
    getAssignments(query = `?page[number]=${this.assignmentsPagination.selectedPage}`) {
      if (this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter) {
        if (query !== '?') {
          query = this.$route.query.queryFilter + `page[number]=${this.assignmentsPagination.selectedPage}`
        }
      }
      this.loadingItems = true
      this.$axios
        .$get(`/admin/assignment${query}`)
        .then((res) => {
          this.assignmentsItems = res.data
          this.assignmentsPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    showItem(item) {
      this.$router.push('/assignments/' + item.assignmentID + '/show')
    },
    deleteItem(item) {
      this.assignmentDeleteApi = 'assignment/' + item.assignmentID
    }
  },
  head() {
    return {
      title: this.$t('menu.assignment')
    }
  }
}
</script>