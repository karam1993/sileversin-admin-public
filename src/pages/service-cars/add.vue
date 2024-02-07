<template>
  <div v-permissions="''" class="d-flex flex-grow-1 flex-column">
    <v-card  class="borderCardInfo">
      <v-card-text>
        <v-form ref="form" >
          <v-row>
            <v-col cols="12" md="6" class="py-1">
              <v-text-field
                v-model="dataForm.plateID"
                :rules="[required]"
                :label="$t('serviceCars.plateID')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-autocomplete
                v-model="dataForm.serviceAreaID"
                :items="activeServiceAreas"
                :rules="[required]"
                :label="$t('serviceCars.serviceAreaName')"
                item-text="serviceArea_name"
                item-value="serviceAreaID"
                outlined
                dense
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-autocomplete
                v-model="dataForm.colorID"
                :items="colores"
                :rules="[required]"
                :label="$t('serviceCars.color')"
                item-text="colorName"
                item-value="colorID"
                outlined
                dense
              >
                <template slot="item" slot-scope="data">
                  <v-icon style="border: 1px solid #eee; border-radius: 50%; padding:2px" :color="'#' + data.item.colorCode" class="mx-1">mdi-palette</v-icon>
                  <span>{{ data.item.colorName }} </span>
                </template>
              </v-autocomplete>
            </v-col>

            <v-col cols="12" md="6" class="py-1">
              <v-autocomplete
                v-model="dataForm.brandID"
                :items="brands"
                :rules="[required]"
                :label="$t('serviceCars.brandID')"
                item-text="brandName"
                item-value="brandID"
                outlined
                dense
                @change="getModel"
              ></v-autocomplete>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-autocomplete
                v-model="dataForm.modelID"
                :items="models"
                :rules="[required]"
                :label="$t('serviceCars.modelID')"
                item-text="modelName"
                item-value="modelID"
                outlined
                dense
              ></v-autocomplete>
            </v-col>

            <v-col cols="12" md="6" class="py-1">
              <v-switch
                v-model="dataForm.status"
                inset
                color="primary"
                :label="$t('serviceCars.serviceCarsStatus')"
              ></v-switch>
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
      dataForm : {
        plateID :'' ,
        serviceAreaID : null ,
        colorID : null , 
        brandID : null ,
        modelID : null ,
        status : true
      },
      loadingSave : false ,
      activeServiceAreas : [] ,
      colores :  [] ,
      brands : [] ,
      models : []
    }
  }, 
  created() {
    this.getServiceAreas()
    this.getColors()
    this.getBrands()
  },
  methods: {
    getServiceAreas() {
      this.$axios
        .$get('/admin/servicearea?page[size]=1000000')
        .then((res) => {
          this.activeServiceAreas = res.data
        })
    },
    getColors() {
      this.$axios
        .$get('/constant/color')
        .then((res) => {
          this.colores = res.data
        })
    },
    getBrands() {
      this.$axios
        .$get('/constant/brand')
        .then((res) => {
          this.brands = res.data
        })
    },
    getModel(brandID) {
      this.$axios
        .$get('/constant/brand/' + brandID)
        .then((res) => {
          this.models = res.data
        })
    },

    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        this.$axios
          .$post('/admin/service-car', this.dataForm)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.$router.push('/service-cars')
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