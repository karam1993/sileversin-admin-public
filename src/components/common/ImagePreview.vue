<template>
  <div>
    <v-dialog v-model="dialog" width="767" @click:outside="$emit('closeCarImage')">
      <v-card>
        <div>
          <v-card-text >
            <v-img :src="image" />
          </v-card-text>
        </div>
       
      </v-card>

    </v-dialog>
  </div>
</template>
  
<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      required: false
    },
    image: {
      type: String,
      default : '/images/no-car.png'
    }
  },
  data() {
    return {
   
    }
  },
  created() {
  },
  methods: {
   
  }
}
</script>