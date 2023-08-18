<template>
  <div class="app">
    <SearchBar @submitSearch="handleSearch" />

    <div class="result" v-if="!activeSearch">
      <Overview
        :icon="activeOverview.weather"
        :date="activeOverview.date"
        :temp="activeOverview.temp"
        :temp_min="activeOverview.temp_min"
        :temp_max="activeOverview.temp_max"
        :wind="activeOverview.wind"
        :rain="activeOverview.rain"
        :humidity="activeOverview.humidity"
        :location="`${city.name}, ${city.country}`"
        :activeDay="activeDay"
      />
      <Forecast
        :days="forecast"
        @setActiveDay="setActiveDay"
        :activeDay="activeDay"
      />
      <Trend :list="activeTrend" />
    </div>

    <div class="searchRes" v-if="activeSearch">
      <div class="result" v-for="(city, index) in cities" :key="index">
        <SearchResult
          :name="city.name"
          :lat="city.lat"
          :lon="city.lon"
          :country="city.country"
          :state="city.state"
          @chooseCity="chooseCity"
        />
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
import Icon from './components/Icon.vue';
import HumidityIcon from './assets/stats/humidity.svg';
import RainIcon from './assets/stats/rain.svg';
import WindIcon from './assets/stats/wind.svg';
import Forecast from './components/Forecast.vue';
import Overview from './components/Overview.vue';
import Trend from './components/Trend.vue';
import SearchBar from './components/SearchBar.vue';
import SearchResult from './components/SearchResult.vue';

export default {
  components: {
    Icon,
    HumidityIcon,
    RainIcon,
    WindIcon,
    Forecast,
    Overview,
    Trend,
    SearchBar,
    SearchResult,
  },
  data() {
    return {
      forecast: [],
      current: {},
      activeDay: 0,
      activeSearch: true,
      cities: [],
    };
  },
  computed: {
    activeOverview() {
      if (this.activeDay === 0) {
        return this.current;
      } else {
        return this.forecast[this.activeDay];
      }
    },
    activeTrend() {
      return this.forecast[this.activeDay] ? this.forecast[this.activeDay].list : [];
    },
  },
  methods: {
    setActiveDay(index) {
      this.activeDay = index;
    },
    handleSearch(search) {
      this.activeSearch = true;
      this.activeDay = 0
      this.getCoordinatesFromService(search);
    },
    async chooseCity({ lat, lon }) {
      const { data: response } = await axios.get(`
        http://${window.location.hostname}:8000/forecast?lat=${lat}&lon=${lon}
      `)
      if (!response.data.forecast) return
      this.current = response.data.current
      this.forecast = response.data.forecast
      this.city = response.data.city
      this.activeSearch = false
    },
    async getCoordinatesFromService(search) {
      const { data: response } = await axios.get(
        `http://${window.location.hostname}:8000/geocode?city=${search}`
      );
      this.cities = response.data;
    },
  },
  mounted() {},
};
</script>

<style>
.app {
  padding-top: 80px;
  position: relative;
}
</style>
