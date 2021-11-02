// This is the key you need for the weater api
const APIKey = '73dd8b602a63285189aa107a03115425'

// https://openweathermap.org/weather-conditions#How-to-get-icon-URL

// get input node from DOM
const searchValueNode = $('#city')
// get ul node from DOM
const searchHistoryNode = $('#search-history')
// get forcast node from DOM
const selectedCityWeatherForecastNode = $('#selected-city-weather-forecast')
// get actual weather node from DOM
const selectedCityWeatherNode = $('#selected-city-weather')

// get the complete search history from the local storage
const searchHistory = JSON.parse(localStorage.getItem('search-history')) || []
// function saves the search history above in the local storage
const saveSearchHistory = () => localStorage.setItem('search-history', JSON.stringify(searchHistory))

// function to get the weater data for the next six days
const requestSearchCityFromApi = cityName => {
  const queryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&cnt=6&appid=${APIKey}`
  return fetch(queryURL).then(response => response.json())
}

const showSearchHistory = () => {
  searchHistoryNode.empty()
  searchHistory.forEach(cityName => {
    searchHistoryNode.append($(`<li><button class="show-weather-button" type="button">${cityName}</button></li>`))
  })
  $('.show-weather-button').click(showWeatherOfSelectedCity)
}

const showWeather = (cityName, weather) => {
  console.log(weather)
  const [actualWeather, ...forecastWeather] = weather
  const date = new Date()

  // actual weather
  const { main: { temp, humidity }, wind: { speed }, weather: [ { icon } ] } = actualWeather
  console.log(date.toLocaleDateString(), temp, humidity, speed, icon)
  selectedCityWeatherNode.empty()
  selectedCityWeatherNode.append(`
    <div class="col weather-forecast-box">
      <div>${cityName} (${date.toLocaleDateString()})<img src="http://openweathermap.org/img/wn/${icon}@2x.png" width="32px" /></div>
      <div>Temp. ${temp}</div>
      <div>Wind ${speed}</div>
      <div>Humidity ${humidity}</div>
    </div>
  `)

  // forecast
  selectedCityWeatherForecastNode.empty()
  forecastWeather.forEach(({ main: { temp, humidity }, wind: { speed }, weather: [ { icon } ]  }) => {
    date.setDate(date.getDate() + 1)
    console.log(date.toLocaleDateString(), temp, humidity, speed, icon)
    selectedCityWeatherForecastNode.append(`
      <div class="col weather-forecast-box">
        <div>${date.toLocaleDateString()}</div>
        <div><img src="http://openweathermap.org/img/wn/${icon}@2x.png" width="32px" /></div>
        <div>Temp. ${temp}</div>
        <div>Wind ${speed}</div>
        <div>Humidity ${humidity}</div>
      </div>
    `)
  })
}

const showWeatherOfSelectedCity = cityButton => {
  const cityName = $(cityButton.target).text()
  requestSearchCityFromApi(cityName).then(result => {
    const { list: weather } = result
    showWeather(cityName, weather)
  })
}

const searchCity = () => {
  const cityName = searchValueNode.val()
  requestSearchCityFromApi(cityName).then(result => {
    const { city: { name }, list: weather } = result
    searchHistory.push(name)
    saveSearchHistory()
    showSearchHistory()
    showWeather(name, weather)
  })
}

showSearchHistory()
$('#search-city-button').click(searchCity)
