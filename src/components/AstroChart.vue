<template>
  <div>
    <div class="date-display">
      <b>{{ formattedDate }}</b><br><br>
      <div class="location-picker-container">
        <label for="location">Location:</label>
        <select id="location" v-model="selectedLocationCity">
          <option disabled value="">Please select a location</option>
          <option v-for="(coords, city) in locations" :value="city" :key="city">{{ city }}</option>
        </select>
      </div>
    </div>
    <div class="datepicker-container">
      <vue3-datepicker v-model="selectedDate" :format="formatDate"></vue3-datepicker>
      <label for="hour">Hour:</label>
      <input id="hour" type="range" min="0" max="23" v-model.number="selectedHour" class="slider"> <br>
      <label for="minute">Mins:</label>
      <input id="minute" type="range" min="0" max="59" v-model.number="selectedMinute" class="slider">
    </div>
    <div id="paper"></div>
  </div>
</template>

<script>
import axios from 'axios';
import vue3Datepicker from 'vue3-datepicker'
import { Chart } from '@astrodraw/astrochart';

export default {
  components: {
    vue3Datepicker
  },
  data() {
    return {
      selectedDate: new Date(),
      selectedHour: 0,
      selectedMinute: 0,
      selectedLocationCity: 'New York',
      selectedLocation: {lat: 40.7128, lon: -74.0060},
      locations: {
        'New York': {lat: 40.7128, lon: -74.0060},
        'Mumbai': {lat: 19.0760, lon: 72.8777},
        'London': {lat: 51.5074, lon: -0.1278},
      },      
      chart: null,
      data: {
        planets: {},
        cusps: [],
      },
    };
  },
  computed: {
    formattedDate() {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      const formattedDate = this.selectedDate.toLocaleDateString('en-US', options)
      const hours = this.selectedHour > 12 ? this.selectedHour - 12 : this.selectedHour
      const minutes = this.selectedMinute < 10 ? '0' + this.selectedMinute : this.selectedMinute
      const ampm = this.selectedHour >= 12 ? 'PM' : 'AM'
      return `${formattedDate} ${hours}:${minutes} ${ampm}`
    },
  },
  methods: {
    async fetchPlanets() {
      try {
        const response = await axios.post('http://localhost:3087/planets', {
          date: {
            year: this.selectedDate.getFullYear(),
            month: this.selectedDate.getMonth() + 1, // JavaScript months are 0-indexed
            day: this.selectedDate.getDate(),
            hour: this.selectedHour,
            minute: this.selectedMinute
          }
        });
        const planets = response.data;
        const planetNames = ["SE_SUN", "SE_MOON", "SE_MERCURY", "SE_VENUS", "SE_MARS", "SE_JUPITER", "SE_SATURN", "SE_URANUS", "SE_NEPTUNE", "SE_PLUTO"];
        const planetData = {};
        planetNames.forEach(planet => {
          if(planets[planet]) {
            const titleCaseName = planet.slice(3).charAt(0).toUpperCase() + planet.slice(4).toLowerCase();
            planetData[titleCaseName] = [planets[planet].longitude];
          }
        });
        this.data.planets = planetData;
      } catch (error) {
        console.error('An error occurred while fetching coordinate data for the planets:', error);
      }
    },
    async fetchHouses() {
      try {
        const response = await axios.post('http://localhost:3087/houses', {
          date: {
            year: this.selectedDate.getFullYear(),
            month: this.selectedDate.getMonth() + 1, // JavaScript months are 0-indexed
            day: this.selectedDate.getDate(),
            hour: this.selectedHour,
            minute: this.selectedMinute
          },
          lat: this.locations[this.selectedLocationCity].lat,
          lon: this.locations[this.selectedLocationCity].lon
        });
        const houses = response.data.houses.house;
        this.data.cusps = houses;
      } catch (error) {
        console.error('An error occurred while fetching coordinates data for the houses:', error);
      }
    },
    async fetchData() {
      await this.fetchPlanets();
      await this.fetchHouses();
      this.chart.radix(this.data);
    }
  },
  watch: {
    selectedDate: {
      handler() {
        this.fetchData();
      },
      deep: true,
    },
    selectedHour: 'fetchData',
    selectedMinute: 'fetchData',
    selectedLocationCity: {
      handler() {
        this.fetchData();
      },
      deep: true,
    },
  },
  mounted() {
    this.chart = new Chart('paper', 800, 800);
    this.fetchData();
  },
};
</script>


<style scoped>
#paper {
  width: 1000px;
  height: 1000px;
  margin-top: 2%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.datepicker-container {
  position: absolute;
  top: 20px;
  left: 20px;
}

.date-display {
  position: absolute;
  top: 20px;
  right: 2%;
  font-size: 20px;
}

.location-picker-container {
  text-align: right;
}
.slider {
  width: 200%; /* Double the length */
}
</style> 