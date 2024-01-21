# AstroVue
A  `vue.js` open-source study project to develop a astro charting application for various analysis.
Presently uses this [AstroChart](https://github.com/AstroDraw/AstroChart) library to render the zodiac chart.
The Epehemeris data is provided by the [Swiss Ephemeris](https://www.astro.com/swisseph/swisseph.htm) and is served by a locally running API in the `swisseph-api`
folder in this repo. <br>

Encouraging forks and contributions (pull requests) to develop this project further


## Project setup
Install the required dependencies for the main `astrovue` app , as well as for the `swisseph-api` server.
```bash
npm install & cd swisseph-api && npm install
```
Remember to download the `.eph` and `.se1` files into the `swisseph-api/ephemeris_data` directory

### Compiles and hot-reloads for development
Start the `astrovue` app in the current terminal
```bash
npm run serve
```

Create a new terminal screen and start the Swiss Ephemeris API Server
```bash
cd swisseph-api && npm start
```


### Compiles and minifies for production
```bash
npm run build
```

### Lints and fixes files
```bash
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


### Other References
* [Vue.js+Pinia demonstration of ephemerides in a graph and tabular form](https://vuejsexamples.com/a-d3-js-in-vue-js-pinia-demonstration-that-displays-ephemerides-in-a-graph-and-tabular-form/)
* https://github.com/g-battaglia/kerykeion (a similar open source astrology project developed in python that detects planetary aspect patterns)
