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
import {
  formatDate,
  getSignalDataWithLimits
} from 'helpers/functions.js'
import Crosshair from 'components/Crosshair'
import './RelativeStrengthIndex.scss'

const sumGain = (a, b) => {
  const aVAlue = typeof a === 'number' ? a : a.gain
  const bVAlue = typeof b === 'number' ? b : b.gain

  return aVAlue + bVAlue
}

const sumLoss = (a, b) => {
  const aVAlue = typeof a === 'number' ? a : a.loss
  const bVAlue = typeof b === 'number' ? b : b.loss

  return aVAlue + bVAlue
}

const getRSI = (rs) => {
  return 100 - (100 / (1 + rs))
}

const getSmoothAvg = (prevAvg, change, RSIperiod) => {
  const avg = ((prevAvg * (RSIperiod - 1)) + change) / RSIperiod

  return avg
}

const getChange = (close, prevClose) => {
  if (!prevClose) return null

  const change = close - prevClose

  return {
    gain: change > 0 ? change : 0,
    loss: change < 0 ? Math.abs(change) : 0
  }
}

class RelativeStrengthIndex extends Component {
  state = {
    lineData: [],
    limitLower: 30,
    limitUpper: 70,
    signalData: [],
    RSIperiod: 14,
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
    const signalData = getSignalDataWithLimits(
      lineData,
      this.state.limitLower,
      this.state.limitUpper,
      'rsi'
    )

    this.setState({
      lineData,
      signalData
    })
  }

  getLineData = (data) => {
    const { RSIperiod } = this.state
    const accumulateGainLoss = []
    let prevClose = null;
    let gainAvg = null
    let lossAvg = null

    const lineData = data.map((datapoint, i, arr) => {
      const { close } = datapoint
      const change = getChange(close, prevClose)
      let rs = null
      let rsi = null

      if (i < RSIperiod) {
        if (change) accumulateGainLoss.push(change)

        gainAvg = accumulateGainLoss.length > 1 ? accumulateGainLoss.reduce(sumGain) / RSIperiod : 0
        lossAvg = accumulateGainLoss.length > 1 ? accumulateGainLoss.reduce(sumLoss) / RSIperiod : 0
      }

      if (i >= RSIperiod) accumulateGainLoss.shift()

      if (i === RSIperiod) {
        rs = gainAvg / lossAvg
        rsi = getRSI(rs)
      } else if (i > RSIperiod) {
        gainAvg = getSmoothAvg(gainAvg, change.gain, RSIperiod)
        lossAvg = getSmoothAvg(lossAvg, change.loss, RSIperiod)
        rs = gainAvg / lossAvg
        rsi = getRSI(rs)
      }

      prevClose = close

      return {
        ...datapoint,
        rsi
      }
    })

    return lineData
  }

  render () {
    const {
      limitLower,
      limitUpper,
      lineData,
      RSIperiod,
      signalData
    } = this.state
    const { height } = this.props

    return (
      <div>
        <h3>RSI ({RSIperiod})</h3>
        <ResponsiveContainer
          className='RelativeStrengthIndex'
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
              dataKey='rsi'
              dot={false}
              isAnimationActive={false}
            />
            <ReferenceLine
              className='RelativeStrengthIndex-limit-lower'
              y={limitLower}
            />
            <ReferenceLine
              className='RelativeStrengthIndex-limit-upper'
              y={limitUpper}
            />
            {signalData.length &&
              signalData.map(signal => (
                <ReferenceDot
                  className={`RelativeStrengthIndex-signal-${signal.type}`}
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

export default RelativeStrengthIndex
