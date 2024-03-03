<template>
    <div id="vimshotable">
      <vue-good-table
        ref="vimshottariTable"
        :columns="columns"
        :rows="formattedRows"
        theme="polar-bear"
        :group-options="groupOptions">
      </vue-good-table>
      <div class="button-group">
        <button @click="expandAll()">Expand All</button>
        <button @click="collapseAll()">Collapse All</button>
      </div>
    </div>
  </template>
  
  <script>
  import 'vue-good-table-next/dist/vue-good-table-next.css'
  import { VueGoodTable } from 'vue-good-table-next';
  
  export default {
    name: 'VimshottariDasaTable',
    components: {
      VueGoodTable
    },
    props: {
      vimsoDasaData: {
        type: Object,
        required: true
      }
    },
    computed: {
      formattedRows() {
        let rows = [];
        Object.entries(this.vimsoDasaData).forEach(([dasa, { start, end, bhuktis }]) => {
          let children = Object.entries(bhuktis).map(([bhuktiName, bhuktiData]) => ({
            dasaBhukti: bhuktiName, // Use Bhukti name for child rows
            start: bhuktiData.start,
            end: bhuktiData.end,
            isChild: true
          }));
  
          // Push the parent Dasa with its children
          rows.push({
            dasaBhukti: dasa, // Use Dasa name for parent row
            start,
            end,
            children
          });
        });
        return rows;
      },
      columns() {
        return [
          { label: 'Dasa/Bhukti', field: 'dasaBhukti', sortable: false},
          { label: 'Start', field: 'start', sortable: false },
          { label: 'End', field: 'end', sortable: false }
        ];
      },
      groupOptions() {
        return {
          enabled: true,
          collapsable: true,
          rowKey: 'dasaBhukti'
        };
      }
    },
    methods: {
      expandAll() {
        this.$refs.vimshottariTable.expandAll();
      },
      collapseAll() {
        this.$refs.vimshottariTable.collapseAll();
      }
    }
  };
  </script>
  
<style>
#vimshotable {
  display: flex;
  flex-direction: column;
}

.button-group {
  margin-bottom: 20px;
  text-align: right;
  order: -1; /* This moves the button group above the table */
}
</style>