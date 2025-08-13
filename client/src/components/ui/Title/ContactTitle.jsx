import React, { Children } from 'react'

const ContactTitle = ({children, className}) => {
  return (
    <h6 className={`leading-[1.2] ${className}`}>{children}</h6>
  )
}

export default ContactTitle