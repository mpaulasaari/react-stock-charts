import React from 'react'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import {
  formatBigNumber,
  formatDate
} from 'helpers/functions'
import Crosshair from 'components/Crosshair'
import VolumeBar from './VolumeBar'

const VolumeOverTime = (props) => {
  const { height } = props

  return (
    <ResponsiveContainer
      height={height}
      syncId='syncChart'
    >
      <ComposedChart
        data={props.data}
        syncId='syncChart'
      >
        <XAxis
          dataKey='date'
          interval='preserveStartEnd'
          tickFormatter={d => formatDate(d)}
        />
        <YAxis
          dataKey='volume'
          orientation='right'
          tickFormatter={d => formatBigNumber(d, 1)}
        />
        <CartesianGrid
          strokeDasharray='2 2'
        />
        <Tooltip
          animationDuration={0}
          content={
            <Crosshair
              data={props.data}
              type='volume'
            />
          }
          cursor={false}
        />
        <Bar
          dataKey='volume'
          isAnimationActive={false}
          shape={<VolumeBar />}
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

export default VolumeOverTime
