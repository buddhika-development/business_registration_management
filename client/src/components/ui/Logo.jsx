import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Logo = () => {
  return (
    <div>
        <Link href={"/"} className='flex items-center gap-3'>

          {/* ================================== */}
          {/* government logo section */}
          {/* ================================== */}
          <div>
            <Image 
              src={"/logo/government-logo.png"}
              width={60}
              height={60}
              alt='Sri Lanka Government'
              className='w-[36px]'
            />
          </div>

                    
          {/* ================================== */}
          {/* Department name section */}
          {/* ================================== */}
          <div>
            <p className='leading-[1.2]'>Department of the <br />
            <span className='font-bold text-xl'>Company registration</span>
            </p>
          </div>

        </Link>
    </div>
  )
}

export default Logo