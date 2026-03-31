import React, { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import "./css/appBar.scss"

const AppBar = () => {
    const [showAppBar, setShowAppBar] = useState(true);
    const [hasShadow, setHasShadow] = useState(false);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Ombre si on a scrollé
            setHasShadow(currentScrollY > 0);

            // Toujours afficher en haut de page
            if (currentScrollY < 50) {
                setShowAppBar(true);
            } else if (currentScrollY > lastScrollY) {
                // Scroll vers le bas => masquer
                setShowAppBar(false);
            } else {
                // Scroll vers le haut => afficher
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
        app-bar fixed top-0 left-0 w-full h-[80px] bg-white z-50 
        justify-between items-center
        select-none
        transition-all duration-300
        ${showAppBar ? 'translate-y-0' : '-translate-y-full'}
        ${hasShadow ? 'shadow-md' : ''}
      `}>
            <Link to="/" className="logo min-w-[50px] w-[10vw] ml-1 mr-1">
                <img src="./logo/logo-nom.png" alt="Logo" />
            </Link>

            <div className="flex items-center border-l-2 border-r-2 border-gray-300">
                <NavLink className="hover:bg-[var(--primary-green)] ml-1 mr-1 pl-3 pr-3 rounded-full pt-1 pb-1"
                    to="/a-propos">
                    À propos de nous
                </NavLink>

                <NavLink className="hover:bg-[var(--primary-green)] ml-1 mr-1 pl-3 pr-3 rounded-full pt-1 pb-1"
                    to="/action">
                    Nos actions
                </NavLink>

                <NavLink className="hover:bg-[var(--primary-green)] ml-1 mr-1 pl-3 pr-3 rounded-full pt-1 pb-1"
                    to="/mission">
                    Notre mission
                </NavLink>

                <NavLink className="hover:bg-[var(--primary-green)] ml-1 mr-1 pl-3 pr-3 rounded-full pt-1 pb-1"
                    to="/projet">
                    Nos projets
                </NavLink>

                <NavLink className="hover:bg-[var(--primary-green)] ml-1 mr-1 rounded-full pl-3 pr-3 pt-1 pb-1"
                    to="/soutenir">
                    Nous soutenir
                </NavLink>
            </div>

            <div className="flex justify-center items-center ml-1">
                <NavLink className="hover:bg-[var(--primary-green)] flex justify-center items-center ml-1 mr-1 pl-3 pr-3 pt-1 pb-1 rounded-full"
                    to="/contact">
                    <i className="fa-solid fa-phone mr-2"></i>
                    Nous contacter
                </NavLink>

                <NavLink className="hover:bg-[var(--primary-green)] flex justify-center items-center ml-1 mr-1 pl-3 pr-3 pt-1 pb-1 rounded-full"
                    to="/rejoindre">
                    <i class="fa-solid fa-arrows-down-to-people mr-2"></i>
                    Nous rejoindre
                </NavLink>
            </div>
        </div>
    );
};

export default AppBar;