import React from 'react'

const MainTitle = ({title, className}) => {
  return (
    <h1 className={`leading-[1.3] ${className}`}>{title}</h1>
  )
}

export default MainTitle