<template>
  <div>

    <v-autocomplete
      class="selectUserAutoComplete"
      dense 
      outlined
      readonly
      :items="selectedUser"
      :value="selectedUser"
      multiple
      return-object
      item-text="fullname"
      item-value="userID"
      :label="$t('notifications.selectUser')"
      small-chips
      click
      clearable
      @click:clear="selectedUser = []"
      @click="dialog = true"
    >
      <template v-slot:selection="data">
        <v-chip small @click="dialog = true" >{{ data.item.fullname }}</v-chip>
      </template>
    </v-autocomplete>

    <v-dialog v-model="dialog">
      <v-card class="py-2">
        <v-card-title style="justify-content:space-between">
          <h4>{{ $t('notifications.selectTitle') }}</h4>
          <div class="d-flex" style="position: relative;" width="width: 500px;">
            <v-select
              v-model="searchKeyFilter"
              dense
              class="searchBy"
              outlined
              solo
              :label="$t('common.search')"
              item-text="name"
              item-value="value"
              :items="[{name : $t('users.name') , value : 'filter[fullname]'} , {name : $t('users.mobile') , value : 'filter[mobile]'} , {name : $t('users.email') , value : 'filter[email]'}]"
              
              hide-details
              @input="getUsers()"
            ></v-select>
            <v-text-field
              v-model="searchUserValue"
              dense
              outlined
              style="width: 300px;"
              :label="$t('common.search')"
              class="mr-6 inputSearch"
              append-icon="mdi-magnify"
              hide-details
              @input="getUsers()"
            ></v-text-field>
          </div>
          <v-btn color="primary" outlined @click="dialog = false">{{ $t('common.ok') }}</v-btn>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="6">

            </v-col>
          </v-row>
        </v-card-text>
        <v-card-text>
          
          <v-data-table
            v-model="selectedUser"
            :headers="headers"
            :items="usersList"
            item-key="userID"
            class="elevation-0"
            hide-default-footer
            show-select
          ></v-data-table>
          <v-pagination
            v-model="page"
            :length="pagesCount"
            circle
            :total-visible="7"
          ></v-pagination>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  model:{
    event: 'update_users' ,
    prop: 'users'
  },
  props:{
    users: {
      type: Array,
      default: () => ([])
    }
  },
  data() {
    return {
      usersList :[]  ,
      searchKeyFilter : 'filter[fullname]' ,
      searchUserValue : null ,
      pagesCount : 1 ,
      page : 1 ,
      dialog : false ,
      headers: [
        { text: this.$t('users.fullname'), value: 'fullname' },
        { text: this.$t('users.mobile'), value: 'mobile' }
       
      ]
    }
  },
  computed: {
    selectedUser:{
      get() {
        return this.users
      },
      set(val) {
        this.$emit('update_users', val)
      }
    }
  },
  watch: {
    page () {
      this.getUsers()
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    getUsers() {
      const query = `?page[number]=${this.page}&${this.searchUserValue ? this.searchKeyFilter : null}=${this.searchUserValue}`

      this.loadingItems = true
      this.$axios
        .$get(`/admin/user${query}`)
        .then((res) => {
          this.usersList = res.data
          this.pagesCount = res.meta.last_page
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingItems = false
        })
    }
  }
}
</script>

<style>
.selectUserAutoComplete.v-autocomplete.v-select.v-text-field input{
    max-height: 100% !important ;
    padding: 7px !important ;
    
}
.searchBy{
  
  position: absolute !important ;
  left: 0 !important ;
  top: 0;
  width: 125px;
  z-index: 100;

}
.searchBy .v-input__slot {
  background: #f1f1f1 !important
}
.inputSearch .v-label{
  left: 125px !important ;
}
.inputSearch input {
  padding-left: 125px;
}
.inputSearch legend{
  margin-left: 125px;
}
</style>