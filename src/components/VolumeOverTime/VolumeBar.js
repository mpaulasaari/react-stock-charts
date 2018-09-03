import React from 'react'
import './VolumeBar.scss'

const VolumeBar = (props) => {
  const {
    close,
    height,
    open,
    width,
    x,
    y
  } = props
  const dirUp = open - close < 0

  return (
    <g
      className={`VolumeBar ${dirUp ? 'up' : 'down'}`}
    >
      <rect
        className='bar'
        height={height}
        width={width}
        x={x}
        y={y}
      >
        {props.children}
      </rect>
    </g>
  )
};

export default VolumeBar
