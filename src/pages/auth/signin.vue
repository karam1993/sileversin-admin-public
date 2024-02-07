<template>
  <div>
    <v-card class="text-center pa-1">
      <v-card-title class="justify-center display-1 mb-2">{{
        $t("login.welcome")
      }}</v-card-title>
      <v-card-subtitle>{{ $t("login.subtitle") }}</v-card-subtitle>
      <v-card-text>
        <v-form ref="form" v-model="isFormValid" lazy-validation>
          <v-text-field
            v-model="email"
            :rules="[required]"
            :validate-on-blur="false"
            :label="$t('login.email')"
            name="email"
            outlined
            dense
            @keyup.enter="Submit"
          ></v-text-field>

          <v-text-field
            v-model="password"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[required, passwordCounter]"
            :type="showPassword ? 'text' : 'password'"
            :label="$t('login.password')"
            name="password"
            outlined
            dense
            @keyup.enter="Submit"
            @click:append="showPassword = !showPassword"
          ></v-text-field>

          <v-btn
            :loading="isLoading"
            block
            dense
            color="primary"
            @click="Submit"
          >{{ $t("login.button") }}</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Rules from '~/apps/validation/index'

export default {
  layout: 'auth',
  mixins: [Rules],
  data() {
    return {
      isLoading: false,
      isFormValid: true,
      // email: 'karam.sawan.sy@gmail.com',
      email: '',
      // password: '123456',
      password: '',
      showPassword: false
    }
  },
  methods: {
    Submit() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        this.$auth
          .loginWith('local', {
            data: { email: this.email, password: this.password }
          })
          .then((res) => {
            this.$store.dispatch('showSuccess', this.$t('login.success'))
            this.$router.push(this.localePath('index'))
          })
          .catch(() => {
            this.$store.dispatch('showError', this.$t('login.error'))
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    }
  },
  head() {
    return {
      title: 'Login'
    }
  }
}
</script>
