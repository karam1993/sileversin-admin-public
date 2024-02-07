<template>
  <div v-permissions="''" class="d-flex flex-grow-1 flex-column">
    <v-card class="borderCardInfo">
      <div>
        <v-card >
          <v-tabs
            v-model="tab"
            show-arrows
            grow
          >
            <v-tab>
              <v-icon class="mx-1">mdi-information-variant-circle-outline</v-icon> {{ $t('users.userInfo') }}
            </v-tab>
            <v-tab>
              <v-icon class="mx-1">mdi-calendar-cursor-outline</v-icon> {{ $t('users.orders') }}
            </v-tab>
            <v-tab>
              <v-icon class="mx-1">mdi-car-multiple</v-icon>  {{ $t('users.cars') }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab" touchless >
            <v-tab-item >
              <v-skeleton-loader
                v-if="loadingBaseData"
                type="article"
              ></v-skeleton-loader>
              <v-card-text v-else>
                <v-card-text>
                  <v-form ref="form" >
                    <v-row>
                      <v-col cols="12" md="6" class="py-1">
                        <v-text-field
                          v-model="userInfo.fname"
                          :rules="[required]"
                          :label="$t('users.fname')"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6" class="py-1">
                        <v-text-field
                          v-model="userInfo.lname"
                          :rules="[required]"
                          :label="$t('users.lname')"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6" class="py-1">
                        <v-text-field
                          v-model="userInfo.email"
                          :rules="[required , email]"
                          :label="$t('users.email')"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6" class="py-1">
                        <v-text-field
                          v-model="userInfo.mobile"
                          :rules="[required , phoneNumber]"
                          :label="$t('users.mobile')"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6" class="py-1">
                        <v-autocomplete
                          v-model="roles"
                          multiple
                          chips
                          small-chips 
                          :items="activeRoles"
                          :label="$t('users.roles')"
                          item-text="name"
                          item-value="name"
                          outlined
                          dense
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="6" md="3" class="py-1">
                        <v-switch
                          v-model="userInfo.status"
                          inset
                          color="primary"
                          :label="$t('users.userStatus')"
                          outlined
                        ></v-switch>
                      </v-col>
                      <v-col cols="6" md="3" class="py-1">
                        <v-switch
                          v-model="userInfo.acceptmarketing"
                          inset   
                          color="primary"
                          :label="$t('users.acceptmarketing')"
                          outlined
                        ></v-switch>
                      </v-col>
                      <v-col cols="6" class="py-1">
                        <v-switch
                          v-model="changePasswordStatus"
                          inset   
                          color="warning"
                          :label="$t('users.changePassword')"
                          outlined
                          @change="changePassword"
                        ></v-switch>
                      </v-col>
                      <v-col v-if="changePasswordStatus" cols="12" class="py-1">
                        <v-row >
                          <v-col cols="12" md="6" class="py-1" >
                            <v-text-field
                              v-model="userInfo.password"
                              :rules="[required , passwordCounter]"
                              type="password"
                              :label="$t('users.password')"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>
                          <v-col cols="12" md="6" class="py-1">
                            <v-text-field
                              v-model="userInfo.password_confirmation"
                              :rules="[required , passwordCounter]"
                              type="password"
                              :label="$t('users.password_confirmation')"
                              outlined
                              dense
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn :loading="loadingSave" color="primary" @click="save">
                    {{ $t('common.save') }}
                  </v-btn>
                </v-card-actions>
              </v-card-text>
            </v-tab-item>
            <v-tab-item >
              <v-card color="#f9f9f9" >
                <v-card-text style="background: ;" >
                  <Orders :orders-user="ordersUser" />
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item >
              <v-card color="#f9f9f9">
                <v-card-text>
                  <Cars :cars-user="userInfo.cars" />
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </div>
    </v-card>
  </div>
</template>

<script>
import Rules from '~/apps/validation/index'
import Orders from '~/components/user/Orders.vue'  
import Cars from '~/components/user/Cars.vue'  


export default {
  components:{
    Orders , Cars
  },
  mixins: [Rules] ,
  data() {
    return { 
      tab : 0 ,
      loadingBaseData : true ,
      loadingSave : false ,
      changePasswordStatus : false ,
      userInfo : {} ,
      ordersUser : [] ,
      activeRoles : [],
      roles : [] 
    }
  },
  created() {
    this.getUserInfo()
    this.getOrdersByUser()
    this.getRoles()
  },
  methods: {
    getUserInfo() {
      this.loadingBaseData = true
      this.$axios
        .$get(`/admin/user/${this.$route.params.id}`)
        .then((res) => {
          this.userInfo  = res.data
          
          this.roles = res.data.roles.map((item) => item.name)
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loadingBaseData = false
        })
    },
    getOrdersByUser() {
      this.loadingOrderData = true
      this.$axios
        .$get(`/admin/order?filter[userID]=${this.$route.params.id}&page[size]=1000000`)
        .then((res) => {
          this.ordersUser  = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loadingOrderData = false
        })
    },
    changePassword(val) {
      if (val) {
        this.$set(this.userInfo , 'password' , '')
        this.$set(this.userInfo , 'password_confirmation' , '')
            
      } else {
        this.$delete(this.userInfo , 'password' )
        this.$delete(this.userInfo , 'password_confirmation' )
      }
    },
    getRoles() {
      this.$axios
        .$get('/admin/role?page[size]=1000000')
        .then((res) => {
          this.activeRoles = res.data
        })
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        const userInfo = { ...this.userInfo }

        userInfo.roles = this.roles
        this.$axios
          .$put(`/admin/user/${this.$route.params.id}`, userInfo)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.changePasswordStatus = false
            this.getUserInfo()
          })
          .catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
          .finally(() => {
            this.loadingSave = false
            
          })
      } else {
        this.$store.dispatch('showError', this.$t('rules.dataNotValid'))
      }
    }
  }

}
</script>