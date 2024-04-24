<template>
  <div >
    <div class="conditional-container">
    <div v-if="selectedHoraryNumber" class="horary-question-container">
      <label for="horaryQuestion"><b>Horary Question:</b> </label>
      <input id="horaryQuestion" type="text" v-model="horaryQuestion" placeholder="Enter your question" class="horary-question">
    </div>  
    <div v-if="selectedHoraryNumber" class="horary-save-load-buttons-container">
        <button @click="saveHoraryChart">Save Horary Chart</button>
        <button @click="loadHoraryChart">Load Horary Chart</button>
    </div>
  </div>
  <div class="input-container">
    <br><br><br><br>
    <label for = "name"> Name:      </label>
    <input id = "name" type="text" v-model="subject.name" placeholder="Name">
    <div class="location-picker-container">
      <label for="location">Location: </label>
      <select id="location" v-model="selectedLocationCity"> 
        <option disabled value="">Please select a location</option>
        <option v-for="(coords, city) in locations" :value="city" :key="city">{{ city }}</option>
      </select>
    </div>
    <div class="horary-number-container">
      <label for="horaryNumber">Horary Number: </label>
      <select id="horaryNumber" v-model="selectedHoraryNumber">
        <option value="">None</option>
        <option v-for="num in 249" :value="num" :key="num">{{ num }}</option>
      </select>
      <div class="horary-quick-selection">
        <button @click="selectRandomHoraryNumber">Select Random Nr</button>
        <button @click="setCurrentTime" class="current-time-button">Get Current Time</button>
      </div>
    </div>
    <br>    
    <div class="datepicker-container">
      <label for = "datepicker-container"> <b>Select Date:</b>    </label>
      <vue3Datepicker v-model="selectedDate" :format="formatDate"></vue3Datepicker>
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
  <div v-if="showHoraryChartPopup" class="horary-chart-popup">
    <HoraryChartsDB :horaryChartData="horaryChartData" @chart-selected="handleChartSelected"/>
    <button @click="showHoraryChartPopup = false">Close</button>
  </div>      
</div>
</template>


<script>
import * as d3 from 'd3';
import axios from 'axios';
import Papa from 'papaparse';
import locations from '../utc_locations.js';
import Toggle from '@vueform/toggle';
import vue3Datepicker from 'vue3-datepicker';
import PlanetsDataTable from './PlanetsDataTable.vue';
import PlanetSignificators from './PlanetSignificators.vue';
import PlanetAspects from './PlanetAspects.vue';
import HousesDataTable from './HousesDataTable.vue';
import HouseSignificators from './HouseSignificators.vue';
import VimshottariDasaTable from './VimshottariDasaTable.vue';
import HoraryChartsDB from './HoraryChartsDB.vue';

// import locationService from '../locationService.js'; 

export default {
  components: {
    vue3Datepicker,
    Toggle,
    HoraryChartsDB,
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
      selectedHoraryNumber: '',
      horaryQuestion: '',
      horaryChartData: [],
      showHoraryChartPopup: false,
      locations : locations,
      selectedAyanamsa: 'Krishnamurti',
      selectedHouseSystem: 'Placidus',
      showHouses: true,
      showZodiacDetails: 'Symbols',
      zodiacDetailsOptions: ['None', 'English', 'Symbols'],           
      ayanamsas: ["Lahiri", "Lahiri_1940", "Lahiri_VP285", "Lahiri_ICRC", "Raman", "Krishnamurti", "Krishnamurti_Senthilathiban"],
      houseSystems: ["Placidus", "Equal", "Equal 2",  "Whole Sign"],
      subject: {name: "John Doe"},
      currentTab: 'Planets',
      currentChildTab: 'Positions',
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
    selectedHoraryNumber: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.fetchChartData();
        }
      },
      immediate: false
    },
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
    handleChartSelected(chart) {
    // Log received chart data to verify its structure and contents
          // console.log('RECEIVED CHART Data:', chart);      
          this.subject.name = chart.Name;
          this.selectedHoraryNumber = chart["Horary Number"];
          this.horaryQuestion = chart["Horary Question"];
          // Properly set the date and time from the chart data
          this.selectedDate = new Date(chart.Year, chart.Month - 1, chart.Day, chart.Hour, chart.Minute, chart.Second);
          this.selectedHour = chart.Hour;
          this.selectedMinute = chart.Minute;
          this.selectedSecond = chart.Second;
          this.selectedLocationCity = chart.Location;
          this.selectedLocation = this.locations[this.selectedLocationCity];
          if (!this.selectedLocation) {
            console.error('Selected location is undefined. Check if the location exists in the locations list.',this.selectedLocationCity);
            return; // Add error handling or a default value
          }     
          this.selectedAyanamsa = chart.Ayanamsa;
          this.selectedHouseSystem = chart["House System"];
          this.showHoraryChartPopup = false; // Close the popup  
          // Now fetch the chart data with updated fields
          this.fetchChartData();
      },
    async loadHoraryChart() {
    try {
      const response = await axios.get('http://127.0.0.1:8090/load_horary_charts');
        // Since the server will send a 404 status when no data is found, check for response status
        if (response.status === 200 && response.data.trim() !== '') {
          this.horaryChartData = this.parseCSVData(response.data);
          this.showHoraryChartPopup = true; // To control the visibility of the popup
        } else {
          alert('No Previously Saved Horary Data Found');
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          alert('No Previously Saved Horary Data Found');
        } else {
          console.error('Error loading horary chart data:', error);
          alert('Failed to load horary chart data.');
        }
      }
    },
    parseCSVData(csvData) {
      const result = Papa.parse(csvData, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true
      });
      return result.data;
      },

    async saveHoraryChart() {
      const year = this.selectedDate.getFullYear();
      const month = (this.selectedDate.getMonth() + 1).toString().padStart(2, '0'); // JavaScript months are 0-indexed
      const day = this.selectedDate.getDate().toString().padStart(2, '0');
      const hour = this.selectedHour.toString().padStart(2, '0');
      const minute = this.selectedMinute.toString().padStart(2, '0');
      const second = this.selectedSecond.toString().padStart(2, '0');
      // Construct the formattedDate string
      const formattedDate = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
      const chartData = {
        chartId: `${this.subject.name}_${formattedDate}_${this.selectedHoraryNumber}`,
        name: this.subject.name,
        horaryNumber: this.selectedHoraryNumber,
        horaryQuestion: this.horaryQuestion,
        year: this.selectedDate.getFullYear(),
        month: this.selectedDate.getMonth() + 1, // JavaScript months are 0-indexed
        day: this.selectedDate.getDate(),
        hour: this.selectedHour,
        minute: this.selectedMinute,
        second: this.selectedSecond,
        location: this.selectedLocationCity,
        latitude: this.selectedLocation.lat,
        longitude: this.selectedLocation.lon,
        utc: this.selectedLocation.utc,
        ayanamsa: this.selectedAyanamsa,
        houseSystem: this.selectedHouseSystem
      };

      try {
        const response = await axios.post('http://127.0.0.1:8090/save_horary_chart', chartData);
        console.log('Save successful:', response.data);
        // Display a confirmation pop-up
        alert('Horary Chart data saved successfully!');
      } catch (error) {
        console.error('Error saving horary chart:', error);
        alert('Failed to save horary chart data.');
      }
    },    
    selectRandomHoraryNumber() {
      this.selectedHoraryNumber = Math.floor(Math.random() * 249) + 1;
    },
    setCurrentTime() {
    const now = new Date();
    this.selectedDate = now;
    this.selectedHour = now.getHours();
    this.selectedMinute = now.getMinutes();
    this.selectedSecond = now.getSeconds();
    },    
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
      if (this.selectedHoraryNumber) {
        apiData.horary_number = this.selectedHoraryNumber;
      }
      const apiUrl = this.selectedHoraryNumber ? 'http://127.0.0.1:8088/get_all_horary_data' : 'http://127.0.0.1:8088/get_all_horoscope_data'; // Modify this line
      const response = await axios.post(apiUrl, apiData);

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

.conditional-container {
  min-height: 55px; /* Adjust based on the typical height of the content */
}

.input-container input ,
.datepicker-container,
.location-picker-container {
  margin-bottom: 20px;
}

.horary-question-container {
  display: flex;
  justify-content: center;
  /* margin: 20px 0; */
}

.horary-save-load-buttons-container {
  display: flex;
  justify-content: center; /* Space out buttons */
  margin-top: 10px;
  width: 100%; /* Take full width to match the input above */
  gap: 10px;
}

.horary-quick-selection {
    display: flex;
    margin-top: 10px; /* Space above the button row */
    gap: 10px; /* Space between the buttons */
  }

.horary-question {
  margin-left: 5px;
  width: 30%; /* Adjust this value to make the input field longer */
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



.slider {
  width: 12%;
}

.show-houses-toggle {
  --toggle-bg-on: royalblue;
  --toggle-border-on: rgb(126, 203, 228);
}

.horary-chart-popup {
  position: fixed; /* or 'absolute' if the parent container is positioned */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%; /* Adjust width as necessary */
  /* max-width: 600px; Adjust max width as necessary */
  z-index: 1000; /* Ensure it's above other content */
  background: white; /* Background color */
  border: 1px solid #ccc; /* Optional border */
  padding: 20px; /* Padding around the content */
  box-shadow: 0 4px 6px rgba(0,0,0,0.1); /* Optional shadow for better visibility */
}
</style>

<!-- Style for toggle button -->
<style src="@vueform/toggle/themes/default.css"></style>

