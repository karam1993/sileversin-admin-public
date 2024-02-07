<template>
  <div v-permissions="''" class="d-flex flex-grow-1 flex-column">
    <v-card class="borderCardInfo">
      <v-card-text>
        <v-form ref="form" >
          <v-row>
            <v-col cols="12" md="6" class="py-1">
              <v-text-field
                v-model="dataForm.packetName"
                :rules="[required]"
                :label="$t('packets.packetName')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-text-field
                v-model="dataForm.validDay"
                :rules="[required , number]"
                :label="$t('packets.validDay')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-text-field
                v-model="dataForm.price"
                :rules="[required , number]"
                :label="$t('packets.price')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-text-field
                v-model="dataForm.tax"
                :rules="[required , number]"
                :label="$t('packets.tax')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-text-field
                v-model="dataForm.totalPrice"
                :rules="[required , number]"
                :label="$t('packets.totalPrice')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-switch
                v-model="dataForm.status"
                inset
                color="primary"
                :label="$t('packets.packetStatus')"
              ></v-switch>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-menu
                v-model="menuValid_at"
                :close-on-content-click="false"
                max-width="290"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :value="dataForm.valid_at"
                    clearable
                    :label="$t('packets.valid_at')"
                    readonly
                    outlined
                    dense
                    
                    v-bind="attrs"
                    :rules="[required]"
                    v-on="on"
                    @click:clear="dataForm.valid_at = null"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dataForm.valid_at"
                  @input="dataForm.valid_at += ' 00:00:00'"
                  @change="menuValid_at = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-menu
                v-model="menuInValid_at"
                :close-on-content-click="false"
                max-width="290"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    :value="dataForm.invalid_at"
                    clearable
                    :label="$t('packets.invalid_at')"
                    readonly
                    outlined
                    :rules="[required]"
                    dense
                    v-bind="attrs"
                    v-on="on"
                    @click:clear="dataForm.invalid_at = null"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dataForm.invalid_at"
                  
                  @change="menuInValid_at = false"
                  @input="dataForm.invalid_at += ' 00:00:00'"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-textarea
                v-model="dataForm.desc"
                :rules="[required]"
                :label="$t('packets.desc')"
                outlined
                dense
              ></v-textarea>
            </v-col>

            <v-col cols="12" md="6" class="py-1">
              <v-autocomplete
                v-model="selectesServices"
                :rules="[requiredArray]"
                multiple
                chips
                small-chips 
                :items="activeServices"
                :label="$t('packets.services')"
                item-text="serviceName"
                item-value="serviceID"
                
                return-object
                outlined
                dense
              ></v-autocomplete>
              <v-simple-table v-if="selectesServices.length > 0">
                <template >
                  <thead>
                    <tr>
                      <th class="text-left">
                        {{ $t('packets.serviceName') }}
                      </th>
                      <th class="text-left">
                        {{ $t('packets.count') }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(services , index) in selectesServices " :key="index">
                      <td>{{ services.serviceName }}</td>
                      <td>
                        
                        <v-text-field
                          v-model="services.count"
                          :rules="[required , number]"
                          class="my-1"
                          :label="$t('packets.count')"
                          outlined
                          hide-details
                          dense
                        ></v-text-field>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
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
      menuValid_at: false,   
      menuInValid_at : false,
      loadingSave : false ,
      activeServices : [] ,
      selectesServices : [] ,
      dataForm : {
        packetName : '' ,
        validDay : '' ,
        price : '' ,
        tax : '' ,
        totalPrice : '' ,
        status : true ,
        valid_at : null ,
        invalid_at : null ,
        desc : null,
        services : [] 

      }
    }
  },
  created() {
    this.getServices()
  },
  methods: {
    getServices() {
      this.$axios
        .$get('/admin/service?filter[status]=true&page[size]=1000000')
        .then((res) => {
          this.activeServices = res.data
        })
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        this.dataForm.services = this.selectesServices
        this.$axios
          .$post('/admin/packet', this.dataForm)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.$router.push('/packets')
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