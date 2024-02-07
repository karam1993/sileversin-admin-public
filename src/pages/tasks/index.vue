<template>
  <div class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="tasksItems"
      :header="tasksHeader"
      :loading="loadingItems"
      :filters="tasksFilter"
      :pagination="tasksPagination"
      :add="taskAddPath"
      :delete="taskDeleteApi"
      :actions="tasksActions"
      :permissions="tasksPermissions"
      @applyFilter="getTasks($event)"
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
      tasksItems : [],
      tasksHeader : [
        { text: this.$t('tasks.taskName'), value: 'taskName' },
        { text: this.$t('tasks.taskDescription'), value: 'taskDescription' },
        { text: this.$t('tasks.taskStatus'), value: 'status' },
        { text: this.$t('common.actions'), value: 'actions' }
      ],
      loadingItems : false ,
      tasksFilter : {
        status : true , // filter is required
        items : [
          { placeHolder : this.$t('tasks.taskName') , key: 'filter[taskName]' , value : '' , type : 'text' },
          { placeHolder : this.$t('tasks.taskDescription') , key: 'filter[taskDescription]' , value : '' , type : 'text' },
          { placeHolder : this.$t('tasks.taskStatus') , key: 'filter[status]' , value : '' , type : 'autocomplete' , items: [{ name : this.$t('common.active') , value : 'true' } , { name : this.$t('common.notActive') , value : 'false' }] , itemText : 'name' , itemId : 'value' } 
        ]
      },
      tasksPagination:{
        pagesCounts : 1 ,
        selectedPage : 1 
      },
      tasksPermissions:{
        show : '' ,
        showAny : '' ,
        add : '' ,
        edit : '' ,
        delete : ''
      },
      taskAddPath : '/tasks/add',
      taskDeleteApi : '' ,
      tasksActions : ['edit' , 'delete'], 
      addPermissionDialog : {
        dialog : false ,
        loader : false ,
        selectedItem : null
      }
    }
  },
    
  created() {
    this.getTasks()
  },
  methods: {
    getTasks(query = `?page[number]=${this.tasksPagination.selectedPage}`) {
      if (this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter) {
        if (query !== '?') {
          query = this.$route.query.queryFilter + `page[number]=${this.tasksPagination.selectedPage}`
        }
      }
      this.loadingItems = true
      this.$axios
        .$get(`/admin/task${query}`)
        .then((res) => {
          this.tasksItems = res.data
          this.tasksPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    goToEditItem(item) {
      this.$router.push('/tasks/' + item.taskID + '/edit')
    },
    deleteItem(item) {
      this.taskDeleteApi = 'task/' + item.taskID
    }
  },
  head() {
    return {
      title: this.$t('menu.tasks')
    }
  }
}
</script>