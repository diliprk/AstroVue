<template>
  <div>
  <div class="input-container">
    <br><br><br><br><br>
    <label for = "name"> Name:      </label>
    <input id = "name" type="text" v-model="subject.name" placeholder="Name">
    <div class="location-picker-container">
      <label for="location">Location: </label>
      <select id="location" v-model="selectedLocationCity">
        <option disabled value="">Please select a location</option>
        <option v-for="(coords, city) in locations" :value="city" :key="city">{{ city }}</option>
      </select>
    </div>      
    <div class="datepicker-container">
      <label for = "datepicker-container"> <b>Select Date:</b>     </label>
      <vue3Datepicker v-model="selectedDate" :format="formatDate"></vue3Datepicker><br>
      <label for="hour">Hour:</label>
      <input id="hour" type="range" min="0" max="23" v-model.number="selectedHour" class="slider"> <br>
      <label for="minute">Mins:</label>
      <input id="minute" type="range" min="0" max="59" v-model.number="selectedMinute" class="slider"><br>
      <label for="second">Secs:</label>
    <input id="second" type="range" min="0" max="59" v-model.number="selectedSecond" class="slider">
    </div>
    <div class="ayanamsa-settings">
      <label> <b>Chart Settings</b> <br><br></label>
      <label for="ayanamsa">Ayanamsa:   </label>
      <select id="ayanamsa" v-model="selectedAyanamsa">
      <option disabled value="">Please select an ayanamsa</option>
      <option v-for="ayanamsa in ayanamsas" :value="ayanamsa" :key="ayanamsa">{{ ayanamsa }}</option>
      </select>
      </div>
    <div class="housesystem-settings">
      <br>
      <label for="houseSystem">House System:  </label>
      <select id="houseSystem" v-model="selectedHouseSystem">
      <option disabled value="">Please select a house system</option>
      <option v-for="houseSystem in houseSystems" :value="houseSystem" :key="houseSystem">{{ houseSystem }}</option>
      </select>
      <br><br>
      <label for="showZodiacDetails">Show Zodiac Details:</label>
      <select id="showZodiacDetails" v-model="showZodiacDetails">
      <option disabled value="">Please select an option</option>
      <option v-for="option in zodiacDetailsOptions" :value="option" :key="option">{{ option }}</option>
      </select>
      <br><br>
      <label for = "showHouses">Show Houses:</label>
      <Toggle id = "showHouses" v-model="showHouses" class="show-houses-toggle"/>
      <br>
    <!-- Tab Controls -->
    <div class="tabs">
      <br>
      <label for = "tabs"> <b>Select DataTable:</b></label><br><br>
      <button 
        v-for="tab in tabs" 
        :key="tab" 
        @click="currentTab = tab" 
        :class="{ active: currentTab === tab }">
        {{ tab }}
      </button>
    </div>
    <!-- Child Tabs for Planets -->
    <div class="tabs" v-if="currentTab === 'Planets'">
      <button 
        v-for="childTab in planetsChildTabs" 
        :key="childTab" 
        @click="currentChildTab = childTab" 
        :class="{ active: currentChildTab === childTab }">
        {{ childTab }}
      </button>
    </div>
    <!-- Child Tabs for Houses -->
    <div class="tabs" v-if="currentTab === 'Houses'">
      <button 
        v-for="childTab in housesChildTabs" 
        :key="childTab" 
        @click="currentChildTab = childTab" 
        :class="{ active: currentChildTab === childTab }">
        {{ childTab }}
      </button>  
    </div>    
    <!-- Conditional Rendering Based on Selected Tab -->
    <div class="tab-content">
      <!-- Conditional rendering for Planets child tabs -->
      <div v-if="currentTab === 'Planets'">
        <PlanetSignificators v-if="currentChildTab === 'Significators'" :planetSignificatorsData="planet_significators" />
        <PlanetsDataTable v-if="currentChildTab === 'Positions'" :planetsData="planets_data" />
        <PlanetAspects v-if="currentChildTab === 'Aspects'" :planetaryAspectsData="planet_aspects" />
      </div>
      <!-- Conditional rendering for Houses chil  d tabs -->
      <div v-if="currentTab === 'Houses'">
        <HouseSignificators v-if="currentChildTab === 'Significators'" :houseSignificatorsData="house_significators" />
        <HousesDataTable v-if="currentChildTab === 'Positions'" :housesData="houses_data" />
        <!-- Existing Positions content or component -->
      </div>
      </div>                   
    </div>
  </div>
  <div class="chart-container"> </div>
  <div class="dasa-table">
      <br><br>
      <label for = "dasa-table"> <b>VimshottariDasa:</b></label>
      <VimshottariDasaTable :vimsoDasaData="vimso_dasa_data"/> 
  </div>           
</div>
</template>


<script>
import * as d3 from 'd3';
import axios from 'axios';
import locations from '../utc_locations.js';
import Toggle from '@vueform/toggle';
import vue3Datepicker from 'vue3-datepicker';
import PlanetsDataTable from './PlanetsDataTable.vue';
import PlanetSignificators from './PlanetSignificators.vue';
import PlanetAspects from './PlanetAspects.vue';
import HousesDataTable from './HousesDataTable.vue';
import HouseSignificators from './HouseSignificators.vue';
import VimshottariDasaTable from './VimshottariDasaTable.vue';

// import locationService from '../locationService.js'; 

export default {
  components: {
    vue3Datepicker,
    Toggle,
    PlanetsDataTable,
    HousesDataTable,
    PlanetSignificators,
    PlanetAspects,
    HouseSignificators,
    VimshottariDasaTable,    
  },
  data() {
    return {
      selectedDate: new Date(),
      selectedHour: 0,
      selectedMinute: 0,
      selectedSecond: 0,
      selectedLocationCity: 'Coimbatore',
      locations : locations,
      selectedAyanamsa: 'Lahiri',
      selectedHouseSystem: 'Placidus',
      showHouses: true,
      showZodiacDetails: 'Symbols',
      zodiacDetailsOptions: ['None', 'English', 'Symbols'],           
      ayanamsas: ["Lahiri","Krishnamurti", "Raman", "FaganBradley", "Deluce", "Sassanian", 
                  "Aldebaran15Taurus", "GalacticCenter_05_Sag"],
      houseSystems: ["Placidus", "Koch", "Porphyrius", "Regiomontanus", "Campanus", "Equal", "Equal 2", 
                     "Vehlow Equal", "Whole Sign", "Meridian", "Azimuthal", "Polich Page", "Alcabitus", "Morinus"],
      subject: {name: "John Doe"},
      currentTab: 'Planets',
      currentChildTab: 'Positions', // Default child tab
      tabs: ['Planets', 'Houses'],
      planetsChildTabs: ['Positions', 'Significators', 'Aspects'],
      housesChildTabs: ['Positions', 'Significators'], 
      planets: [],
      planets_data: [],
      planet_significators:[],
      planet_aspects: [],
      houses: [],
      houses_data: [],
      house_significators: [],
      vimso_dasa_data : []
    };
  },
  computed: {
    selectedLocation() {
      return this.locations[this.selectedLocationCity];
    },
    dateWithTime() {
      let dateWithTime = new Date(this.selectedDate);
      dateWithTime.setHours(this.selectedHour, this.selectedMinute, this.selectedSecond);
      return dateWithTime;
    },
    innerTexts() {
      return [
        {label: "Name: ", value: this.subject.name},
        {label: "Time: ", value: this.formatDate(this.dateWithTime)},
        {label: "Location: ", value: this.selectedLocationCity},
        {label: "Lat, Lon: ", value: `${this.selectedLocation.lat}, ${this.selectedLocation.lon}`},
      ];
    },
  },  
  async created() {
    this.fetchChartData();
  },
  
  mounted() {
    this.drawAstroChart();
  },
  watch: {
    planets: {
      handler() {
        this.drawAstroChart();
      },
      deep: true,
    },
    'subject.name': {
      handler() {
        this.drawAstroChart();
      },
      deep: true,
    },
    selectedDate: {
      handler() {
        this.fetchChartData();
      },
      deep: true,
    },
    selectedHour: 'fetchChartData',
    selectedMinute: 'fetchChartData',
    selectedSecond: 'fetchChartData',
    selectedAyanamsa: 'fetchChartData',
    showHouses: 'fetchChartData',
    selectedHouseSystem: 'fetchChartData',
    selectedLocationCity: {
      handler(newCity) {
      this.selectedLocation = this.locations[newCity];
      this.fetchChartData();
      },
      deep: true,
    },
    showZodiacDetails: {
      handler() {
        this.drawAstroChart();
      },
      deep: true,
    },
  },
  methods: {
    selectParentTab(tab) {
    this.currentTab = tab;
    // Reset child tab based on the selected parent tab
    if (tab === 'Planets') {
      this.currentChildTab = 'Positions';
    } else if (tab === 'Houses') {
      this.currentChildTab = 'Positions';
    }
  },
    async fetchChartData() {
      const apiData = {
        year: this.selectedDate.getFullYear(),
        month: this.selectedDate.getMonth() + 1, // JavaScript months are 0-indexed
        day: this.selectedDate.getDate(),
        hour: this.selectedHour,
        minute: this.selectedMinute,
        second: this.selectedSecond,
        latitude: this.selectedLocation.lat,
        longitude: this.selectedLocation.lon,
        utc: this.selectedLocation.utc,
        ayanamsa: this.selectedAyanamsa,
        house_system: this.selectedHouseSystem
      };

      const response = await axios.post('http://127.0.0.1:8088/get_all_horoscope_data', apiData);

      // Transform the response data into the format expected by your chart
      this.planets = Object.entries(response.data.consolidated_chart_data).flatMap(([sign, bodies]) => 
          Object.entries(bodies)
            .filter(([body]) => {
            // Exclude unwanted bodies
            if (['Pluto', 'Syzygy', 'Chiron'].includes(body)) {
              return false;
            }
            // Exclude houses if showHouses is false
            if (!this.showHouses && /\b[IVX]+\b/.test(body)) {
              return false;
            }
            return true;
          })
            .map(([body, data]) => ({
              name: body,
              degree: data.SignLonDecDeg,
              sign: sign
            }))
        );

      // Assign the second response to planets_data
      this.planets_data = response.data.planets_data
        .filter(planet => !['Pluto', 'Syzygy', 'Chiron'].includes(planet.Object))
        .map(planet => {
          if (planet.isRetroGrade) {
            return {
              ...planet,
              Object: `${planet.Object} [R]`
            };
          } else {
            return planet;
          }
        });
        
      this.planet_significators = response.data.planet_significators;
      this.planet_aspects = response.data.planetary_aspects;
      // Assign the houses data from the response
      this.houses_data = response.data.houses_data;
      this.house_significators = response.data.house_significators;
      // Redraw the chart with the new data
      this.drawAstroChart();

      this.vimso_dasa_data = response.data.vimshottari_dasa_table;
    },
    // formatDate(date) {
    //   const options = { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false};
    //   return date.toLocaleDateString('en-IN', options);
    // },    
    formatDate(date) {
    const year = date.getFullYear();
    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    return `${day} ${month} ${year}, ${hour}:${minute}:${second}`;
  },

  drawAstroChart() {
    // Clear the previous chart
    d3.select('.chart-container').selectAll('*').remove();

    // Sort the planets by degree in descending order
    this.planets.sort((a, b) => b.degree - a.degree);

     // Create a new date that includes the selected time
    let dateWithTime = new Date(this.selectedDate);
    dateWithTime.setHours(this.selectedHour, this.selectedMinute, this.selectedSecond);

    // Create the SVG container
    var svg = d3.select(".chart-container").append("svg")
      .attr("width", 510) // Adjusted to accommodate 1.5 pixel gaps
      .attr("height", 510) // Adjusted to accommodate 1.5 pixel gaps
      .style("margin", "auto")
      .style("display", "block");

    // Create a group for each box
    var groups = svg.selectAll("g")
      .data(d3.range(16)) // now we need 16 squares
      .enter()
      .append("g")
      .attr("transform", function(d, i) {
        var x = (i % 4) * 127.5, // Adjusted for the 1.5 pixel gap
            y = Math.floor(i / 4) * 127.5; // Adjusted for the 1.5 pixel gap
        return "translate(" + [x, y] + ")";
      });

    // Draw the boxes
    groups.filter(function(d, i) { return i < 4 || i > 11 || (i % 4 !== 1 && i % 4 !== 2); }) // only draw the outer boxes
      .append("rect")
      .attr("width", 125) // Adjusted for the 1.5 pixel gap
      .attr("height", 125) // Adjusted for the 1.5 pixel gap
      .style("stroke", "black")
      .style("fill", "#F0FFFF");

    // Label the boxes with the zodiac signs
    var signs = ["Gemini","Aquarius","Cancer","Capricorn", "Leo", "Sagittarius", "Scorpio", "Libra", "Virgo", "Pisces", "Aries", "Taurus"];
    var symbols = ["e", "a", "f", "l", "g", "k", "j", "i", "h", "b", "c", "d"];

    var signLabels = groups.filter(function(d, i) { return i < 4 || i > 11 || (i % 4 !== 1 && i % 4 !== 2); }) 
      .append("text")
      .attr("x", 62.5) // Center of the box
      .attr("y", 62.5) // Center of the box
      .attr("text-anchor", "middle") // Center the text
      .attr("opacity", 0.25) // Reduce opacity
      .text(function(d, i) {
        if (this.showZodiacDetails === 'None') {
          return '';
        } else if (this.showZodiacDetails === 'Symbols') {
          return symbols[(i + 9) % 12];
        } else {
          return signs[(i + 9) % 12];
        }
      }.bind(this));

    if (this.showZodiacDetails === 'English') {
        signLabels.style("transform", "translateY(40px)") // Shift down by 20px
                  .style("fill", "royalblue") // Use fill instead of color
        }

    // Apply the ZodiacSigns font when 'Symbols' is selected
    if (this.showZodiacDetails === 'Symbols') {
        signLabels.style("font-family", "ZodiacSigns")
                  .style("transform", "translateY(20px)") // Shift down by 20px
                  .style("font-size", "400%")
                  .style("fill", "royalblue") // Use fill instead of color
        }

    // Add the planets to the boxes
    groups.filter(function(d, i) { return i < 4 || i > 11 || (i % 4 !== 1 && i % 4 !== 2); })
      .selectAll("text.planet")
      .data(function(d, i) {
        // Filter the planets for the current sign
        return this.planets.filter(planet => planet.sign === signs[(i + 9) % 12]);
      }.bind(this))
      .enter()
      .append("text")
      .attr("class", "planet")
      .attr("x", 10)
      .attr("y", function(d, i) { return 40 + i * 20; }) // Position the planets below the sign name
      .style("fill", function(d) {
      // Check if the name of the planet matches a Roman numeral
        return /\b[IVXLCDM]+\b/.test(d.name) ? "red" : "black"; // Use red for houses, black for others
      })
      .text(function(d) {
        return d.name + " " + d.degree.toFixed(2) + "\u00B0"; // Use unicode for degree symbol
      });
      
    // Add the subject details to the middle of the SVG
    // Check if selectedDate is defined
    if (this.selectedDate) {
      // Create a new date that includes the selected time
      let dateWithTime = new Date(this.selectedDate);
      dateWithTime.setHours(this.selectedHour, this.selectedMinute, this.selectedSecond);

      // Use the new date in the innerTexts array
      var innerTexts = [
        {label: "Name: ", value: this.subject.name},
        {label: "Time: ", value: this.formatDate(dateWithTime)},
        {label: "Location: ", value: this.selectedLocationCity},
        {label: "Lat, Lon: ", value: `${this.locations[this.selectedLocationCity].lat}, ${this.locations[this.selectedLocationCity].lon}`},
      ];
  }
  
    svg.selectAll("text.inner")
    .data(innerTexts)
    .enter()
    .append("text")
    .attr("class", "inner")
    .attr("x", 255) // Center of the chart
    .attr("y", function(d, i) { return 255 + (i - 1) * 30; }) // Position the details below each other
    .attr("text-anchor", "middle") // Center the text
    .html(function(d) { 
      return `<tspan style="font-weight:bold">${d.label}</tspan>${d.value}`; 
        });
      },
    },
  };

</script>


<style scoped>
@font-face {
  font-family: 'ZodiacSigns';
  src: url('~@/assets/ZodiacSigns.ttf') format('truetype');
}

#inputFields {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  height: 10vh; 
}

body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  margin: 0;
  position: relative;
}


.dasa-table {
  /* You might want to set a specific width or max-width here */
  /* width: auto; */
  margin: 0 auto; /* This will center the table */
  display: block; /* Ensure it's treated as a block-level element */  
  max-width: 960px;
}
.chart-container {
  position: absolute;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
}

.tabs button {
  padding: 10px;
  border: none;
  background-color: #f0f0f0;
  margin-right: 5px;
  cursor: pointer;
}

.tabs button.active {
  background-color: #F0FFFF; /* Matching the SVG box color */
  font-weight: bold; /* Keeping the text bold */
  color: #000; /* Optional: Setting text color to black for better contrast */
  border: 1px solid #007bff; /* Optional: Adding a blue border for a bit of contrast */
}

.tab-content {
  /* padding: 20px; */
  margin: 50px auto 0;
  max-width: 960px;
  /* border: 1px solid #ddd;
  border-top: none; */
}

text {
  transform: translate(25px, 55px); 
  opacity: 1.0;
}

.input-container input ,
.datepicker-container,
.location-picker-container {
  margin-bottom: 20px;
}

.slider {
  width: 12%;
}

.show-houses-toggle {
  --toggle-bg-on: royalblue;
  --toggle-border-on: rgb(126, 203, 228);
}

</style>

<!-- Style for toggle button -->
<style src="@vueform/toggle/themes/default.css"></style>

