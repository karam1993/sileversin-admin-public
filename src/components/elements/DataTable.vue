<template>
  <div>
    <v-expansion-panels v-if="filters.status" v-permissions="permissions.showAny" class="mb-2 borderCardInfo" >
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h3 class="primary--text">{{ $t('common.filter') }}<v-btn
            v-if="this.$route.query.queryFilter !== '?' && this.$route.query.queryFilter"
            class="mx-2"
            outlined
            color="error"
            @click="removeFilter"
          ><v-icon>mdi-filter-off-outline</v-icon> {{ $t('common.removeFilter') }}</v-btn></h3>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-row class="justify-space-around mt-1">
            <v-col
              v-for="(item, index) in filters.items"
              :key="index"
              cols="12"
              md="4"
              class="my-0 py-0"
            >

              <v-text-field
                v-if="item.type == 'text'"
                v-model="item.value"
                :label="item.placeHolder"
                outlined
                dense
                clearable
                @input="typeFilter"
              ></v-text-field>
              <v-autocomplete
                v-else-if="item.type == 'autocomplete' && !item.searchable"
                v-model="item.value"
                :label="item.placeHolder"
                outlined
                dense
                clearable
                :items="item.items"
                :item-text="item.itemText"
                :item-value="item.itemId"
                :no-data-text="$t('common.noDataAvailable')"
                @input="typeFilter"
              ></v-autocomplete>
              <v-autocomplete
                v-else-if="item.type == 'autocomplete' && item.searchable"
                v-model="item.value"
                :label="item.placeHolder"
                :search-input.sync="item.searchKey"
                outlined
                dense
                clearable
                :items="item.items"
                :item-text="item.itemText"
                :item-value="item.itemId"
                :no-data-text="$t('common.noDataAvailable')"
                @keyup="searchItems(index, item)"
                @focus="searchItems(index, item)"
                @click:clear="searchItems(index, item)"
                @input="typeFilter"
              ></v-autocomplete>
              <v-menu
                v-else-if="item.type == 'date'"
                v-model="item.menu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="item.value"
                    :label="item.placeHolder"
                    append-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    outlined
                    dense
                    clearable
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="item.value" @input="interTime(item)"></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-row>
      <v-col cols="12" class="pt-0 pb-1">
        <v-btn
          v-if="add"
          v-permissions="permissions.add"
          outlined
          color="primary"
          @click="addItem"
        >
          <v-icon class="mr-1">mdi-plus-circle</v-icon> {{ $t('common.add') }}
        </v-btn>
        <div v-if="otherAction.length != 0" class="d-inline-block pr-1">
          <v-btn
            v-for="(btn, index) in otherAction"
            :key="index"
            v-permissions="btn.permissions"
            class="ml-1"
            color="primary"
            @click="openDialog(btn.emit, index)"
          >
            {{ btn.text }}
          </v-btn>
        </div>

      </v-col>
    </v-row>
    <v-data-table
      v-model="selectable.items"
      :show-select="selectable.status"
      :headers="header"
      :items="items"
      :items-per-page="20"
      :loading="loading"
      hide-default-footer
      :item-key="selectable.itemKey"
      class="elevation-1 borderCardInfo"
    >
      <template v-slot:[`item.fullname`]="{ item }">
        <div>
          <nuxt-link :to="`/users/${item.userID}/edit`">{{ item.fullname }}</nuxt-link>
        </div>
      </template>
      <template v-slot:[`item.lang`]="{ item }">
        <div>
          <v-chip v-if="item.lang == 'tr'" color="primary" small>TR</v-chip>
          <v-chip v-else-if="item.lang == 'ar'" color="primary" small>AR</v-chip>
          <v-chip v-else-if="item.lang == 'en'" color="primary" small>EN</v-chip>
          <span v-else > - </span>
        </div>
      </template>

      <template v-slot:[`item.mobile`]="{ item }">
        <div>
          <a :href="'tel:0' + item.mobile">{{ item.mobile }}</a>
        </div>
      </template>

      <template v-slot:[`item.user.fullname`]="{ item }">
        <div>
          <nuxt-link
            v-if="item.user"
            class="text-decoration-underline black--text"
            :to="`/users/${item.user.userID}/edit`"
          >{{
            item.user.fullname
          }}</nuxt-link>
          <div v-else>-</div>
        </div>
      </template>
      <template v-slot:[`item.serviceCar.plateID`]="{ item }">
        <div>
          <nuxt-link
            v-if="item.user"
            class="text-decoration-underline black--text"
            :to="`/service-cars/${item.serviceCar.serviceCarID}/edit`"
          >{{
            item.serviceCar.plateID
          }}</nuxt-link>
          <div v-else>-</div>
        </div>
      </template>
      <template v-slot:[`item.email`]="{ item }">
        <div>
          <a :href="'mailto:' + item.email">{{ item.email }}</a>
        </div>
      </template>
      <template v-slot:[`item.totalPrice`]="{ item }">
        <div>
          <p class="mb-0 mt-1"><span>{{ $t('packets.price') }} : {{ item.price + '₺ + ' + item.tax + '₺ KDV' }}</span></p>
          <p class="mb-1"><b>{{ $t('packets.totalPrice') }} : {{ item.totalPrice + '₺ ' }}</b></p>
        </div>
      </template>
      <template v-slot:[`item.netprice`]="{ item }">
        <div>
          <p class="mb-0 mt-1"><span>{{ $t('services.price') }} : {{ item.price + '₺' }}</span></p>
          <p class="mb-1"><b>{{ $t('services.netprice') }} : {{ item.netprice + '₺' }}</b></p>
        </div>
      </template>
      <template v-slot:[`item.description`]="{ item }">
        <div>
          <show-text :text-content="item.description" :size="30"></show-text>
        </div>
      </template>
      <template v-slot:[`item.status`]="{ item }">
        <div>
          <v-icon v-if="item.status" color="success">
            mdi-check-circle-outline
          </v-icon>
          <v-icon v-else color="error">
            mdi-close-circle-outline
          </v-icon>
        </div>
      </template>
      <template v-slot:[`item.acceptmarketing`]="{ item }">
        <div>
          <v-icon v-if="item.acceptmarketing" color="success">
            mdi-check-circle-outline
          </v-icon>
          <v-icon v-else color="error">
            mdi-close-circle-outline
          </v-icon>
        </div>
      </template>
      <template v-slot:[`item.public`]="{ item }">
        <div>
          <v-icon v-if="item.public" color="info">
            mdi-earth
          </v-icon>
          <v-icon v-else color="warning">
            mdi-image-filter-center-focus-strong-outline
          </v-icon>
        </div>
      </template>
      <template v-slot:[`item.color.colorName`]="{ item }">
        <div>
          {{ item.color.colorName }} <v-icon
            style="border: 1px solid #eee; border-radius: 50%; padding:2px"
            :color="'#' + item.color.colorCode"
          >mdi-palette</v-icon>
        </div>
      </template>
      <template v-slot:[`item.car.brandmodel.brand.brandName`]="{ item }">
        <div>
          {{ item.car.brandmodel.brand.brandName + ' / ' + item.car.brandmodel.modelName }}
        </div>
      </template>
      <template v-slot:[`item.appointmentDateTime`]="{ item }">
        <div>

          <span>{{ item.appointment.appExpectStart.substr(0, 10) }}</span> 
          <v-chip small color="warning">
            {{ item.appointment.appExpectStart.substr(10, 6) }}
            <v-icon class="mx-1" small >mdi-arrow-right-bold-outline </v-icon>
            {{ item.appointment.appExpectEnd.substr(10, 6) }}
          </v-chip>

        </div>
      </template>
      <template v-slot:[`item.uuid`]="{ item }">
        <div class="pa-0 ma-0">
          <v-tooltip bottom class="pa-0 ma-0">
            <template v-slot:activator="{ on, attrs }">

              <copy-label :text="item.uuid" />
              <v-icon
                v-bind="attrs"
                color="black"
                style="cursor: pointer;"
                class="mx-2"
                v-on="on"
              >mdi-qrcode</v-icon>
            </template>

            <VueQrcode :value="item.uuid" />
          </v-tooltip>
        </div>
      </template>
      <template v-slot:[`item.taskDescription`]="{ item }">
        <div>
          <show-text :text-content="item.taskDescription" :size="30"></show-text>
        </div>
      </template>
      <template v-slot:[`item.userOrder`]="{ item }">
        <div v-if="item.order.user" class="my-1">
          <p class="mb-1"><nuxt-link :to="`/users/${item.order.user.userID}/edit`">{{ item.order.user.fullname }}</nuxt-link></p>
          <CarPlate :plate="item.order.car.plate" />
        </div>
        <div v-else>-</div>
      </template>
      <template v-slot:[`item.paymentType`]="{ item }">
        <div v-if="item.paymentType == 'CREDITCARD'">
          <v-icon color="success">mdi-credit-card-check-outline</v-icon>
          <span class="success--text">{{ $t(`orders.${item.paymentType}`) }}</span>
        </div>
        <div v-else-if="item.paymentType == 'CASH'">
          <v-icon color="warning">mdi-cash-check</v-icon>
          <span class="warning--text">{{ $t(`orders.${item.paymentType}`) }}</span>
        </div>
        <div v-else>
          <span class="info--text">{{ item.paymentType }}</span>
        </div>
      </template>
      <template v-slot:[`item.car.plate`]="{ item }">
        <div v-if="item.car" class="my-1">
          <CarPlate :plate="item.car.plate" />
        </div>
      </template>
      <template v-slot:[`item.amount`]="{ item }">
        <div>
          <span v-text="item.amount ? '₺' + item.amount : '-'"></span>
        </div>
      </template>
      <template v-slot:[`item.appStatus`]="{ item }">
        <v-chip color="primary" style="width: 90px;" class="justify-center" small>{{ $t('status.' + item.appStatus)
        }}</v-chip>
      </template>
      <template v-slot:[`item.orderStatus`]="{ item }">
        <v-chip color="primary" style="width: 90px;" class="justify-center" small>{{ $t('status.' + item.status)
        }}</v-chip>
      </template>
      <template v-slot:[`item.assignmentStatus`]="{ item }">
        <v-chip color="primary" style="width: 90px;" class="justify-center" small>{{ $t('status.' + item.assignmentStatus)
        }}</v-chip>
      </template>
      <template v-slot:[`item.paymentStatus`]="{ item }">
        <v-chip color="primary" style="width: 90px;" class="justify-center" small>{{ $t('status.' + item.paymentStatus)
        }}</v-chip>
      </template>
      <template v-slot:[`item.paymentDone_at`]="{ item }">
        <div>
          <span v-text="item.paymentDone_at ? item.paymentDone_at : '-'"></span>
        </div>
      </template>
      <template v-slot:[`item.paymentDoneBy`]="{ item }">
        <div>
          <span v-text="item.paymentDoneBy ? item.paymentDoneBy : '-'"></span>
        </div>
      </template>
      <template v-slot:[`item.roles`]="{ item }">
        <div>
          <span v-for="(role, index) in item.roles" :key="index" class="mb-0">
            <v-chip v-if="role.name == 'employee'" class="ml-1" small color="warning"><v-icon small class="mr-1" >mdi-motorbike</v-icon> {{ $t('assignments.employee') }}</v-chip>
            <v-chip v-if="role.name == 'admin'" small color="info"><v-icon small class="mr-1" >mdi-security</v-icon>  {{ $t('assignments.admin') }}</v-chip>
          </span>
          <v-chip v-if="item.roles.length == 0" small color="#eee"><v-icon small class="mr-1" >mdi-account</v-icon>  {{ $t('assignments.user') }}</v-chip>
        </div>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <div>
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-if="actions.includes('edit')" v-permissions="permissions.show" @click="updateItem(item)">
                <v-list-item-title>
                  <v-icon color="secondary" small>mdi-circle-edit-outline </v-icon>
                  <span class="black--text">{{ $t('common.edit') }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="actions.includes('show_orders')" v-permissions="permissions.show" @click="showOrders(item)">
                <v-list-item-title>
                  <v-icon color="secondary" small>mdi-car-wash </v-icon>
                  <span class="black--text">{{ $t('common.show_order') }}</span>
                </v-list-item-title>
              </v-list-item>

              <v-list-item v-if="actions.includes('show_assignments') && item.roles.filter(obj => {return obj.name === 'employee'}).length != 0 " v-permissions="permissions.show" @click="showAssignments(item)">
                <v-list-item-title>
                  <v-icon color="secondary" small>mdi-clipboard-account-outline </v-icon>
                  <span class="black--text">{{ $t('common.show_assignment') }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="actions.includes('show')" v-permissions="permissions.show" @click="showItem(item)">
                <v-list-item-title>
                  <v-icon color="secondary" small>mdi-eye-outline </v-icon>
                  <span class="black--text">{{ $t('common.show') }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="actions.includes('print-qr')" v-permissions="permissions.printQr" @click="printQrCode(item)">
                <v-list-item-title>
                  <v-icon color="secondary" small>mdi-printer-outline </v-icon>
                  <span class="black--text">{{ $t('common.printQr') }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="actions.includes('nots')" v-permissions="''" @click="showNots(item)">
                <v-list-item-title>
                  <v-icon color="secondary" small>mdi-sticker-text-outline </v-icon>
                  <span class="black--text">{{ $t('common.note') }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="actions.includes('run')" v-permissions="''" @click="runNotify(item)">
                <v-list-item-title>
                  <v-icon color="secondary" small>mdi-email-fast-outline </v-icon>
                  <span class="black--text">{{ $t('common.run') }}</span>
                </v-list-item-title>
              </v-list-item>
              <v-list-item v-if="actions.includes('delete')" v-permissions="permissions.delete" @click="deleteItem(item)">
                <v-list-item-title>
                  <v-icon color="secondary" small>mdi-trash-can-outline </v-icon>
                  <span class="black--text">{{ $t('common.delete') }}</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
    </v-data-table>

    <v-pagination
      v-model="pagination.selectedPage"
      v-permissions="permissions.showAny"
      class="my-4"
      :length="pagination.pagesCounts"
      :total-visible="7"
      circle
      @input="$vuetify.goTo(0)"
    ></v-pagination>
    <DeleteConfirm v-model="formDataDelete" />
  </div>
</template>
<style scoped>
.v-tooltip__content {
  padding: 10px;
  background: #d8d8d8;
}
</style>
<script>
import DeleteConfirm from '~/components/confirm/delete.vue'
import ShowText from '~/components/common/ShowText'
import VueQrcode from 'vue-qrcode'
import CopyLabel from '../common/CopyLabel'
import CarPlate from  '~/components/common/CarPlate'

// import VueQrcode from 'vue-qrcode'

export default {
  components: {
    DeleteConfirm, ShowText, VueQrcode, CopyLabel , CarPlate
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    header: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    filters: {
      type: Object,
      default: null
    },
    pagination: {
      type: Object,
      default: null
    },
    permissions: {
      type: Object,
      default: null,
      required: true
    },
    selectable: {
      type: Object,
      default() {
        return {
          status: false,
          items: []
        }
      },
      required: false
    },
    add: {
      type: String,
      default: '',
      required: false
    },
    otherAction: {
      type: Array,
      default: () => [],
      required: false
    },
    delete: {
      type: String,
      default: '',
      required: false
    },
    actions: {
      type: Array,
      default: () => [],
      required: false
    }
  },
  data() {
    return {
      timer: null,
      formDataDelete: {
        deleteApi: this.delete,
        dialog: false,
        status: false
      }
    }
  },
  watch: {
    'pagination.selectedPage': function (selectedPage) {
      let query = `?page[number]=${selectedPage}&`

      for (let index = 0; index < this.filters.items.length; index++) {
        if (this.filters.items[index]['value']) {
          query += `${this.filters.items[index]['key']}=${this.filters.items[index]['value']}&`
        }
      }
      this.$emit('applyFilter', query)
    },
    'formDataDelete.status': function (status) {
      if (status) {
        let query = `?page[number]=${this.pagination.selectedPage}&`

        for (let index = 0; index < this.filters.items.length; index++) {
          if (this.filters.items[index]['value']) {
            query += `${this.filters.items[index]['key']}=${this.filters.items[index]['value']}&`
          }
        }
        this.$emit('applyFilter', query)
        this.formDataDelete.status = false
      }
    }
  },
  created() {
    this.checkFilterToGetData(this.filters.items)
    if (this.$route.query.queryFilter) {
      const filter = this.$route.query.queryFilter.split('&')
      const ArrObj = []

      for (let index = 0; index < filter.length; index++) {
        const key = filter[index].substring(filter[index].indexOf('?') + 1, filter[index].indexOf(']') + 1)
        const val = filter[index].substring(filter[index].indexOf(']') + 2, filter[index].length)
        const obj = { key: key, val: val }

        if (key) {
          ArrObj.push(obj)
        }
      }
      for (let indexX = 0; indexX < this.filters.items.length; indexX++) {
        for (let indexY = 0; indexY < ArrObj.length; indexY++) {
          if (this.filters.items[indexX]['key'] === ArrObj[indexY]['key']) {
            this.filters.items[indexX]['value'] = ArrObj[indexY]['val']
          }

        }

      }
    }
  },
  methods: {
    interTime(item) {
      item.menu = false
      this.typeFilter()
    },
    removeFilter() {
      this.$router.push({ query: { 'queryFilter': '?' } })
      for (let index = 0; index < this.filters.items.length; index++) {
        this.filters.items[index]['value'] = ''
      }
      if (this.timer) {           // delay time befor searching
        clearTimeout(this.timer)  // delay time befor searching
        this.timer = null         // delay time befor searching
      }                           // delay time befor searching
      this.timer = setTimeout(() => {
        this.$emit('applyFilter', '?')
      }, 500)

    },
    typeFilter() {
      const value = this.filters
      let query = '?'

      for (let index = 0; index < value.items.length; index++) {
        if (value.items[index]['value']) {
          query += `${value.items[index]['key']}=${value.items[index]['value']}&`
        }
      }

      this.$router.push({ query: { 'queryFilter': query } })
      if (this.timer) {           // delay time befor searching
        clearTimeout(this.timer)  // delay time befor searching
        this.timer = null         // delay time befor searching
      }                           // delay time befor searching
      this.timer = setTimeout(() => {
        this.pagination.selectedPage = 1
        this.$emit('applyFilter', query)
      }, 500)
    },
    searchItems(index, obj) {
      if (obj['key'] === 'filter[userID]') {
        this.getUsers(index)
      }
      else if (obj['key'] === 'filter[servicearea]') {
        this.getServiceArea(index)
      }
      else if (obj['key'] === 'filter[serviceCarID]') {
        this.getServiceCar(index)
      }
      else if (obj['key'] === 'filter[role]') {
        this.getRol(index)
      }
    },
    checkFilterToGetData(myArray) {
      for (let index = 0; index < myArray.length; index++) {
        if (myArray[index]['key'] === 'filter[userID]') {
          this.getUsers(index, myArray[index])
        }

      }
    },
    addItem() {
      this.$router.push(this.add)
    },
    getUsers(indexInFilter) {
      if (this.timer) {           // delay time befor searching
        clearTimeout(this.timer)  // delay time befor searching
        this.timer = null         // delay time befor searching
      }                           // delay time befor searching
      this.timer = setTimeout(() => {
        console.log(this.filters.items[indexInFilter]['filter'])
        this.$axios
          .$get(`/admin/user?filter[fullname]=${this.filters.items[indexInFilter]['searchKey'] || ''} ${this.filters.items[indexInFilter]['filter'] || ''}`)
          .then((res) => {
            this.filters.items[indexInFilter]['items'] = res.data
          }).catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
      }, 500)
    },
    getServiceArea(indexInFilter) {
      if (this.timer) {           // delay time befor searching
        clearTimeout(this.timer)  // delay time befor searching
        this.timer = null         // delay time befor searching
      }                           // delay time befor searching
      this.timer = setTimeout(() => {
        this.$axios
          .$get('/admin/servicearea')
          .then((res) => {
            this.filters.items[indexInFilter]['items'] = res.data
          }).catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
      }, 500)
    },
    getServiceCar(indexInFilter) {
      if (this.timer) {           // delay time befor searching
        clearTimeout(this.timer)  // delay time befor searching
        this.timer = null         // delay time befor searching
      }                           // delay time befor searching
      this.timer = setTimeout(() => {
        this.$axios
          .$get(`/admin/service-car?filter[plateID]=${this.filters.items[indexInFilter]['searchKey'] || ''} ${this.filters.items[indexInFilter]['filter'] || ''}`)
          .then((res) => {
            this.filters.items[indexInFilter]['items'] = res.data
          }).catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
      }, 500)
    },
    getRol(indexInFilter) {
      if (this.timer) {           // delay time befor searching
        clearTimeout(this.timer)  // delay time befor searching
        this.timer = null         // delay time befor searching
      }                           // delay time befor searching
      this.timer = setTimeout(() => {
        this.$axios
          .$get(`/admin/role?filter ${this.filters.items[indexInFilter]['filter'] || ''}`)
          .then((res) => {
            this.filters.items[indexInFilter]['items'] = res.data
          }).catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
      }, 500)
    },
    openDialog(emit, index) {
      this.$emit(emit, this.otherAction[index])
    },
    updateItem(item) {
      this.$emit('editItem', item)
    },
    showItem(item) {
      this.$emit('showItem', item)
    },
    showNots(item) {
      this.$emit('showNots', item)
    },
    runNotify(item) {
      this.$emit('runNotify', item)
    },
    deleteItem(item) {
      this.$emit('deleteItem', item)
      this.$nextTick(() => {
        this.formDataDelete.dialog = true
        this.formDataDelete.deleteApi = this.delete
      })
    },
    printQrCode(item) {
      this.$emit('printQrCode', item)
    },
    showOrders(item) {
      this.$emit('showOrders', item)
    },
    showAssignments(item) {
      this.$emit('showAssignments', item)
    }
  }
}
</script>