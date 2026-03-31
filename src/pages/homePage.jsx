import Missions from "../components/mission"
import MyCarousel from "../components/carousel"
import Info from "../components/info"
import axios from 'axios'
import { useEffect, useState } from "react"
import { Link } from "react-router"
import Partenaires from "../components/partenaires"
import Chiffres from "../components/chiffres"
import FlashInfo from "../components/flashInfo"


const Home = () => {
    const [infos, setInfos] = useState([])
    const [partenaires, setPartenaires] = useState([])
    const [chiffres, setChiffres] = useState([])
    const [flashInfos, setFlashInfos] = useState([])

    useEffect(() => {
        const fectData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/info')
                setInfos(response.data)
            } catch (error) {
                console.log(error);
            }
        };
        fectData();
    }, [])

    useEffect(() => {
        const fectData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/partenaire')
                setPartenaires(response.data)
                console.log(response.data);
            } catch (error) {
                console.log(error);
            }
        };
        fectData();
    }, [])

    useEffect(() => {
        const dataFect = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/partenaire')
                setChiffres(response.data)

            } catch (error) {
                console.log(error);
            }
        };
        dataFect()
    }, [])

    useEffect(() => {
        const dataFect = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/flash')
                setFlashInfos(response.data)
            } catch (error) {
                console.log(error);
            }
        };
        dataFect()
    }, [])

    return (
        <div className="page">
            <section className="flex flex-wrap items- justify-center p-2">
                <div className='overflow-hidden rounded-md w-[60%] max-[800px]:w-[100%] bg-[url(./bg/bg1.png)] bg-cover'>
                    <Link to={'admin/affiche'} className="position-static top-3 border-2 m-3 rounded-full w-[40px] h-[40px] flex justify-center items-center bg-[white] hover:bg-gray-400">
                        <i class="fa-solid fa-pencil"></i>
                    </Link>
                    <MyCarousel />
                </div>

                {
                    flashInfos &&
                    <div className="flex-1 mr-2 mb-2 mt-2 p-2">
                        <div className="flex justify-between items-center">
                            <h3 className="text-red-500">À la une</h3>
                            <Link to={'admin/flash-info'} className="border-2 m-3 rounded-full w-[40px] h-[40px] flex justify-center items-center bg-[white] hover:bg-gray-400">
                                <i class="fa-solid fa-pencil"></i>
                            </Link>
                        </div>
                        {flashInfos.slice(0, 3).map((flashInfo) => (<FlashInfo flashInfoId={flashInfo._id} />))}
                    </div>
                }

            </section>
            <section className="mt-  rounded-2xl flex justify-evenly flex-wrap m-2">
                <div className="flex-1 pl-2 pr-2 pb-2 max-w-120">
                    <h2>Qu'est-ce que la FIBREE ?</h2>
                    <p className="text-justify">Donner une définition de la fibrée en quelque mots Donner une définition de la fibrée en quelque mots Donner une définition de la fibrée en quelque mots Donner une définition de la fibrée en quelque mots Donner une définition de la fibrée en quelque mots </p>
                    <Link to={'/a-propos'} className="bg-green-400 hover:bg-green-300 pl-2 pr-2 pt-2 pb-2 m-2 rounded-2">
                        <span className="text-nowrap">En savoir plus sur la FIBREE <i class="fa-solid fa-arrow-right"></i></span>
                    </Link>
                </div>
                <Missions></Missions>

                <Link to={'admin/mission'} className="border-2 rounded-full w-[40px] h-[40px] flex justify-center items-center bg-[white] hover:bg-gray-400">
                    <i class="fa-solid fa-pencil"></i>
                </Link>
            </section>
            {(infos && infos.length > 0) &&
                <section className="bg-[var(--blue-sky)] pt-3 pb-3 max-[800px]:p-0 m-2 rounded-3 mt-5 shadow-[0_0_3px_grey]">
                    <div className="flex items-center">
                        <h2 className="max-[800px]:ml-3 ml-5"> Nos dernières actualités</h2>
                        <Link to={'/admin/actualite'} className="border-2 max-[800px]:ml-2 ml-5 rounded-full w-[40px] h-[40px] flex justify-center items-center bg-[white] hover:bg-gray-400">
                            <i class="fa-solid fa-pencil"></i>
                        </Link>
                    </div>
                    <div className="flex-1 flex flex-wrap justify-center">
                        {infos.slice(0, 3).map((info) => ((<Info infoId={info._id}></Info>)))}
                    </div>
                    <Link to={'/actualite'} className="ml-5 bg-green-400 hover:bg-green-300 p-2 rounded-2">
                        <span className="text-nowrap">Voir les actualités de la FIBREE <i class="fa-solid fa-arrow-right"></i></span>
                    </Link>
                </section>
            }
            {
                (partenaires && partenaires.length > 0) &&
                <section className="max-[800px]:p-0 m-2 mt-5">
                    <div className="flex items-center">
                        <h2 className="ml-3">Nos partenaires</h2>
                        <Link to={'/admin/partenaire'} className="border-2 max-[800px]:ml-2 ml-5 rounded-full w-[40px] h-[40px] flex justify-center items-center bg-[white] hover:bg-gray-400">
                            <i class="fa-solid fa-pencil"></i>
                        </Link>
                    </div>
                    <Partenaires></Partenaires>
                </section>
            }
            {
                (partenaires && partenaires.length > 0) &&
                <section className="max-[800px]:p-0 m-2 bg-gray-100 p-3 rounded-md mt-5">
                    <div className="flex items-center">
                        <h2 className="ml-3">Chiffres clés</h2>
                        <Link to={'/admin/partenaire'} className="border-2 max-[800px]:ml-2 ml-5 rounded-full w-[40px] h-[40px] flex justify-center items-center bg-[white] hover:bg-gray-400">
                            <i class="fa-solid fa-pencil"></i>
                        </Link>
                    </div>

                    <div className="flex-1 flex flex-wrap justify-center items-start">
                        <div className="flex min-[800px]:hidden flex-wrap justify-center">
                            {chiffres.slice(0, 4).map((chiffre) => (<Chiffres chiffreId={chiffre._id}></Chiffres>))}
                        </div>
                        <div className="flex max-[800px]:hidden flex-wrap justify-center">
                            {chiffres.map((chiffre) => (<Chiffres chiffreId={chiffre._id}></Chiffres>))}
                        </div>
                        <Link to={'/chiffre'} className="min-[800px]:hidden bg-green-400 hover:bg-green-300 p-2 rounded-2">
                            <span className="text-nowrap">Voir plus de chiffres de la FIBREE <i class="fa-solid fa-arrow-right"></i></span>
                        </Link>
                    </div>
                </section>
            }
        </div>
    )
}

export default Home