import React from 'react'
import { Link } from 'react-router-dom'
import "./css/FootBar.scss"

const FootBar = () => {
    const currentDate = new Date().getFullYear()
    return (
        <div className='w-full' id='footBar'>
            <form className='flex flex-wrap bg-gray-100 items-center justify-center max-[800px]:p-2 p-5'>
                <span className='mr-5'>Enrégistrez votre couriel pour recevoir les actualités de la FIBREE <i class="fa-xl fa-solid text-green-400 fa-hand-point-right"></i></span>
                <div className='flex flex-1'>
                    <div className='bg-green-400 h-[40px] w-[40px] border-2 border-gray-300 flex justify-center items-center rounded-l-sm'>@</div>
                    <input type="email" placeholder='example@gmail.com' required name="" id="" className='outline-none border-l-none h-[40px] pl-2 flex-1 border-2 border-gray-300' />
                    <button type="submit" className='rounded-r-sm hover:bg-green-300 bg-green-400 rounded-full border-2 border-gray-300 flex justify-center items-center pl-5 pr-5'>Envoyer</button>
                </div>
            </form>
            <div className='border-t-3 bg-gray-300 border-gray-200 w-full flex flex-wrap max-[800px]:flex-col p-3'>
                <div className='flex-1 flex-wrap p-2 max-[800px]:items-center flex-col items-start flex'>
                    <Link to="/" className="">
                        <img src="./logo/logo.png" alt="Logo" className='h-[70px] w-[70px] border-3 border-gray-400  rounded-full' />
                    </Link>
                    <div className='text-nowrap mt-2'>Ouagadougou, Burkina Faso</div>                    <div className='hover:underline mt-3'>
                        <a className='underline-none' href="https://wa.me/0033614413987" target="_blank" rel="noopener noreferrer">(+33) 0 614 413-987</a>
                    </div>
                    <div className='flex flex-wrap '>
                        <div className='hover:underlined hover:bg-[var(--facebook)] bg-[white] m-2 rounded-full w-[max-content] border-3 border-gray-400'>
                            <a target='_blanked'
                                className='
                                h-[40px] w-[40px] 
                                flex justify-center items-center 
                                '
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
                            to="/about">À propos de nous
                        </Link>
                    </div>
                    <div className='hover:underline w-[max-content] m-2 mt-3'>
                        <Link className=""
                            to="/contact">Nos projets
                        </Link>
                    </div>
                    <div className='hover:underline w-[max-content] m-2 mt-3'>
                        <Link className=""
                            to="/partenaire">Devenir partenaire
                        </Link>
                    </div>
                </div>
                <div className='flex-1 flex-wrap p-2 max-[800px]:items-center flex-col items-start flex'>
                    <div className='hover:underline w-[max-content] m-2 mt-3'>
                        <Link className=""
                            to="/equipe">Notre équipe
                        </Link>
                    </div>
                    <div className='hover:underline w-[max-content] m-2 mt-3'>
                        <Link className=""
                            to="/contact">Nous contacter
                        </Link>
                    </div>
                    <div className='hover:underline w-[max-content] m-2 mt-3'>
                        <Link className=""
                            to="/nous-rejoindre">Rejoindre la FIBREE
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