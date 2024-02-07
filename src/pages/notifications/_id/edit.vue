<template>
  <div v-permissions="''" class="d-flex flex-grow-1 flex-column">
    <v-card class="borderCardInfo">
      <v-skeleton-loader
        v-if="loadingData"
        type="article"
      ></v-skeleton-loader>
      <v-card-text v-else>
        <v-form ref="form" >
          <v-row>
            <v-col cols="12" class="py-1">
              <v-text-field
                v-model="notificationInfo.notificationJobName"
                :rules="[required]"
                :label="$t('notifications.notificationJobName')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" class="py-1">
              <v-textarea
                v-model="notificationInfo.notificationMessage.text"
                :rules="[required]"
                :label="$t('notifications.messageText')"
                outlined
                dense
              ></v-textarea>
            </v-col>
            <v-col cols="12" class="py-1 ">
              <div class="d-flex">
                <v-avatar class="pb-1" v-if="notificationInfo.notificationMessage.imageUrl">
                  <img
                    style="object-fit: contain;"
                    
                    :src="notificationInfo.notificationMessage.imageUrl"
                  >
                </v-avatar>
                <div :class="notificationInfo.notificationMessage.imageUrl ? 'ml-2' : ''" style="width: 100%;">
                  <v-text-field
                    v-model="notificationInfo.notificationMessage.imageUrl"
                    :rules="[imageUrl]"
                    :label="$t('notifications.imageUrl')"
                    outlined
                    dense
                  ></v-text-field>
                </div>
              </div>
            </v-col>
          </v-row>

          <v-card class="elevation-0" color="#eee">
            <v-card-text>
              <v-expansion-panels v-model="openedTab">
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <h3>{{ $t('notifications.condition') }}</h3>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row>
                      <v-col cols="12" class="py-1">
                        <v-text-field
                          v-model="notificationInfo.notificationJobCondition.limit"
                          :rules="[number]"
                          :label="$t('notifications.limit')"
                          outlined
                          dense
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <h3>{{ $t('notifications.userInfo') }}</h3>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row>
                      <v-col cols="12" class="py-1">
                        <v-autocomplete
                          v-model="notificationInfo.notificationJobCondition.lang"
                          :items="[{name : $t('services.english') , value : 'en'},{name : $t('services.arabic') , value : 'ar'},{name : 'Turkish' , value : $t('services.turkish')}]"
                          :label="$t('notifications.lang')"
                          outlined
                          item-text="name"
                          value-text="value"
                          clearable
                          dense
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" class="py-1">
                        <SelectUser v-model="users" />
                      </v-col>
                      <v-col cols="12" md="6" class="py-1">
                        <v-menu
                          v-model="menuLoginFrom"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          min-width="auto"
                        >
                       
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="notificationInfo.notificationJobCondition.login.from"
                              dense
                              outlined
                              :label="$t('notifications.loginFrom')"
                              append-icon="mdi-calendar"
                              readonly
                              clearable
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="notificationInfo.notificationJobCondition.login.from"
                            @input="menuLoginFrom = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" md="6" class="py-1">
                        <v-menu
                          v-model="menuLoginTo"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          min-width="auto"
                        >
                       
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="notificationInfo.notificationJobCondition.login.to"
                              dense
                              outlined
                              :label="$t('notifications.loginTo')"
                              append-icon="mdi-calendar"
                              readonly
                              clearable
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="notificationInfo.notificationJobCondition.login.to"
                            @input="menuLoginTo = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" md="6" class="py-1">
                        <v-menu
                          v-model="menuSeeFrom"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          min-width="auto"
                        >
                       
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="notificationInfo.notificationJobCondition.seen.from"
                              dense
                              outlined
                              :label="$t('notifications.seeFrom')"
                              append-icon="mdi-calendar"
                              readonly
                              clearable
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="notificationInfo.notificationJobCondition.seen.from"
                            @input="menuSeeFrom = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" md="6" class="py-1">
                        <v-menu
                          v-model="menuSeeTo"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          min-width="auto"
                        >
                       
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="notificationInfo.notificationJobCondition.seen.to"
                              dense
                              outlined
                              clearable
                              :label="$t('notifications.seeTo')"
                              append-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="notificationInfo.notificationJobCondition.seen.to"
                            @input="menuSeeTo = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <h3>{{ $t('notifications.orderInfo') }}</h3>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row>
                      <v-col cols="12" md="6" class="py-1">
                        <v-menu
                          v-model="menuOrderFrom"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          min-width="auto"
                        >
                       
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="notificationInfo.notificationJobCondition.order_last.from"
                              dense
                              outlined
                              clearable
                              :label="$t('notifications.orderFrom')"
                              append-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="notificationInfo.notificationJobCondition.order_last.from"
                            @input="menuOrderFrom = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" md="6" class="py-1">
                        <v-menu
                          v-model="menuOrderTo"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          min-width="auto"
                        >
                       
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="notificationInfo.notificationJobCondition.order_last.to"
                              dense
                              outlined
                              :label="$t('notifications.orderTo')"
                              append-icon="mdi-calendar"
                              readonly
                              clearable
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="notificationInfo.notificationJobCondition.order_last.to"
                            @input="menuOrderTo = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>

          </v-card>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :loading="loadingSave" color="primary" @click="save">
          {{ $t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
  
<script>
import Rules from '~/apps/validation/index'
import SelectUser from '~/components/common/SelectUser'

export default {
  components: {
    SelectUser
  },
  mixins: [Rules] ,
  data() {
    return {
      openedTab : 0 ,
      users : [],
      loadingData : true ,
      loadingSave : false ,
      notificationInfo: null,
      menuLoginFrom : false ,
      menuLoginTo : false ,
      menuSeeFrom : false ,
      menuSeeTo : false ,
      menuOrderFrom : false ,
      menuOrderTo : false 
    }
  },
  
  created() {
    this.getNotificationInfo()
  },
  methods: {
    getNotificationInfo() {
      this.loadingData = true
      this.$axios
        .$get(`/admin/notification/${this.$route.params.id}`)
        .then((res) => {
          this.notificationInfo  = res.data
          console.log(this.notificationInfo)
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loadingData = false
        })
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        // start save
      } else {
        this.$store.dispatch('showError', this.$t('rules.dataNotValid'))
      }
    }
  
  }
  
}
  
</script>