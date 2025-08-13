//import React, { Children } from 'react'

const ContactTitle = ({children, className}) => {
  return (
    <h className={`leading-[1.2] ${className}`}>{children}</h>
  )
}

export default ContactTitle