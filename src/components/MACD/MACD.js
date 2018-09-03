import React, { Component } from 'react'
import {
  Bar,
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
import {
  getEMA,
  getSum,
  formatDate
} from 'helpers/functions'
import Crosshair from 'components/Crosshair'
import './MACD.scss'

class MACD extends Component {
  state = {
    EMAperiod1: 12,
    EMAperiod2: 26,
    EMAperiodSignal: 9,
    lineData: [],
    signalData: []
  }

  componentWillMount() {
    this.generateRSI(this.props.data)
  }

  componentWillReceiveProps(nextProps) {
    this.generateRSI(nextProps.data)
  }

  generateRSI = (data) => {
    if (!data || !data.length) return []

    const lineData = this.getLineData(data)
    const signalData = this.getSignalData(lineData)

    this.setState({
      lineData,
      signalData
    })
  }

  getLineData = (data) => {
    const accumulateCloses = []
    const accumulateMACD = []
    let ema1 = null
    let ema2 = null

    const lineData = data.map((datapoint, i, arr) => {
      const {
        EMAperiod1,
        EMAperiod2,
        EMAperiodSignal
      } = this.state
      const { close } = datapoint
      let histogram = null
      let macd = null
      let signal = null

      if (i < EMAperiod2) {
        accumulateCloses.push(close)
      } else {
        if (!ema1 && !ema2) {
          ema1 = getSum(accumulateCloses.slice(0, (EMAperiod1))) / EMAperiod1
          ema2 = getSum(accumulateCloses) / EMAperiod2
        }

        ema1 = getEMA(close, ema1, EMAperiod1)
        ema2 = getEMA(close, ema2, EMAperiod2)
        macd = ema1 - ema2

        accumulateMACD.push(macd)

        if (accumulateMACD.length === EMAperiodSignal) {
          signal = getSum(accumulateMACD) / EMAperiodSignal
          accumulateMACD.shift()
          histogram = macd - signal
        }
      }

      return {
        ...datapoint,
        histogram,
        macd,
        signal
      }
    })

    return lineData
  }

  getSignalData = (lineData) => {
    const signalData = []

    lineData.forEach((curr, i, arr) => {
      const prev = arr[i - 1]

      if (prev && prev.histogram < 0 && curr.histogram > 0) {
        signalData.push({
          type: 'up',
          x: curr.date,
          y: 0
        })
      }

      if (prev && prev.histogram > 0 && curr.histogram < 0) {
        signalData.push({
          type: 'down',
          x: curr.date,
          y: 0
        })
      }
    })

    return signalData
  }

  render () {
    const {
      EMAperiod1,
      EMAperiod2,
      EMAperiodSignal,
      lineData,
      signalData
    } = this.state
    const { height } = this.props

    return (
      <div>
        <h3>MACD ({EMAperiod1}, {EMAperiod2}, {EMAperiodSignal})</h3>
        <ResponsiveContainer
          className='MACD'
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
            <Bar
              className='MACD-bar'
              dataKey='histogram'
              isAnimationActive={false}
            />
            <Line
              className='MACD-line1'
              dataKey='macd'
              dot={false}
              isAnimationActive={false}
            />
            <Line
              className='MACD-line2'
              dataKey='signal'
              dot={false}
              isAnimationActive={false}
            />
            <ReferenceLine
              className='RelativeStrengthIndex-limit-middle'
              y={0}
            />
            {signalData.length &&
              signalData.map(signal => (
                <ReferenceDot
                  className={`MACD-signal-${signal.type}`}
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

export default MACD
