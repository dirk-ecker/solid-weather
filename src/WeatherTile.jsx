import { For, Show } from 'solid-js'

export default properties => {
  return (
    <Show
      when={properties.weather}
    >
      {properties.weather.city.name}
      <For
        each={properties.weather.daily}
        fallback={<div>Loading...</div>}
      >{ entry => (
          <div class="col">
            <div>{new Date(entry.dt*1000).toLocaleDateString()}</div>
            <img src={`http://openweathermap.org/img/wn/${entry.weather[0].icon}.png`}/>
            <div>{entry.temp.day}</div>
            <div>{entry.humidity}</div>
          </div>
        )
      }</For>
    </Show>
  )
}

/*
    <Show
      when={properties.weather}
    >
      {properties.weather?.city?.name}
      {
        properties.weather?.list?.map(entry => (
          <>
            <div>{new Date(entry.dt*1000).toLocaleDateString()}</div>
            <div>{entry.main.temp}</div>
            <div>{entry.main.humidity}</div>
            <div>{entry.main.weather?.[0].icon}</div>
          </>
        ))
      }

 */
/*
  <div class="weather-forecast-box">
      <div>${properties.date.toLocaleDateString()}</div>
      <div>
        <img
          src={`http://openweathermap.org/img/wn/${properties.weather.icon}@2x.png`}
          width="32px"
        />
      </div>
      <div>Temp. {properties.weather.temp}</div>
      <div>Wind {properties.weather.speed}</div>
      <div>Humidity {properties.weather.humidity}</div>
    </div>
 */
