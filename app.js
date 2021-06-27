const iconElement = document.querySelector(".weatherIcon");
const tempElement = document.querySelector(".temperatureValue p");
const descElement = document.querySelector(".temperatureDescription p");
const locationElement = document.querySelector(".location p");
const notificationElement = document.querySelector(".notification");

const key = "21ead0937237a433c009a35862285f1f";


const weather={};

weather.temperature={
    unit:"celsius"
}

const KELVIN = 273;


if("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}
else{
    console.log('not able to allow do to some ..');
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

function setPosition(position){
  
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    
    getWeather(latitude, longitude);
}

function showError(error){
    
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

function getWeather(latitude, longitude){
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    fetch(api)
    .then(function(response){  //Promise(async await,then)
        let data=response.json();
        return data;
    })
    .then(function(data){
        weather.temperature.value= Math.floor(data.main.temp - KELVIN);
       //  console.log(data.main.temp - KELVIN);
       weather.description = data.weather[0].description;
       weather.iconId = data.weather[0].icon;
       weather.city = data.name;
       weather.country = data.sys.country;
    })
    .then(function(){
        displayWeather();
    })

}

function displayWeather(){
    iconElement.innerHTML=` <img src="icons/${weather.iconId}.png" alt="unknownImg">`;
                         //29°c
    tempElement.innerHTML = `${weather.temperature.value}&deg;<span>C</span>`;
                          //coludy|fog
    descElement.textContent = weather.description;
                            //landon,Gb
    locationElement.textContent = `${weather.city}, ${weather.country}`;
}


function celsiusToFahrenheit(temperature){
    return (temperature * 9/5) + 32;
}

tempElement.addEventListener("click", function(){
    //user denied location
    if(weather.temperature.value === undefined) return;
    
    if(weather.temperature.unit == "celsius"){
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }else{
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        weather.temperature.unit = "celsius"
    }
});

