## Swiss Ephemeris Server API
This API is based on the `swisseph` node package developed by Alois Treindl. You can refer the Git repo below:<br>
https://github.com/aloistr/swisseph?tab=readme-ov-file

### Install the dependencies
```bash
cd <into_this_swisseph-api-folder>
npm install
```
* Download the required ephmeris data from below URLs and put it in the `ephemeris_data` folder in this directory.<br>
  * Copy all the `.se1` files from here: https://github.com/aloistr/swisseph/tree/master/ephe (after cloning the repo)
  * Refer [this section](https://github.com/aloistr/swisseph?tab=readme-ov-file#jpl-files) to download the `de406.eph` file or any other `.eph` file of your choice
    * Download the large `de441.eph`  file which contains data for many celestial bodies with high accuracy [OPTIONAL]



### Start the API server
```bash
npm start
```

