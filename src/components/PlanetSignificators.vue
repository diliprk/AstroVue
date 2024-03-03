<template>
  <div>
    <vue-good-table
      :columns="columns"
      :rows="rows"
      theme="polar-bear">
    </vue-good-table>
  </div>
</template>

<script>
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next';

export default {
  name: 'PlanetSignificators',
  components: {
    VueGoodTable,
  },
  props: {
    planetSignificatorsData: {
      type: Array,
      required: true
    }
  },
  computed: {
    columns() {
      return [
        { label: 'Planet', field: 'planet', width: '10px'},
        { label: 'A', field: 'house', sortable: false},
        { label: 'B', field: 'sign', sortable: false},
        { label: 'C', field: 'star', sortable: false},
        { label: 'D', field: 'sub', sortable: false},
      ];
    },
    rows() {
      return this.planetSignificatorsData.map(item => ({
        planet: item[0],
        house: item[1],
        sign: item[2],
        star: item[3].join(', '),
        sub: item[4].join(', ')
      }));
    }
  },
};
</script>
