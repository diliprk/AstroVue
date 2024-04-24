<template>
    <div>
      <vue-good-table
        :columns="columns"
        :rows="rows"
        :pagination-options="paginationOptions"
        :search-options="{ enabled: true }"        
        theme="polar-bear">

      <!-- Define a template slot for the Chart ID column -->
      <template v-slot:table-row="props">
        <span v-if="props.column.field === 'Chart ID'" @click="selectChart(props.row)" class="clickable-chart-id">
          {{ props.row['Chart ID'] }}
        </span>
        <span v-else>
          {{ props.formattedRow[props.column.field] }}
        </span>
      </template>

    </vue-good-table>
    </div>
  </template>
  
  <script>
  import 'vue-good-table-next/dist/vue-good-table-next.css'
  import { VueGoodTable } from 'vue-good-table-next';
  import { toRaw } from 'vue';
  
  export default {
    name : 'HoraryChartsDB',
    components: {
      VueGoodTable,
    },
    props: {
      horaryChartData: {
        type: Array,
        required: true,
      },
    },
    // mounted() {
    // this.centerPopup(); // Center the popup initially
    // window.addEventListener('resize', this.centerPopup);
    // },
    // beforeUnmount() {
    //   window.removeEventListener('resize', this.centerPopup);
    // },
    // methods: {
    // centerPopup() {
    //   const popup = this.$refs.popup; // Accessing the popup element using ref
    //   if (popup) {
    //     popup.style.top = `${(window.innerHeight - popup.offsetHeight) / 2}px`;
    //     popup.style.left = `${(window.innerWidth - popup.offsetWidth) / 2}px`;
    //   }
    //   }
    // },    
    computed: {
      columns() {
        if (this.horaryChartData.length > 0) {
          const sortableFields = ['Chart ID', 'Year', 'Month', 'Day']; // List of sortable fields
          return Object.keys(this.horaryChartData[0]).map(key => ({
            label: key,
            field: key,
            sortable: sortableFields.includes(key),
            width: key.length > 10 ? 150 : 100, // Example of dynamic width based on key length
            // Custom HTML template for the 'Chart ID' column
          }));
        }
        return [];
      },
      rows() {
        return this.horaryChartData;
      },
      paginationOptions() {
        return {
          enabled: true,
          perPage: 7, // Adjust number of rows per page as needed
          position: 'bottom', // Can be 'top', 'bottom', or 'both'
          perPageDropdown: [10, 20, 30, 50] // Dropdown options for rows per page
        };      
      }
    },
    methods: {
    selectChart(row) {
      // Emit an event with the chart ID
      this.$emit('chart-selected', toRaw(row));
    },
  }    
  };
  </script>
  
  <style scoped>
  .vgt-table {
    max-height: 400px; /* Adjust based on your pop-up size */
    overflow-y: auto; /* Allows scrolling within the table if it exceeds the max height */
  }
  
  .vgt-header-row .vgt-th {
    background-color: #f4f4f4; /* Light background for headers for readability */
    color: #333; /* Ensure text color contrasts well with the background */
  }
  
  /* Customizes the look when hovering over sortable columns */
  .vgt-header-row .vgt-th.sortable:hover {
    background-color: #e2e2e2;
    cursor: pointer;
  }
  
  .vgt-row {
    background-color: #fff; /* White background for rows to match pop-up style */
    border-bottom: 1px solid #eee; /* Light borders for row separation */
  }

  .clickable-chart-id {
  cursor: pointer;
  color: #007bff; /* Bootstrap link color for consistency */
  text-decoration: underline;
}
  </style>