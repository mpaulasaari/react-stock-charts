import React, { Component } from 'react'
import {
  CartesianGrid,
  Line,
  ComposedChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import {
  formatDate,
  getRound,
  getSignalDataSMA,
  getSum
} from 'helpers/functions'
import Crosshair from 'components/Crosshair'
import './SimpleMovingAverage.scss'

class SimpleMovingAverage extends Component {
  state = {
    lineData: [],
    signalData: [],
    sma1: 50,
    sma2: 200,
  }

  componentWillMount() {
    this.generateSMA(this.props.data)
  }

  componentWillReceiveProps(nextProps) {
    this.generateSMA(nextProps.data)
  }

  generateSMA = (data) => {
    if (!data || !data.length) return []

    const lineData = this.getLineData(data)
    const signalData = getSignalDataSMA(lineData)

    this.setState({
      lineData,
      signalData
    })
  }

  getLineData = (data) => {
    const sma1accumulate = []
    const sma2accumulate = []
    const lineData = data.map((datapoint, i, arr) => {
      const sma1 = this.state.sma1 / datapoint.timePeriod
      const sma2 = this.state.sma2 / datapoint.timePeriod
      let smaValues = {}

      sma1accumulate.push(datapoint.close)
      sma2accumulate.push(datapoint.close)

      if (i >= sma1) {
        sma1accumulate.shift()
        smaValues.sma1 = sma1accumulate.reduce(getSum) / sma1
      }

      if (i >= sma2) {
        sma2accumulate.shift()
        smaValues.sma2 = sma2accumulate.reduce(getSum) / sma2
      }

      return {
        ...datapoint,
        sma1: getRound(smaValues.sma1, 2),
        sma2: getRound(smaValues.sma2, 2)
      }
    })

    return lineData
  }

  render () {
    const {
      lineData,
      signalData,
      sma1,
      sma2
    } = this.state
    const { height } = this.props

    return (
      <div>
        <h3>SMA ({sma1}, {sma2})</h3>
        <ResponsiveContainer
          className='SimpleMovingAverage'
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
              dataKey='high'
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
              className='SimpleMovingAverage-line1'
              dataKey='sma1'
              dot={false}
              isAnimationActive={false}
            />
            <Line
              className='SimpleMovingAverage-line2'
              dataKey='sma2'
              dot={false}
              isAnimationActive={false}
            />
            {signalData.length &&
              signalData.map(signal => (
                <ReferenceDot
                  className={`SimpleMovingAverage-signal-${signal.type}`}
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

export default SimpleMovingAverage
