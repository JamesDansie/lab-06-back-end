'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT;

function Data (searchQuery, formattedQuery, lat, lng) {
  this.search_query= searchQuery;
  this.formatted_query= formattedQuery;
  this.latitude = lat;
  this.longitude = lng;
}

app.get('', (request, response) => {
  response.send('hi');
})

app.get('/location', (request, response) => {
  const geoData = require('./data/geo.json');

  //seach query from the front end;
  //today given from the json data
  const searchQuery = request.query.data;

  //data from geoData
  const formattedQuery = geoData.results[0].formatted_address;
  const lat = geoData.results[0].geometry.location.lat;
  const lng = geoData.results[0].geometry.location.lng;

  const formattedData = new Data(searchQuery, formattedQuery, lat, lng);

  response.send(formattedData);

})

app.listen(PORT, () => {console.log(`app is up and running on PORT ${PORT}`)});
