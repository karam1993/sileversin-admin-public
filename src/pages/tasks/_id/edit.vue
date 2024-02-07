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
              <v-text-field
                v-model="taskInfo.taskName"
                :rules="[required]"
                :label="$t('tasks.taskName')"
                outlined
                dense
              ></v-text-field>
            </v-col>
            <v-col cols="6" md="3" class="pb-1 pt-0">
              <v-switch
                v-model="taskInfo.status"
                inset   
                color="primary"
                :label="$t('tasks.taskStatus')"
              ></v-switch>
            </v-col>
            <v-col cols="12" md="6" class="py-1">
              <v-textarea
                v-model="taskInfo.taskDescription"
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
      loadingData : true ,
      loadingSave : false ,
      taskInfo : {}

    }
  },
  created() {
    this.getTaskInfo()
  },
  methods: {
    getTaskInfo() {
      this.loadingData = true
      this.$axios
        .$get(`/admin/task/${this.$route.params.id}`)
        .then((res) => {
          this.taskInfo  = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loadingData = false
        })
    },
    save() {
      if (this.$refs.form.validate()) {
        this.loadingSave = true
        const taskInfo = { ...this.taskInfo }

        this.$axios
          .$put(`/admin/task/${this.$route.params.id}`, taskInfo)
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('common.success'))
            this.getTaskInfo()
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