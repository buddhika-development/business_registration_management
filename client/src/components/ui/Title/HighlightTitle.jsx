// import React, { Children } from 'react'

const HighlightTitle = ({children, className}) => {
  return (
    <h1 className={`leading-[1.2] ${className}`}>{children}</h1>
  )
}

export default HighlightTitle