<template>
  <div v-permissions="''" class="d-flex flex-grow-1 flex-column">
    <v-row>
      <v-col cols="12">
        <div v-if="nots.length > 0">
          <v-card v-for="(item , index) in nots" :key="index" class="mb-2">
            <v-card-title>
              <span class="mb-0 mr-1" > <v-chip small color="info" class="white--text"><v-icon small class="mr-1">mdi-account</v-icon> {{ item.user.name }}</v-chip> </span>
              <span  v-if="item.reminder_at" class="mb-0 "> <v-chip small color="warning" class="white--text"><v-icon small class="mr-1">mdi-bell-ring-outline</v-icon> {{ item.reminder_at }}</v-chip> </span>
            </v-card-title>
            <v-card-text class="reviewContact">
              <div v-html="item.noteText">
              </div>
            </v-card-text>
          </v-card>
        </div>
        <div v-else>
          <v-card >
            <v-card-text>
              <p class="text-center mb-0">{{ $t('common.noDataAvailable') }}</p>
            </v-card-text>
          </v-card>
        </div>
        
      </v-col>
      <v-col cols="12">
        <v-card>
          <v-card-text>
            <p v-if="dataForm.reminder_at" class="mb-0">
              <v-chip
                small
                class="white--text"
                close
                color="warning"
                @click:close="dataForm.reminder_at = null"
              >{{ dataForm.reminder_at }}</v-chip>
            </p>
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">

                <v-badge
                  bordered
                  color="warning"
                  overlap
                >

                  <v-icon
                    slot="badge"
                    style="z-index: 1;"
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-bell-ring-outline
                  </v-icon>

                </v-badge>
              </template>
              <v-date-picker
                v-model="dataForm.reminder_at"
                no-title
                @input="menu = false"
                @click="$refs.menu.save(dataForm.reminder_at)"
              ></v-date-picker>

            </v-menu>

            <quillEditor
              v-model="dataForm.noteText" 
              class="quill-editor"
            />
            
            <v-btn class="mt-2" :loading="loadingSave" color="primary" @click="save">
              {{ $t('common.save') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>
  </div>
</template>
<script>
import { quillEditor } from 'quill-vuejs'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      menu: false,
      loadingSave : false ,
      nots : [] ,
      dataForm:{
        noteText : '' ,
        reminder_at : null
      }
    }
  },
  created() {
    this.getNots()
  },
  methods: {
    getNots() {
      this.$axios
        .$get(`/admin/user/${this.$route.params.id}/note`)
        .then((res) => {
          console.log(res)
          this.nots = res.data
        })
    },
    save() {
      this.loadingSave = true
      this.$axios
        .$post(`/admin/user/${this.$route.params.id}/note`, this.dataForm)
        .then((res) => {
          this.$store.dispatch('showSuccess', this.$t('common.success'))
          this.dataForm.noteText = null 
          this.dataForm.reminder_at = null 
          this.getNots()
        })
        .catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingSave = false
        })
      
    }
  }
}
</script>

<style>
.reviewContact p{
    margin-bottom: 0;
    padding-bottom: 0;
    
}
</style>