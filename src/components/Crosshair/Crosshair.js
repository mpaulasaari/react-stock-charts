import React from 'react'
import { formatBigNumber } from 'helpers/functions'
import './Crosshair.scss'

const Crosshair = (props) => {
  const {
    coordinate,
    data,
    label,
    type,
    viewBox
  } = props
  const values = (data && data.find(d => d.date === label)) || {}
  let tooltipClasses = ''

  tooltipClasses += coordinate.x > (viewBox.width - 100) ? 'Crosshair-tooltip_left' : ''
  tooltipClasses += coordinate.y > (viewBox.height - 50) ? 'Crosshair-tooltip_top' : ''

  return (
    <div
      className='Crosshair'
    >
      <div
        className='Crosshair-horizontal'
        style={{
          left: viewBox.left,
          top: coordinate.y,
          width: viewBox.width,
        }}
      />
      <div
        className='Crosshair-vertical'
        style={{
          left: coordinate.x,
          top: viewBox.top,
          height: 2000,
        }}
      />
      <div
        className='Crosshair-xLabel'
        style={{
          left: coordinate.x,
          top: viewBox.height,
        }}
      >
        {label}
      </div>
      {type &&
        <div
          className={`Crosshair-tooltip ${tooltipClasses}`}
          style={{
            left: coordinate.x,
            top: coordinate.y,
          }}
        >
          <p><span className='label'>O:</span> {values.open}</p>
          <p><span className='label'>H:</span> {values.high}</p>
          <p><span className='label'>C:</span> {values.close}</p>
          <p><span className='label'>L:</span> {values.low}</p>
          <p><span className='label'>V:</span> {formatBigNumber(values.volume, 1)}</p>
        </div>
      }
    </div>
  )
}

export default Crosshair
