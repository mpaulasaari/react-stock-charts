import React, { Component } from 'react'
import MACD from 'components/MACD'
import PriceOverTime from 'components/PriceOverTime'
import RelativeStrengthIndex from 'components/RelativeStrengthIndex'
import StochasticOscillator from 'components/StochasticOscillator'
import VolumeOverTime from 'components/VolumeOverTime'
import { getURLParam } from 'helpers/functions'
// import { weekly } from './mockdata'
import './Dashboard.scss'


class Dashboard extends Component {
  state = {
    data: []
  }

  componentWillMount() {
    const { REACT_APP_ALPHA_ADVANTAGE_API_KEY } = process.env
    const symbol = getURLParam('symbol') || ''

    fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_WEEKLY&symbol=${symbol}&apikey=${REACT_APP_ALPHA_ADVANTAGE_API_KEY}`, {
      method: 'get'
    })
    .then(response => response.json())
    .then(json => {
      const parsed = json['Weekly Time Series'] || []
      const data = Object.entries(parsed).map((item) => {
        const date = item[0]
        const values = item[1]

        return {
          date: date,
          open: Number(values['1. open']),
          high: Number(values['2. high']),
          low: Number(values['3. low']),
          close: Number(values['4. close']),
          volume: Number(values['5. volume']),
          timePeriod: 1
        }
      })

      this.setState({
        data: data.reverse()
      })
    })

    // # Mockdata used for debugging without fetching from server
    //
    // const parsed = weekly['Weekly Time Series']
    // const data = Object.entries(parsed).map((item) => {
    //   const date = item[0]
    //   const values = item[1]
    //
    //   return {
    //     date: date,
    //     open: Number(values['1. open']),
    //     high: Number(values['2. high']),
    //     low: Number(values['3. low']),
    //     close: Number(values['4. close']),
    //     volume: Number(values['5. volume']),
    //     timePeriod: 1
    //   }
    // })
    //
    // this.setState({
    //   data: data.reverse()
    // })
  }

  render() {
    const { data } = this.state

    return (
      <section className='Dashboard'>
        <PriceOverTime
          data={data}
          height={350}
        />
        <VolumeOverTime
          data={data}
          height={120}
        />
        <MACD
          data={data}
          height={120}
        />
        <StochasticOscillator
          data={data}
          height={120}
        />
        <RelativeStrengthIndex
          data={data}
          height={120}
        />
      </section>
    )
  }
}

export default Dashboard
