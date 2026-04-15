import React from 'react'
import { Link } from 'react-router'

const Rejoindre = () => {
  return (
    <div className='page  items-center flex'>
      <div className='flex flex-1 justify-evenly flex-wrap'>
        <div>
          {/* <span>Vous avez entendu parlé de la FIBREE ? Vous avez aimez nos idées, Vous </span> */}
          <Link to={'/rejoindre/spontane'} target='_blank' className="m-1 h-[160px] w-[320px] duration-100 rounded-xl hover:scale-105 bg-black text-white hover:shadow-xl flex justify-center items-center p-2">
            <h4 className='text-center'>Nous rejoindre spontanement</h4>
          </Link>
        </div>
        <Link to={'/rejoindre/session'} target='_blank' className="m-1 h-[160px] w-[320px] duration-100 rounded-xl hover:scale-105 bg-[rgba(50,205,50,0.6)] text-white hover:shadow-xl flex justify-center items-center p-2">
          <h4 className='text-center'>Session spéciale d'hadhésion</h4>
        </Link>
      </div>
    </div>
  )
}

export default Rejoindre