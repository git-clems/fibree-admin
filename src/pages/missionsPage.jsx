import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Loading from '../components/LoadingPage'
import { Link } from 'react-router'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../auth/firebase'

const Mission = () => {

    const [missions, setMissions] = useState()

    useEffect(() => {
        const FetchData = async () => {
            try {
                const querry = await getDocs(collection(db, 'mission'))
                const data = querry.docs.map(doc => ({
                    _id: doc.id,
                    ...doc.data()
                }))
                setMissions(data.filter(e => !e.removed && e.displayed))
            } catch (error) {
                console.log(error);
            }
        }
        FetchData()
    }, [])


    while (!missions) {
        return <Loading></Loading>
    }

    return (
        <div className='page'>
            <h2 className='m-3'>Nos missions</h2>
            {
                missions &&
                missions.map((mission, index) => (
                    index % 2 == 0
                        ? <section className='flex flex-wrap justify-between m-2'>
                            <div className='flex-1 max-w-[1000px] min-w-[300px]'>
                                <h4><span className='text-orange-500'>{index + 1} - {mission.title}</span></h4>
                                <p className='pl-3'>{mission.description}</p>
                            </div>
                            <img src={mission.image} alt="" className='max-w-[200px] object-cover m-3 border-10 border-yellow-100 rounded-xl' />
                        </section>
                        : <section className='flex flex-wrap justify-between m-2'>
                            <img src={mission.image} alt="" className='max-w-[200px] object-cover m-3 border-10 border-yellow-100 rounded-xl' />
                            <div className='flex-1 max-w-[1000px] min-w-[300px]'>
                                <h4><span className='text-green-600'> {index + 1} - {mission.title}</span></h4>
                                <p className='ml-3'>{mission.description}</p>
                            </div>
                        </section>
                ))
            }
        </div>
    )
}

export default Mission