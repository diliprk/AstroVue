<template>
  <div class="planetary-aspects">
    <vue-good-table
      :columns="columns"
      :rows="rows"
      theme="polar-bear">
      <template v-slot:table-row="props">
        <!-- Check if it's the first column -->
        <span v-if="props.column.field === 'planetName'" class="bold">{{ props.row[props.column.field] }}</span>
        <!-- Default rendering for other columns -->
        <span v-else>{{ props.row[props.column.field] }}</span>
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next';

export default {
  name: 'PlanetaryAspects',
  components: {
    VueGoodTable,
  },
  props: {
    planetaryAspectsData: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      planets: ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto', 'Rahu', 'Ketu']
    };
  },
  computed: {
    columns() {
      const cols = [{ label: 'Planet', field: 'planetName', sortable: false}];
      this.planets.forEach(planet => {
        cols.push({ label: planet, field: planet,sortable: false});
      });
      return cols;
    },
    rows() {
      return this.planets.map(rowPlanet => {
        const row = { planetName: rowPlanet };
        this.planets.forEach(colPlanet => {
          row[colPlanet] = this.getAspect(rowPlanet, colPlanet);
        });
        return row;
      });
    }
  },
  methods: {
    getAspect(rowPlanet, colPlanet) {
      if (rowPlanet === colPlanet) return ''; // No aspect with itself
      const aspect = this.planetaryAspectsData.find(aspect => 
        (aspect.P1 === rowPlanet && aspect.P2 === colPlanet) || 
        (aspect.P1 === colPlanet && aspect.P2 === rowPlanet));
      return aspect ? `${aspect.AspectType} (${aspect.AspectDeg}°)` : '';
    }
  }
};
</script>

<style scoped>
.bold {
  font-weight: bold;
}
</style>