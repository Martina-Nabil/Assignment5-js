const currentDay = document.getElementById('currentDay');
const todayNumber = document.getElementById('todayNumber');
const monthName = document.getElementById('monthName');

const locationCity = document.querySelector('.first .forecast-content .location-city');
const degree = document.querySelector('.first .forecast-content .degree');
const statusWeather = document.querySelector('.first .forecast-content .todayStatus');
const weatherIcon = document.querySelector('.first #weatherIcon');

const cityInput = document.getElementById('cityInput');
const findButton = document.getElementById('findButton')
const humdity = document.querySelector('.humdity');
const wind = document.querySelector('.wind');
const windDirection = document.querySelector('.wind-direction');

const imgNextDay = document.getElementsByClassName('imgForecast');
const nextMaxDegree = document.getElementsByClassName('max-degree');
const nextMinDegree = document.getElementsByClassName('min-degree');
const nextStatus = document.getElementsByClassName('status');
const nextDay = document.getElementsByClassName('nextDay')






async function fetchWeather(location) {
    const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=7fb2a44974664ec5b1b231337240401&q=${location}&days=3`);
    const result =  await response.json();
    return result
}


function displayData(data){
    let todayDate = new Date();
    currentDay.innerHTML = todayDate.toLocaleString('en-US',{weekday:"long"});
    todayNumber.innerHTML = todayDate.getDate();
    monthName.innerHTML = todayDate.toLocaleString('en-US',{month:"long"});
    locationCity.innerHTML = data.location.name;
    degree.innerHTML = data.current.temp_c + '°C';
    statusWeather.innerHTML = data.current.condition.text;
    weatherIcon.src = data.current.condition.icon;
    humdity.innerHTML= data.current.humidity + '%';
    wind.innerHTML = data.current.wind_kph  + 'km/h'
    windDirection.innerHTML = data.current.wind_dir;
}


function displayNextDays(data){
    let forecastData = data.forecast.forecastday;
    for(let i=0; i<3 ; i++){
    let nextDate = new Date(forecastData[i+1].date);
    nextDay[i].innerHTML = nextDate.toLocaleString('en-US',{weekday:"long"});
    nextMaxDegree[i].innerHTML = forecastData[i+1].day.maxtemp_c +'°C';
    nextMinDegree[i].innerHTML = forecastData[i+1].day.mintemp_c +'°C';
    imgNextDay[i].src = forecastData[i+1].day.condition.icon;
    nextStatus[i].innerHTML = forecastData[i+1].day.condition.text;


    }

}

async function startApp(city){
    let weatherData = await fetchWeather(city)
    if(!weatherData.error){
        displayData(weatherData);
        displayNextDays(weatherData);
    }
    
}

startApp()



cityInput.addEventListener('input', function(){

    startApp(cityInput.value)

})
    

    
findButton.addEventListener('click', function() {
    startApp(cityInput.value)
        });







// Function to get weather data based on coordinates
async function fetchWeatherByCoords(latitude, longitude) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=7fb2a44974664ec5b1b231337240401&q=${latitude},${longitude}&days=3`);
        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

// Function to get user's location using Geolocation API
function getUserLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    resolve({ latitude, longitude });
                },
                (error) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error('Geolocation is not supported by this browser.'));
        }
    });
}

// Update weather based on user's location
async function updateWeatherForUserLocation() {
    try {
        const { latitude, longitude } = await getUserLocation();
        const weatherData = await fetchWeatherByCoords(latitude, longitude);
        if (weatherData) {
            startApp(weatherData.location.name);
        } else {
            console.error('Weather data not available.');
        }
    } catch (error) {
        console.error('Error accessing user location:', error);
    }
}


updateWeatherForUserLocation();









