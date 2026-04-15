import React from 'react'
import { Link } from 'react-router-dom'
import "./css/FootBar.scss"

const FootBar = () => {
    const currentDate = new Date().getFullYear()
    return (
        <div className='w-full' id='footBar'>
            <div className='border-t-3 bg-gray-50 border-gray-200 w-full flex flex-wrap max-[800px]:flex-col p-3'>
                <div className='flex-1 flex-wrap p-2 max-[800px]:items-center flex-col items-start flex'>
                    <Link to="/" className="">
                        <img src="/logo/logo.png" alt="Logo" className='h-[70px] w-[70px] border-3 border-gray-500  rounded-full' />
                    </Link>
                    <div className='text-nowrap mt-2'>Ouagadougou, Burkina Faso</div>                    <div className='hover:underline mt-3'>
                        <a className='underline-none' href="https://wa.me/0033614413987" target="_blank" rel="noopener noreferrer">(+33) 0 614 413-987</a>
                    </div>
                    <div className='flex flex-wrap '>
                        <div className='hover:underlined hover:bg-[var(--facebook)] bg-[white] m-2 rounded-full w-[max-content] border-3 border-gray-400'>
                            <a target='_blanked'
                                className='
                                h-[40px] w-[40px] 
                                flex justify-center items-center '
                                href='https://www.facebook.com/profile.php?id=61551099549905'
                            ><i class="fa-brands fa-facebook-f"></i>
                            </a>
                        </div>
                        <div className='hover:underlined hover:bg-green-400 bg-[white] m-2 rounded-full w-[max-content] border-3 border-gray-400'>
                            <a target='_blanked'
                                className='
                                h-[40px] w-[40px] 
                                flex justify-center items-center'
                                href="mailto:clement2bamogo@gmail.com"
                            ><i class="fa-regular fa-envelope"></i>
                            </a>
                        </div>
                    </div>
                </div>
                <div className='flex-1 flex-wrap p-2 max-[800px]:items-center flex-col items-start flex'>
                    <div className='hover:underline w-[max-content] m-2 mt-3'>
                        <Link className=""
                            to="/a-propos">À propos de nous
                        </Link>
                    </div>
                    {/* <div className='hover:underline w-[max-content] m-2 mt-3'>
                        <Link className=""
                            to="">Nos projets
                        </Link>
                    </div> */}
                    <div className='hover:underline w-[max-content] m-2 mt-3'>
                        <Link className=""
                            to="/devenir-partenaire">Devenir partenaire
                        </Link>
                    </div>
                </div>
                <div className='flex-1 flex-wrap p-2 max-[800px]:items-center flex-col items-start flex'>
                    {/* <div className='hover:underline w-[max-content] m-2 mt-3'>
                        <Link className=""
                            to="/equipe">Notre équipe
                        </Link>
                    </div> */}
                    <div className='hover:underline w-[max-content] m-2 mt-3'>
                        <Link className=""
                            to="/contact">Nous contacter
                        </Link>
                    </div>
                    <div className='hover:underline w-[max-content] m-2 mt-3'>
                        <Link className=""
                            to="/rejoindre">Rejoindre la FIBREE
                        </Link>
                    </div>

                </div>
            </div>
            <div className='bg-gray-500 flex-wrap p-2 pb-3 max-[800px]:flex-col items-center justify-center flex'>
                <span className='text-nowrap m-3 text-white'><i class="fa-regular fa-copyright"></i> {currentDate} FIBREE</span>
                <div className='flex max-[800px]:flex-col items-center'>
                    <div className='hover:underline '>
                        <Link className='m-3 text-nowrap text-white'>Mention legale</Link>
                    </div>
                    <div className='hover:underline'>
                        <Link className='m-3 text-nowrap min-[800px]:border-l-1 min-[800px]:pl-3 text-white'>Condition d'utilisation</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FootBar