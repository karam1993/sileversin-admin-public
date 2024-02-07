<template>
  <div class="d-flex flex-grow-1 flex-column">
    <DataTable
      :items="notificationsItems"
      :header="notificationsHeader"
      :loading="loadingItems"
      :filters="notificationsFilter"
      :pagination="notificationsPagination"
      :add="notificationAddPath"
      :delete="notificationDeleteApi"
      :actions="notificationsActions"
      :permissions="notificationsPermissions"
      @applyFilter="getNotifications($event)"
      @runNotify="startRunNotify($event)"
      @editItem="goToEditItem($event)"
      @deleteItem="deleteItem($event)"
    />
    <ConfirmMessageStartRun :dialog="startRunDialogStatus" :loading="loaderStartRun" :contant="contantTextStartRun" @closeConfirmation="closeConfirmationStartRun($event)" />
  </div>
</template>
    
<script>
import DataTable from '~/components/elements/DataTable.vue'
import ConfirmMessageStartRun from  '~/components/common/dialog/ConfirmMessage'

export default {
  components:{
    DataTable ,
    ConfirmMessageStartRun
  },
  data() {
    return {
      notificationsItems : [],
      selectedNotificationToRun : null ,
      notificationsHeader : [
        { text: this.$t('notifications.notificationJobName'), value: 'notificationJobName' },
        { text: this.$t('notifications.created_at'), value: 'created_at' },
        { text: this.$t('notifications.started_at'), value: 'started_at' },
        { text: this.$t('notifications.user_count'), value: 'user_count' },
        
        { text: this.$t('common.actions'), value: 'actions' }
      ],
      loadingItems : false ,
      notificationsFilter : {
        status : false , // filter is required
        items : []
      },
      notificationsPagination:{
        pagesCounts : 1 ,
        selectedPage : 1 
      },
      notificationsPermissions:{
        show : '' ,
        showAny : '' ,
        add : '' ,
        edit : '' ,
        delete : ''
      },
      notificationAddPath : '/notifications/add',
      notificationDeleteApi : '' ,
      notificationsActions : ['delete' , 'run'], 
      addPermissionDialog : {
        dialog : false ,
        loader : false ,
        selectedItem : null
      },
      startRunDialogStatus : false ,
      loaderStartRun : false ,
      contantTextStartRun : {
        title : `<h5>${this.$t('confirm.startRun')}</h5>` ,
        body : `<p class='mb-0'>${this.$t('confirm.startRunText')}</p>` 
      }
    }
  },
    
  created() {
    this.getNotifications()
  },
  methods: {
    getNotifications(query = `?page[number]=${this.notificationsPagination.selectedPage}`) {
      if (this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter) {
        if (query !== '?') {
          query = this.$route.query.queryFilter + `page[number]=${this.notificationsPagination.selectedPage}`
        }
      }
      this.loadingItems = true
      this.$axios
        .$get(`/admin/notification${query}`)
        .then((res) => {
          this.notificationsItems = res.data
          this.notificationsPagination.pagesCounts = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    },
    goToEditItem(item) {
      this.$router.push('/notifications/' + item.id + '/edit')
    },
    startRunNotify(item) {
      this.selectedNotificationToRun = item
      this.startRunDialogStatus = true
    },
    closeConfirmationStartRun(status) {
      if (status) {
        this.loaderStartRun = true
        this.$axios.$post(`/admin/notification/${this.selectedNotificationToRun.id}/run`).then(() => {
          this.startRunDialogStatus = false
          this.$store.dispatch('showSuccess', this.$t('common.success'))
          this.getNotifications()
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loaderStartRun = false
          this.startRunDialogStatus = false
        })
      }
      else {
        this.startRunDialogStatus = false
      }
    },
    deleteItem(item) {
      this.notificationDeleteApi = 'notification/' + item.id
    }
  },
  head() {
    return {
      title: this.$t('menu.notification')
    }
  }
}
</script>