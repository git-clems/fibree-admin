import React from 'react'

const Loading = () => {
  return (
    <div className='w-full h-[100vh] bg-[var(--primary-green)] flex justify-center items-center'>
      <div class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
  )
}

export default Loading