//import React, { Children } from 'react'

const ContactTitle = ({children, className}) => {
  return (
    <div className={`leading-[1.2] ${className}`}>{children}</div>
  )
}

export default ContactTitle