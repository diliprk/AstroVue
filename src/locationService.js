export default {
    async getLocationData(cityname) {
      try {
        // Query the first API
        const locationResponse = await fetch(`http://api.geonames.org/searchJSON?q=${cityname}&maxRows=10&username=diliprk`);
        const locationData = await locationResponse.json();
  
        if (locationData.status) {
          return { error: locationData.status.message };
        }
  
        // Extract lat and lon from the first response
        const { lat, lng: lon } = locationData.geonames[0];
  
        // Query the second API
        const timezoneResponse = await fetch(`http://api.geonames.org/timezoneJSON?lat=${lat}&lng=${lon}&username=diliprk`);
        const timezoneData = await timezoneResponse.json();
  
        if (timezoneData.status) {
          return { error: timezoneData.status.message };
        }
  
        // Extract rawOffset and convert it to utcOffset
        const rawUtc = parseFloat(timezoneData.rawOffset);
        const utcHours = Math.floor(Math.abs(rawUtc));
        const utcMinutes = Math.round((Math.abs(rawUtc) % 1) * 60);
        const utc = `${rawUtc >= 0 ? '+' : '-'}${utcHours.toString().padStart(2, '0')}:${utcMinutes.toString().padStart(2, '0')}`;
  
        // Return the location data
        return { [cityname]: {"lat" : lat, "lon" :  lon,  "utc" : utc } };
      } catch (error) {
        return { error: 'An error occurred while fetching the location data.' };
      }
    },
  };