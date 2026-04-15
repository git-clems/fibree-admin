import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import "./css/appBar.scss"

const SmallAppBar = () => {
    const [showAppBar, setShowAppBar] = useState(true);
    const [hasShadow, setHasShadow] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [open, isOpen] = useState(false)


    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            setHasShadow(currentScrollY > 0);

            if (currentScrollY < 50) {
                setShowAppBar(true);
            } else if (currentScrollY > lastScrollY) {
                setShowAppBar(false);
            } else {
                setShowAppBar(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    return (
        <div className={`
        small-app-bar fixed top-0 left-0 w-full h-[80px] bg-white z-50
        justify-between items-center
        transition-all duration-300
        select-none
        ${showAppBar ? 'translate-y-0' : '-translate-y-full'}
        ${hasShadow ? 'shadow-md' : ''}
      `}>

            <Link to="/" className="logo w-[10vw] min-w-[100px] ml-5 mr-1 transition-all duration-300">
                <img src="./logo/logo-nom.png" alt="Logo" />
            </Link>

            <div onClick={() => isOpen(!open)} className='cursor-pointer mr-5'>
                {
                    open ? <i class="fa-2xl fa-solid fa-xmark"></i> : <i class="fa-2xl fa-solid fa-bars"></i>
                }
                {
                    open &&
                    <div className="absolute bg-gray-100  shadow-md w-full top-[80px] left-0">
                        <div className='flex flex-col border-t-1 border-gray-300'>
                            <NavLink
                                className="hover:bg-[var(--primary-green)] p-2"
                                to="/a-propos">
                                <h6>À propos de nous</h6>
                            </NavLink>

                            {/* <NavLink
                                className="hover:bg-[var(--primary-green)] p-2"
                                to="/action">
                                <h6>Nos actions</h6>
                            </NavLink> */}

                            <NavLink
                                className="hover:bg-[var(--primary-green)] p-2"
                                to="/mission">
                                <h6>Nos missions</h6>
                            </NavLink>

                            <NavLink
                                className="hover:bg-[var(--primary-green)] p-2"
                                to="/soutenir">
                                <h6>Nous soutenir</h6>
                            </NavLink>
                        </div>

                        <div className="flex flex-col border-t-1 -1 border-gray-300">
                            <NavLink
                                className="hover:bg-[var(--primary-green)] p-2 flex justify-between items-center"
                                to="/contact">
                                <h6>Nous contacter</h6>
                                <i className="fa-solid fa-phone mr-2"></i>
                            </NavLink>

                            <NavLink
                                className="hover:bg-[var(--primary-green)] p-2 flex justify-between items-center"
                                to="/rejoindre">
                                <h6>Nous rejoindre</h6>
                                <i class="fa-solid fa-arrows-down-to-people mr-2"></i>
                            </NavLink>
                        </div>
                    </div>
                }
            </div>

        </div>
    );
};

export default SmallAppBar;