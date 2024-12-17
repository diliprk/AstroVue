<template>
    <div>
      <vue-good-table
        :columns="columns"
        :rows="rows"
        theme="polar-bear">
        <template #table-row="{ row, column }">
          <span v-if="column.field === 'value'" :style="{ color: row.class }"
            :title="row.attribute === 'ExpectedOutcome' ? '2, 6, 11 --> means Positive.\n5, 8, 12 --> means Negative' : ''">
            {{ row[column.field] }}
          </span>
          <span v-else :style="{ fontWeight: '600' }">
            {{ row[column.field] }}
          </span>
        </template>
      </vue-good-table>
    </div>
  </template>
  
  <script>
  import 'vue-good-table-next/dist/vue-good-table-next.css'
  import { VueGoodTable } from 'vue-good-table-next';
  
  export default {
    name: 'PrasnaDataTable',
    components: {
      VueGoodTable,
    },
    props: {
      prasnaData: {
        type: Array,
        required: true,
        default: () => ([])
      }
    },
    computed: {   
      columns() {
        return [
          {
            label: 'Attribute',
            field: 'attribute',
            sortable: false,
            width: '50px', 
          },
          {
            label: 'Value',
            field: 'value',
            sortable: false,
          }
        ];
      },
      rows() {
        return this.prasnaData.map(item => ({
          attribute: item.name,
          value: item.value,
          class: this.getClassForValue(item.name, item.value)
        }));
      }
    },
    methods: {
      getClassForValue(label, value) {
        if (label === 'isValidQuestion') {
          return value ? 'limegreen' : 'red'; // Direct boolean comparison
        } else if (label === 'ExpectedOutcome') {
          return value === 'Positive' ? 'limegreen' : 'red';
        }
        return '';
      }
    },
  };
  </script>
  
  <style scoped>
  .lime-green {
    color: limegreen;
  }
  
  .red {
    color: red;
  }
  
  .vgt-table {
    max-height: 400px;
    overflow-y: auto;
  }
  
  .vgt-header-row .vgt-th {
    background-color: #f4f4f4;
    color: #333;
  }
  
  .vgt-header-row .vgt-th.sortable:hover {
    background-color: #e2e2e2;
    cursor: pointer;
  }
  </style>