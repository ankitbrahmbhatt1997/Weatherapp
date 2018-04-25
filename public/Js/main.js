let submit = document.getElementById("w-change-btn");
let address = document.getElementById("location");

let place = document.getElementById("w-location");
let temp = document.getElementById("w-string");
let string = document.getElementById("w-desc");
let humidity = document.getElementById("w-humidity");
let dewPoint = document.getElementById("w-dewpoint");
let appTemp = document.getElementById("w-feels-like");
let wind = document.getElementById("w-wind");

function submitted(e) {
  e.preventDefault();
  axios
    .post("/", { address: address.value })
    .then(response => {
      console.log(response.data);
      place.textContent = response.data.location;
      temp.textContent = response.data.temp;
      string.textContent = response.data.summary;
      humidity.textContent = response.data.humidity;
      dewPoint.textContent = response.data.dewPoint;
      appTemp.textContent = response.data.apptemp;
      wind.textContent = response.data.wind;
    })
    .catch(error => {
      console.log(error);
    });
}

submit.addEventListener("click", submitted);
