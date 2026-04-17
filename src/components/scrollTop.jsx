import React, { useEffect, useState } from 'react'

const ScrollTop = () => {
  const [position, setPosition] = useState(0)

  const GoUp = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const handleScroll = () => {
      setPosition(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <button
      style={{ borderRadius: '100%' }}
      className={`bg-white text-black rounded-full ${
        position > 50 ? 'block' : 'hidden'
      } fixed bottom-10 right-10 h-12 w-12 shadow-[0_0_15px_rgba(0,0,0,0.9)] border-sky-50 flex justify-center items-center cursor-pointer`}
      onClick={GoUp}
    >
      <i className="fa-solid fa-angles-up"></i>
    </button>
  )
}

export default ScrollTop