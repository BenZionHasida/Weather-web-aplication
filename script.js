

// display max and min degrees on the screen 
async function displayDegrees(location) {
  let weatherData = await getWeather(location);
  let maxList = weatherData[0];
  let minList = weatherData[1];
  temperatureSpanList = document.querySelectorAll(".degrees");
  for (let index = 0; index   < temperatureSpanList.length; index++) {
    let spanElement = temperatureSpanList[index];
    let dailyMax = maxList[index];
    let dailyMin = minList[index];
    let displaycontent = Math.floor(dailyMin) + "° / " + Math.floor(dailyMax) + "°";
    spanElement.textContent = displaycontent;
  }
}

// display the images of the weather icons on the screen
async function displayimages(location) {
  let dayStatus = gatDayStatus();
  let weatherData = await getWeather(location);
  let codeList = weatherData[2];
  let imagesobject = await getImages();
  let imagesList = document.querySelectorAll(".image");
  for (let index = 0; index < imagesList.length; index++) {
    let element = imagesList[index];
    if (dayStatus === "day") {
      element.setAttribute("src", imagesobject[codeList[index]].day.image);
    } else {
      element.setAttribute("src", imagesobject[codeList[index]].night.image);
    }
  }
}

// get 3 days maximium and minimum degrees and the weather code (by latitude and longitude)
async function getWeather(location) {
  if (location === "") {
    location = await getLocation();
  }
  let lati = location[0];
  let long = location[1];

  let respons = await fetch("https://api.open-meteo.com/v1/forecast?latitude=" +
  lati +
  "&longitude=" +
  long +
  "&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3"
     );
  let weatherData = await respons.json();
    
  return [
    weatherData.daily.temperature_2m_max,
    weatherData.daily.temperature_2m_min,
    weatherData.daily.weathercode,
  ];
}

// get the latitude and longitude of the user location
async function getLocation() {
  let latitude, longitude;
  try {
    let response = await fetch("https://ipapi.co/json/");
    let location = await response.json();
    if (location.error == true) {
      throw new error("429");
    }
    latitude = location.latitude;
    longitude = location.longitude;
  } catch (error) {
    latitude = 32.1033;
    longitude = 34.8879;
  }
  return [longitude, latitude];
}

// get the images object that match the WMO code
async function getImages(codeList) {
  let respons = await fetch(
    "https://gist.githubusercontent.com/stellasphere/9490c195ed2b53c707087c8c2db4ec0c/raw/7f2d37310ac5d5c309fd9d2f4dd98cc837c28237/descriptions.json"
  );
  let imagesData = await respons.json();
  return imagesData;
}


// return 'night' or 'day', serve the weather icons to display images match the hour
function gatDayStatus() {
  let time = new Date();
  let hour = time.getHours();
  console.log(hour);
  if (hour >= 7 && hour < 19) {
    return "day";
  } else {
    return "night";
  }
}

// listen to search button and to 'Enter' button on keyborad
function listenToSearch() {
  let searchbutton = document.querySelector(".search-button");
  searchbutton.addEventListener("click", startToCearch);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      startToCearch();
    }
  });
}

// prapare the city to search
function startToCearch() {
  let searchEntry = document.querySelector(".search-entry");
  let cityToCearch = searchEntry.value;
  cityToCearch = upperFormat(cityToCearch);
  displayCityData(cityToCearch);
  searchEntry.value = "";
}


// convert to upper format for searcing 
function upperFormat(cityName) {
  let words = cityName.split(" ");
  let titleCaseCity = words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return titleCaseCity;
}



// get cities data json, to cearch city on
async function getCities() {
  let respons = await fetch(
    "https://raw.githubusercontent.com/lmfmaier/cities-json/master/cities500.json"
  );
  let citiesObject = await respons.json();
  return citiesObject;
}

// check if the city exist in the json
async function findCity(toCearch) {
  let cities = await getCities();
  for (let index = 0; index < cities.length; index++) {
    const element = cities[index];
    if (toCearch === element.name) {
        console.log(element);
      return [element,toCearch];
    }
  }
  return ["not exist",toCearch];
}

// dispaly city data
async function displayCityData(city) {
  cityData = await findCity(city);
  if (cityData[0] === "not exist") {
    alert("'"+cityData[1]+"' doesn't exist");
  } else {
    let lat = cityData[0].lat;
    let lon = cityData[0].lon;
    displayDegrees([lat, lon]);
    displayimages([lat, lon]);
    let displayCityDiv = document.querySelector(".city")
    displayCityDiv.innerHTML = "·"+cityData[1]
  
  }
 }
// listening to search button 
listenToSearch();

//displaing default degrees and images
displayDegrees("");
displayimages("");
