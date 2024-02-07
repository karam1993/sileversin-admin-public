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
                    v-model="serviceInfo.serviceName"
                    :rules="[required]"
                    :label="$t('services.serviceName')"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col v-if="serviceInfo.serviceNameTrans.length > 0" cols="12" class="py-1 mb-3">
                  <div class="tabLangClass">
                    <div >
                      <v-tabs
                        v-model="tabName"
                        color="primary"
                        grow
                      >
                        <v-tab v-for="(lang , index) in serviceInfo.serviceNameTrans" :key="index">
                          {{ lang.lable }}
                        </v-tab>
                      </v-tabs>
                     
                      <v-tabs-items v-model="tabName" touchless>
                        <v-tab-item v-for="(lang , index) in serviceInfo.serviceNameTrans" :key="index">
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
                    v-model="serviceInfo.price"
                    :rules="[required , number]"
                    :label="$t('services.price')"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-1">
                  <v-autocomplete
                    v-model="serviceInfo.segments"
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
                    v-model="serviceInfo.timeslot"
                    :rules="[required , number]"
                    :label="$t('services.timeslot')"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-1">
                  <v-text-field
                    v-model="serviceInfo.description"
                    :rules="[required]"
                    :label="$t('services.desc')"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col v-if="serviceInfo.descriptionTrans.length > 0" cols="12" class="py-1 mb-3">
                  <div class="tabLangClass">
                    <div >
                      <v-tabs
                        v-model="tabDesc"
                        color="primary"
                        grow
                      >
                        <v-tab v-for="(lang , index) in serviceInfo.descriptionTrans" :key="index">
                          {{ lang.lable }}
                        </v-tab>
                      </v-tabs>
                     
                      <v-tabs-items v-model="tabDesc" touchless>
                        <v-tab-item v-for="(lang , index) in serviceInfo.descriptionTrans" :key="index">
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
                    v-model="serviceInfo.netprice"
                    :rules="[required , number]"
                    :label="$t('services.netprice')"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-1">
                  <v-switch
                    v-model="serviceInfo.status"
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
      langs : [
        { key : 'en' , lable : this.$t('services.english') } ,
        { key : 'ar' , lable : this.$t('services.arabic') } 
      ],
      langService : [] ,
      tabName : 0 ,
      tabDesc : 0 ,
      serviceInfo : {},
      loadingSave : false ,
      loadingData : true ,
      activeTasks : [] ,
      activeSegments : []
    }
  },
  watch:{
    'serviceInfo.tasks':{
      deep: true,
      handler: function (tasks) {
        for (let index = 0; index < tasks.length; index++) {
          this.$set(tasks[index] , 'ord' , index + 1)
        }
      }
    },
    langService(selectedLang) {
      const newTranslateNameArr = []
      const newTranslateDescArr = []
      
      for (let index = 0; index < selectedLang.length; index++) {
        const obj = { lang : selectedLang[index]['key'] , translation : '' , lable :selectedLang[index]['lable'] }
        const objDesc = { lang : selectedLang[index]['key'] , translation : '' , lable :selectedLang[index]['lable'] }

        const langObj =  this.serviceInfo.serviceNameTrans.find((item) => item.lang === obj['lang'])
        const langObjDesc =  this.serviceInfo.descriptionTrans.find((item) => item.lang === obj['lang'])

        obj.translation = langObj ? langObj.translation : ''
        objDesc.translation = langObjDesc ? langObjDesc.translation : ''
        
        newTranslateNameArr.push({ ...obj })
        newTranslateDescArr.push({ ...objDesc })        
      }
      this.serviceInfo.serviceNameTrans = [...newTranslateNameArr]
      this.serviceInfo.descriptionTrans = [...newTranslateDescArr]
      
    }
  },

  created() {
    this.getsSrviceInfo()
    this.getTasks() 
    this.getSegments()

  },
  methods: {
    getsSrviceInfo() {
      this.loadingData = true
      this.$axios
        .$get(`/admin/service/${this.$route.params.id}`)
        .then((res) => {
          this.serviceInfo  = res.data
          this.setLabelToTranslate()
          const segmentIDs = res.data.segments.map((item) => item.segmentID)

          this.serviceInfo.segments = segmentIDs
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loadingData = false
        })
    },
    setLabelToTranslate() {
      this.langService = []
      for (let index = 0; index < this.serviceInfo.serviceNameTrans.length; index++) {
        const langObj =  this.langs.find((item) => item.key === this.serviceInfo.serviceNameTrans[index]['lang'])

        this.langService.push(langObj)
        this.$set(this.serviceInfo.serviceNameTrans[index] , 'lable' ,langObj.lable )

      }
    },
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

        const serviceInfo = { ...this.serviceInfo }

        this.$axios
          .$put(`/admin/service/${this.$route.params.id}`, serviceInfo)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.changePasswordStatus = false
            this.getsSrviceInfo()
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