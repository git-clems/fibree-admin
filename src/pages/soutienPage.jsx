import React from 'react'
import { Link } from 'react-router'

const Soutien = () => {
  return (
    <div className='page '>
      <div className='flex flex-1 justify-evenly flex-wrap'>
        <Link to={'/devenir-partenaire'} target='_blank' className="m-1 h-[160px] w-[320px] duration-100 rounded-xl hover:scale-105 bg-black text-white hover:shadow-xl flex justify-center items-center p-2">
          <h4 className='text-center'>Devenez partenaire de la FIBREE</h4>
        </Link>
        <Link to={'/faire-un-don'} target='_blank' className="m-1 h-[160px] w-[320px] duration-100 rounded-xl hover:scale-105 bg-[rgba(50,205,50,0.6)] text-white hover:shadow-xl flex justify-center items-center p-2">
          <h4 className='text-center'>Faire un don à la fédération</h4>
        </Link>
        <Link to={'/formateur'} target='_blank' className="m-1 h-[160px] w-[320px] duration-100 rounded-xl hover:scale-105 bg-[rgba(100,20,0,1)] text-white hover:shadow-xl flex justify-center items-center p-2">
          <h4 className='text-center'>Partagez votre expertise entrepreunarial</h4>
        </Link>
      </div>
    </div>
  )
}

export default Soutien