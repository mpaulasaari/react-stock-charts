import React from 'react'
import './CandleStick.scss'

const CandleStick = (props) => {
  const {
    close,
    height,
    high,
    low,
    open,
    width,
    x,
    y
  } = props
  const multiplier = height / high
  const dirUp = open - close < 0
  const maxOpenClose = Math.max(open, close)
  const rectHeightReal = Math.abs(open - close) * multiplier
  const rectHeight = rectHeightReal > 1 ? rectHeightReal : 1
  const rectY = y + ((high - maxOpenClose) * multiplier)
  const lineHeight = (high - low) * multiplier
  const lineY = y

  return (
    <g
      className={`CandleStick ${dirUp ? 'up' : 'down'}`}
    >
      <line
        className='CandleStick-highLow'
        x1={x + (width / 2) - 0.5}
        y1={lineY}
        x2={x + (width / 2) - 0.5}
        y2={lineY + lineHeight}
      />
      <rect
        className='CandleStick-openClose'
        height={rectHeight}
        width={width}
        x={x}
        y={rectY}
      >
        {props.children}
      </rect>
    </g>
  )
}

export default CandleStick
