<template>
  <div class="d-inline-flex " >
    <div v-if="textContent && textContent.length > size">
      {{ textContent.slice(0, size) + " ... " }}<a @click="show=true">{{ $t("common.seeAll") }}</a>
    </div>
    <div v-else>
      {{ textContent }}
    </div>

    <v-dialog v-if="show" v-model="show" max-width="510">
      <v-card class="borderCardInfo" >
        <v-card-text class="pt-2">
          {{ textContent }}
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    textContent: {
      type: String,
      default: ''
    },
    size: {
      type: Number,
      default: 40
    }
  },
  data() {
    return {
      show: false
    }
  }
}
</script>
