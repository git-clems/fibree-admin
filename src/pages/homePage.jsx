import Missions from "../components/mission"
import MyCarousel from "../components/carousel"
import Info from "../components/info"
import axios from 'axios'
import { useEffect, useState } from "react"
import { Link } from "react-router"
import Partenaires from "../components/partenaires"
import Event from "../components/event"
import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import { db } from "../auth/firebase"
import Loading from "../components/LoadingPage"
import Statistic from '../components/statistics'


const Home = () => {
    const [infos, setInfos] = useState()
    const [events, setEvents] = useState()
    const [partenaires, setPartenaires] = useState()
    const [statistics, setStatistics] = useState([])
    const [about, setAbout] = useState()


    useEffect(() => {
        onSnapshot(collection(db, 'event'), snap => {
            const data = snap.docs.map((doc) => ({
                _id: doc.id,
                ...doc.data()
            }))
            setEvents(data)
        })

        onSnapshot(collection(db, 'infos'), snap => {
            const data = snap.docs.map((doc) => ({
                _id: doc.id,
                ...doc.data()
            }))
            setInfos(data)
        })
        onSnapshot(collection(db, 'partner'), snap => {
            const data = snap.docs.map((doc) => ({
                _id: doc.id,
                ...doc.data()
            }))
            setPartenaires(data)
        })
    })

    useEffect(() => {
        const fectData = async () => {
            try {
                const response = await getDocs(collection(db, 'about'))
                const data = response.docs.map(e => ({
                    _id: e.id,
                    ...e.data()
                }))
                setAbout(data[0])
            } catch (error) {
                console.log(error);
            }
        };
        fectData();
    }, [])


    useEffect(() => {
        const dataFect = async () => {
            try {
                const response = await getDocs(collection(db, 'statistic'))
                const data = response.docs.map(e => ({
                    _id: e.id,
                    ...e.data()
                }))
                setStatistics(data)
            } catch (error) {
                console.log(error);
            }
        };
        dataFect()
    }, [])



    while (!infos || !events || !partenaires || !about || !statistics) {
        return <Loading></Loading>
    }


    return (
        <div className="page">
            <section className="flex flex-wrap items- justify-center p-2 bg-[url(./bg/bg1.png)] bg-cover">
                {
                    events &&
                    <div className="flex-1 h-[max-content] max-[600px]:hidden rounded-md m-2 mt-0 bg-gray-100">
                        <div className="flex justify-between items-center m-2">
                            <h3 className="text-red-500">À la une</h3>
                            <Link to={'/event'} className="bg-green-400 hover:bg-green-300 rounded-full pt-2 pb-2 pl-5 pr-5">
                                <span className="text-nowrap">Voir plus<i class="fa-solid fa-arrow-right"></i></span>
                            </Link>
                        </div>
                        {events.slice(0, 3).map((event) => (<Event eventId={event._id} />))}
                    </div>
                }
                <div className='overflow-hidden rounded-md w-[60%] max-[800px]:w-[100%]'>
                    <MyCarousel />
                </div>

            </section>
            <section className="mt-  rounded-2xl flex justify-evenly flex-wrap m-2">
                <div className="flex-1 pl-2 pr-2 pb-2 max-w-120">
                    <h2>Qu'est-ce que la FIBREE ?</h2>
                    <p className="text-justify">{about.about}</p>
                    <Link to={'/a-propos'} className="bg-green-400 hover:bg-green-300 rounded-full pt-2 pb-2 pl-5 pr-5">
                        <span className="text-nowrap">En savoir plus sur la FIBREE <i class="fa-solid fa-arrow-right"></i></span>
                    </Link>
                </div>
                <Missions></Missions>

            </section>
            {(infos && infos.length > 0) &&
                <section className="bg-gray-100 pt-3 pb-3 max-[800px]:p-0 mt-5 flex flex-col items-center">
                    <div className="flex items-center">
                        <h2 className="max-[800px]:ml-3 ml-5"> Nos dernières actualités</h2>
                    </div>
                    <div className="flex-1 flex flex-wrap justify-center">
                        {infos.slice(0, 3).map((info) => ((<Info infoId={info._id}></Info>)))}
                    </div>

                    <Link to={'/actualite'} className="bg-green-400 hover:bg-green-300 rounded-full pt-2 pb-2 pl-5 pr-5">
                        <span className="text-nowrap">Voir toutes nos actualités <i class="fa-solid fa-arrow-right"></i></span>
                    </Link>
                </section>
            }
            {
                partenaires.filter(e => e.displayed).length > 0 &&
                <section className="max-[800px]:p-0 m-2 mt-5">
                    <div className="flex items-center">
                        <h2 className="ml-3">Nos partenaires</h2>
                    </div>
                    <Partenaires></Partenaires>
                </section>
            }

            {
                statistics.filter.length > 0 &&
                <section className="max-[800px]:p-0 m-2 p-3 rounded-md mt-5">
                    <div className="flex items-center justify-center">
                        <h2 className="ml-3">Nos chiffres clés</h2>
                    </div>

                    <div className="flex max-[800px]:hidden flex-wrap justify-center">
                        {statistics.map((statistic) => (<Statistic statisticId={statistic._id}></Statistic>))}
                    </div>
                    <div className="flex min-[800px]:hidden flex-wrap justify-center">
                        {statistics.slice(0, 4).map((statistic) => (<Statistic statisticId={statistic._id}></Statistic>))}

                        <Link to={'/statistic'} className="bg-green-400 hover:bg-green-300 rounded-full pt-2 pb-2 pl-5 pr-5">
                            <span className="text-nowrap">Voir tous nos statistiques <i class="fa-solid fa-arrow-right"></i></span>
                        </Link>
                    </div>
                </section>
            }
        </div>
    )
}

export default Home