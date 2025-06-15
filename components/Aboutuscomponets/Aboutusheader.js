import Image from 'next/image'
import React from 'react'

const Aboutusheader = ({image1,image2,title}) => {
  return (
    <div className='relative hidden md:block mt-44'>
        <Image src={image1} alt="aboutus" className='w-full relative'/>
        {/* <div className='absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 '>
        <Image src={image2} alt='Aboutbrindah' className='object-contain'/>
        </div> */}
        <div className='absolute transform -translate-x-1/2 -translate-y-1/2 left-1/3 top-1/2 '>
         <p className='text-white font-bold text-5xl '>{title}</p>
        </div>
    </div>
  )
}

export default Aboutusheader