export type Coords = {
  lat: number
  lon: number
}

export type BaseState = 'loading' | 'success' | 'error'

export type FormState = 'unsubmitted' | BaseState

export type WeatherData = {
  coord: {
    lon: number
    lat: number
  }
  weather: [
    {
      id: number
      main: string
      description: string
      icon: string
    },
  ]
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level: number
    grnd_level: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust: number
  }
  rain: {
    '1h': number
  }
  clouds: {
    all: number
  }
  dt: number
  sys: {
    type: number
    id: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

export type Feature = {
  properties: {
    datasource: {
      sourcename: string
      attribution: string
      license: string
      url: string
    }
    country: string
    country_code: string
    state: string
    county: string
    city: string
    postcode: string
    iso3166_2: string
    lon: number
    lat: number
    state_code: string
    result_type: string
    formatted: string
    address_line1: string
    address_line2: string
    category: string
    timezone: {
      name: string
      offset_STD: string
      offset_STD_seconds: number
      offset_DST: string
      offset_DST_seconds: number
      abbreviation_STD: string
      abbreviation_DST: string
    }
    plus_code: string
    plus_code_short: string
    rank: {
      importance: number
      confidence: number
      confidence_city_level: number
      match_type: string
    }
    place_id: string
  }
  geometry: {
    type: string
    coordinates: [number, number]
  }
  bbox: [number, number, number, number]
}

export type LocationPrediction = {
  type: string
  features: Feature[]
  query: {
    text: string
    parsed: { city: string; expected_type: string }
  }
}
