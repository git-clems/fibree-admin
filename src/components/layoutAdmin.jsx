import React from 'react'
import { Link } from 'react-router'

const LayoutAdmin = ({ link, name, bg_color, text_color }) => {
    return (
        <Link to={link} style={{backgroundColor: bg_color || 'var(--primary-green)', color : text_color || 'black'}} className="m-1 h-[160px] w-[160px] duration-100 rounded-xl hover:scale-105 hover:shadow-xl flex justify-center items-center p-2">
            <h4 className='text-center'>{name}</h4>
        </Link>
    )
}

export default LayoutAdmin