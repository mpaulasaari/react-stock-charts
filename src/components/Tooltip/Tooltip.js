import React from 'react'
import './Tooltip.scss'

const Tooltip = ({ children }) => {
  return (
    <div
      className='Tooltip'
    >
      {children}
    </div>
  )
}

export default Tooltip
