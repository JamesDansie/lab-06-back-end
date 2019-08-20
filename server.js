'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;

//Data constructor
function Data (searchQuery, formattedQuery, lat, lng) {
  this.search_query= searchQuery;
  this.formatted_query= formattedQuery;
  this.latitude = lat;
  this.longitude = lng;
}

//Weather constructor
//time input is in seconds
function WeatherData(forecast, time) {
  this.forecast = forecast;

  //converting time to milliseconds
  let dateImput = new Date(time*1000);
  this.time = dateImput.toString();
}

app.get('', (request, response) => {
  response.send('landing page');
})

//location page
app.get('/location', (request, response) => {
  try {
    //getting given data
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

  } catch (error) {
    response.status(500);
    response.send('sorry had an error');
  }
})

app.get('/weather', (request, response) => {
  try {
    //getting given data
    const darkSkyData = require('./data/darksky.json');
    let week = [];
    let time = darkSkyData.daily.data[0].time
    let forecast = darkSkyData.daily.data[0].summary

    //getting data for the next week aka 7 days
    for(let i=0 ; i<7; i++) {
      time = darkSkyData.daily.data[i].time
      forecast = darkSkyData.daily.data[i].summary

      //making a new weather object for each day and pushing to the week array
      const formattedData = new WeatherData(forecast,time);
      week.push(formattedData);
    }
    response.send(week);
  }catch(error){
    response.status(500);
    response.send('sorry had an error');
  }
})

app.listen(PORT, () => {console.log(`app is up and running on PORT ${PORT}`)});
