import React from 'react'
import { Link } from 'react-router'

const Page404 = ({ message, prev, prevLink, errorNumber }) => {
  return (
    <div className='w-full h-[100vh] flex justify-center items-center flex-col'>
      <h1 ><span className='text-red-500'>{errorNumber ? errorNumber : '404'}</span></h1>
      <h2 className='text-red-500 text-center'>{message ? message : "Page non trouvée"}</h2>
      <Link to={prevLink ? prevLink : '/'} className='bg-green-500 pt-1 pb-1 pl-5 pr-5 rounded-full hover:bg-green-400 text-white'><i class="fa-solid fa-arrow-left"></i> {prev ? prev : "Revenir à l'accueil"}</Link>
    </div>
  )
}

export default Page404