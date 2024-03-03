<!-- 
    Library Documentation: https://borisflesch.github.io/vue-good-table-next/guide/
 -->

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
    name: 'HousesDataTable',
    components: {
      VueGoodTable,
    },
    props: {
      housesData: {
        type: Array,
        required: true
      }
    },
    computed: {
      columns() {
        return [
          {
            label: 'HouseNr',
            field: 'Object',
            sortable: true,
          },
          {
            label: 'ZodiacDeg',
            field: 'LonDecDeg',
            tooltip: 'Position of the Object in Zodiac Sky which ranges from 0 to 360 decimal degrees',
          },
          {
            label: 'SignDMS',
            field: 'SignLonDMS',
            sortable: false,
            tooltip: 'Position of the Object in the particular zodiac sign in Degree, Mins, Secs which ranges\
            from 00:00:00 to 30:00:00 in each rashi',
          },
          {
            label: 'SignDecDeg',
            field: 'SignLonDecDeg',
            sortable: false,
            tooltip: 'Position of the Object in the particular zodiac sign in decimal degrees which ranges\
            from 0.0 to 30.0 degrees in each rashi',
          },
          {
            label: 'DegSize',
            field: 'DegSize',
            sortable: false,
          },
          {
            label: 'Rasi',
            field: 'Rasi',
            sortable: false,
          },        
          {
            label: 'RL',
            field: 'RasiLord',
            sortable: false,
            tooltip: "RasiLord"
          },
          {
            label: 'Nakshatra',
            field: 'Nakshatra',
            sortable: false,
          },
          {
            label: 'NL',
            field: 'NakshatraLord',
            sortable: false,
            tooltip: "NakshatraLord (or) StarLord"
          },
          {
            label: 'SL',
            field: 'SubLord',
            sortable: false,
            tooltip: "SubLord or UpaNakshatra"
          },
          {
            label: 'SSL',
            field: 'SubSubLord',
            sortable: false,
            tooltip: "SubSubLord"
          },          
        ];
      },
      rows() {
        return this.housesData;
      }
    },
  };
  </script>


<style>
.vgt-header-row .vgt-th {
  position: relative;
}

.vgt-header-row .vgt-th:hover::after {
  content: attr(data-tooltip);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: #fff;
  padding: 5px;
  border-radius: 5px;
  white-space: nowrap;
  z-index: 100;
}
</style>