import React from 'react'
import { Link } from 'react-router'

const LayoutAdmin = ({ link, name, bg_color, text_color, badge }) => {
    return (
        <Link to={link} style={{ backgroundColor: bg_color || 'var(--primary-green)', color: text_color || 'black' }} className="m-1 h-[160px] w-[160px] duration-100 rounded-xl hover:scale-105 hover:shadow-xl flex justify-center items-center p-2">
            <div>
                <h4 className='text-center'>{name}</h4>
                {badge > 0 ?
                    <div>
                        {badge > 99 ?
                            <div className='text-sky-50 position-relative top-[-80px] bg-red-500 h-[30px] w-[30px] flex justify-center items-center rounded-full'>+10</div> :
                            <div className='text-sky-50 position-relative top-[-80px] bg-red-500 h-[30px] w-[30px] flex justify-center items-center rounded-full'>{badge}</div>
                        }
                    </div> :
                    <div className='text-sky-50 position-relative top-[-80px] bg-transparent h-[30px] w-[30px] flex justify-center items-center rounded-full'></div>}
            </div>
        </Link>
    )
}

export default LayoutAdmin