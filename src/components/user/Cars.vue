<template>
  <div>
    <v-row  v-if="carsUser.length > 0 ">
      <v-col v-for="(car , index ) in carsUser" :key="index" md="4">
        <v-card class="borderCardInfo">
          <v-card-title>
            {{ car.brandmodel.brand.brandName + ' ' +car.brandmodel.modelName }}
          </v-card-title>
          <v-card-text>
            <v-row no-gutters>
              <v-col cols="5">
                <p class="mb-1"><b>{{ $t('cars.color') }} : </b> <span>{{ car.color.colorName }}</span></p>
                <p v-if="car.plate" class="mb-1"><CarPlate :plate="car.plate" /> </p>
                <p v-else class="mb-1"><b>{{ $t('cars.plate') }} : </b>  <span >{{ car.plateID }}</span></p>
              </v-col>
              <v-col cols="7">
                <v-img
                  class="rounded-lg"
                  width="100%"
                  :src=" car.url ? car.url : '/images/no-car.png'"
                ></v-img>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-card v-else color="#f9f9f9" elevation="0">
      <v-card-text>
        <p class="mb-0 text-center">{{ $t('common.noDataAvailable') }}</p>
        
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    carsUser: {
      type: Array,
      default: () => ([])
    }
  }
}
</script>