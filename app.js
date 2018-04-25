const express = require("express");
const exhbs = require("express-handlebars");
const bodyParser = require("body-parser");
const axios = require("axios");
const app = express();
const keys = require("./config/keys");
var location;

app.use(express.static(__dirname + "/public"));
//setting up our view engine
app.engine(
  "handlebars",
  exhbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

//set up body parser
// create application/json parser
app.use(bodyParser.json());

// create application/x-www-form-urlencoded parser
app.use(bodyParser.urlencoded({ extended: false }));
//
app.use((req, res, next) => {
  res.locals.location = req.body.address;
  next();
});

//routes

app.get("/", (req, res) => {
  res.render("form");
});

app.post("/", (req, res) => {
  let address = req.body.address;

  let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${
    keys.apiKey
  }`;

  axios
    .get(url)
    .then(response => {
      if (response.data.status === "ZERO_RESULTS") {
        throw new Error("Unable to find the address");
      }

      let lat = response.data.results[0].geometry.location.lat;
      let lng = response.data.results[0].geometry.location.lng;
      res.locals.location = response.data.results[0].formatted_address;

      let weatherURL = `https://api.darksky.net/forecast/ee1b015436727d79748144e13166c8cc/${lat},${lng}`;
      return axios.get(weatherURL);
    })
    .then(response => {
      let temp = `${response.data.currently.temperature} F`;
      let apptemp = `Temperature seems to be: ${
        response.data.currently.apparentTemperature
      } F`;
      let humidity = `Relative humidity : ${response.data.currently.humidity}`;
      let dewPoint = `Dewpoint : ${response.data.currently.dewPoint}`;
      let wind = `Wind:${response.data.currently.windSpeed}`;
      let summary = response.data.currently.summary;
      let location = res.locals.location;
      res.send({
        temp,
        apptemp,
        humidity,
        location,
        dewPoint,
        wind,
        summary
      });
    })
    .catch(e => {
      if (e.code === "ENOTFOUND") {
        console.log("Unable to connect to API");
      } else {
        console.log(e.message);
      }
    });
});

app.listen(5000, () => {
  console.log("Server started at port 5000");
});
