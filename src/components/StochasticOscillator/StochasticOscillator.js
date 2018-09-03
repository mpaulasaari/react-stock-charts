import React, { Component } from 'react'
import {
  CartesianGrid,
  Line,
  ComposedChart,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import Crosshair from 'components/Crosshair'
import {
  formatDate,
  getSignalDataWithLimits,
  getSum
} from 'helpers/functions'
import './StochasticOscillator.scss'

class StochasticOscillator extends Component {
  state = {
    lineData: [],
    limitLower: 20,
    limitUpper: 80,
    signalData: [],
    sma: 3,
    SOperiod: 14,
  }

  componentWillMount() {
    this.generateSO(this.props.data)
  }

  componentWillReceiveProps(nextProps) {
    this.generateSO(nextProps.data)
  }

  generateSO = (data) => {
    if (!data || !data.length) return []

    const lineData = this.getLineData(data)
    const signalData = getSignalDataWithLimits(
      lineData,
      this.state.limitLower,
      this.state.limitUpper,
      'fullK'
    )

    this.setState({
      lineData,
      signalData
    })
  }

  getLineData = (data) => {
    const { sma, SOperiod } = this.state
    const accumulateFastK = []
    const accumulateFullK = []
    const lineData = data.map((datapoint, i, arr) => {
      const { close } = datapoint
      let fullD = null
      let fullK = null

      if (i >= SOperiod - 1) {
        const prevArr = arr.slice(i - SOperiod + 1, i + 1)
        const highs = prevArr.map(dp => dp.high)
        const lows = prevArr.map(dp => dp.low)
        const highestHigh = Math.max(...highs)
        const lowestLow = Math.min(...lows)
        const fastK = (close - lowestLow) / (highestHigh - lowestLow) * 100

        accumulateFastK.push(fastK)

        if (accumulateFastK.length > sma) accumulateFastK.shift()

        if (accumulateFastK.length === sma) {
          fullK = getSum(accumulateFastK) / sma

          accumulateFullK.push(fullK)

          if (accumulateFullK.length > sma) accumulateFullK.shift()

          if (accumulateFullK.length === sma) {
            fullD = getSum(accumulateFullK) / sma
          }
        }
      }

      return {
        ...datapoint,
        fullD,
        fullK
      }
    })

    return lineData
  }

  render () {
    const {
      limitLower,
      limitUpper,
      lineData,
      SOperiod,
      signalData,
      sma
    } = this.state
    const { height } = this.props

    return (
      <div>
        <h3>Stochastic Oscillator ({SOperiod}, {sma}, {sma})</h3>
        <ResponsiveContainer
          className='StochasticOscillator'
          height={height}
        >
          <ComposedChart
            data={lineData}
            syncId='syncChart'
          >
            <XAxis
              dataKey='date'
              interval='preserveStartEnd'
              tickFormatter={d => formatDate(d)}
            />
            <YAxis
              domain={[0, 100]}
              orientation='right'
            />
            <CartesianGrid
              strokeDasharray='2 2'
            />
            <Tooltip
              animationDuration={0}
              content={<Crosshair />}
              cursor={false}
            />
            <Line
              className='StochasticOscillator-fullK'
              dataKey='fullK'
              dot={false}
              isAnimationActive={false}
            />
            <Line
              className='StochasticOscillator-fullD'
              dataKey='fullD'
              dot={false}
              isAnimationActive={false}
            />
            <ReferenceLine
              className='StochasticOscillator-limit-lower'
              y={limitLower}
            />
            <ReferenceLine
              className='StochasticOscillator-limit-upper'
              y={limitUpper}
            />
            {signalData.length &&
              signalData.map(signal => (
                <ReferenceDot
                  className={`StochasticOscillator-signal-${signal.type}`}
                  isFront={true}
                  key={`signal-${signal.x}-${signal.y}`}
                  r={3}
                  x={signal.x}
                  y={signal.y}
                />
              ))
            }
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    )
  }
}

export default StochasticOscillator
