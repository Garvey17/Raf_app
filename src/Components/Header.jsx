import Image from 'next/image'
import React from 'react'
import Toggle from './Toggle'
// import {logoAsset} from '@/data/productData.js'


function Header() {

  return (
    <div className='py-5 px-5 md:px-12 lg:px-28'>
        <Toggle/>
    </div>
  )
}

export default Header