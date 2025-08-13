import React, { Children } from 'react'

const AboutUsTitle = ({children, className}) => {
  return (
    <h6 className={`leading-[1.2] ${className}`}>{children}</h6>
  )
}

export default AboutUsTitle