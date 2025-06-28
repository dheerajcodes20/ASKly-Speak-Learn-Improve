import { UserButton } from '@stackframe/stack'
import Image from 'next/image'
import React from 'react'

function AppHeader() {
  return (
    <div className='p-3 shadow-sm flex justify-between items-center bg-white '>

     <div className='text-4xl font-bold text-black ml-4'>Talk<span className='text-blue-600'>Tutor</span></div>
     <UserButton/>
    </div>
  )
}

export default AppHeader
