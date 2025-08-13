import React from 'react'
import Logo from '../ui/Logo'

const AdminLogin = () => {
  return (
    <div className='w-[400px] flex flex-col items-center'>

      {/*================================================ */}
      {/* logo section */}
      {/*================================================ */}
      <Logo />  

      {/*================================================ */}
      {/* form section */}
      {/*================================================ */}
      <form action="" className='flex flex-col gap-4 mt-8'>
        <div className='user-input-section'>
          <label htmlFor="userName">Admin User Name</label>
          <input
            type="text"
            name='userName'
            placeholder='BRA-9020'
            required
          />
        </div>
        <div className='user-input-section'>
          <label htmlFor="password">Admin Password</label>
          <input
            type="password"
            name='password'
            placeholder='***********'
            required
          />
        </div>
        <button type='submit' className='btn'>
          Login
        </button>
      </form>
      
    </div>
  )
}

export default AdminLogin