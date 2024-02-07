<template>
  <div v-permissions="''" class="d-flex flex-grow-1 flex-column">
    <v-card class="borderCardInfo">
      <v-card-text>
        <v-form ref="form" >
          <v-row>
            <v-col cols="12" md="6" class="py-1">
              <v-row>
                <v-col cols="12" class="py-1">
                  <v-autocomplete
                    v-model="langService"
                    :rules="[]"
                    :label="$t('services.langs')"
                    :items="langs"
                    item-text="lable"
                    item-value="key"
                    chips
                    small-chips
                    outlined
                    multiple
                    dense
                    return-object
                  ></v-autocomplete>
                </v-col>
                <v-col cols="12" class="py-1">
                  <v-text-field
                    v-model="dataForm.serviceName"
                    :rules="[required]"
                    :label="$t('services.serviceName')"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-1 mb-3" v-if="dataForm.serviceNameTrans.length > 0">
                  <div class="tabLangClass">
                    <div >
                      <v-tabs
                        v-model="tabName"
                        color="primary"
                        grow
                      >
                        <v-tab v-for="(lang , index) in langService" :key="index">
                          {{ lang.lable }}
                        </v-tab>
                      </v-tabs>
                     
                      <v-tabs-items v-model="tabName">
                        <v-tab-item v-for="(lang , index) in dataForm.serviceNameTrans" :key="index">
                          <v-card flat >
                            <v-card-text>
                              <v-text-field
                                v-model="lang.translation"
                                :rules="[required]"
                                :label="$t('services.nameTranslate')"
                                outlined
                                dense
                              ></v-text-field>
                            </v-card-text>
                          </v-card>
                        </v-tab-item>
                      </v-tabs-items>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" class="py-1">
                  <v-text-field
                    v-model="dataForm.price"
                    :rules="[required , number]"
                    :label="$t('services.price')"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-1">
                  <v-autocomplete
                    v-model="dataForm.segments"
                    :rules="[requiredArray]"
                    multiple
                    chips
                    small-chips
                    :items="activeSegments"
                    item-text="segment_name"
                    item-value="segmentID"
                    :label="$t('services.segments')"
                    outlined
                    dense
                  ></v-autocomplete>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-row>
                <v-col cols="12" class="py-1">
                  <v-text-field
                    v-model="dataForm.timeslot"
                    :rules="[required , number]"
                    :label="$t('services.timeslot')"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-1">
                  <v-text-field
                    v-model="dataForm.description"
                    :rules="[required]"
                    :label="$t('services.desc')"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-1 mb-3" v-if="dataForm.descriptionTrans.length > 0">
                  <div class="tabLangClass">
                    <div >
                      <v-tabs
                        v-model="tabDesc"
                        color="primary"
                        grow
                      >
                        <v-tab v-for="(lang , index) in langService" :key="index">
                          {{ lang.lable }}
                        </v-tab>
                      </v-tabs>
                      <v-tabs-items v-model="tabDesc" touchless>
                        <v-tab-item v-for="(lang , index) in dataForm.descriptionTrans" :key="index">
                          <v-card flat >
                            <v-card-text>
                              <v-text-field
                                v-model="lang.translation"
                                :rules="[required]"
                                :label="$t('services.descriptionTrans')"
                                outlined
                                dense
                              ></v-text-field>
                            </v-card-text>
                          </v-card>
                        </v-tab-item>
                      </v-tabs-items>
                    </div>
                  </div>
                </v-col>
                <v-col cols="12" class="py-1">
                  <v-text-field
                    v-model="dataForm.netprice"
                    :rules="[required , number]"
                    :label="$t('services.netprice')"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-1">
                  <v-switch
                    v-model="dataForm.status"
                    class="mt-1"
                    :label="$t('services.serviceStatus')"
                    inset
                  ></v-switch>
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
    </v-card>
  </div>
</template>

<script>
import Rules from '~/apps/validation/index'

export default {
  mixins: [Rules] ,
  data() {
    return {
      tabName : 0 ,
      tabDesc : 0 ,
      loadingSave : false ,
      langs : [
        { key : 'en' , lable : this.$t('services.english') , value : '' } ,
        { key : 'ar' , lable : this.$t('services.arabic') , value : '' } 
        
      ],
      langService : [] ,
      dataForm : {
        serviceName :'' ,
        serviceNameTrans : [],
        descriptionTrans : [] ,
        price : '' ,
        netprice : '' ,
        description : '' ,
        timeslot : '' ,
        status : true,
        tasks : [] ,
        segments : []
      },
      activeTasks : [] ,
      activeSegments : [] 
    }
  },
  watch:{
    'dataForm.tasks':{
      deep: true,
      handler: function (tasks) {
        for (let index = 0; index < tasks.length; index++) {
          this.$set(tasks[index] , 'ord' , index + 1)
        }
      }
    },
    langService(selectedLang) {
      this.dataForm.serviceNameTrans = []
      this.dataForm.descriptionTrans = []

      for (let index = 0; index < selectedLang.length; index++) {
        const obj = { lang : selectedLang[index]['key'] , translation : '' }

        this.dataForm.serviceNameTrans.push({ ...obj })
        this.dataForm.descriptionTrans.push({ ...obj })
      }
      
    }
  },
  created() {
    this.getTasks()
    this.getSegments()
  },
  methods: {
    getTasks() {
      this.$axios
        .$get('/admin/task?filter[status]=true&page[size]=1000000')
        .then((res) => {
          this.activeTasks = res.data
        })
    },
    getSegments() {
      this.$axios
        .$get('/admin/segment?page[size]=1000000')
        .then((res) => {
          this.activeSegments = res.data
        })
    },

    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        console.log(this.dataForm)
        this.$axios
          .$post('/admin/service', this.dataForm)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.$router.push('/services')
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
<style>
.tabLangClass{
    border: 1px solid rgb(158 158 158);
    border-radius: 5px;
    overflow: auto;
}
.noLangClass{
  padding: 8px;
}
</style>