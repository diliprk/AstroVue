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
    name: 'HouseSignificators',
    components: {
      VueGoodTable,
    },
    props: {
      houseSignificatorsData: {
        type: Array,
        required: true
      }
    },
    computed: {
      columns() {
        return [
          { label: 'House', field: 'house', sortable: false},
          { label: 'A', field: 'inStar', sortable: false},
          { label: 'B', field: 'inSub', sortable: false},
          { label: 'C', field: 'inSubSub', sortable: false},
          { label: 'D', field: 'significator', sortable: false},
        ];
      },
      rows() {
        return this.houseSignificatorsData.map(item => ({
          house: item[0],
          inStar: item[1].join(', '),
          inSub: item[2].join(', '),
          inSubSub: item[3].join(', '),
          significator: item[4]
        }));
      }
    },
  };
  </script>