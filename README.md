# AstroVue
<img width="1310" alt="astrovue_repo_CoverImage" src="https://github.com/diliprk/AstroVue/assets/20330371/6eefef23-5f83-4de3-b094-a0484344c121">

An open-source project using `Vue.js` that renders South-Indian style horoscope chart and tables for the Krishnamurthi Paddhati system.
This project is a companion to the [VedicAstro](https://github.com/diliprk/VedicAstro) as it uses the FastAPI call from
the `VedicAstro` library to get the positions, aspects and significators of the planets and houses. <br>
Encouraging forks and contributions (pull requests) to develop this project further


## Project setup
**NOTE**: Please get this [VedicAstro python API](https://github.com/diliprk/VedicAstro/blob/main/VedicAstroAPI.py) running, by following the [installation steps](https://github.com/diliprk/VedicAstro/tree/main#installation) Git Repo. 

After cloning this git repo, `cd astrovue` and then <br>
Install the required dependencies for the main `astrovue` app.
```bash
npm install
```

### Compiles and hot-reloads for development
Start the `astrovue` app and associated `charts_db_server.js` expressJS server in the current terminal
```bash
npm run start
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
