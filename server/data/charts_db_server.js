const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 8090;

app.use(bodyParser.json());
app.use(cors());

const dataPath = path.join(__dirname, 'data', 'horary_charts.csv');
// Ensure the CSV headers match the structure of your chartData object
const csvHeaders = "Chart ID,Name,Horary Number,Horary Question,Year,Month,Day,Hour,Minute,Second,Location,Latitude,Longitude,UTC,Ayanamsa,House System\n";

// Endpoint to load horary charts
app.get('/load_horary_charts', (req, res) => {
  const filePath = path.join(__dirname, 'data', 'horary_charts.csv');

  // Check if the file exists first
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error('CSV file does not exist:', err);
      return res.status(404).send('No Previously Saved Horary Data Found');
    }

    // File exists, now read it
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading the CSV file:', err);
        return res.status(500).send('Error reading horary chart data');
      }
      // Check if the file is empty
      if (!data || data.trim() === '') {
        return res.status(404).send('No Previously Saved Horary Data Found');
      }
      res.send(data);
    });
  });
});

app.post('/save_horary_chart', (req, res) => {
  const { chartId, name, horaryNumber, horaryQuestion, year, month, day, hour, minute, second, location, latitude, longitude, utc, ayanamsa, houseSystem } = req.body;
  // Format the CSV line to match the incoming data structure
  const csvLine = `"${chartId}","${name}",${horaryNumber},"${horaryQuestion}",${year},${month},${day},${hour},${minute},${second},"${location}",${latitude},${longitude},"${utc}","${ayanamsa}","${houseSystem}"\n`;

  fs.open(dataPath, 'a+', (err, fd) => {
    if (err) {
      console.error('Failed to open file:', err);
      res.status(500).send('Failed to save horary chart data');
      return;
    }
    fs.fstat(fd, (err, stat) => {
      if (err) {
        console.error('Failed to get file stats:', err);
        res.status(500).send('Failed to save horary chart data');
        return;
      }
      if (stat.size === 0) {
        // File is empty, write headers first
        fs.write(fd, csvHeaders + csvLine, (err) => {
          fs.close(fd, (err) => {
            if (err) {
              console.error('Failed to close file:', err);
            }
          });
          if (err) {
            console.error('Failed to write to file:', err);
            res.status(500).send('Failed to save chart data');
            return;
          }
          res.send('Horary Chart data saved successfully with headers');
        });
      } else {
        // File already has content, just append the new line
        fs.appendFile(dataPath, csvLine, (err) => {
          fs.close(fd, (err) => {
            if (err) {
              console.error('Failed to close file:', err);
            }
          });
          if (err) {
            console.error('Failed to append to file:', err);
            res.status(500).send('Failed to save chart data');
            return;
          }
          res.send('Horary Chart data appended successfully');
        });
      }
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port http://127.0.0.1:${PORT}`);
});