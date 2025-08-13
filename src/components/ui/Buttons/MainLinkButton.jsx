import Link from 'next/link'
import React from 'react'

const MainLinkButton = ({text, link}) => {
  return (
    <Link href={link} className='bg-primary px-8 py-3 font-semibold text-shadow-sm text-white rounded-xl hover:bg-primary/80 duration-300'>
        {text}
    </Link>
  )
}

export default MainLinkButton