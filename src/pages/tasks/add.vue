<template>
  <div v-permissions="''" class="d-flex flex-grow-1 flex-column">
    <v-card class="borderCardInfo">
      <v-card-text>
        <v-form ref="form" >
          <v-row>
            <v-col cols="12" md="6" class="py-1">
              <v-text-field
                v-model="dataForm.taskName"
                :rules="[required]"
                :label="$t('tasks.taskName')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="6" md="3" class="pb-1 pt-0">
              <v-switch
                v-model="dataForm.status"
                inset   
                color="primary"
                :label="$t('tasks.taskStatus')"
              ></v-switch>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-textarea
                v-model="dataForm.taskDescription"
                :label="$t('tasks.taskDescription')"
                outlined
                dense
              ></v-textarea>
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
        taskName : '' ,
        taskDescription : '' ,
        status : true
      },
      loadingSave : false 

    }
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        this.$axios
          .$post('/admin/task', this.dataForm)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.$router.push('/tasks')
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
  },

}
</script>