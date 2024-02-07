<template>
  <div v-permissions="''" class="d-flex flex-grow-1 flex-column">
    <v-card class="borderCardInfo">
      <v-card-text>
        <v-form ref="form" >
          <v-row>
            <v-col cols="12" md="6" class="py-1">
              <v-text-field
                v-model="dataForm.fname"
                :rules="[required]"
                :label="$t('users.fname')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-text-field
                v-model="dataForm.lname"
                :rules="[required]"
                :label="$t('users.lname')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-text-field
                v-model="dataForm.email"
                :rules="[required , email]"
                :label="$t('users.email')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-text-field
                v-model="dataForm.mobile"
                :rules="[required , phoneNumber]"
                :label="$t('users.mobile')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-text-field
                v-model="dataForm.password"
                :rules="[required , passwordCounter]"
                type="password"
                :label="$t('users.password')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-text-field
                v-model="dataForm.password_confirmation"
                :rules="[required , passwordCounter]"
                type="password"
                :label="$t('users.password_confirmation')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-autocomplete
                v-model="dataForm.roles"
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
            <v-col cols="6" md="3" class="py-1 pt-0">
              <v-switch
                v-model="dataForm.status"
                inset
                color="primary"
                :label="$t('users.userStatus')"
              ></v-switch>
            </v-col>
            <v-col cols="6" md="3" class="py-1 pt-0">
              <v-switch
                v-model="dataForm.acceptmarketing"
                inset   
                color="primary"
                :label="$t('users.acceptmarketing')"
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
        fname :'',
        lname : '' ,
        email : '' ,
        mobile : '' ,
        password : '' ,
        password_confirmation : '' ,
        acceptmarketing : false , 
        status : true ,
        roles : [] 
      },
      loadingSave : false ,
      activeRoles : []
    }
  },
  created() {
    this.getRoles()
  },
  methods: {
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
        this.$axios
          .$post('/admin/user', this.dataForm)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.$router.push('/users')
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