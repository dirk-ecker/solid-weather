import './App.css'
import { createSignal, createResource , createEffect } from 'solid-js'
import { createStore } from 'solid-js/store'
import Loading from './Loading'
import WeatherTile from './WeatherTile'

const API_KEY = '73dd8b602a63285189aa107a03115425'

const fetchWeather = async cityName => {
  const actualWeatherResponse = await fetch(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&cnt=1&appid=${API_KEY}`)
  const { city } = await actualWeatherResponse.json()
  const { coord: { lat, lon } } = city
  const forecaseWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
  const forecaseWeatherData = await forecaseWeatherResponse.json()
  forecaseWeatherData.city = city
  return forecaseWeatherData
}

const createLocalStore = () => {
  const [history, setHistory] = createStore({ history: [] })
  if (localStorage.history) setHistory(JSON.parse(localStorage.history))
  createEffect(() => (localStorage.history = JSON.stringify(history)))
  return [history, setHistory]
}

export default () => {
  const [historyStore, setHistoryStore] = createLocalStore()
  const [cityName, setCityName] = createSignal()
  const [weather] = createResource(cityName, fetchWeather)

  let timeoutHandle
  const processWeather = name => {
    clearTimeout(timeoutHandle)
    timeoutHandle = setTimeout( () => setCityName(name), 300)
  }

  return (
      <div class="container-fluid">
        <div className="row">
          <h1 className="col bg-primary text-center">
            Weather
          </h1>
        </div>

        <div className="row">
          <div className="col">

            <div className="row">

              <div className="col col-3">
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      placeholder="Enter Name of City"
                      onInput={event => processWeather(event.currentTarget.value)}
                    />
                    <button
                      type="button"
                      class="btn btn-primary"
                      onClick={event => {
                        setHistoryStore('history', [cityName(), ...historyStore.history])
                      }}
                    >
                      <i class="bi-plus-lg" />
                    </button>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                      <For each={historyStore.history}>
                        {cityName => {
                          return (
                            <div class="row">
                              <div class="col d-grid gap-2">
                                <button onClick={event => setCityName(cityName)}>{cityName}</button>
                              </div>
                            </div>
                          )
                        }}
                      </For>
                  </div>
                </div>

              </div>

              <div className="col">
                <Loading loading={weather.loading}>
                  <div class="row">
                    <WeatherTile weather={weather()} />
                  </div>
                </Loading>
              </div>

            </div>

          </div>
        </div>

      </div>
  )
}
