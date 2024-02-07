<template>
  <div v-permissions="''" class="d-flex flex-grow-1 flex-column">
    <v-card class="borderCardInfo">
      <div>
        <v-card >
          <v-tabs
            v-model="tab"
            show-arrows
            grow
          >
            <v-tab @click="getAppointmentInfo">
              <v-icon class="mx-1">mdi-information-variant-circle-outline</v-icon> {{ $t('appointments.appointmentInfo') }}
            </v-tab>
            <v-tab @click="getOrderInfo">
              <v-icon class="mx-1">mdi-calendar-cursor-outline</v-icon> {{ $t('appointments.order') }}
            </v-tab>
            <v-tab @click="getOrderInfo">
              <v-icon class="mx-1">mdi-account-hard-hat-outline</v-icon>  {{ $t('appointments.assignment') }}
            </v-tab>
            <v-tab @click="getActiveServicers" v-if="appointmentInfo.appStatus == 'free'">
              <v-icon class="mx-1">mdi-cursor-default-click</v-icon>  {{ $t('appointments.makeOrder') }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab" touchless>
            
            <v-tab-item >
              <v-skeleton-loader
                v-if="appLoadingData"
                type="article"
              ></v-skeleton-loader>
              <v-card v-else>
                <v-card-text>
                  <table class="attributeTable" >
                    <th>{{ $t('orders.attribute') }}</th>
                    <th>{{ $t('orders.value') }}</th>
                    <tr>
                      <td><b>#{{ $t('appointments.id') }}</b></td>
                      <td><b>{{ appointmentInfo.appointmentID }}</b></td>
                    </tr>
                    <tr>
                      <td>{{ $t('appointments.status') }}</td>
                      <td><v-chip small :color="getColor(appointmentInfo.appStatus)">{{ $t(`status.${appointmentInfo.appStatus}`) }}</v-chip> </td>
                    </tr>
                    <tr>
                      <td>{{ $t('appointments.serviceArea') }}</td>
                      <td><span>{{ appointmentInfo.servicearea.serviceArea_name }}</span></td>
                    </tr>
                    <tr>
                      <td>{{ $t('appointments.apointmentDate') }}</td>
                      <td>
                        <span>{{ appointmentInfo.appExpectStart.substr(0, 10) }}</span> 
                        <v-chip small color="primary">
                          {{ appointmentInfo.appExpectStart.substr(10, 6) }}
                          <v-icon class="mx-1" small >mdi-arrow-right-bold-outline </v-icon>
                          {{ appointmentInfo.appExpectEnd.substr(10, 6) }}
                        </v-chip>
                       
                      </td>
                    </tr>
                    <tr v-if="appointmentInfo.appStartAt">
                      <td>{{ $t('appointments.workDate') }}</td>
                      <td>
                        <span>{{ appointmentInfo.appStartAt.substr(0, 10) }}</span> 
                        <v-chip small color="primary">
                          {{ appointmentInfo.appStartAt.substr(10, 6) }}
                          <v-icon class="mx-1" small >mdi-arrow-right-bold-outline </v-icon>
                          {{ appointmentInfo.appEndtAt.substr(10, 6) }}
                        </v-chip>
                      </td>
                      <!-- <td><span>{{ appointmentInfo.appStartAt.substr(0, 10) }}</span> <v-icon class="mx-1" small >mdi-arrow-right-bold-outline </v-icon> <span> {{ appointmentInfo.appEndtAt.substr(0, 10) }}</span></td> -->
                    </tr>
                    <tr v-if="!appointmentInfo.order">
                      <td>{{ $t('common.actions') }}</td>
                      <td>
                        <v-btn
                          
                          color="error"
                          rounded
                          outlined
                          small
                          @click="deleteAppointmentDialogStatus = true"
                        > <v-icon small class="mx-1">mdi-delete-empty-outline</v-icon>{{ $t('common.delete') }}</v-btn>
                      </td>
                    </tr>
                  </table>
                  <ConfirmMessage :dialog="deleteAppointmentDialogStatus" :loading="loaderDeleteAppointment" :contant="contantTextDeleteAppointment" @closeConfirmation="closeConfirmationDeleteAppointment($event)" />
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item >
              <v-skeleton-loader
                v-if="orderLoadingData"
                type="article"
              ></v-skeleton-loader>
              <v-card v-if="!orderLoadingData && orderInfo" color="#f9f9f9">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-card style="height: 100%;" class="borderCardInfo">
                        <v-card-title primary-title>
                          {{ $t('orders.basicInfo') }}
                        </v-card-title>
                        <v-card-text>
                          <table class="attributeTable">
                            <tr>
                              <th>{{ $t('orders.attribute') }}</th>
                              <th>{{ $t('orders.value') }}</th>
                            </tr>
                            <tr>
                              <td>#{{ $t('orders.id') }}</td>
                              <td><nuxt-link :to="`/orders/${ orderInfo.orderID }/show`">{{ orderInfo.orderID }}</nuxt-link></td>
                            </tr>
                            <tr v-if=" orderInfo.service[0]">
                              <td>{{ $t('orders.servise') }}</td>
                              <td>{{ orderInfo.service[0]['serviceName'] }}</td>
                            </tr>
                            <tr>
                              <td> {{ $t('orders.appointment') }}</td>
                              <td><span v-if="orderInfo.appointment">{{ orderInfo.appointment.appExpectStart.substr(0, 10) }}</span> <v-chip v-if="orderInfo.appointment" small color="primary">  {{ orderInfo.appointment.appExpectStart.substr(10, 6) }}<v-icon class="mx-1" small >mdi-arrow-right-bold-outline </v-icon> <span> {{ orderInfo.appointment.appExpectEnd.substr(10, 6) }}</span> </v-chip></td>
                            </tr>
                            <tr>
                              <td>{{ $t('orders.executionDate') }}</td>
                              <td><span v-if="orderInfo.appointments">{{ orderInfo.appointments.appStartAt.substr(0, 10) }}</span> <v-chip v-if="orderInfo.appointments" small color="primary">  {{ orderInfo.appointments.appStartAt.substr(10, 6) }}<v-icon class="mx-1" small >mdi-arrow-right-bold-outline </v-icon> <span> {{ orderInfo.appointments.appEndtAt.substr(10, 6) }}</span> </v-chip></td>
                            </tr>
                            <tr>
                              <td>{{ $t('orders.status') }}</td>
                              <td><v-chip small :color="getColor(orderInfo.status)">{{ $t('status.' + orderInfo.status) }}</v-chip></td>
                            </tr>
                            <!-- <tr v-if="orderInfo.assignment">
                              <td>{{ $t('orders.assignment') }}</td>
                              <td><nuxt-link :to="`/assignments/${orderInfo.assignment.assignmentID}/show`">{{ $t('orders.showAssignmentInfo') }}</nuxt-link></td>
                            </tr> -->
                          </table>

                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-card style="height: 100%;" class="borderCardInfo">
                        <v-card-title primary-title>
                          {{ $t('orders.carInfo') }}
                        </v-card-title>
                        <v-card-text >
                          <table class="attributeTable">
                            <tr>
                              <th>{{ $t('orders.attribute') }} </th>
                              <th>{{ $t('orders.value') }}</th>
                            </tr>
                            <tr>
                              <td>{{ $t('orders.plate') }}</td>
                              <td><CarPlate :plate="orderInfo.car.plate" />  </td>
                            </tr>
                            <tr>
                              <td>{{ $t('orders.model') }}</td>
                              <td> {{ orderInfo.car.brandmodel.brand.brandName + ' - ' + orderInfo.car.brandmodel.modelName }} <v-chip class="mx-1" small color="primary">{{ orderInfo.car.brandmodel.segment.segment_name }}</v-chip> </td>
                            </tr>
                            <tr>
                              <td>{{ $t('orders.color') }}</td>
                              <td> 
                                <v-icon
                                  small
                                  style="border: 1px solid #eee; border-radius: 50%; padding:2px;background-color: #fff;"
                                  :color="'#' + orderInfo.car.color.colorCode"
                                >mdi-palette</v-icon>  {{ orderInfo.car.color.colorName }}
                              </td>
                            </tr>
                            <tr>
                              <td>{{ $t('orders.image') }}</td>
                              <td> <v-btn
                                v-if="orderInfo.car.url"
                                small
                                class="carShowBtn"
                                color="primary"
                                icon
                                @click="showCarImageDialog = true"
                              ><v-icon small >mdi-eye</v-icon></v-btn> <span v-text="orderInfo.car.url ? 'Preview Car Image': $t('common.noImage')">  </span></td>
                            </tr>
                            <tr>
                              <td>{{ $t('orders.map') }}</td>
                              <td> <v-btn small icon color="warning" @click="goToLocation(orderInfo.geoPoint)"><v-icon small>mdi-map</v-icon></v-btn> {{ $t('orders.showCarLocation') }}</td>
                            </tr>
                          </table>
                        </v-card-text>
                      </v-card>
                      <ImagePreview v-if="showCarImageDialog" :dialog="showCarImageDialog" :image="orderInfo.car.url || '/images/no-car.png'" @closeCarImage="showCarImageDialog = false" />
                    </v-col>
                    <v-col v-if="orderInfo.user" cols="12" md="6">
                      <v-card style="height: 100%;" class="borderCardInfo">
                        <v-card-title primary-title>
              
                          {{ $t('orders.userInfo') }}
                        </v-card-title>
                        <v-card-text >
                          <table class="attributeTable">
                            <tr>
                              <th>{{ $t('orders.attribute') }} </th>
                              <th>{{ $t('orders.value') }}</th>
                            </tr>
                            <tr>
                              <td>{{ $t('orders.fullName') }}</td>
                              <td>{{ orderInfo.user.fullname }}</td>
                            </tr>
                            <tr>
                              <td>{{ $t('orders.email') }}</td>
                              <td><a :href="'mailto:' + orderInfo.user.email ">{{ orderInfo.user.email }}</a></td>
                            </tr>
                            <tr>
                              <td>{{ $t('orders.phoneNumber') }}</td>
                              <td><a :href="'tel:0' + orderInfo.user.mobile ">{{ orderInfo.user.mobile }}</a></td>
                            </tr>
                          </table>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col v-if="orderInfo.invoice" cols="12" md="6">
                      <v-card style="height: 100%;" class="borderCardInfo">
                        <v-card-title primary-title class="justify-space-between">
              
                          {{ $t('orders.invoiceInfo') }}
                          <v-menu
                            bottom
                            left
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                color="primary"
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon>mdi-dots-vertical</v-icon>
                              </v-btn>
                            </template>

                            <v-list>
                              <v-list-item @click="orderCancel">
                                <v-list-item-title><v-icon color="error">mdi-delete-forever-outline</v-icon>{{ $t('orders.orderCancel') }} </v-list-item-title>
                              </v-list-item>
                              <v-list-item v-if="orderInfo.invoice.successpayment" @click="orderRefunf">
                                <v-list-item-title><v-icon color="warning"> mdi-cash-refund</v-icon> {{ $t('orders.refundMoney') }}</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="makeItPaid">
                                <v-list-item-title><v-icon color="info">mdi-contactless-payment-circle</v-icon>{{ $t('orders.makeItPaid') }}</v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </v-card-title>
                        <v-card-text >
                          <table class="attributeTable">
                            <th>{{ $t('orders.attribute') }} </th>
                            <th>{{ $t('orders.value') }}</th>
                            <tr>
                              <td>{{ $t('orders.paymentType') }}</td>
                              <td>
                                <v-chip v-if="orderInfo.paymentType == 'CREDITCARD'" small color="success">
                                  <v-icon >mdi-credit-card-check-outline</v-icon>
                                  <span class="mx-1"> {{ $t(`orders.${orderInfo.paymentType}`) }}</span>
                                </v-chip>
                                <v-chip v-else-if="orderInfo.paymentType == 'CASH'" small color="warning">
                                  <v-icon >mdi-cash-check</v-icon>
                                  <span class="mx-1"> {{ $t(`orders.${orderInfo.paymentType}`) }}</span>
                                </v-chip>
                                <div v-else>
                                  <span class="info--text">{{ orderInfo.paymentType }}</span>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td>{{ $t('orders.price') }}</td>
                              <td>₺{{ orderInfo.invoice.price }}</td>
                            </tr>
                            <tr>
                              <td>{{ $t('orders.totalPrice') }}</td>
                              <td>₺{{ orderInfo.invoice.totalPrice }}</td>
                            </tr>
                            <tr v-if="orderInfo.invoice.fixedDiscount">
                              <td>{{ $t('orders.fixedDiscount') }}</td>
                              <td>₺{{ orderInfo.invoice.fixedDiscount }}</td>
                            </tr>
                            <tr v-if="orderInfo.invoice.percentageDiscount">
                              <td>{{ $t('orders.percentageDiscount') }}</td>
                              <td>₺{{ orderInfo.invoice.percentageDiscount }}</td>
                            </tr>
                            <tr>
                              <td><b>{{ $t('orders.totalPayment') }}</b></td>
                              <td><b>₺{{ orderInfo.invoice.totalPayment }}</b></td>
                            </tr>
                            <tr>
                              <td><b>{{ $t('orders.paymentStatus') }}</b></td>
                              <td><v-chip small color="success" class="d-inline-block" style="text-transform: capitalize;"><span >{{ $t('status.'+orderInfo.invoice.invoiceStatus) }}</span></v-chip></td>
                            </tr>
                
                          </table>
                        </v-card-text>
                      </v-card>
                      <ConfirmMessage :dialog="deleteOrderDialogStatus" :loading="loaderDeleteOrder" :contant="contantTextDeleteOrder" @closeConfirmation="closeConfirmationDeleteOrder($event)" />
                      <ConfirmMessage :dialog="refundOrderDialogStatus" :loading="loaderRefundOrder" :contant="contantTextRefundOrder" @closeConfirmation="closeConfirmationDeleteRefund($event)" />
                      <ConfirmMessage :dialog="makePaidOrderDialogStatus" :loading="loaderMakePaidOrder" :contant="contantTextMakePaidOrder" @closeConfirmation="closeConfirmationDeleteMakePaid($event)" />

                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <v-card v-if="!orderLoadingData && !orderInfo">
                <v-card-text>
                  <p class="mb-0 text-center">{{ $t('common.noDataAvailable') }}</p>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item >
              <v-skeleton-loader
                v-if="assignmentLoadingData"
                type="article"
              ></v-skeleton-loader>
              <v-card v-if="!assignmentLoadingData && assignmentInfo" color="#f9f9f9">
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-card style="height: 100%;" class="borderCardInfo">
                        <v-card-title primary-title class="justify-space-between">
                          {{ $t('assignments.basicInfo') }}
                          <v-menu
                            bottom
                            left
                          >
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn
                                icon
                                color="primary"
                                v-bind="attrs"
                                v-on="on"
                              >
                                <v-icon>mdi-dots-vertical</v-icon>
                              </v-btn>
                            </template>

                            <v-list>
                              <v-list-item @click="changeAssignmentDialogStatus = true">
                                <v-list-item-title><v-icon color="warning">mdi-swap-horizontal</v-icon>{{ $t('assignments.changeAssignment') }}</v-list-item-title>
                              </v-list-item>
                              <v-list-item @click="deleteAssignmentDialogStatus = true">
                                <v-list-item-title><v-icon color="error">mdi-delete-forever-outline</v-icon>{{ $t('assignments.deleteAssignment') }} </v-list-item-title>
                              </v-list-item>

                            </v-list>
                          </v-menu>
                        </v-card-title>
                        <v-card-text>
                          <table class="attributeTable">
                            <tr>
                              <th>{{ $t('assignments.attribute') }}</th>
                              <th>{{ $t('assignments.value') }}</th>
                            </tr>
                            <tr>
                              <td>#{{ $t('assignments.id') }}</td>
                              <!-- <td>{{ assignmentInfo.assignmentID }}</td> -->
                              <td><nuxt-link :to="`/assignments/${ assignmentInfo.assignmentID }/show`">{{ assignmentInfo.assignmentID }}</nuxt-link></td>
                            </tr>
                            <tr>
                              <td>{{ $t('assignments.status') }}</td>
                              <td><v-chip small :color="getColor(assignmentInfo.assignmentStatus)">{{ $t('status.' + assignmentInfo.assignmentStatus) }}</v-chip></td>
                            </tr>
                            <tr v-if="assignmentInfo.assignmentDoneAt">
                              <td> {{ $t('assignments.assignmentDoneAt') }}</td>
                              <td><span >{{ assignmentInfo.assignmentDoneAt.substr(0, 10) }}</span> <v-chip small color="primary">  {{ assignmentInfo.assignmentDoneAt.substr(10, 6) }}</v-chip></td>
                            </tr>
                            <tr v-if="assignmentInfo.assignmentCancelledAt">
                              <td> {{ $t('assignments.assignmentCancelledAt') }}</td>
                              <td><span >{{ assignmentInfo.assignmentCancelledAt.substr(0, 10) }}</span> <v-chip small color="primary">  {{ assignmentInfo.assignmentCancelledAt.substr(10, 6) }}</v-chip></td>
                            </tr>
                            <tr v-if="assignmentInfo.assignmentCancelledAt">
                              <td> {{ $t('assignments.assignmentCancelled_reason') }}</td>
                              <td><span >{{ assignmentInfo.assignmentCancelled_reason }}</span></td>
                            </tr>
                            <tr>
                              <td>{{ $t('assignments.carServicePlate') }}</td>
                              <td><nuxt-link :to="`/service-cars/${assignmentInfo.serviceCar.serviceCarID}/edit`">{{ assignmentInfo.serviceCar.plateID }}</nuxt-link></td>
                            </tr>
                          </table>

                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-card style="height: 100%;" class="borderCardInfo">
                        <v-card-title primary-title>
                          {{ $t('assignments.empInfo') }}
                        </v-card-title>
                        <v-card-text v-if="assignmentInfo.user">
                          <table class="attributeTable">
                            <tr>
                              <th>{{ $t('assignments.attribute') }} </th>
                              <th>{{ $t('assignments.value') }}</th>
                            </tr>
                            <tr>
                              <td>{{ $t('assignments.fullName') }}</td>
                              <td>{{ assignmentInfo.user.fullname }}</td>
                            </tr>
                            <tr>
                              <td>{{ $t('assignments.email') }}</td>
                              <td><a :href="'mailto:' + assignmentInfo.user.email ">{{ assignmentInfo.user.email }}</a></td>
                            </tr>
                            <tr>
                              <td>{{ $t('assignments.phoneNumber') }}</td>
                              <td><a :href="'tel:0' + assignmentInfo.user.mobile ">{{ assignmentInfo.user.mobile }}</a></td>
                            </tr>
                            <tr v-if="assignmentInfo.user">
                              <td> {{ $t('assignments.loggedIn') }}</td>
                              <td> 
                                <span >{{ assignmentInfo.user.login_at.substr(0, 10) }}</span> <v-chip small color="primary">  {{ assignmentInfo.user.login_at.substr(10, 6) }}</v-chip>
                              </td>
                            </tr>
                          </table>
                        </v-card-text>
                        <v-card-text v-else>
                          <p class="mb-0 text-center">{{ $t('common.noDataAvailable') }}</p>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-card style="height: 100%;" class="borderCardInfo">
                        <v-card-title primary-title>
                          {{ $t('assignments.images') }}
                        </v-card-title>
                        <v-card-text v-if="assignmentInfo.images.length != 0">
                          <div class="d-flex">
                            <div style="width: 80px;" >
                              <div v-for="(item, index) in assignmentInfo.images" :key="index" class="imageGallary" @click="selectedImage = item.url ">
                                <v-img
                                  height="70"
                                  width="80"
                                  wid
                                  :src="item.url"
                                  :lazy-src="item.url"
                                ></v-img>
                              </div>
                            </div>
                            <div class="previewImage" style="width:calc(100% - 90px)">
                              <v-img :lazy-src="selectedImage" :src="selectedImage"></v-img>
                            </div>
                          </div>

                        </v-card-text>
                        <v-card-text v-else>
                          <p class="mb-0 text-center">{{ $t('common.noDataAvailable') }}</p>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>

                  <ConfirmMessage :dialog="deleteAssignmentDialogStatus" :loading="loaderDeleteAssignment" :contant="contantTextDeleteAssignment" @closeConfirmation="closeConfirmationDeleteAssignment($event)" />
                  <ConfirmMessage :dialog="changeAssignmentDialogStatus" :loading="loaderChangeAssignment" :contant="contantTextChangeAssignment" @closeConfirmation="closeConfirmationChangeAssignment($event)" />

                </v-card-text>
              </v-card>
              <v-card v-if="!assignmentLoadingData && !assignmentInfo" >
                <v-card-text>
                  <p class="mb-0 text-center">{{ $t('common.noDataAvailable') }}</p>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item v-if="appointmentInfo.appStatus == 'free'">
              <v-skeleton-loader
                v-if="loadingFastOrder"
                type="article"
              ></v-skeleton-loader>
              <v-card v-else>
                <v-card-text>
                  <v-form ref="form" >
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="urlGoogleMap"
                          outlined
                          dense
                          :rules="[required]"
                          :label="$t('appointments.googleMapUrl')"
                          @input="getLatLngFromUrl(urlGoogleMap)"
                        ></v-text-field>
                        <div v-if="!mapNotValid">
                          <GmapMap
                            :center="mapCenter"
                            :zoom="18"
                            map-type-id="terrain"
                            style="width: 100%; height: 300px"
                          >
                            <GmapMarker
                              :position="mapCenter"
                              :clickable="true"
                            />
                          </GmapMap>
                        </div>
                        <div v-else class="mapNotActive">
                          {{ $t('appointments.mapNotValid') }}
                        </div>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-row>
                          <v-col cols="12" class="py-1 pt-0">
                            <v-text-field
                              v-model="fastOrder.user.mobile"
                              :rules="[required, phoneNumber]"
                              outlined
                              dense
                              placeholder="5510000000"
                              :label="$t('appointments.phoneNumber')"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="6" class="py-1">
                            <v-text-field
                              v-model="fastOrder.user.fname"
                              outlined
                              dense
                              :label="$t('appointments.fname')"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="6" class="py-1">
                            <v-text-field
                              v-model="fastOrder.user.lname"
                              outlined
                              dense
                              :label="$t('appointments.lname')"
                            ></v-text-field>
                          </v-col>
                          <v-col cols="6" class="py-1">
                            <v-autocomplete
                              v-model="fastOrder.service.serviceID"
                              :items="activeServicers"
                              :item-value="'serviceID'"
                              :rules="[required]"
                              :item-text="'serviceName'"
                              outlined
                              dense
                              :label="$t('appointments.service')"
                            ></v-autocomplete>
                          </v-col>

                          <v-col cols="6" class="py-1">
                            <v-autocomplete
                              v-model="fastOrder.car.segmentID"
                              :items="segmentCars"
                              :rules="[required]"
                              :item-value="'segmentID'"
                              :item-text="'segment_name'"
                              outlined
                              dense
                              :label="$t('appointments.segment')"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" class="py-1">
                            <v-btn
                              color="primary"
                              :loading="loading"
                              @click="saveFastOrder"
                            >
                              {{ $t('common.create') }}
                            </v-btn>
                          </v-col>
                       
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
                
              </v-card>
            </v-tab-item>
          </v-tabs-items>

        </v-card>
      </div>
    </v-card>
  </div>
</template>

<script>
import ConfirmMessage from  '~/components/common/dialog/ConfirmMessage'
import CarPlate from  '~/components/common/CarPlate'
import ImagePreview from  '~/components/common/ImagePreview'
import Rules from '~/apps/validation/index'

export default {

  components: {
    ConfirmMessage, CarPlate,ImagePreview
  },
  mixins: [Rules] ,
  data() {
    return {
      tab : 0 ,
      loadingFastOrder : false ,
      loading : false ,
      appLoadingData : false ,
      appointmentInfo : {appStatus : null} ,

      deleteAppointmentDialogStatus : false ,
      loaderDeleteAppointment : false ,
      contantTextDeleteAppointment : {
        title : `<h5>${this.$t('confirm.deleteAppointment')}</h5>` ,
        body : `<p class='mb-0'>${this.$t('confirm.deleteAppointmentText')}</p>` 
      },
      deleteOrderDialogStatus : false ,
      loaderDeleteOrder : false ,
      contantTextDeleteOrder : {
        title : `<h5>${this.$t('confirm.deleteOrder')}</h5>` ,
        body : `<p class='mb-0'>${this.$t('confirm.deleteOrderText')}</p>` 
      },
      orderLoadingData : true ,
      orderInfo :null ,
      assignmentLoadingData : true ,
      assignmentInfo : null ,
      selectedImage : null ,
      showCarImageDialog : false ,
      refundOrderDialogStatus : false ,
      
      loaderRefundOrder : false ,
      contantTextRefundOrder : {
        title : `<h5>${this.$t('confirm.refundOrder')}</h5>` ,
        body : `<p class='mb-0'>${this.$t('confirm.refundOrderText')}</p>` ,
        form :[
          { name :  'amount' , type : 'textfield' , label : 'Amount' , value : '' }
        ]
      },
      makePaidOrderDialogStatus : false ,
      loaderMakePaidOrder : false ,
      contantTextMakePaidOrder : {
        title : `<h5>${this.$t('confirm.makeOrder')}</h5>` ,
        body : `<p class='mb-0'>${this.$t('confirm.makeOrderText')}</p>` 
      },
      deleteAssignmentDialogStatus : false ,
      loaderDeleteAssignment : false ,
      contantTextDeleteAssignment : {
        title : `<h5>${this.$t('confirm.deleteAssignment')}</h5>` ,
        body : `<p class='mb-0'>${this.$t('confirm.deleteAssignmentText')}</p>` ,
        form :[
          { name :  'assignmentCancelled_reason' , type : 'textarea' , label : 'Reason' , value : '' }
        ]
      },

      changeAssignmentDialogStatus : false ,
      loaderChangeAssignment : false ,
      contantTextChangeAssignment : {
        title : `<h5>${this.$t('confirm.changeAssignment')}</h5>` ,
        body : `<p class='mb-0'>${this.$t('confirm.changeAssignmentText')}</p>` ,
        form :[
          { 
            name :  'serviceCarID' , type : 'autocomplete' , label : 'Service Car Plate' , value : '' , autocompleteOptions : 
            {
              api : 'admin/service-car?filter[status]=true&filter[plateID]=', 
              itemText : 'plateID' ,
              itemValue : 'serviceCarID' ,
              items : [] ,
              searcheble : true
            } 
          }
        ]
      },
      activeServicers : [] ,
      segmentCars : [] ,
      urlGoogleMap : '' ,
      mapCenter : { lat:null, lng:null } ,
      mapNotValid : true ,
      fastOrder : {
        user : {
          mobile : '' ,
          fname : null ,
          lname : null
        },
        car : {
          segmentID : null
        },
        service : {
          serviceID : null 
        },
        appointment : {
          uuid : null
        },
        geopoint : {
          latitude : null ,
          longitude : null
        }
      }
    }
  },
  created() {
    this.getAppointmentInfo()
  },
  methods: {
    getAppointmentInfo() {
      this.appLoadingData = true
      this.$axios
        .$get(`/admin/appointment/${this.$route.params.id}`)
        .then((res) => {
          this.appointmentInfo = res.data
          this.fastOrder.appointment.uuid = this.appointmentInfo.uuid
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.appLoadingData = false
        })
    },
    closeConfirmationDeleteOrder(status) {
      if (status) {
        this.loaderDeleteOrder = true
        this.$axios.$delete(`/admin/order/${this.orderInfo.orderID}`).then(() => {
          this.deleteOrderDialogStatus = false
          this.$store.dispatch('showSuccess', this.$t('common.success'))
          this.getOrderInfo()
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loaderDeleteOrder = false
        })
      }
      else {
        this.deleteOrderDialogStatus = false
      }
    },
    closeConfirmationDeleteAppointment(status) {
      if (status) {
        this.loaderDeleteAppointment = true
        this.$axios.$delete(`/admin/appointment/${this.appointmentInfo.appointmentID}`).then(() => {
          this.deleteAppointmentDialogStatus = false
          this.$store.dispatch('showSuccess', this.$t('common.success'))
          this.$router.go(-1)
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loaderDeleteAppointment = false
        })
      }
      else {
        this.deleteOrderDialogStatus = false
      }
    },
    closeConfirmationDeleteRefund(status) {
      if (status) {
        this.loaderRefundOrder = true

        const index = this.contantTextRefundOrder.form.findIndex( (object) => {
          return object.name === 'amount'
        })

        const data = {
          form : { 'amount' : this.contantTextRefundOrder.form[index]['value'] , '_method': 'DELETE' }
        }

        this.$axios.$post(`/admin/payment/${this.orderInfo.invoice.successpayment.paymentID}` , data.form).then(() => {
          this.refundOrderDialogStatus = false
          this.$store.dispatch('showSuccess', this.$t('common.success'))
          this.contantTextRefundOrder.form[index]['value'] = null
          this.getOrderInfo()
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loaderRefundOrder = false
        })
      }
      else {
        this.refundOrderDialogStatus = false
      }
    },
    closeConfirmationDeleteMakePaid(status) {
      if (status) {
        this.loaderMakePaidOrder = true
        this.$axios.$put(`/admin/order/${this.orderInfo.orderID}}`).then(() => {
          this.makePaidOrderDialogStatus = false
          this.$store.dispatch('showSuccess', this.$t('common.success'))
          this.getOrderInfo()
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loaderMakePaidOrder = false
        })
      }
      else {
        this.makePaidOrderDialogStatus = false
      }
    },
    getColor(status) {
      if (status === 'free') {
        return 'info'
      }
      else if (status === 'done') {
        return 'success'
      }
      else if (status === 'reserved') {
        return 'waiting'
      }
      else if (status === 'active') {
        return 'warning'
      }
      else if (status === 'refund') {
        return 'warning'
      }
      else if (status === 'pending') {
        return 'info'
      }
      else if (status === 'cancelled') {
        return 'error'
      } else {
        return 'light'
      }
      
    },
    getOrderInfo() {
      this.orderInfo = null
      this.assignmentInfo = null 
      if (!this.appointmentInfo.order) {
        this.orderLoadingData = false
        this.assignmentLoadingData = false

        return
      }
      this.orderLoadingData = true
      this.$axios
        .$get(`/admin/order/${this.appointmentInfo.order.orderID}`)
        .then((res) => {
          this.orderInfo = res.data
          this.getAssignmentInfo()
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.orderLoadingData = false
        })
    },
    getAssignmentInfo() {
      if (!this.orderInfo.assignment) {
        this.assignmentLoadingData = false

        return
      }

      this.assignmentLoadingData = true
      this.$axios
        .$get(`/admin/assignment/${this.orderInfo.assignment.assignmentID}`)
        .then((res) => {
          this.assignmentInfo = res.data
          this.selectedImage = this.assignmentInfo['images'].length !== 0 ?  this.assignmentInfo['images'][0]['url'] : null
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.assignmentLoadingData = false
        })
    },
    orderCancel() {
      this.deleteOrderDialogStatus = true
    },
    orderRefunf() {
      this.refundOrderDialogStatus = true
    },
    makeItPaid() {
      this.makePaidOrderDialogStatus = true
    },
    closeConfirmationDeleteAssignment(status) {
      if (status) {
        this.loaderDeleteAssignment = true
        const index = this.contantTextDeleteAssignment.form.findIndex( (object) => {
          return object.name === 'assignmentCancelled_reason'
        })
        const data = {
          form : { 'assignmentCancelled_reason' : this.contantTextDeleteAssignment.form[index]['value'] , '_method': 'DELETE' }
        }

        this.loaderDeleteAssignment = true
        this.$axios.$post(`/admin/assignment/${this.assignmentInfo.assignmentID}` , data.form).then(() => {
          this.deleteAssignmentDialogStatus = false
          this.$store.dispatch('showSuccess', this.$t('common.success'))
          this.contantTextDeleteAssignment.form[index]['value'] = null
          this.getAssignmentInfo()
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loaderDeleteAssignment = false
        })
      }
      else {
        this.deleteAssignmentDialogStatus = false
      }
    },
    closeConfirmationChangeAssignment(status) {
      if (status) {
        this.loaderChangeAssignment = true
        const index = this.contantTextChangeAssignment.form.findIndex( (object) => {
          return object.name === 'serviceCarID'
        })
        const data = {
          form : { 'serviceCarID' : this.contantTextChangeAssignment.form[index]['value'] }
        }

        this.loaderChangeAssignment = true
        this.$axios.$put(`/admin/assignment/${this.assignmentInfo.assignmentID}` , data.form).then(() => {
          this.getAssignmentInfo()
          this.changeAssignmentDialogStatus = false
          this.$store.dispatch('showSuccess', this.$t('common.success'))
          this.contantTextChangeAssignment.form[index]['value'] = null
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        }).finally(() => {
          this.loaderChangeAssignment = false
        })
      }
      else {
        this.changeAssignmentDialogStatus = false
      }
    },
    goToLocation(coordinates ) {
      const urlSuffix = coordinates .latitude + ', ' + coordinates .longitude

      window.open(
        'https://www.google.com/maps/search/?api=1&query=' + urlSuffix,
        '_blank'
      )
    },
    getLatLngFromUrl() {
      const apiKey = process.env.GOOGLE_API_KEY
      const plusCode = this.urlGoogleMap
      const arrayCode =  this.urlGoogleMap.substring(0, this.urlGoogleMap.indexOf(' ')).split('+')

      if (arrayCode.length !== 2 ) {
        this.mapNotValid = true
        this.mapCenter.lat = this.fastOrder.geopoint.latitude = null
        this.mapCenter.lng = this.fastOrder.geopoint.longitude = null    

        return
      }
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(plusCode)}&key=${apiKey}`

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          const { lat, lng } = data.results[0].geometry.location

          this.mapNotValid = false
          this.mapCenter.lat = this.fastOrder.geopoint.latitude = lat
          this.mapCenter.lng = this.fastOrder.geopoint.longitude = lng    

        })
        .catch((error) => {
          this.mapNotValid = true
          this.mapCenter.lat = this.fastOrder.geopoint.latitude = null
          this.mapCenter.lng = this.fastOrder.geopoint.longitude = null    
        })

    },
    getActiveServicers() {
      this.loadingFastOrder = true
      this.$axios
        .$get('/admin/service?filter[status]=true&page[size]=1000')
        .then((res) => {
          this.activeServicers = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })
        .finally(() => {
          this.loadingFastOrder = false
        })
      this.getSegmentCar()

    },
    getSegmentCar() {
      this.$axios
        .$get('/admin/segment?page[size]=1000')
        .then((res) => {
          this.segmentCars = res.data
        }).catch((err) => {
          this.$store.dispatch('showError', err.response.data.message)
        })

    },
    saveFastOrder() {
      if (this.$refs.form.validate()) {
        
        this.loadingFastOrder = true
        this.$axios
          .$post('/admin/fast-order' , this.fastOrder)
          .then((res) => {
            this.$store.dispatch('showSuccess' , res.message)
            this.$router.go(-1)
          }).catch((err) => {
            this.$store.dispatch('showError', err.response.data.message)
          })
          .finally(() => {
            this.loadingFastOrder = false
          })
      } else {
        this.$store.dispatch('showError', this.$t('rules.dataNotValid'))
      }

    }
  }
}
</script>
<style >
  .imageGallary{
    border: 2px solid #e9e9e9 ;
    border-radius: 6px;
    padding: 3px;
    overflow: hidden;
    margin-bottom: 7px;
    cursor: pointer;
  }
  .imageGallary:last-of-type{
    margin-bottom: 0;
  }
  .imageGallary .v-image{
    border-radius: 4px;
  }
  .previewImage{
    border: 2px solid #e9e9e9 ;
    border-radius: 6px;
    padding: 3px;
    margin-left: 10px;
  }
  .previewImage .v-image{
    border-radius: 4px;
  }
  .mapNotActive{
    border: 1px solid #9e9e9e;
    height: 300px;
    border-radius: 5px;
    text-align: center;
    line-height: 300px;
    background: #32323247;
  }
</style>